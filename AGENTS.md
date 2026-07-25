# Dino Quest Agent Notes

## Product

Dino Math Quest is the Charlotte-facing game in `artifacts/dino-math-quest`: a Vite + React + Tailwind mobile PWA for early math, shapes, patterns, and confidence-building play. The rest of the workspace is supporting infrastructure or previews unless a task says otherwise.

Charlotte is a bright 4-year-old who mainly uses the app on iPad/tablet, sometimes phone, and essentially never desktop. She reads basic books, spells, counts confidently, and has strong visual memory. She also has a speech delay and benefits from patient, rhythmic repetition, syllable breaks, music, and gentle support for hard sounds such as `L` and `W`.

Use this context for UX, copy, audio, reward, accessibility, and testing decisions, but keep the product flexible. Prefer observing the running game and making practical child-centered improvements over hard-coding a fixed therapy flow.

## Product Intent

The durable north star, summarized here so it costs nothing to know. Full version:
`docs/product-blueprint.md` (read its Purpose / Thesis / Goals / Non-Goals; treat its
"Current Implementation Status" section as unverified — see the note in that file).

Dino Island is Charlotte's own learning world — a calm, joyful, tablet-first place
where she chooses an adventure instead of passive screen time. The target feel is
**65% Montessori-calm** (clear, warm, uncluttered, predictable, confidence-building)
and **35% Sesame Street** (catchy music, call-and-response, memorable characters,
gentle humor, rhythmic language). It is a game world, not a dashboard, and a
Charlotte-first "Charlotte OS" rather than a generic school product.

Explicit non-goals — these are the creative guardrails, and they bind:

- No failure states, no timers that end runs, no gamified pressure.
- No punitive speech feedback; never tell her she could not be understood.
- No open-ended AI conversation for Charlotte.
- No screens that require an adult to read them for her to play.
- No ads, accounts, social features, or in-app purchases.
- No desktop-first redesign.

Difficulty should adapt **silently** — advance on quick success, ease off on repeated
friction, and never announce struggle or remediation. Reward effort and participation,
not just correctness.

## Compound Engineering Skills

32 CE skills are committed directly to `.local/secondary_skills/` and are available automatically — no setup needed. Replit Agent discovers them on every session via git checkout.

Invoke them by name in the Replit chat, e.g.: `ce-plan: add a new biome` or `ce-work: implement the plan at docs/plans/foo.md`. For Claude Code (desktop), they're also available as `/ce-plan` etc. via `.claude/commands/`.

To update skills, edit `.local/secondary_skills/<skill-name>/SKILL.md` directly and commit.

## Start Here

**This file is the single entry point.** Everything else is reached from here or
from `docs/README.md`. If another document claims to be the starting point, it is
describing an older workflow.

Load in this order, and stop as soon as you have what the task needs:

1. **This file** — product intent, guardrails, commands, conventions. Always.
2. **`docs/repo-map.md`** — every real source file with line counts, how screens
   connect, and which directories to ignore. Read before touching code. The whole
   application is ~3,400 lines across 22 files; it fits in context, so load files
   directly instead of searching for them.
3. **`docs/README.md`** — a one-line index of every other document, tiered by
   whether it is current, reference, or historical. Read only when you need one.

Nothing else auto-loads. `docs/` holds ~2,700 lines and most of it is historical;
reading it wholesale costs more than the code it describes.

### If you were given a vague prompt

Prefer discovering this app by **playing it**, not by reading about it. Start it
with `preview_start` (config name `dino`), play both games at tablet width, and
form your own view before opening `docs/dogfood/`, `docs/plans/`, or `tasks/` —
those contain prior conclusions that will anchor you to an earlier thread's framing.

## Workspace

- Package manager: `pnpm` only.
- Install from repo root: `pnpm install`.
- Run the game: `pnpm run dev:dino` (serves on **port 25918**; the script sets
  `PORT` and `BASE_PATH` for you — Vite fails fast without them).
  In Claude Code, `preview_start` with the config name `dino` does this in one call.
- Preview a production build: `pnpm run preview:dino`.
- Typecheck everything: `pnpm run typecheck`. Passes clean as of `20e46f9`.
- Build everything: `pnpm run build`.
- There is no test runner. **Typecheck plus an actual play-through is the only
  meaningful verification** — behavioral claims need a play-through, not a code read.
- `pnpm install` may still print a `preinstall: Use pnpm instead` failure at the end
  on Windows. The install itself succeeded; the root guard misreads the user agent.
  `verifyDepsBeforeRun: false` in `pnpm-workspace.yaml` keeps that guard from
  breaking every other `pnpm run`.

## Team Coordination

- For multi-thread work, start with this file, then read `docs/team-roster.md` for current roles, hand-off expectations, and active coordination notes. Single-thread work does not need the roster.
- Keep role prompts and large findings out of `AGENTS.md`; store evolving team context in `docs/` or `research/` and link to it from the roster.
- Route child-development, learning, speech, and accessibility evidence through `research/`; route implementation observations through `docs/`.

## Development Guidance

- Keep changes focused on the game unless the task is explicitly about the API, DB, generated clients, or workspace tooling.
- `src/components/ui/` holds 55 shadcn components of which 53 are unused — only
  `card` is imported anywhere. Do not grep it and do not add to it.
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
