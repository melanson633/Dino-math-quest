import { spawn, type ChildProcess } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Browser, type Page } from 'playwright-core';
import { parse } from 'yaml';

type StepStatus = 'pass' | 'warn' | 'fail';

interface StepResult {
  name: string;
  status: StepStatus;
  notes: string[];
}

interface Report {
  generatedAt: string;
  appUrl: string;
  viewport: { name: string; width: number; height: number };
  summary: { status: StepStatus; pass: number; warn: number; fail: number };
  consoleErrors: string[];
  steps: StepResult[];
  artifacts: string[];
}

interface SpellingWordContent {
  id: string;
  word: string;
  icon: string;
  clue: string;
  sound: string;
  sayPrompt: string;
  rhythm: string[];
  contextHints: string[];
  group: 'family' | 'dino' | 'speech';
  difficulty: 'support' | 'steady' | 'stretch';
}

interface DinoIslandYaml {
  spellingWords: SpellingWordContent[];
}

interface PublicAudioManifestAsset {
  id?: unknown;
  kind?: unknown;
  src?: unknown;
  approved?: unknown;
}

interface PublicAudioManifest {
  schema_version?: unknown;
  generated_at?: unknown;
  assets?: unknown;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..', '..');
const defaultPort = Number(process.env.PORT || '25918');
const outputDir = path.join(repoRoot, 'artifacts', 'dino-math-quest', 'test-results', 'child-playtest');
const dinoIslandYamlPath = path.join(repoRoot, 'artifacts', 'dino-math-quest', 'src', 'content', 'dino-island.yaml');
const dinoAppSourceDir = path.join(repoRoot, 'artifacts', 'dino-math-quest', 'src');
const blockedCopy = ["can't understand", 'cannot understand', "didn't say", 'wrong voice', 'try harder', 'bad try'];

function hasArg(name: string) {
  return process.argv.includes(name);
}

function argValue(name: string, fallback: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function summarize(steps: StepResult[], consoleErrors: string[]): Report['summary'] {
  const counts = {
    pass: steps.filter(step => step.status === 'pass').length,
    warn: steps.filter(step => step.status === 'warn').length,
    fail: steps.filter(step => step.status === 'fail').length + consoleErrors.length,
  };
  return {
    ...counts,
    status: counts.fail > 0 ? 'fail' : counts.warn > 0 ? 'warn' : 'pass',
  };
}

function record(steps: StepResult[], name: string, status: StepStatus, notes: string | string[]) {
  steps.push({ name, status, notes: Array.isArray(notes) ? notes : [notes] });
}

let spellingWordsCache: SpellingWordContent[] | null = null;

async function loadSpellingWords(): Promise<SpellingWordContent[]> {
  if (!spellingWordsCache) {
    const content = parse(await readFile(dinoIslandYamlPath, 'utf8')) as DinoIslandYaml;
    spellingWordsCache = content.spellingWords ?? [];
  }
  return spellingWordsCache;
}

async function verifySpellingContent(steps: StepResult[]) {
  const words = await loadSpellingWords();
  const failures: string[] = [];
  const warnings: string[] = [];
  const difficulties = new Set(words.map(word => word.difficulty));
  const groups = new Set(words.map(word => word.group));

  for (const item of words) {
    const word = item.word ?? '';
    const firstLetter = word[0] ?? '';
    const hints = item.contextHints ?? [];
    const joinedHints = hints.join(' ').toLowerCase();
    const rhythmText = (item.rhythm ?? []).join('-').toLowerCase();

    if (!/^[A-Z]{2,9}$/.test(word)) failures.push(`${item.id}: word must be 2-9 uppercase letters`);
    if (!item.icon || !item.clue || !item.sound || !item.sayPrompt) failures.push(`${item.id}: missing visible clue, icon, sound, or say prompt`);
    if (hints.length < 3) failures.push(`${item.id}: needs at least 3 context hints`);
    if (!joinedHints.includes(firstLetter.toLowerCase())) failures.push(`${item.id}: hints should include first-letter support for ${firstLetter}`);
    if (rhythmText && !joinedHints.includes(rhythmText)) warnings.push(`${item.id}: rhythm cue "${rhythmText}" is not visible in context hints`);
    if (firstLetter === 'L' && !joinedHints.includes('tongue-up')) failures.push(`${item.id}: L-initial word needs gentle tongue-up cue`);
    if (firstLetter === 'W' && !joinedHints.includes('round lips')) failures.push(`${item.id}: W-initial word needs gentle round-lips cue`);
  }

  if (words.length < 10) failures.push(`word bank is too small for short-session variety (${words.length} words)`);
  for (const difficulty of ['support', 'steady', 'stretch'] as const) {
    if (!difficulties.has(difficulty)) failures.push(`missing ${difficulty} spelling words`);
  }
  for (const group of ['family', 'dino', 'speech'] as const) {
    if (!groups.has(group)) failures.push(`missing ${group} spelling words`);
  }

  record(
    steps,
    'spelling word-bank context audit',
    failures.length > 0 ? 'fail' : warnings.length > 0 ? 'warn' : 'pass',
    failures.length > 0
      ? failures
      : warnings.length > 0
        ? warnings
        : `${words.length} words include visible clues, first-letter support, rhythm cues, and gentle L/W support where relevant.`,
  );
}

async function readSourceFiles(dir: string): Promise<Array<{ relativePath: string; text: string }>> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: Array<{ relativePath: string; text: string }> = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await readSourceFiles(fullPath));
      continue;
    }
    if (!/\.(ts|tsx|yaml)$/.test(entry.name)) continue;
    files.push({
      relativePath: path.relative(repoRoot, fullPath),
      text: await readFile(fullPath, 'utf8'),
    });
  }

  return files;
}

