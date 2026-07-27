import { existsSync, readFileSync } from "node:fs";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ElevenLabsClient, type ElevenLabs } from "@elevenlabs/elevenlabs-js";

type AudioKind = "tts" | "sound_effect" | "music";
type ElevenLabsClientInstance = InstanceType<typeof ElevenLabsClient>;

interface AudioManifest {
  schema_version: number;
  defaults?: {
    tts_model_id?: string;
    sound_model_id?: string;
    music_model_id?: "music_v1";
    output_format?: string;
    voice_id_env?: string;
  };
  items: AudioManifestItem[];
}

interface AudioManifestItem {
  id: string;
  kind: AudioKind;
  text?: string;
  prompt?: string;
  output_file: string;
  use: string;
  approved_for_generation: boolean;
  approved_for_gameplay: boolean;
  model_id?: string;
  voice_id?: string;
  voice_id_env?: string;
  duration_seconds?: number;
  prompt_influence?: number;
  loop?: boolean;
}

interface CliOptions {
  manifestPath: string;
  outputDir: string;
  publicManifestPath: string;
  reviewReportPath: string | null;
  dryRun: boolean;
  force: boolean;
}

interface PublicAudioAsset {
  id: string;
  kind: AudioKind;
  src: string;
  use: string;
  approved: boolean;
}

const repoRoot = findRepoRoot(process.cwd());

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  loadEnvFile(path.join(repoRoot, ".env"));

  const manifest = await readJson<AudioManifest>(options.manifestPath);
  validateManifest(manifest);
  const outputFormat = manifest.defaults?.output_format ?? "mp3_44100_128";
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const approvedItems = manifest.items.filter((item) => item.approved_for_generation);
  const client = apiKey ? new ElevenLabsClient({ apiKey }) : null;

  if (approvedItems.length === 0) {
    console.log("No audio items are approved_for_generation. Public manifest will still be refreshed.");
  } else if (!apiKey && !options.dryRun) {
    throw new Error("ELEVENLABS_API_KEY is required unless --dry-run is used.");
  }

  await mkdir(options.outputDir, { recursive: true });

  const publicAssets: PublicAudioAsset[] = [];
  for (const item of manifest.items) {
    const outputPath = resolveOutputPath(options.outputDir, item);
    if (item.approved_for_generation) {
      if (options.dryRun) {
        console.log(`[dry-run] ${await fileExists(outputPath) ? 'validated existing' : 'would generate'} ${item.id} -> ${outputPath}`);
      } else if (!options.force && (await fileExists(outputPath))) {
        console.log(`kept existing ${item.id} -> ${outputPath}`);
      } else {
        const audio = await generateAudio(item, manifest, outputFormat, client!);
        await writeFile(outputPath, Buffer.from(audio));
        console.log(`generated ${item.id} -> ${outputPath}`);
      }
    }

    if (item.approved_for_gameplay) {
      if (!(await fileExists(outputPath))) {
        if (options.dryRun) {
          console.log(`[dry-run] would expose ${item.id} after ${outputPath} is generated`);
          continue;
        }
        throw new Error(`Audio item ${item.id} is approved_for_gameplay but ${outputPath} does not exist.`);
      }
      publicAssets.push({
        id: item.id,
        kind: item.kind,
        src: `/audio/generated/${item.output_file}`,
        use: item.use,
        approved: true,
      });
    }
  }

  const publicManifest = {
    schema_version: manifest.schema_version,
    generated_at: new Date().toISOString(),
    assets: publicAssets,
  };
  if (options.dryRun) {
    console.log(`dry run validated ${manifest.items.length} source audio item(s); public manifest was not changed`);
  } else {
    await writeFile(options.publicManifestPath, `${JSON.stringify(publicManifest, null, 2)}\n`, "utf8");
    console.log(`wrote public audio manifest with ${publicAssets.length} approved gameplay asset(s)`);
  }

  if (options.reviewReportPath) {
    await mkdir(path.dirname(options.reviewReportPath), { recursive: true });
    await writeFile(options.reviewReportPath, buildReviewReport(manifest, options.outputDir), "utf8");
    console.log(`wrote parent review report to ${options.reviewReportPath}`);
  }
}

