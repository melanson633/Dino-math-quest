# CLAUDE.md

Read `AGENTS.md`. It is the single entry point for this repo — product intent,
guardrails, commands, and the reading order. `docs/README.md` indexes everything else.

Two harness files are committed so a fresh session needs no setup:

- `.claude/launch.json` — `preview_start` with the config name `dino` boots the
  game on port 25918 in one call. Prefer it over running a dev server by hand.
- `.claude/settings.json` — pre-approves the routine read-only and build commands
  (`pnpm install`, `typecheck`, `build`, `dev:dino`, read-only `git`) so simple
  work does not spend turns on permission prompts. Generated client directories
  and `.env` files are denied.