async function verifyNoBlockedCopyInSource(steps: StepResult[]) {
  const files = await readSourceFiles(dinoAppSourceDir);
  const hits = files.flatMap(file => {
    const text = file.text.toLowerCase();
    return blockedCopy
      .filter(copy => text.includes(copy))
      .map(copy => `${file.relativePath}: "${copy}"`);
  });

  record(
    steps,
    'source copy guardrail',
    hits.length === 0 ? 'pass' : 'fail',
    hits.length === 0
      ? `Scanned ${files.length} source/content files for blocked discouraging speech-copy phrases.`
      : hits,
  );
}

async function verifyPublicAudioManifest(page: Page, steps: StepResult[]) {
  const manifest = await page.evaluate(async () => {
    const response = await fetch('/audio/manifest.json', { cache: 'no-store' });
    const body = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      body,
    };
  });

  if (!manifest.ok) {
    record(steps, 'public audio manifest safety', 'fail', `Manifest request failed with HTTP ${manifest.status}.`);
    return;
  }

  let parsed: PublicAudioManifest;
  try {
    parsed = JSON.parse(manifest.body) as PublicAudioManifest;
  } catch {
    record(steps, 'public audio manifest safety', 'fail', 'Manifest response was not valid JSON.');
    return;
  }

  const assets = Array.isArray(parsed.assets) ? parsed.assets as PublicAudioManifestAsset[] : null;
  if (!assets) {
    record(steps, 'public audio manifest safety', 'fail', 'Manifest did not expose an assets array.');
    return;
  }

  const failures = assets.flatMap((asset, index) => {
    const notes: string[] = [];
    const label = typeof asset.id === 'string' ? asset.id : `asset-${index}`;
    const src = typeof asset.src === 'string' ? asset.src : '';

    if (typeof asset.id !== 'string' || asset.id.length === 0) notes.push(`${label}: missing string id`);
    if (asset.approved !== true) notes.push(`${label}: approved must be true before child-facing exposure`);
    if (!['tts', 'sound_effect', 'music'].includes(String(asset.kind))) notes.push(`${label}: unsupported kind ${String(asset.kind)}`);
    if (!src.startsWith('/audio/generated/') || !src.endsWith('.mp3')) notes.push(`${label}: src must be an approved generated mp3 path`);
    if (src.includes('..') || src.includes('\\')) notes.push(`${label}: src contains unsafe path segments`);

    return notes;
  });

  record(
    steps,
    'public audio manifest safety',
    failures.length === 0 ? 'pass' : 'fail',
    failures.length === 0
      ? `Manifest is reachable and exposes ${assets.length} approved generated gameplay audio asset(s).`
      : failures,
  );
}