async function generateAudio(
  item: AudioManifestItem,
  manifest: AudioManifest,
  outputFormat: string,
  client: ElevenLabsClientInstance,
): Promise<Uint8Array> {
  if (item.kind === "tts") {
    const voiceId = resolveVoiceId(item, manifest);
    if (!item.text) throw new Error(`TTS item ${item.id} needs text.`);
    const audio = await client.textToSpeech.convert(voiceId, {
      text: item.text,
      modelId: item.model_id ?? manifest.defaults?.tts_model_id ?? "eleven_multilingual_v2",
      outputFormat: outputFormat as ElevenLabs.TextToSpeechConvertRequestOutputFormat,
    });
    return collectAudioBytes(audio);
  }

  if (item.kind === "sound_effect") {
    if (!item.text) throw new Error(`Sound effect item ${item.id} needs text.`);
    const request: ElevenLabs.CreateSoundEffectRequest = {
      text: item.text,
      modelId: item.model_id ?? manifest.defaults?.sound_model_id ?? "eleven_text_to_sound_v2",
      outputFormat: outputFormat as ElevenLabs.AllowedOutputFormats,
    };
    if (item.duration_seconds !== undefined) request.durationSeconds = item.duration_seconds;
    if (item.prompt_influence !== undefined) request.promptInfluence = item.prompt_influence;
    if (item.loop !== undefined) request.loop = item.loop;
    const audio = await client.textToSoundEffects.convert(request);
    return collectAudioBytes(audio);
  }

  const prompt = item.prompt ?? item.text;
  if (!prompt) throw new Error(`Music item ${item.id} needs prompt or text.`);
  const request: ElevenLabs.BodyComposeMusicV1MusicPost = {
    prompt,
    modelId: manifest.defaults?.music_model_id ?? "music_v1",
    outputFormat: outputFormat as ElevenLabs.AllowedOutputFormats,
    forceInstrumental: true,
  };
  if (item.duration_seconds !== undefined) request.musicLengthMs = Math.round(item.duration_seconds * 1000);
  const audio = await client.music.compose(request);
  return collectAudioBytes(audio);
}

function resolveVoiceId(item: AudioManifestItem, manifest: AudioManifest): string {
  if (item.voice_id) return item.voice_id;
  const envName = item.voice_id_env ?? manifest.defaults?.voice_id_env;
  const voiceId = envName ? process.env[envName] : undefined;
  if (!voiceId) {
    throw new Error(`TTS item ${item.id} needs voice_id or ${envName ?? "a voice_id_env"} set before generation.`);
  }
  return voiceId;
}

function validateManifest(manifest: AudioManifest): void {
  if (!Number.isInteger(manifest.schema_version) || manifest.schema_version < 1) {
    throw new Error("Audio manifest needs a positive integer schema_version.");
  }

  const ids = new Set<string>();
  for (const item of manifest.items) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(item.id)) {
      throw new Error(`Audio item id ${item.id} must use lowercase letters, numbers, and hyphens.`);
    }
    if (ids.has(item.id)) {
      throw new Error(`Audio manifest has a duplicate item id: ${item.id}`);
    }
    ids.add(item.id);

    if (path.isAbsolute(item.output_file) || item.output_file.includes("..") || !item.output_file.endsWith(".mp3")) {
      throw new Error(`Audio item ${item.id} needs a relative .mp3 output_file without path traversal.`);
    }
    if (item.approved_for_gameplay && !item.approved_for_generation) {
      throw new Error(`Audio item ${item.id} cannot be approved_for_gameplay unless approved_for_generation is also true.`);
    }
    if (item.kind === "tts" && !item.text?.trim()) {
      throw new Error(`TTS item ${item.id} needs text.`);
    }
    if (item.kind === "sound_effect" && !item.text?.trim()) {
      throw new Error(`Sound effect item ${item.id} needs text.`);
    }
    if (item.kind === "music" && !(item.prompt?.trim() || item.text?.trim())) {
      throw new Error(`Music item ${item.id} needs prompt or text.`);
    }
    if (item.duration_seconds !== undefined && (item.duration_seconds <= 0 || item.duration_seconds > 15)) {
      throw new Error(`Audio item ${item.id} duration_seconds should be a short positive cue up to 15 seconds.`);
    }
  }
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    manifestPath: path.join(repoRoot, "scripts", "audio", "elevenlabs-audio-manifest.json"),
    outputDir: path.join(repoRoot, "artifacts", "dino-math-quest", "public", "audio", "generated"),
    publicManifestPath: path.join(repoRoot, "artifacts", "dino-math-quest", "public", "audio", "manifest.json"),
    reviewReportPath: null,
    dryRun: false,
    force: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;
    if (arg === "--manifest") {
      options.manifestPath = path.resolve(args[++index]!);
    } else if (arg === "--output-dir") {
      options.outputDir = path.resolve(args[++index]!);
    } else if (arg === "--public-manifest") {
      options.publicManifestPath = path.resolve(args[++index]!);
    } else if (arg === "--review-report") {
      const nextArg = args[index + 1];
      if (nextArg && !nextArg.startsWith("--")) {
        options.reviewReportPath = path.resolve(args[++index]!);
      } else {
        options.reviewReportPath = path.join(repoRoot, "docs", "audio-parent-review.md");
      }
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--force") {
      options.force = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

function loadEnvFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line.trim());
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2]!.replace(/^["']|["']$/g, "");
    }
  } catch {
    // A missing .env is fine; host env vars are the primary source.
  }
}

