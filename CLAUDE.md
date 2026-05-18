# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Replit-hosted pnpm-workspace monorepo whose primary product is **Dino Math Quest** — a mobile-portrait React PWA that teaches young children addition, subtraction, and shape/pattern recognition through a biome-unlock progression. The repo also ships a scaffolded Express API server, a component-preview "mockup sandbox", and shared libs (DB, OpenAPI client, Zod schemas) that are wired in but mostly empty stubs at this point. Treat the game artifact as the live code; treat the rest as infrastructure waiting for content.

## Workspace layout

```
artifacts/
  dino-math-quest/     # The game (Vite + React 19 + Tailwind v4 + shadcn/ui)
  api-server/          # Express 5 API, bundled with esbuild
  mockup-sandbox/      # Component preview canvas for src/components/mockups/*.tsx
lib/
  db/                  # Drizzle ORM + Postgres (schema is an empty stub)
  api-spec/            # openapi.yaml + Orval codegen config
  api-zod/             # Generated Zod schemas (do not hand-edit src/generated/)
  api-client-react/    # Generated React Query hooks + custom fetch (do not hand-edit src/generated/)
scripts/               # One-off tsx scripts
```

Each artifact has a `.replit-artifact/artifact.toml` declaring its dev/prod run commands, ports, and routing — this is how Replit boots services, not anything in `package.json`.

## Common commands

Run from the repo root unless noted. `pnpm` is mandatory — the root `preinstall` script blocks npm/yarn.

| Task | Command |
|---|---|
| Install | `pnpm install` |
| Typecheck everything | `pnpm run typecheck` |
| Build everything (typecheck + per-package builds) | `pnpm run build` |
| Run the game (Vite dev) | `pnpm --filter @workspace/dino-math-quest run dev` |
| Build the game | `pnpm --filter @workspace/dino-math-quest run build` |
| Run the API server | `pnpm --filter @workspace/api-server run dev` |
| Run the mockup sandbox | `pnpm --filter @workspace/mockup-sandbox run dev` |
| Regenerate API client + Zod from `openapi.yaml` | `pnpm --filter @workspace/api-spec run codegen` |
| Push DB schema (dev) | `pnpm --filter @workspace/db run push` |
| Typecheck a single package | `pnpm --filter <name> run typecheck` |

There is **no test runner configured** anywhere in the repo. Don't claim tests pass; say "no test suite exists" if asked.

The game and sandbox Vite configs `throw` at startup if `PORT` and `BASE_PATH` aren't set. Replit injects them via `artifact.toml`; if you run them outside Replit you must set both (`PORT=25918 BASE_PATH=/ pnpm --filter @workspace/dino-math-quest run dev`).

## Architecture: Dino Math Quest

The game is a single-page React app rendered into a fixed mobile frame (`max-w-[430px]`, `h-[100dvh]`). It uses **no router** — `App.tsx` switches between four screens (`home`, `puzzle`, `dinoden`, `biome-unlock`) based on a single `currentScreen` value in `GameContext`. `wouter` is a dependency but currently unused.

State and persistence live entirely in `src/context/GameContext.tsx`:
- The whole `GameState` is serialized to `localStorage` under key `dino-math-quest-state` on every change.
- On load, a `biome-unlock` screen is rewritten to `puzzle` so reopens never land on a transition.
- `answerPuzzle(true)` runs a 900ms delay before mutating state — this is what lets the celebration animation play before the next puzzle.

Three data files in `src/lib/` are the source of truth for progression and must be edited together:
- `biomes.ts` — 4 biomes with `threshold` (totalCorrect needed to unlock) and a `bossDinoId` per biome.
- `dinos.ts` — 12 dinos keyed by `unlockAt` (totalCorrect milestones 5, 10, … 60).
- `puzzles.ts` — `generatePuzzle()` picks addition / subtraction / shapes by random weight; addition/subtraction generate three options with `uniqueDistractors` clamped to [0, 18]; shapes splits 50/50 between recognition and pattern completion.

