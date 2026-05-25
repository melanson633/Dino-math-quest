# Dino Quest Replit Import Notes

This project was imported from Replit/GitHub, but local development should follow the repo-owned guidance in `AGENTS.md`.

## Current Local App

- Charlotte-facing app: `artifacts/dino-math-quest`
- Package: `@workspace/dino-math-quest`
- Package manager: `pnpm`
- Local dev command, from the repo root in PowerShell:
  - `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run dev`
- Portable dev command for Replit or local shells:
  - `pnpm run dev:dino`
- Replit deployment commands:
  - Build: `pnpm run build:replit`
  - Run/preview: `pnpm run preview:dino`

## Validation

- Full typecheck: `pnpm run typecheck`
- Full build: `pnpm run build`
- Replit-compatible build: `pnpm run build:replit`
- Primary browser target: tablet/iPad portrait, with mobile portrait as a quick secondary check.

## Notes For Future Agents

- Do not treat the API server as the primary product surface unless the task explicitly asks for API, DB, or generated-client work.
- Use `docs/product-blueprint.md` for product direction, `docs/team-roster.md` for role coordination, and `tasks/dino-island-build-task-list.md` for approved build order.
- Keep Replit-era comments in generated or imported UI files unless they create real confusion; this file is only the local orientation layer.
