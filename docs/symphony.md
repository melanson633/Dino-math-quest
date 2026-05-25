# Symphony Harness

This repo includes a TypeScript implementation of the core Symphony orchestration contract from `openai/symphony` under `scripts/src/symphony`.

## Operational Boundary

The current approved posture is API-first, pre-live coordination only: use Linear API reads/writes as authoritative, validate/render prompts, and use dry-run/status serving for visibility. Do not use `--live-agent` for real implementation until every live-readiness gate in `docs/symphony-strategy-audit.md` is implemented and verified. The audit file is an evidence log; when it is verbose, treat its `Current Confidence`, `Current Strategy`, `Verified Facts`, and latest loophole entries as the active decision boundary.

## Commands

- Validate config and prompt: `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md`
- Render the prompt with a sample issue: `pnpm --filter @workspace/scripts run symphony render-prompt WORKFLOW.md`
- Start the orchestrator in safe dry-run mode: `pnpm --filter @workspace/scripts run symphony serve WORKFLOW.md --dry-run --port 0` (long-running service; stop with `Ctrl+C`)
- Live Codex turns are intentionally prohibited for implementation work until the live-readiness gates in `docs/symphony-strategy-audit.md` pass. The negative preflight check is: `pnpm --filter @workspace/scripts run symphony serve WORKFLOW.md --live-agent --port 0`

`WORKFLOW.md` is the repo-owned Symphony workflow. It uses `$LINEAR_API_KEY` for tracker auth, resolves repo-local `.env` values when the host process does not already provide them, filters Linear project `DINO` by its assigned `slugId`, and stores per-issue workspaces under `.symphony/workspaces`. Use the Linear API for Linear setup and operations unless the user explicitly asks for a different path.

For ad hoc Linear API smoke checks, run from the `scripts` package context or an equivalent `@workspace/scripts` command so `tsx` and local imports resolve correctly. Use the public `LinearClient.rawGraphql` helper for direct GraphQL probes. On Windows, background status-server probes should launch `pnpm.cmd` with `Start-Process`.

Dry-run mode reads Linear candidates and renders prompts, but does not transition Linear issues, create/remove per-issue workspaces, or run workspace hooks. Live agent mode is blocked unless `WORKFLOW.md` defines an `after_create` or `before_run` hook that populates/syncs each per-issue workspace plus an `after_run` hook that integrates or hands off completed workspace changes before Linear completion.

## Linear Setup

Linear project: `DINO` at `https://linear.app/mem-dev/project/dino-f48a68feb930`.

The project has been seeded from `tasks/dino-island-build-task-list.md` as one Backlog issue per task. Issues intentionally start in `Backlog`, which is not an active Symphony state.

To approve an issue for Symphony execution, use the Linear API to add the `Symphony Run` label and move exactly one approved issue into `Todo` or `In Progress`. Active state alone is not enough; the required label is the execution gate. If more active labeled issues exist than `agent.max_concurrent_agents`, the orchestrator refuses dispatch so extra approvals cannot quietly run next. A successful live run is transitioned only after the agent succeeds and the required `after_run` hook succeeds. Failed or stalled runs retry with backoff up to `agent.max_attempts`, then stop retrying in the current process and log the failure. Before live use, add a durable Linear failure policy such as removing the run label, adding a failure label/comment, or moving the issue to a non-active failure state.

## Scope

Implemented:

- `WORKFLOW.md` discovery, front matter parsing, config defaults, repo-local `.env` loading, `$VAR` resolution, and dynamic reload.
- Strict prompt rendering for `{{ issue.* }}`, `{{ attempt }}`, simple `{% for item in issue.labels %}` loops, and known filters.
- Linear candidate, terminal-state, and state-refresh reads with normalized issue records.
- Linear start/completion transitions, plus a required-label gate for explicit run approval.
- Workspace key sanitization, root containment checks, persistent per-issue workspaces, lifecycle hooks, and read-only dry-run workspace behavior.
- Polling orchestration, dispatch sorting, active/terminal reconciliation, retry queue, capped backoff retries, continuation retries, and status snapshots.
- Operator-visible structured logs and optional loopback HTTP status endpoints.
- Codex app-server JSON-line launch, initialize, thread creation, turn start, token-usage capture, turn completion handling, and failure propagation for live runs.

The default runner is dry-run so this harness does not launch autonomous agents or mutate Linear/workspaces until explicitly requested. `--live-agent` uses the installed Codex app-server protocol and starts each turn with `approvalPolicy: "never"` so unattended runs fail instead of blocking on approval prompts. In live mode, `after_run` is only called after a successful agent result; failed agent attempts go to retry/failure handling without invoking the completion handoff hook. Startup cleanup of terminal issue workspaces is skipped unless `hooks.before_remove` exists, so terminal-state drift cannot remove work before an explicit archive/review policy is installed.

## Safety Posture

This is intended for trusted local development. Tracker tokens are resolved from env vars or repo-local `.env` values and are not logged. Hooks are trusted workflow code and run inside the per-issue workspace. Live Codex turns use `approvalPolicy: "never"`; if a run asks for blocked user input, it is expected to fail or time out visibly instead of waiting indefinitely.
