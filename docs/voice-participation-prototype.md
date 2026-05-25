# Voice Participation Prototype

Status: implemented behind a feature flag and off by default.

Feature flag:

```yaml
featureFlags:
  liveVoiceParticipation: false
```

File locations:

```text
artifacts/dino-math-quest/src/lib/voiceParticipation.ts
artifacts/dino-math-quest/src/screens/SpeechAdventureScreen.tsx
artifacts/dino-math-quest/src/content/dino-island.yaml
```

## What It Does

When `liveVoiceParticipation` is enabled, Speech Adventure shows an extra `Dino Listen` button. Tapping it asks the browser for microphone access, listens briefly with Web Audio amplitude sampling, then returns only one of these states:

- `attempt`: some voice/sound energy was detected.
- `quiet`: no clear attempt was detected during the short listening window.
- `unavailable`: microphone access, browser support, or permission was unavailable.

It does not use speech recognition. It does not transcribe. It does not score pronunciation. It does not decide whether Charlotte said the word correctly.

## Child Experience Rules

- Keep `I Tried` available at all times as the safe, no-microphone path.
- If sound is detected, respond positively.
- If quiet, ask for at most one more try using positive wording.
- If unavailable, fall back to `I Tried` without presenting a failure.
- Never say "I can't understand you."
- Never block progress on microphone participation.

## Why It Stays Off By Default

This is a useful technical prototype but not yet release-ready for Charlotte's default flow. It still needs real iPad Safari validation for:

- Microphone permission UX.
- AudioContext behavior after user gestures.
- Background noise sensitivity.
- Whether the prompt feels encouraging or distracting.
- Whether latency feels smooth enough for a 4-year-old.

## Validation Path

Default-off smoke:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build
```

Browser checks:

- With `liveVoiceParticipation: false`, Speech Adventure should show the normal beat buttons, `I Tried`, and `Next`, with no `Dino Listen` button.
- With the flag temporarily enabled for local testing only, `Dino Listen` should request mic permission and never block use of `I Tried`.

## Next Decision

Before enabling this for Charlotte, run a real iPad Safari test with an adult present and decide whether the microphone prompt improves confidence or creates friction. If it creates friction, keep this code dormant and continue using scripted, rhythm-based participation.
