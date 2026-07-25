# Dino Quest Agent Notes

## Product

Dino Math Quest is the Charlotte-facing game in `artifacts/dino-math-quest`: a Vite + React + Tailwind mobile PWA for early math, shapes, patterns, and confidence-building play. The rest of the workspace is supporting infrastructure or previews unless a task says otherwise.

Charlotte is a bright 4-year-old who mainly uses the app on iPad/tablet, sometimes phone, and essentially never desktop. She reads basic books, spells, counts confidently, and has strong visual memory. She also has a speech delay and benefits from patient, rhythmic repetition, syllable breaks, music, and gentle support for hard sounds such as `L` and `W`.

Use this context for UX, copy, audio, reward, accessibility, and testing decisions, but keep the product flexible. Prefer observing the running game and making practical child-centered improvements over hard-coding a fixed therapy flow.

## Compound Engineering Skills

32 CE skills are committed directly to `.local/secondary_skills/` and are available automatically — no setup needed. Replit Agent discovers them on every session via git checkout.

Invoke them by name in the Replit chat, e.g.: `ce-plan: add a new biome` or `ce-work: implement the plan at docs/plans/foo.md`. For Claude Code (desktop), they're also available as `/ce-plan` etc. via `.claude/commands/`.

To update skills, edit `.local/secondary_skills/<skill-name>/SKILL.md` directly and commit.

## Workspace

- Package manager: `pnpm` only.
- Install from repo root: `pnpm install`.
- Run the game locally in PowerShell:
  - `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run dev`
- Typecheck everything: `pnpm run typecheck`.
- Build everything: `pnpm run build`.
- There is currently no dedicated test runner.

## Team Coordination

- For multi-thread work, start with this file, then read `docs/team-roster.md` for current roles, hand-off expectations, and active coordination notes.
- Keep role prompts and large findings out of `AGENTS.md`; store evolving team context in `docs/` or `research/` and link to it from the roster.
- Route child-development, learning, speech, and accessibility evidence through `research/`; route implementation observations through `docs/`.

## Development Guidance

- Keep changes focused on the game unless the task is explicitly about the API, DB, generated clients, or workspace tooling.
- Preserve `data-testid` attributes on interactive game controls.
- Treat `src/context/GameContext.tsx` as the main state/persistence owner. It serializes progress to `localStorage` under `dino-math-quest-state`.
- Puzzle/progression source files in `src/lib/` are coupled: update `biomes.ts`, `dinos.ts`, and `puzzles.ts` together when changing progression.
- Audio is synthesized in `src/lib/audio.ts`; avoid restarting background music on every state update.
- Generated files under `lib/api-client-react/src/generated/` and `lib/api-zod/src/generated/` should be regenerated, not hand-edited.

## UX And Validation

- Primary validation surface is tablet/iPad portrait. Check mobile portrait when quick; desktop is only a containment sanity check.
- Verify the app loads visually, has no obvious runtime overlay, and supports touch-sized controls before declaring UI work done.
- From Charlotte's perspective, the next tap should be visually obvious without adult reading. Favor large targets, clear feedback, low-friction retries, and encouragement that rewards effort as well as correctness.
- Speech-support ideas should be gentle and optional: rhythmic word emphasis, repeated prompts, syllable breaks, music, and confidence-building call-and-response patterns.