async function waitForApp(url: string, timeoutMs: number) {
  const start = Date.now();
  let lastError = '';

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      const body = await response.text();
      const looksLikeDinoQuest = body.includes('id="root"') && body.includes('/src/main.tsx');
      if (response.ok && looksLikeDinoQuest) return;
      lastError = response.ok
        ? 'HTTP 200 but response did not look like the Dino Quest Vite app'
        : `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error(`App did not become reachable at ${url}: ${lastError}`);
}

function startDevServer(port: number): ChildProcess {
  const command = process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : 'pnpm';
  const args = process.platform === 'win32'
    ? ['/d', '/s', '/c', 'pnpm --filter @workspace/dino-math-quest run dev']
    : ['--filter', '@workspace/dino-math-quest', 'run', 'dev'];

  return spawn(command, args, {
    cwd: repoRoot,
    env: { ...process.env, PORT: String(port), BASE_PATH: '/' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

async function stopDevServer(child: ChildProcess | undefined) {
  if (!child?.pid || child.killed) return;

  if (process.platform === 'win32') {
    await new Promise<void>(resolve => {
      const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
      killer.on('exit', () => resolve());
      killer.on('error', () => resolve());
    });
    return;
  }

  child.kill('SIGTERM');
}

async function clickTestId(page: Page, testId: string) {
  await page.locator(`[data-testid="${testId}"]`).click();
}

async function visibleText(page: Page) {
  return (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
}

async function checkNoBlockedCopy(page: Page, steps: StepResult[]) {
  const text = (await visibleText(page)).toLowerCase();
  const found = blockedCopy.filter(copy => text.includes(copy));
  record(
    steps,
    'positive-only speech and retry copy',
    found.length === 0 ? 'pass' : 'fail',
    found.length === 0 ? 'No discouraging speech-recognition copy was visible.' : `Blocked copy visible: ${found.join(', ')}`,
  );
}

async function checkTouchTargets(page: Page, steps: StepResult[], label: string) {
  const smallTargets = await page.locator('button').evaluateAll(buttons => buttons
    .filter(button => {
      const style = (globalThis as typeof globalThis & { getComputedStyle: (element: unknown) => { visibility: string; display: string } }).getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    })
    .map(button => {
      const rect = button.getBoundingClientRect();
      return {
        label: (button.textContent ?? button.getAttribute('aria-label') ?? 'button').trim().replace(/\s+/g, ' ').slice(0, 40),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    })
    .filter(button => button.width < 44 || button.height < 44));

  record(
    steps,
    `${label} touch targets`,
    smallTargets.length === 0 ? 'pass' : 'fail',
    smallTargets.length === 0
      ? 'All visible buttons met the 44px minimum target heuristic.'
      : smallTargets.map(button => `${button.label}: ${button.width}x${button.height}`),
  );
}

async function checkNoHorizontalOverflow(page: Page, steps: StepResult[], label: string) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: (globalThis as typeof globalThis & { document: { documentElement: { clientWidth: number } } }).document.documentElement.clientWidth,
    scrollWidth: (globalThis as typeof globalThis & { document: { documentElement: { scrollWidth: number } } }).document.documentElement.scrollWidth,
  }));

  const overflow = dimensions.scrollWidth - dimensions.clientWidth;
  record(
    steps,
    `${label} no sideways scroll`,
    overflow <= 2 ? 'pass' : 'fail',
    overflow <= 2
      ? `Page width stayed contained at ${dimensions.clientWidth}px.`
      : `Page overflowed horizontally by ${overflow}px (${dimensions.scrollWidth}px content on ${dimensions.clientWidth}px viewport).`,
  );
}

async function checkVisibleFirstViewport(page: Page, steps: StepResult[], label: string, selector: string, expectedCount: number) {
  const result = await page.locator(selector).evaluateAll(elements => {
    const viewportHeight = (globalThis as typeof globalThis & { innerHeight: number }).innerHeight;
    const visible = elements.filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= viewportHeight && rect.width > 0 && rect.height > 0;
    });
    return { visible: visible.length, viewportHeight };
  });

  record(
    steps,
    `${label} first-view choices`,
    result.visible >= expectedCount ? 'pass' : 'warn',
    `${result.visible}/${expectedCount} expected choices fit inside the first ${Math.round(result.viewportHeight)}px viewport.`,
  );
}

async function checkObviousNextTap(page: Page, steps: StepResult[], label: string, selector: string) {
  const targets = await page.locator(selector).evaluateAll(elements => elements
    .map(element => {
      const rect = element.getBoundingClientRect();
      const style = (globalThis as typeof globalThis & { getComputedStyle: (element: unknown) => { visibility: string; display: string } }).getComputedStyle(element);
      return {
        text: (element.textContent ?? element.getAttribute('aria-label') ?? '').trim().replace(/\s+/g, ' ').slice(0, 44),
        visible: style.visibility !== 'hidden' && style.display !== 'none' && rect.width >= 44 && rect.height >= 44,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
      };
    })
    .filter(target => target.visible)
    .sort((a, b) => a.top - b.top));

  const first = targets[0];
  record(
    steps,
    `${label} next tap clarity`,
    first ? 'pass' : 'fail',
    first
      ? `Primary visible target: "${first.text || 'unlabeled target'}" at ${first.width}x${first.height}px.`
      : `No visible touch-sized target matched ${selector}.`,
  );
}

async function verifyHome(page: Page, steps: StepResult[]) {
  await page.evaluate(() => globalThis.localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('[data-testid^="button-learning-area-"]').first().waitFor({ state: 'visible' });

  const adventureCount = await page.locator('[data-testid^="button-learning-area-"]').count();
  record(
    steps,
    'home base choices',
    adventureCount >= 2 ? 'pass' : 'fail',
    `Visible playable learning areas: ${adventureCount}. Scaffolded areas stay off the child home screen.`,
  );

  const firstAdventure = await page.locator('[data-testid^="button-learning-area-"]').first().boundingBox();
  record(
    steps,
    'home next tap obvious',
    firstAdventure && firstAdventure.width >= 120 && firstAdventure.height >= 74 ? 'pass' : 'warn',
    firstAdventure
      ? `First adventure target is ${Math.round(firstAdventure.width)}x${Math.round(firstAdventure.height)}px.`
      : 'Could not measure the first adventure target.',
  );
  await checkVisibleFirstViewport(page, steps, 'home', '[data-testid^="button-learning-area-"]', 2);
  await checkObviousNextTap(page, steps, 'home', '[data-testid^="button-learning-area-"]');
  await checkNoHorizontalOverflow(page, steps, 'home');
  await checkTouchTargets(page, steps, 'home');
}

async function verifyMath(page: Page, steps: StepResult[]) {
  await clickTestId(page, 'button-learning-area-math');
  await page.locator('[data-testid^="button-answer-"]').first().waitFor({ state: 'visible' });

  const answerCount = await page.locator('[data-testid^="button-answer-"]').count();
  record(steps, 'math answer choices', answerCount === 3 ? 'pass' : 'fail', `Visible answers: ${answerCount}.`);

  const missionText = (await page.locator('[data-testid="math-mission"]').textContent())?.trim().replace(/\s+/g, ' ') ?? '';
  const hasMissionWorldCue = missionText.length >= 8;
  record(
    steps,
    'math island mission cue',
    hasMissionWorldCue ? 'pass' : 'fail',
    hasMissionWorldCue
      ? `Child-readable mission cue visible: "${missionText}".`
      : `Missing child-readable mission cue; saw "${missionText}".`,
  );

  const visualScene = page.locator('[data-testid="math-visual-scene"]');
  const visualSceneVisible = await visualScene.isVisible().catch(() => false);
  const visualSceneLabel = await visualScene.getAttribute('aria-label').catch(() => '');
  const visualItemCount = await page.locator('[data-testid="math-visual-scene"] [data-testid="math-scene-item"]').count();
  record(
    steps,
    'math island visual scene',
    visualSceneVisible ? 'pass' : 'fail',
    visualSceneVisible
      ? `Visible scene "${visualSceneLabel ?? ''}" includes ${visualItemCount} individually tagged item(s).`
      : 'Math visual scene was not visible before answer tapping.',
  );

  await checkVisibleFirstViewport(page, steps, 'math', '[data-testid^="button-answer-"]', 3);
  await checkObviousNextTap(page, steps, 'math', '[data-testid^="button-answer-"]');

  let sawRetry = false;
  const answerButtons = page.locator('[data-testid^="button-answer-"]');
  for (let index = 0; index < answerCount; index += 1) {
    const button = answerButtons.nth(index);
    if (await button.isDisabled()) continue;
    await button.click();
    await page.waitForTimeout(450);
    const text = await visibleText(page);
    if (text.includes('Good try. Pick one more!')) sawRetry = true;
    if (text.includes('✨') || text.includes('🎉')) break;
  }

  const afterMathText = await visibleText(page);
  record(
    steps,
    'math retry and completion',
    afterMathText.includes('✨') || afterMathText.includes('🎉') ? 'pass' : 'fail',
    sawRetry
      ? 'A wrong tap produced positive retry copy, then a correct tap completed the puzzle.'
      : 'Puzzle completed; retry copy was not forced because the first selected answer may have been correct.',
  );
  await checkNoHorizontalOverflow(page, steps, 'math');
  await checkTouchTargets(page, steps, 'math');
}

async function goHome(page: Page) {
  if (await page.locator('[data-testid^="button-learning-area-"]').first().isVisible().catch(() => false)) return;

  const homeByTestId = page.locator('[data-testid$="-home"], [data-testid="button-math-home"]').first();
  if (await homeByTestId.count()) {
    await homeByTestId.click();
  } else {
    await page.getByRole('button', { name: /^Home$/ }).first().click();
  }
  await page.locator('[data-testid^="button-learning-area-"]').first().waitFor({ state: 'visible' });
}

async function openScaffoldScreen(page: Page, screen: 'speech' | 'music') {
  await page.evaluate((targetScreen) => {
    const key = 'dino-math-quest-state';
    const saved = globalThis.localStorage.getItem(key);
    const state = saved ? JSON.parse(saved) as Record<string, unknown> : {};
    globalThis.localStorage.setItem(key, JSON.stringify({ ...state, currentScreen: targetScreen, muteAudio: false }));
  }, screen);
  await page.reload({ waitUntil: 'networkidle' });
}

async function verifySpelling(page: Page, steps: StepResult[]) {
  await goHome(page);
  await clickTestId(page, 'button-learning-area-spelling');
  await page.locator('[data-testid^="button-spelling-letter-"]').first().waitFor({ state: 'visible' });

  const bodyText = (await visibleText(page)).toLowerCase();
  const hearWord = page.getByRole('button', { name: 'Hear the word' });
  const hearWordVisible = await hearWord.isVisible();
  record(
    steps,
    'spelling context before tapping',
    hearWordVisible && bodyText.includes('tap the letters in order') ? 'pass' : 'fail',
    hearWordVisible
      ? 'The screen pairs a visible clue with an on-demand Hear it model before letter taps.'
      : 'The on-demand Hear it model was not visible.',
  );
  await checkObviousNextTap(page, steps, 'spelling', '[data-testid^="button-spelling-letter-"]');

  // The target word is never printed on screen — only empty letter boxes — so it
  // is identified from the visible clue card and confirmed against the tray.
  const pageText = await visibleText(page);
  const trayLetters = await page.locator('[data-testid^="button-spelling-letter-"]')
    .evaluateAll(buttons => buttons.map(button => (button.textContent ?? '').trim()));
  const candidates = (await loadSpellingWords()).filter(item =>
    pageText.includes(item.clue)
    && pageText.includes(item.icon)
    && pageText.includes(item.sound)
    && item.word.split('').every(letter => trayLetters.includes(letter)));

  if (candidates.length !== 1) {
    record(
      steps,
      'spelling word build',
      'fail',
      `Could not identify the visible target word; ${candidates.length} word-bank entries matched the clue card and letter tray.`,
    );
  } else {
    const word = candidates[0].word;
    for (const letter of word.split('')) {
      await clickTestId(page, `button-spelling-letter-${letter}`);
      await page.waitForTimeout(120);
    }

    const nextEnabled = !(await page.locator('[data-testid="button-spelling-next"]').isDisabled());
    record(
      steps,
      'spelling word build',
      nextEnabled ? 'pass' : 'fail',
      nextEnabled ? `Built ${word}; Next Word became available.` : `Built ${word}, but Next Word stayed disabled.`,
    );
  }

  await checkNoHorizontalOverflow(page, steps, 'spelling');
  await checkTouchTargets(page, steps, 'spelling');
}

// Records every element that actually starts playing, which the preload warm-up
// loop does not. A network request is not a usable signal here: the clips are
// already fetched on an earlier gesture, so a warm tap replays from memory and
// emits nothing, while scanning every request the page ever made can never fail.
// Source text, not a function: tsx compiles this file with esbuild's keepNames,
// and the injected `__name` helper does not exist in the page.
const recordAudioPlayback = `
  (() => {
    const played = [];
    globalThis.__dinoPlayedAudio = played;
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      played.push(this.currentSrc || this.src);
      return nativePlay.apply(this, arguments);
    };
  })();
