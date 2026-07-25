# Repo Map

Precomputed orientation so an agent can skip the discovery phase. Facts here were
measured on 2026-07-25 at commit `20e46f9`. If something contradicts the code, the
code wins — but re-measure before assuming this file is stale.

## The one thing to know

The product is **one Vite + React SPA** at `artifacts/dino-math-quest`. Everything
else in the workspace is scaffolding that no gameplay task needs to touch.

**Real application code is ~3,400 lines across 22 files.** That is the whole surface
area. It fits comfortably in context — you do not need to search for it.

## Where the app actually lives

All paths below are under `artifacts/dino-math-quest/src/`.

| File | Lines | Role |
| --- | --- | --- |
| `content/dino-island.yaml` | 606 | Authored content: words, puzzles, companions, copy |
| `screens/PuzzleScreen.tsx` | 584 | Math gameplay — all 8 puzzle types render here |
| `screens/SpellingAdventureScreen.tsx` | 521 | Words gameplay — 3 modes in one file |
| `lib/puzzles.ts` | 382 | Math puzzle generation |
| `context/GameContext.tsx` | 342 | **State + persistence owner.** Start here |
| `screens/DinoDenScreen.tsx` | 254 | Collection / reward gallery |
| `lib/audio.ts` | 246 | Synthesized audio |
| `lib/dinos.ts` | 198 | Dino roster + unlock thresholds |
| `components/SettingsModal.tsx` | 184 | Grown-up controls |
| `screens/SpeechAdventureScreen.tsx` | 171 | Speech practice |
| `screens/HomeScreen.tsx` | 169 | Dino Island hub |
| `components/TopBar.tsx` | 166 | Floating header (Den / Mute / Settings) |
| `content/dinoIslandContent.ts` | 154 | YAML → typed objects |
| `screens/MusicDenScreen.tsx` | 146 | Music den |
| `screens/BiomeUnlockScreen.tsx` | 89 | Biome unlock celebration |
| `screens/DinoRewardScreen.tsx` | 82 | New-dino celebration |
| `components/TenFrame.tsx` | 64 | Ten-frame math manipulative |
| `lib/voiceParticipation.ts` | 59 | Voice prompt helpers |
| `screens/AdventurePreviewScreen.tsx` | 57 | Area preview |
| `lib/biomes.ts` | 43 | Biome definitions |
| `components/TriDino.tsx` | 29 | Mascot |
| `lib/utils.ts` | 6 | `cn()` only |

## How screens connect

There is **no router**. `App.tsx` switch-renders on `state.currentScreen`, and the
whole app is wrapped in `GameProvider`.

```
ScreenType = home | puzzle | spelling | speech | music
           | adventure-preview | dinoden | biome-unlock | dino-reward
```

`GameContext.tsx` owns all state and serializes to `localStorage` under the key
`dino-math-quest-state`. To reset while testing, clear that key or use
**Settings → Reset Adventure**.

`App.tsx` wraps everything in a `max-w-[820px]` frame — the letterboxing you see on
a wide desktop window is deliberate, not a layout bug.

## Content pipeline

`dino-island.yaml` → imported `?raw` → parsed by `dinoIslandContent.ts` → typed exports.

Authored copy and word lists belong in the **YAML**, not in components. Types live
next to the parser in `dinoIslandContent.ts`.

## Do not read these

They are large, generated, or irrelevant, and reading them wastes most of a context
window for no gain:

- `src/components/ui/**` — 55 shadcn components, **53 of them unused**. Only `card`
  is imported anywhere outside that directory. Treat this directory as dead weight;
  do not grep it, and do not add to it.
- `lib/api-client-react/src/generated/**`, `lib/api-zod/src/generated/**` — generated,
  regenerate rather than edit.
- `artifacts/mockup-sandbox/**` — a separate design sandbox, not the product.
- `artifacts/api-server/**`, `lib/db/**` — unused by gameplay.
- `.claude/skills/**`, `.claude/commands/**` — tooling; the harness loads what it needs.

## Known duplication

`shuffle<T>()` is defined twice: `lib/puzzles.ts:375` and, independently,
`screens/SpellingAdventureScreen.tsx:23`. Any refactor should collapse these.

## Verification

There is **no test runner**. The only meaningful checks are:

1. `pnpm run typecheck` — passes clean at `20e46f9`.
2. Launching the app and playing it (see `AGENTS.md` → Running).

Because there are no tests, behavioral claims must come from an actual play-through.
`docs/dogfood/` holds recorded play-through findings.