Audio (`src/lib/audio.ts`) is fully synthesized via Web Audio `OscillatorNode` — there are no audio files. `startBgMusic(biomeIndex)` swaps the BGM oscillator per biome, and the `useEffect` in `GameContext` only restarts it when the biome or relevant screen changes (don't trigger it on every state update — the ref-based guards there are load-bearing).

UI: **shadcn/ui new-york style** with all 55 components pre-installed under `src/components/ui/`. Aliases configured in `components.json` and `tsconfig.json`: `@/*` → `src/*`, `@assets/*` → `../../attached_assets/*`. Tailwind v4 via `@tailwindcss/vite` — no separate `tailwind.config.js`; theme tokens are declared inline in `src/index.css` via `@theme inline`. Font is Baloo 2 (loaded from Google Fonts in `index.css`).

PWA: `main.tsx` registers `/sw.js` (a tiny stale-while-revalidate cache). The manifest is in `public/manifest.json`. `index.html` sets `user-scalable=no` and `apple-mobile-web-app-capable=yes` — this is a touch-only kiosk-style game.

Test selectors: interactive elements use `data-testid="..."` attributes (e.g. `button-start-adventure`, `button-answer-${opt.id}`, `button-mute`). Preserve these when refactoring.

## Architecture: API stack

The API is wired but the contract is essentially empty. The flow is:

1. **`lib/api-spec/openapi.yaml`** is the source of truth (only `/healthz` exists today). The title field **must stay "Api"** — the Orval transformer enforces this and the import paths assume the generated filename is `api.ts`.
2. **`pnpm --filter @workspace/api-spec run codegen`** runs Orval, which writes:
   - `lib/api-client-react/src/generated/` — React Query hooks using `customFetch` as the mutator.
   - `lib/api-zod/src/generated/` — Zod schemas + TS types.
   Both `generated/` directories are clobbered (`clean: true`) on every codegen — never hand-edit them.
3. **`artifacts/api-server`** imports the Zod schemas from `@workspace/api-zod` to validate responses (see `src/routes/health.ts` for the pattern: `Schema.parse({...})`). It's built with esbuild via `build.mjs` into a single `dist/index.mjs`; dev runs `build && start`, not `tsx`.
4. **`artifacts/dino-math-quest`** depends on `@workspace/api-client-react` (workspace import), but does not currently call any API. `lib/api-client-react/src/custom-fetch.ts` is the hand-written mutator — it supports an optional `setBaseUrl` and `setAuthTokenGetter` for Expo-style remote use.

The DB layer (`lib/db`) wires Drizzle + node-postgres against `DATABASE_URL` but `src/schema/index.ts` is a commented-out template. Add table files alongside it and re-export from `index.ts`; the file's own comments show the expected pattern (table + `createInsertSchema` from `drizzle-zod` + inferred types). `pnpm --filter @workspace/db run push` syncs schema in dev; `post-merge.sh` runs it automatically after every `git merge`.

## TypeScript & workspace conventions

- Root `tsconfig.json` uses project references — `lib/db`, `lib/api-client-react`, `lib/api-zod` build via `tsc --build`; artifacts and scripts are typechecked package-by-package with `--noEmit`. This is what `pnpm run typecheck:libs` vs `pnpm run typecheck` splits.
- `tsconfig.base.json` sets `customConditions: ["workspace"]` so package `exports` are resolved via workspace source files, not built dist.
- Strict mode is mostly on, but `noImplicitOverride`, `strictFunctionTypes`, and `noUnusedLocals` are intentionally **off**.
- Use the **catalog** for shared deps. New packages like react, zod, tailwind, drizzle, etc. should reference `"catalog:"` in `package.json` rather than pinning a version locally. Add the dep to `pnpm-workspace.yaml`'s `catalog:` block first.

## Mockup sandbox (component preview)

`artifacts/mockup-sandbox` auto-discovers any `.tsx` file under `src/components/mockups/**` (excluding paths starting with `_`) via the `mockupPreviewPlugin` Vite plugin. The plugin generates `src/.generated/mockup-components.ts` on startup and re-runs on file add/remove. Don't edit `.generated/` by hand. Mockups are loaded as dynamic `import()` so dropping a new `.tsx` file in is enough — no registry edit needed.

## Gotchas

- **Never lower `minimumReleaseAge` in `.npmrc`** (currently 1440 min). It's a supply-chain defense; the file's header comment spells out the policy. Add packages to `minimumReleaseAgeExclude` only if absolutely necessary, then remove the exclusion once 24h have passed.
- **The lockfile is `pnpm-lock.yaml`.** The preinstall hook deletes stray `package-lock.json`/`yarn.lock`. If you see one appear, that's a foreign package manager and should not be committed.
- **Adding a dependency on a generated lib?** Make it a `workspace:*` dep and run `pnpm install` once — Orval-generated files are committed, so consumers don't need to run codegen unless `openapi.yaml` changed.
- **Game progression changes** (new biome, new dino, new puzzle type) must keep `BIOMES[i].threshold` and `DINOS[i].unlockAt` in sync with the `GameContext.answerPuzzle` logic: biome promotion checks the *next* biome's `threshold` against the new `totalCorrect`, and dino unlock is exact-match (`d.unlockAt === newTotal`), so off-by-one errors silently skip rewards.
- **`replit.md` is a template** — its scripts (e.g. `pnpm --filter @workspace/api-server run dev` on port 5000) describe a generic Replit pnpm-workspace setup, not the current state of this repo. Treat this CLAUDE.md as authoritative and update `replit.md` if/when product copy is needed.