`;

async function playedAudioSrcs(page: Page): Promise<string[]> {
  return page.evaluate(() => (globalThis as typeof globalThis & { __dinoPlayedAudio?: string[] }).__dinoPlayedAudio ?? []);
}

function recordOfflineAudioInteraction(
  steps: StepResult[],
  name: string,
  control: string,
  interactionRequests: string[],
  playedDuringInteraction: string[],
  expectedClip: RegExp,
) {
  const unsafeRequests = interactionRequests.filter(url => /\/api\/tts|elevenlabs\.io/i.test(url));
  const bundledPlayback = playedDuringInteraction.filter(src => expectedClip.test(src));
  record(
    steps,
    name,
    unsafeRequests.length === 0 && bundledPlayback.length > 0 ? 'pass' : 'fail',
    unsafeRequests.length > 0
      ? `Child audio interaction made live requests: ${unsafeRequests.join(', ')}.`
      : bundledPlayback.length > 0
        ? `${control} played bundled ${bundledPlayback.map(src => src.split('/').pop()).join(', ')} with no live TTS request.`
        : `${control} played no bundled generated clip matching ${expectedClip.source}; played: ${playedDuringInteraction.join(', ') || 'nothing'}.`,
  );
}

async function verifyOfflineAudioInteraction(page: Page, steps: StepResult[], requests: string[]) {
  const hearWord = page.getByRole('button', { name: 'Hear the word' });
  await hearWord.waitFor({ state: 'visible' });
  await page.waitForTimeout(700);
  const requestStart = requests.length;
  const playbackStart = (await playedAudioSrcs(page)).length;
  await hearWord.click();
  await page.waitForTimeout(700);

  recordOfflineAudioInteraction(
    steps,
    'offline word-model audio',
    'Hear it',
    requests.slice(requestStart),
    (await playedAudioSrcs(page)).slice(playbackStart),
    /\/audio\/generated\/word-.*\.mp3$/i,
  );
}

async function verifySpeech(page: Page, steps: StepResult[], requests: string[]) {
  await openScaffoldScreen(page, 'speech');
  await page.locator('[data-testid="button-speech-i-tried"]').waitFor({ state: 'visible' });
  await checkObviousNextTap(page, steps, 'speech', '[data-testid^="button-speech-beat-"], [data-testid="button-speech-i-tried"]');

  // Hear Dino is the other child-facing spoken model, so it carries the same
  // offline guarantee as spelling's Hear it.
  const hearModel = page.locator('[data-testid="button-speech-hear-model"]');
  await hearModel.waitFor({ state: 'visible' });
  await page.waitForTimeout(700);
  const modelRequestStart = requests.length;
  const modelPlaybackStart = (await playedAudioSrcs(page)).length;
  await hearModel.click();
  await page.waitForTimeout(700);
  recordOfflineAudioInteraction(
    steps,
    'offline speech-model audio',
    'Hear Dino',
    requests.slice(modelRequestStart),
    (await playedAudioSrcs(page)).slice(modelPlaybackStart),
    /\/audio\/generated\/speech-.*\.mp3$/i,
  );

  const turnCue = page.locator('[data-testid="speech-turn-cue"]');
  const turnCueText = await turnCue.innerText();
  const activeTurn = page.locator('[data-testid="speech-turn-step"][data-active="true"]');
  const activeTurnCount = await activeTurn.count();
  const initialActiveTurnText = activeTurnCount === 1 ? await activeTurn.first().innerText() : '';
  const hasTurnLabels = /Dino says/i.test(turnCueText) && /Charlotte says/i.test(turnCueText);
  record(
    steps,
    'speech turn-taking cue',
    hasTurnLabels && activeTurnCount === 1 && /Dino says/i.test(initialActiveTurnText) ? 'pass' : 'fail',
    hasTurnLabels && activeTurnCount === 1 && /Dino says/i.test(initialActiveTurnText)
      ? 'Speech practice starts with one obvious Dino modeling step.'
      : `Turn cue text: "${turnCueText.replace(/\s+/g, ' ').trim()}"; active turn count: ${activeTurnCount}.`,
  );

  const nextBefore = await page.locator('[data-testid="button-speech-next"]').isDisabled();
  await clickTestId(page, 'button-speech-beat-0');
  const activeAfterBeatText = await activeTurn.first().innerText();
  record(
    steps,
    'speech cue hands turn to Charlotte',
    /Charlotte says/i.test(activeAfterBeatText) ? 'pass' : 'fail',
    /Charlotte says/i.test(activeAfterBeatText)
      ? 'After tapping a rhythm beat, the active cue moves to Charlotte says.'
      : `Active cue after rhythm beat: "${activeAfterBeatText.replace(/\s+/g, ' ').trim()}".`,
  );

  await clickTestId(page, 'button-speech-i-tried');
  const nextAfter = await page.locator('[data-testid="button-speech-next"]').isDisabled();
  const activeAfterTryText = await activeTurn.first().innerText();
  record(
    steps,
    'speech cue unlocks next word',
    /Next dino word/i.test(activeAfterTryText) ? 'pass' : 'fail',
    /Next dino word/i.test(activeAfterTryText)
      ? 'After I Said It, the active cue moves to Next dino word.'
      : `Active cue after I Said It: "${activeAfterTryText.replace(/\s+/g, ' ').trim()}".`,
  );

  record(
    steps,
    'speech participation gate',
    nextBefore && !nextAfter ? 'pass' : 'fail',
    nextBefore && !nextAfter
      ? 'Next starts disabled, rhythm can be tapped, and I Said It unlocks progress.'
      : `Next disabled before: ${nextBefore}; after I Said It: ${nextAfter}.`,
  );

  await checkNoBlockedCopy(page, steps);
  await checkNoHorizontalOverflow(page, steps, 'speech');
  await checkTouchTargets(page, steps, 'speech');
}

async function verifyMusic(page: Page, steps: StepResult[]) {
  await openScaffoldScreen(page, 'music');
  await page.locator('[data-testid^="button-music-beat-"]').first().waitFor({ state: 'visible' });
  await checkObviousNextTap(page, steps, 'music', '[data-testid^="button-music-beat-"]');

  const nextBeatCue = await page.locator('[data-testid="music-next-beat-cue"]').innerText();
  const highlightedNextBeat = page.locator('[data-testid^="button-music-beat-"][data-next="true"]');
  const highlightedCount = await highlightedNextBeat.count();
  const firstHighlightedText = highlightedCount > 0 ? await highlightedNextBeat.first().innerText() : '';
  record(
    steps,
    'music next beat is explicit',
    highlightedCount === 1 && nextBeatCue.toLowerCase().includes('clap') && firstHighlightedText.toLowerCase().includes('clap')
      ? 'pass'
      : 'fail',
    `Cue: "${nextBeatCue.replace(/\s+/g, ' ')}"; highlighted beat count: ${highlightedCount}; highlighted text: "${firstHighlightedText.replace(/\s+/g, ' ')}".`,
  );

  const beatCount = await page.locator('[data-testid^="button-music-beat-"]').count();
  for (let index = 0; index < beatCount; index += 1) {
    await clickTestId(page, `button-music-beat-${index}`);
    await page.waitForTimeout(100);
  }

  const hint = await page.locator('[data-testid="text-music-hint"]').innerText();
  const nextEnabled = !(await page.getByRole('button', { name: 'Next Beat' }).isDisabled());
  record(
    steps,
    'music ordered beat play',
    hint.includes("Dino's beat") && nextEnabled ? 'pass' : 'fail',
    `Hint after ordered taps: "${hint}"; Next Beat enabled: ${nextEnabled}.`,
  );
  await checkNoHorizontalOverflow(page, steps, 'music');
  await checkTouchTargets(page, steps, 'music');
}

async function verifyDinoDen(page: Page, steps: StepResult[]) {
  await goHome(page);
  await clickTestId(page, 'button-dinoden');
  await page.locator('[data-testid="button-back-dinoden"]').waitFor({ state: 'visible' });

  const emptyText = await visibleText(page);
  const lockedCards = await page.locator('[data-testid^="card-dino-"]').count();
  record(
    steps,
    'dino den empty-state guidance',
    emptyText.includes('Find your first dino friend') && emptyText.includes('Play Math Quest') && lockedCards >= 6 ? 'pass' : 'fail',
    `Empty state text present: ${emptyText.includes('Find your first dino friend')}; dino cards visible: ${lockedCards}.`,
  );
  await checkObviousNextTap(page, steps, 'dino den empty', '[data-testid="button-back-dinoden"]');
  await checkObviousNextTap(page, steps, 'dino den empty math start', '[data-testid="button-dinoden-start-math"]');
  await checkNoHorizontalOverflow(page, steps, 'dino den empty');
  await checkTouchTargets(page, steps, 'dino den empty');

  await clickTestId(page, 'button-dinoden-start-math');
  const routedToMath = await page.locator('[data-testid^="button-answer-"]').count();
  record(
    steps,
    'dino den empty routes to math',
    routedToMath > 0 ? 'pass' : 'fail',
    routedToMath > 0
      ? 'Empty Dino Den starts Math Quest directly with answer choices visible.'
      : 'Empty Dino Den did not route into Math Quest answer choices.',
  );
  await goHome(page);

  await page.evaluate(() => {
    globalThis.localStorage.setItem('dino-math-quest-state', JSON.stringify({
      currentBiome: 0,
      totalCorrect: 2,
      unlockedDinos: ['stego'],
      muteAudio: false,
      currentScreen: 'dinoden',
      selectedCompanionId: 'mama',
      selectedLearningAreaId: 'math',
      lastUnlockedDinoId: 'stego',
      adultSettings: {
        mathPace: 'balanced',
        speechSupport: 'steady',
        musicCues: true,
      },
    }));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('[data-testid="button-dino-syllables"]').waitFor({ state: 'visible' });

  const unlockedText = await visibleText(page);
  record(
    steps,
    'dino den unlocked friend',
    unlockedText.includes('Stegosaurus')
      && unlockedText.includes('Find the word STEGO')
      && unlockedText.includes('Try three tiny moments.') ? 'pass' : 'fail',
    unlockedText.includes('Stegosaurus')
      ? 'Seeded first dino opens with name, visible word prompt, practice trail, and practice choices.'
      : 'Seeded first dino was not visible.',
  );
  await checkObviousNextTap(page, steps, 'dino den practice', '[data-testid^="button-dino-"]');

  await clickTestId(page, 'button-dino-syllables');
  const syllableText = await visibleText(page);
  await clickTestId(page, 'button-dino-chant');
  const chantText = await visibleText(page);
  await clickTestId(page, 'button-dino-count');
  const countText = await visibleText(page);
  await clickTestId(page, 'button-dino-move');
  const moveText = await visibleText(page);
  record(
    steps,
    'dino den speech-math practice',
    syllableText.includes('Steg - o - saur - us')
      && chantText.includes('Steg-o-saur-us, step with me.')
      && countText.includes('Count three back plates.')
      && moveText.includes('Tap three sleepy plates awake.') ? 'pass' : 'fail',
    `Syllable cue: ${syllableText.includes('Steg - o - saur - us')}; chant cue: ${chantText.includes('Steg-o-saur-us, step with me.')}; count cue: ${countText.includes('Count three back plates.')}; move cue: ${moveText.includes('Tap three sleepy plates awake.')}.`,
  );

  const practicedTrail = await page.locator('[data-testid="dino-practice-trail"]').textContent();
  record(
    steps,
    'dino den confidence trail',
    practicedTrail?.includes('Steggy is smiling with you.') ? 'pass' : 'fail',
    practicedTrail?.includes('Steggy is smiling with you.')
      ? 'Three tiny practice moments produce a visible positive friend-practice reward.'
      : 'Practice trail did not show the completed friend-practice reward.',
  );

  await checkNoHorizontalOverflow(page, steps, 'dino den unlocked');
  await checkTouchTargets(page, steps, 'dino den unlocked');
  await clickTestId(page, 'button-back-dinoden');
  await page.locator('[data-testid^="button-learning-area-"]').first().waitFor({ state: 'visible' });
}

async function verifyGrownUpControls(page: Page, steps: StepResult[]) {
  await goHome(page);
  await clickTestId(page, 'button-settings');
  await page.locator('[data-testid="button-settings-close"]').waitFor({ state: 'visible' });

  const title = await page.getByRole('heading', { name: 'Grown-up Controls' }).isVisible();
  const closeBox = await page.locator('[data-testid="button-settings-close"]').boundingBox();
  record(
    steps,
    'grown-up controls open safely',
    title && closeBox && closeBox.width >= 44 && closeBox.height >= 44 ? 'pass' : 'fail',
    title && closeBox
      ? `Settings opened with a ${Math.round(closeBox.width)}x${Math.round(closeBox.height)}px close target.`
      : 'Settings modal did not expose the expected title and close control.',
  );

  await clickTestId(page, 'button-math-pace-stretch');
  await clickTestId(page, 'button-speech-support-light');
  await clickTestId(page, 'button-music-cues-toggle');
  await clickTestId(page, 'button-settings-close');
  await page.locator('[data-testid="button-settings-close"]').waitFor({ state: 'hidden' });
  await page.reload({ waitUntil: 'networkidle' });

  const persisted = await page.evaluate(() => {
    const saved = globalThis.localStorage.getItem('dino-math-quest-state');
    if (!saved) return null;
    const parsed = JSON.parse(saved) as { adultSettings?: { mathPace?: string; speechSupport?: string; musicCues?: boolean } };
    return parsed.adultSettings ?? null;
  });
  const settingsPersisted = persisted?.mathPace === 'stretch' && persisted?.speechSupport === 'light' && persisted?.musicCues === false;
  record(
    steps,
    'grown-up controls persist',
    settingsPersisted ? 'pass' : 'fail',
    settingsPersisted
      ? 'Math pace, speech support, and music cue settings persisted after reload.'
      : `Unexpected persisted adult settings: ${JSON.stringify(persisted)}.`,
  );

  await page.locator('[data-testid^="button-learning-area-"]').first().waitFor({ state: 'visible' });
  await clickTestId(page, 'button-settings');
  await clickTestId(page, 'button-reset-adventure');
  await clickTestId(page, 'button-confirm-reset');
  await page.locator('[data-testid^="button-learning-area-"]').first().waitFor({ state: 'visible' });

  const afterReset = await page.evaluate(() => {
    const saved = globalThis.localStorage.getItem('dino-math-quest-state');
    if (!saved) return null;
    const parsed = JSON.parse(saved) as {
      totalCorrect?: number;
      selectedCompanionId?: string;
      currentScreen?: string;
      adultSettings?: { mathPace?: string; speechSupport?: string; musicCues?: boolean };
    };
    return {
      totalCorrect: parsed.totalCorrect,
      selectedCompanionId: parsed.selectedCompanionId,
      currentScreen: parsed.currentScreen,
      adultSettings: parsed.adultSettings,
    };
  });
  const resetKeptAdultSettings = afterReset?.totalCorrect === 0
    && afterReset.selectedCompanionId === 'none'
    && afterReset.currentScreen === 'home'
    && afterReset.adultSettings?.mathPace === 'stretch'
    && afterReset.adultSettings?.speechSupport === 'light'
    && afterReset.adultSettings?.musicCues === false;
  record(
    steps,
    'grown-up reset keeps setup',
    resetKeptAdultSettings ? 'pass' : 'fail',
    resetKeptAdultSettings
      ? 'Reset returned to Home Base, cleared child progress, and preserved adult setup choices.'
      : `Unexpected state after reset: ${JSON.stringify(afterReset)}.`,
  );

  await checkVisibleFirstViewport(page, steps, 'post-settings home', '[data-testid^="button-learning-area-"]', 2);
  await checkNoHorizontalOverflow(page, steps, 'post-settings home');
  await checkTouchTargets(page, steps, 'post-settings home');
}

async function runPlaytest(appUrl: string, headed: boolean): Promise<Report> {
  const artifacts: string[] = [];
  const consoleErrors: string[] = [];
  const steps: StepResult[] = [];
  let browser: Browser | undefined;

  try {
    browser = await chromium.launch({ channel: 'chrome', headless: !headed });
  } catch {
    browser = await chromium.launch({ channel: 'msedge', headless: !headed });
  }

  const context = await browser.newContext({
    viewport: { width: 744, height: 1133 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'DinoQuestChildPlaytest/1.0 iPad',
  });
  await context.addInitScript({ content: recordAudioPlayback });
  const page = await context.newPage();
  page.on('pageerror', error => consoleErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));

  await page.goto(appUrl, { waitUntil: 'networkidle' });
  await verifySpellingContent(steps);
  await verifyNoBlockedCopyInSource(steps);
  await verifyPublicAudioManifest(page, steps);
  await verifyHome(page, steps);
  await verifyMath(page, steps);
  await verifySpelling(page, steps);
  await verifyOfflineAudioInteraction(page, steps, requests);
  await verifySpeech(page, steps, requests);
  await verifyMusic(page, steps);
  await verifyDinoDen(page, steps);
  await verifyGrownUpControls(page, steps);

  const tabletScreenshot = path.join(outputDir, 'tablet-final.png');
  await page.screenshot({ path: tabletScreenshot, fullPage: true });
  artifacts.push(path.relative(repoRoot, tabletScreenshot));

  await page.setViewportSize({ width: 390, height: 844 });
  await goHome(page);
  await checkVisibleFirstViewport(page, steps, 'mobile home', '[data-testid^="button-learning-area-"]', 2);
  await checkObviousNextTap(page, steps, 'mobile home', '[data-testid^="button-learning-area-"]');
  await checkNoHorizontalOverflow(page, steps, 'mobile home');
  await checkTouchTargets(page, steps, 'mobile home');
  const mobileScreenshot = path.join(outputDir, 'mobile-home.png');
  await page.screenshot({ path: mobileScreenshot, fullPage: true });
  artifacts.push(path.relative(repoRoot, mobileScreenshot));

  await context.close();
  await browser.close();

  return {
    generatedAt: new Date().toISOString(),
    appUrl,
    viewport: { name: 'iPad portrait primary, mobile portrait quick check', width: 744, height: 1133 },
    summary: summarize(steps, consoleErrors),
    consoleErrors,
    steps,
    artifacts,
  };
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const port = Number(argValue('--port', String(defaultPort)));
  const appUrl = argValue('--url', `http://127.0.0.1:${port}/`);
  const noServer = hasArg('--no-server');
  const headed = hasArg('--headed');
  let server: ChildProcess | undefined;

  try {
    if (!noServer) {
      server = startDevServer(port);
    }
    await waitForApp(appUrl, 30_000);
    const report = await runPlaytest(appUrl, headed);
    const reportPath = path.join(outputDir, 'report.json');
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ summary: report.summary, report: path.relative(repoRoot, reportPath), artifacts: report.artifacts }, null, 2));
    if (report.summary.status === 'fail') process.exitCode = 1;
  } finally {
    await stopDevServer(server);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
