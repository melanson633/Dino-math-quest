# Dino Island Architecture Extension Audit

Date: 2026-05-24

Scope: concise implementation audit for extending the Charlotte-facing app in `artifacts/dino-math-quest`.

## Current Entry Points

- App shell and routing: `src/App.tsx`
- Main state and persistence: `src/context/GameContext.tsx`
- Dino Island content schema: `src/content/dino-island.yaml`
- Typed content loader: `src/content/dinoIslandContent.ts`
- Math screen: `src/screens/PuzzleScreen.tsx`
- First playable expansion screens: `src/screens/SpellingAdventureScreen.tsx`, `src/screens/SpeechAdventureScreen.tsx`, `src/screens/MusicDenScreen.tsx`
- Audio: `src/lib/audio.ts`
- Math/progression data: `src/lib/puzzles.ts`, `src/lib/dinos.ts`, `src/lib/biomes.ts`

## Extension Points

- `GameContext` is the state owner. It already stores selected companion, selected learning area, current screen, total correct, biome, unlocked dinos, and mute state in `localStorage`.
- `startLearningArea` is the right entry point for new child-facing sections because it handles selection, screen routing, and audio unlock.
- `dino-island.yaml` is the right first stop for companion metadata, weighted variants, learning area labels, speech starters, music starters, and feature flags.
- New playable sections should add a screen component, route through `App.tsx`, and use `goToScreen('home')` for a clear return path.
- Math progression remains split across `puzzles.ts`, `dinos.ts`, and `biomes.ts`; update those together when reward thresholds or puzzle types change.

## Risks

- Math puzzle generation is random and stateless. Adaptive difficulty will need lightweight local tracking before it can fall back silently or advance quickly.
- Companion variants currently use weighted metadata, but runtime selection can vary between renders if callers choose variants directly during render. Prefer deterministic per-session or per-screen selection when companions become more visible in gameplay.
- The new YAML loader is runtime parsed through Vite `?raw`; this is good for editing but still needs careful type guards if content grows or becomes user-editable.
- Audio is now gesture-gated, but iPad Safari should still be checked on real hardware before relying on background music or generated audio behavior.
- There is no dedicated test runner; repeatable QA currently needs documented Playwright/manual smoke scripts.

## Recommended First Architecture Changes

1. Add Math-specific session state for current streak, misses on current puzzle, and simple difficulty band.
2. Add a data-driven Math Quest companion moment model, starting with one small avatar/encouragement slot.
3. Add a repeatable browser smoke script or checklist before broadening gameplay complexity.
4. Keep ElevenLabs or generated voice assets as static/generated content pipelines first, not live child-flow network calls.

## Validation Expectations

- Run app-specific typecheck and build for implementation slices:
  - `pnpm --filter @workspace/dino-math-quest run typecheck`
  - `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build`
- Browser smoke tablet portrait first, then mobile when quick.
- For Math changes, verify at least: enter Math from Home Base, answer wrong then correct, observe feedback, return Home, and check console health.
