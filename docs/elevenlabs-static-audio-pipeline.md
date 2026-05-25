# ElevenLabs Static Audio Pipeline

Last updated: 2026-05-25

## Purpose

Dino Island can use ElevenLabs for scripted dino phrases, gentle sound effects, and short music cues, but Charlotte's play loop should not depend on live network generation. This pipeline uses the official `@elevenlabs/elevenlabs-js` SDK to generate parent-approved assets outside gameplay, stores them as static files, and lets the app fall back to local synthesized tones whenever an approved asset is unavailable.

## Files

- Source review manifest: `scripts/audio/elevenlabs-audio-manifest.json`
- Generator: `scripts/src/audio/elevenlabsGenerator.ts`
- Generated audio output: `artifacts/dino-math-quest/public/audio/generated/`
- Child-facing runtime manifest: `artifacts/dino-math-quest/public/audio/manifest.json`
- Runtime playback/fallback: `artifacts/dino-math-quest/src/lib/audio.ts`

## Approval Flow

1. Add or edit an item in `scripts/audio/elevenlabs-audio-manifest.json`.
2. Keep `approved_for_generation` false until an adult approves the exact text or prompt and voice/model choice.
3. For TTS, set `ELEVENLABS_DINO_VOICE_ID` in the host environment or add a reviewed `voice_id` to the item. Do not put API keys in client code.
4. Run a dry run first:

   ```powershell
   pnpm --filter @workspace/scripts run elevenlabs:audio -- --dry-run
   ```

5. Generate reviewed candidates:

   ```powershell
   pnpm --filter @workspace/scripts run elevenlabs:audio
   ```

6. Listen to the generated files under `artifacts/dino-math-quest/public/audio/generated/`.
7. Only after adult review, set `approved_for_gameplay` true and rerun the generator so `public/audio/manifest.json` exposes the asset to the app.

## Runtime Rules

- Gameplay only reads local files from `public/audio/`.
- The ElevenLabs API key is only used by the Node generator.
- The app attempts approved static assets after a user gesture; otherwise it immediately uses synthesized fallback sounds.
- Mute applies to generated assets and synthesized tones.
- Missing or unapproved assets must not block Math, Spelling, Speech, Music, or Dino Den.

## First Candidate Set

The initial manifest includes:

- `tri-great-counting`: correct Math Quest answer
- `tri-one-more-try`: gentle retry
- `tri-new-friend`: Dino reward
- `tri-say-it-with-me`: speech cue
- `dino-soft-stomp`: rhythm cue
- `sparkle-short`: reward cue
- `count-with-tri-song`: Math Quest counting music candidate
- `wow-word-song`: W-sound rhythm music candidate
- `lion-light-song`: L-sound rhythm music candidate

All start unapproved for generation and gameplay by design.

## Validation

After changing the pipeline or runtime audio behavior:

```powershell
pnpm --filter @workspace/scripts run elevenlabs:audio -- --dry-run
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/dino-math-quest run typecheck
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build
```

Then browser-check tablet portrait with sound muted and unmuted. Confirm no sound starts before a tap, no runtime error appears when the public manifest has zero approved assets, and normal synthesized fallback still plays.