async function collectAudioBytes(audio: AsyncIterable<Uint8Array> | ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  const maybeAsyncIterable = audio as Partial<AsyncIterable<Uint8Array>>;
  if (typeof maybeAsyncIterable[Symbol.asyncIterator] === "function") {
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
  } else {
    const reader = (audio as ReadableStream<Uint8Array>).getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  }
  return Buffer.concat(chunks);
}

function findRepoRoot(startDir: string): string {
  let current = startDir;
  while (true) {
    const packagePath = path.join(current, "package.json");
    const manifestPath = path.join(current, "scripts", "audio", "elevenlabs-audio-manifest.json");
    if (existsSync(packagePath) && existsSync(manifestPath)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(`Could not find Dino Quest repo root from ${startDir}`);
    }
    current = parent;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function resolveOutputPath(outputDir: string, item: AudioManifestItem): string {
  const resolvedOutputDir = path.resolve(outputDir);
  const outputPath = path.resolve(resolvedOutputDir, item.output_file);
  const relativePath = path.relative(resolvedOutputDir, outputPath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Audio item ${item.id} output_file must stay inside ${resolvedOutputDir}.`);
  }
  return outputPath;
}

function buildReviewReport(manifest: AudioManifest, outputDir: string): string {
  const rows = manifest.items.map((item) => {
    const source = item.kind === "music" ? item.prompt : item.text;
    return [
      `### ${item.id}`,
      "",
      `- Kind: ${item.kind}`,
      `- Use: ${item.use}`,
      `- Output: ${path.relative(repoRoot, path.join(outputDir, item.output_file))}`,
      `- Generation approved: ${yesNo(item.approved_for_generation)}`,
      `- Gameplay approved: ${yesNo(item.approved_for_gameplay)}`,
      item.duration_seconds !== undefined ? `- Duration target: ${item.duration_seconds}s` : null,
      item.prompt_influence !== undefined ? `- Prompt influence: ${item.prompt_influence}` : null,
      "- Parent review:",
      "  - [ ] Text/prompt fits Charlotte and the app tone",
      "  - [ ] Voice/sound is warm, clear, and not overstimulating",
      "  - [ ] Approved to generate",
      "  - [ ] Approved for gameplay after listening",
      "",
      "```text",
      source ?? "",
      "```",
      "",
    ].filter((line): line is string => line !== null).join("\n");
  });

  return [
    "# ElevenLabs Parent Audio Review",
    "",
    "Generated from `scripts/audio/elevenlabs-audio-manifest.json`.",
    "",
    "Use this as a review worksheet before changing `approved_for_generation` or `approved_for_gameplay` in the source manifest. Do not expose generated files in the runtime public manifest until they have been listened to and explicitly approved.",
    "",
    "## Safe Approval Sequence",
    "",
    "1. Review the text and prompts below with an adult before changing any approval flags.",
    "2. Set `approved_for_generation` to `true` only for specific items approved for candidate generation.",
    "3. Run `pnpm --filter @workspace/scripts run elevenlabs:review` to validate the manifest and refresh this worksheet.",
    "4. Run `pnpm --filter @workspace/scripts run elevenlabs:audio` to generate only approved candidates.",
    "5. Listen to every generated file under `artifacts/dino-math-quest/public/audio/generated/`.",
    "6. Set `approved_for_gameplay` to `true` only for files that are warm, clear, gentle, and parent-approved after listening.",
    "7. Rerun `pnpm --filter @workspace/scripts run elevenlabs:audio`, then browser-check the game after a tap with sound muted and unmuted.",
    "",
    "Guardrails: generated audio is optional, must stay static, and must never block Charlotte's play loop. If anything is missing or unapproved, the app should use local synthesized fallback sounds.",
    "",
    "## Review Items",
    "",
    ...rows,
  ].join("\n");
}

function yesNo(value: boolean): string {
  return value ? "yes" : "no";
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
