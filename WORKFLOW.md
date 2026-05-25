---
tracker:
  kind: linear
  api_key: $LINEAR_API_KEY
  project_slug: f48a68feb930
  required_label: Symphony Run
  active_states: [Todo, In Progress]
  terminal_states: [Done, Canceled, Duplicate]
polling:
  interval_ms: 30000
workspace:
  root: .symphony/workspaces
hooks:
  timeout_ms: 60000
agent:
  max_concurrent_agents: 1
  max_turns: 20
  max_attempts: 3
  max_retry_backoff_ms: 300000
codex:
  command: codex app-server --listen stdio://
  turn_timeout_ms: 3600000
  read_timeout_ms: 5000
  stall_timeout_ms: 300000
---
# Symphony Issue Prompt

You are working from Linear issue `{{ issue.identifier }}`: `{{ issue.title }}`.

Use the repository instructions in `AGENTS.md` first. Keep changes scoped to the issue, preserve the tablet-first Charlotte context for Dino Quest work, and run the fastest meaningful validation before handing back.

Treat `docs/product-blueprint.md` as the canonical product direction. If the Linear issue, task list, or local notes conflict with the current blueprint, stop and report the conflict instead of implementing stale scope.

Use the Linear API as the authoritative source for Linear state and mutations. Browser-visible Linear state is only a visual aid unless reconciled through the API.

Issue details:

{{ issue.description }}

Labels: {{ issue.labels | join: ", " }}

If this is a retry or continuation, use the current workspace state and the rendered attempt value when present instead of restarting unrelated work.
