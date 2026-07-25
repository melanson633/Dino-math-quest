# Docs Index

`AGENTS.md` is the single entry point for the repo. This file indexes everything
under `docs/`, `tasks/`, and the root so you can pick one document instead of
reading the folder. Roughly 2,700 lines live here — most of it historical.

Tiers mean:

- **Current** — trustworthy, reflects intent or the live codebase.
- **Reference** — useful when working in that specific area; not general context.
- **Historical** — a record of what a past thread decided or observed. **Not current
  direction.** Do not implement from these without confirming the scope still stands.

## Current

| Doc | Lines | Read it when |
| --- | --- | --- |
| `repo-map.md` | 95 | Before touching code. File inventory, screen wiring, what to ignore |
| `product-blueprint.md` | 185 | You need product direction. **Its "Current Implementation Status" section is stale — see the note in the file.** The Purpose, Thesis, Goals, and Non-Goals sections are durable |
| `team-roster.md` | 87 | Coordinating across multiple threads. Not needed for solo work |
| `asset-specs/README.md` | 154 | Generating, reviewing, or replacing dino and biome art. Defines the spec schema and **reserves a silhouette class and body color per species** — read this before any art work |
| `asset-specs/dinos/<id>.md` | ~230 each | Drawing or reviewing one dino. Read only the one you are working on |
| `asset-specs/biomes/<id>.md` | ~255 each | Drawing or reviewing one biome background |

## Reference

| Doc | Lines | Read it when |
| --- | --- | --- |
| `math-quest-rubric.md` | 58 | Scoring or arguing about math-section quality |
| `qa-playtest-checklist.md` | 190 | Running a structured child playtest |
| `local-validation-harness.md` | 389 | Working on the validation harness itself |
| `audio-music-speech-spec.md` | 103 | Changing audio, music, or speech behavior |
| `elevenlabs-static-audio-pipeline.md` | 72 | Touching the generated-audio pipeline |
| `audio-parent-review.md` | 179 | Reviewing generated audio for parent approval |
| `family-avatar-workflow.md` | 109 | Working on family avatars or likeness assets |
| `voice-participation-prototype.md` | 65 | Working on the feature-flagged voice participation |
| `architecture-extension-audit.md` | 47 | Extending architecture beyond the current sections |
| `../research/*.md` | ~5 files | You need learner evidence: gifted, neurodivergent, speech-delay, traditional |

## Historical — not current direction

Read these for archaeology, not instruction. They record decisions and observations
from earlier threads and may describe features, plans, or results that no longer
match the code.

| Doc | Lines | What it is |
| --- | --- | --- |
| `plans/2026-07-25-dino-aruba-polish-plan.md` | — | A prior polish plan. **Item 5c in this plan introduced the live letter-tray blocker** recorded in `dogfood/2026-07-25-live-playthrough.md`. Treat as a cautionary record, not a spec |
| `../tasks/dino-island-build-task-list.md` | 506 | A prior execution order. Superseded unless a task explicitly revives it |
| `code-review-p2-scope.md` | 39 | Scope note from a past review pass |
| `math-quest-improvement-plan.md` | 47 | Superseded by the rubric and blueprint |
| `local-exploration-notes.md` | 91 | Exploration notes from an earlier session |
| `symphony-strategy-audit.md` | 499 | Audit of the Symphony/Linear orchestration experiment |
| `symphony.md` | 47 | Symphony orchestration notes |
| `../WORKFLOW.md` | 42 | Symphony/Linear runner config and issue template. Only relevant to that runner |
| `../replit.md` | 29 | Replit environment notes |

## Evidence

`dogfood/` holds recorded play-throughs of the running app — what was actually
observed, with method stated. These are **evidence, not a work order**. If you are
forming your own view of the app, play it first, then read these to compare.

| Doc | What it covers |
| --- | --- |
| `dogfood/2026-07-25-live-playthrough.md` | Browser play-through at `20e46f9`. One blocker, one layout bug, one orphaned feature, and an explicit list of what was not verified |
