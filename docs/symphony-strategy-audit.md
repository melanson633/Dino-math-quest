# Symphony Strategy Audit

Date: 2026-05-25

## Active Strategy Decision - 2026-05-25

I am 100% confident only in this bounded strategy: Linear API-first coordination, prompt/config validation, dry-run/status visibility, and fail-closed prohibition of real `--live-agent` implementation. I am not 100% confident in autonomous live implementation, automatic completion, final merge, or release readiness.

Authoritative rule: use the Linear API for every Linear operation unless the user explicitly changes that rule. Browser-visible Linear can help with inspection, but it is not authoritative unless reconciled through the API.

Allowed now: validate `WORKFLOW.md`, render worker prompts, read/write approved Linear setup through the API, run dry-run/status mode, and implement manually in the orchestrator or explicitly scoped team threads.

Not allowed yet: live unattended Symphony implementation, automatic completion to `Done`, final merge, or release sign-off.

Loopholes closed in the latest loop:

- Run direct TypeScript/Linear smoke scripts from the `scripts` package context, or through an equivalent scripts-package command. Root-level `pnpm exec tsx` does not reliably see the scripts package dev dependency.
- For direct Linear checks, use `loadWorkflow('../WORKFLOW.md')`, `resolveConfig(workflow)`, `new LinearClient(config)`, and public `rawGraphql`; do not call private client internals.
- On Windows background probes, launch `pnpm.cmd` rather than `pnpm` with `Start-Process`.
- Keep local probe logs under ignored `tmp/` or `.symphony/` paths.
- The imported project still lacks a clean tracked Git baseline. That is compatible with API/dry-run coordination, but blocks live worktree isolation, reliable diff review, and final commit/merge readiness.

## Current Confidence

The Linear API-first coordination strategy is sound for manual issue setup, status reads, explicitly approved issue gating, prompt verification, and safe dry-run operation. Unattended live agents remain intentionally blocked until workspace population, result integration, durable failure policy, cancellation semantics, and a clean Git baseline are configured and smoke-tested.

After re-checking the upstream Symphony draft spec on 2026-05-25, the confidence boundary is stricter: this repo is ready to use Linear API plus Symphony dry-run as a coordination harness, but it is not ready to use `--live-agent` for real implementation work. Treat live-agent execution as prohibited until the live-readiness gates below are implemented and verified. "100% confident" means confident inside that pre-live boundary, not confident that unattended implementation is safe.

Current loop result on 2026-05-25: I am 100% confident in the bounded pre-live strategy only. I am intentionally not 100% confident in live autonomous implementation, final merge, or release readiness because those require the open gates below: clean tracked Git baseline, physical iPad Safari playtest, parent-approved audio exposure, approved family-avatar intake, reviewed live workspace/handoff hooks, durable Linear failure policy, stall abort handling, single-runner protection, and non-terminal review handoff.

Latest operator check on 2026-05-25: the strategy remains 100% confidence-worthy only inside that bounded pre-live scope. A fresh check against the upstream Symphony draft spec, local workflow validation, rendered prompt, scripts typecheck, live-agent negative preflight, dry-run status server, Linear API reconciliation, and Git status did not justify broadening the allowed scope.

Fresh operator loop on 2026-05-25: the strategy is still 100% confidence-worthy only as an API-first, pre-live coordination harness. Current evidence again supports validate/render/dry-run/status use and Linear API setup/status operations. It does not support live unattended implementation because the repo still lacks a clean tracked Git baseline, live workspace population/handoff hooks, single-runner protection, durable Linear failure policy, stall abort handling, configured non-terminal completion handoff, and live multi-turn semantics.

Current API-only operator loop on 2026-05-25: the strategy remains 100% confidence-worthy only inside the pre-live boundary. The Linear API is the source of truth for all Linear reads and writes, browser Linear is only a visual/debug aid, dry-run/status mode is allowed, and `--live-agent` remains prohibited for real implementation. A fresh local loop reconfirmed workflow validation, prompt rendering, scripts typecheck, Replit-compatible build, live-agent fail-closed behavior, dry-run status/refresh, and Linear API state. The result does not broaden the strategy into unattended live execution.

Latest orchestrator loop on 2026-05-25: I am still 100% confident only in the bounded strategy: Linear API-first coordination, prompt/config validation, dry-run/status visibility, and fail-closed live-agent prohibition. I am not 100% confident in autonomous live implementation, automatic completion, or final merge readiness because the untracked Git baseline, live workspace lifecycle, durable failure policy, single-runner protection, stall abort semantics, non-terminal handoff, real iPad validation, approved audio exposure, and avatar/privacy gates remain open.

## Current Strategy

Use this bounded strategy until the live-readiness gates are completed:

1. Keep `docs/product-blueprint.md` as the canonical product source. If Linear, the local task list, or generated worker prompts conflict with the blueprint, stop and reconcile before implementation.
2. Use the Linear API for all Linear reads and writes that affect orchestration state. Browser-visible Linear is a visual/debug aid only and must not be treated as authoritative unless API-reconciled.
3. Use Symphony only in validate, render-prompt, and dry-run/status modes for now. `--live-agent` must continue to fail closed.
4. Approve at most one active issue at a time with the `Symphony Run` label while `agent.max_concurrent_agents` is `1`.
5. Keep implementation in the main orchestrator thread or explicitly scoped team threads until Git has a reviewed baseline and live workspaces have a tested create/run/handoff/remove lifecycle.
6. Before any future live run, require: clean tracked baseline, `.env` ignored, idempotent Linear operation scripts, non-terminal review handoff instead of automatic `Done`, durable failure marking in Linear, abort/kill handling for stalled workers, and focused regression tests for dry-run/live safety gates.

## Verified Facts

- 2026-05-25 current strategy-doc cleanup: `docs/team-roster.md` now reflects completion through P3-004, `tasks/dino-island-build-task-list.md` now explicitly makes `docs/product-blueprint.md` the product source of truth, and `docs/symphony.md` now states the short operational boundary before listing commands.
- 2026-05-25 current confidence loop: `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md`, `pnpm --filter @workspace/scripts run symphony render-prompt WORKFLOW.md`, and `pnpm --filter @workspace/scripts run typecheck` all pass.
- 2026-05-25 current live negative check: `pnpm --filter @workspace/scripts run symphony serve WORKFLOW.md --live-agent --port 0` fails closed before serving because workspace population/sync and handoff hooks are absent.
- 2026-05-25 current Linear API check: DINO resolves to `slugId` `f48a68feb930`, one `Symphony Run` label exists, and there are 0 active issues and 0 active approved issues in `Todo` or `In Progress`.
- 2026-05-25 current dry-run status check: `serve WORKFLOW.md --dry-run --port <local>` exposes `/api/v1/state` and accepts `POST /api/v1/refresh` with 0 running and 0 retrying.
- `WORKFLOW.md` now tells workers that Linear API state is authoritative and browser-visible Linear state is only a visual aid unless API-reconciled.
- `WORKFLOW.md` resolves and validates with `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md`.
- The rendered issue prompt is scoped and Charlotte/tablet-aware with `pnpm --filter @workspace/scripts run symphony render-prompt WORKFLOW.md`.
- The TypeScript harness typechecks with `pnpm --filter @workspace/scripts run typecheck`.
- Linear API auth works from the local environment and repo-local `.env` without printing the token.
- Linear project `DINO` resolves to `slugId` `f48a68feb930` in organization `mem-dev`.
- Required label `Symphony Run` exists.
- Current Linear API sample on 2026-05-25: DINO resolves, the `Symphony Run` label exists, and there are 0 active issues in `Todo` or `In Progress`, including 0 active approved issues with `Symphony Run`.
- Dry-run status serving works at `/api/v1/state`; manual refresh accepts `POST /api/v1/refresh` without live-agent or workspace mutations.
- Current `--live-agent` preflight fails closed because `WORKFLOW.md` intentionally lacks workspace population and handoff hooks.
- 2026-05-25 second-pass audit reconfirmed Linear API access: DINO resolves to `slugId` `f48a68feb930`, the `Symphony Run` label exists, and there are currently 0 active issues and 0 active approved issues in `Todo` or `In Progress`.
- 2026-05-25 second-pass audit reconfirmed local harness state: workflow validation passes, prompt rendering works, the scripts package typechecks, dry-run status serving works, and `--live-agent` fails closed before serving because required workspace/handoff hooks are absent.
- `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md` passes.
- `pnpm --filter @workspace/scripts run typecheck` passes.
- `pnpm --filter @workspace/scripts run symphony serve WORKFLOW.md --live-agent --port 0` fails closed before serving because required workspace/handoff hooks are absent.
- Replit/local wrapper commands now route to the Charlotte-facing game: `.replit` uses `pnpm run dev:dino`, deployment build uses `pnpm run build:replit`, and deployment run uses `pnpm run preview:dino`.
- `pnpm run build:replit` passes from the repo root after full typecheck and recursive package builds.
- `pnpm run dev:dino` served `Dino Math Quest` on an alternate local port with HTTP 200, proving the portable dev command works without relying on the previous direct Vite command.
- Fresh-state Playwright smoke cleared `localStorage` and verified first-run Home Base on tablet viewport with no console warnings or errors.
- Dry-run mode now skips Linear start/completion mutations, per-issue workspace creation/removal, and workspace lifecycle hooks.
- `--live-agent` now refuses to start unless the workflow defines a workspace population/sync hook and an `after_run` integration/handoff hook.
- Linear start and completion transitions are awaited during live runs; transition failure is treated as run failure instead of logged after local completion.
- `after_run` is fatal; a failed handoff prevents local completion and Linear completion.
- The orchestrator refuses dispatch when more active approved issues exist than `agent.max_concurrent_agents`.
- Retry dispatch now re-checks the active approved issue count.
- Blocker relations now gate every active state, not only `Todo`.
- 2026-05-25 latest audit loop reconfirmed the upstream Symphony spec boundary: the service is a scheduler/runner, ticket writes usually live in agent/tooling policy, and a successful run can hand off to a review state instead of `Done`.
- 2026-05-25 latest local validation: `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md`, `pnpm --filter @workspace/scripts run symphony render-prompt WORKFLOW.md`, and `pnpm --filter @workspace/scripts run typecheck` all pass.
- 2026-05-25 latest live-mode negative check: `pnpm --filter @workspace/scripts run symphony serve WORKFLOW.md --live-agent --port 0` still fails closed because workspace population/sync and handoff hooks are absent.
- 2026-05-25 latest Linear API check: DINO resolves to `slugId` `f48a68feb930`, one `Symphony Run` label exists, and there are 0 active issues and 0 active approved issues in `Todo` or `In Progress`.
- 2026-05-25 latest code-level hardening: `after_run` now runs only after a successful agent result, and startup terminal-workspace cleanup now requires `hooks.before_remove` before removing terminal issue workspaces.
- 2026-05-25 post-hardening verification: scripts package typecheck passes, workflow validation passes, the live-agent negative preflight still fails closed, Linear API reconciliation still shows 0 active and 0 active approved issues, and dry-run status serving starts at `/api/v1/state`.
- 2026-05-25 current validation loop: workflow validation, prompt rendering, scripts package typecheck, `pnpm run build:replit`, the live-agent negative preflight, dry-run status serving, and API reconciliation all pass inside the pre-live boundary.
- 2026-05-25 API-schema correction check: direct Linear reconciliation must query Project `slugId`, not `slug`, and project teams through `Project.teams.nodes`, not `Project.team`; corrected query resolves DINO to `slugId` `f48a68feb930`, confirms team `MEM`, confirms one `Symphony Run` label, and shows 0 active approved issues.
- 2026-05-25 latest current-state loop: `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md`, `pnpm --filter @workspace/scripts run symphony render-prompt WORKFLOW.md`, and `pnpm --filter @workspace/scripts run typecheck` all pass; `--live-agent` still fails closed before serving because workspace population hooks are absent; dry-run status serving reports 0 running, 0 retrying, and 0 completed; Linear API reconciliation resolves DINO `slugId` `f48a68feb930`, team `MEM`, one `Symphony Run` label, 0 active issues, and 0 active approved issues.
- 2026-05-25 Git baseline check: `git status --short` still reports the imported project as untracked. This is compatible with pre-live dry-run coordination, but it blocks any strategy that assumes branch isolation, normal merge review, or final commit/merge readiness.
- 2026-05-25 operator confidence loop: re-read `WORKFLOW.md`, `docs/symphony.md`, and this audit; re-checked the upstream Symphony draft spec; confirmed workflow validation, prompt rendering, scripts typecheck, live-agent fail-closed behavior, dry-run `/api/v1/state` plus `/api/v1/refresh`, and Linear API reconciliation. Linear still has 0 active issues and 0 active approved issues in `Todo` or `In Progress`.
- 2026-05-25 fresh operator loop: `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md`, `pnpm --filter @workspace/scripts run symphony render-prompt WORKFLOW.md`, `pnpm --filter @workspace/scripts run typecheck`, and `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm run build:replit` passed; `pnpm --filter @workspace/scripts run symphony serve WORKFLOW.md --live-agent --port 0` failed closed because workspace population/sync and handoff hooks are absent; dry-run `/api/v1/state` reported 0 running, 0 retrying, and 0 completed, and `/api/v1/refresh` succeeded.
- 2026-05-25 fresh Linear API reconciliation: DINO resolves to `slugId` `f48a68feb930`, team `MEM`, one `Symphony Run` label exists, and there are 0 active issues plus 0 active approved issues in `Todo` or `In Progress`.
- 2026-05-25 fresh Git baseline check: `git status --short` still reports the imported project as untracked. This remains compatible with dry-run coordination but blocks live worktree isolation, reliable diff review, and final commit/merge readiness.
- 2026-05-25 API-only operator loop: re-read `WORKFLOW.md`, `docs/symphony.md`, `docs/symphony-strategy-audit.md`, and `tasks/dino-island-build-task-list.md`; re-checked the upstream Symphony spec; confirmed workflow validation, rendered prompt, scripts typecheck, live-agent fail-closed behavior, dry-run `/api/v1/state` plus `/api/v1/refresh`, and Linear API reconciliation. Current P4 Linear issues `MEM-39` through `MEM-42` are all in `Backlog` without `Symphony Run`; there are 0 active issues and 0 active approved issues.
- 2026-05-25 current API-only confidence loop: re-read `WORKFLOW.md`, `docs/symphony.md`, `docs/symphony-strategy-audit.md`, `scripts/src/symphony/linear.ts`, `.gitignore`, `tasks/dino-island-build-task-list.md`, and `docs/team-roster.md`; re-checked the upstream Symphony draft spec; confirmed `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md`, `pnpm --filter @workspace/scripts run symphony render-prompt WORKFLOW.md`, `pnpm --filter @workspace/scripts run typecheck`, and `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm run build:replit` pass. `pnpm --filter @workspace/scripts run symphony serve WORKFLOW.md --live-agent --port 0` still fails closed because workspace population/sync hooks are absent. Dry-run `/api/v1/state` reported 0 running, 0 retrying, 0 completed, and `/api/v1/refresh` succeeded. Linear API reconciliation resolved DINO `slugId` `f48a68feb930`, team `MEM`, one `Symphony Run` label, 0 active issues, and 0 active approved issues.
- 2026-05-25 current Git/secrets check: `.gitignore` excludes `/.env`, `/.env.*`, `.symphony/`, `.dino-dev.pid`, Replit cache/local folders, and `private-family-source/`. `git status --short` still reports the imported project as untracked, so this remains safe for local pre-live checks but not safe for worktree isolation, branch review, final merge readiness, or any strategy that depends on tracked baseline diffs.
- 2026-05-25 latest orchestrator loop: re-read `WORKFLOW.md`, `docs/symphony.md`, `docs/symphony-strategy-audit.md`, `scripts/src/symphony/linear.ts`, `scripts/src/symphony/orchestrator.ts`, `tasks/dino-island-build-task-list.md`, and `docs/team-roster.md`; re-checked the upstream Symphony draft spec; confirmed workflow validation, rendered prompt, scripts typecheck, live-agent fail-closed behavior, dry-run `/api/v1/state` plus `/api/v1/refresh`, Linear API reconciliation, and Git status. Linear API resolved org `mem-dev`, project `f48a68feb930`, team `MEM`, one `Symphony Run` label, 0 active issues, and 0 active approved issues. Git still reports the imported project as untracked.

## Loopholes Found And Fixes

### Latest API-Only Assumption Loop

This loop was added after the operating assumption: "use the Linear API for all Linear operations until the user states otherwise."

37. "API-only" can be interpreted as "never look at Linear in the browser."
   - Risk: the team may skip useful visual review of the Linear board, comments, and issue formatting even though the real safety boundary is mutation/source-of-truth control.
   - Fix: use Linear API for all Linear reads and writes that affect orchestration state. Browser viewing is allowed only as a visual/debug aid; any decision, status, approval, or issue mutation must be confirmed or performed through the API.

38. Browser/manual Linear changes can create untracked drift.
   - Risk: if someone changes labels, states, dependencies, or issue text in the UI, the local strategy can look valid while API state has changed under it.
   - Fix: before approving a batch or running Symphony, re-query Linear by API for project, labels, active issues, dependencies, and approved issues. Treat the API result as current truth.

39. API-only issue seeding can duplicate or stale-sync work.
   - Risk: without an idempotent sync convention, API issue creation can create duplicate DINO tasks or overwrite useful human edits.
   - Proper fix before broad issue sync: include a stable repo task id in every Linear issue title or description, query by that id before create/update, and append sync notes instead of blindly replacing human-authored descriptions.

40. Personal API key actions are attributed to the key owner.
   - Risk: Linear history can make orchestrator actions look like direct human actions, reducing audit clarity.
   - Fix: every API-created or API-updated issue/comment should include an explicit "via Dino Quest orchestrator" note when the action is not a direct human edit. Do not expose token values in logs or comments.

41. Linear API polling is acceptable for low-volume local dry-run checks, but not ideal as a broad long-running trigger.
   - Risk: a future high-frequency or multi-runner setup could fight Linear rate/complexity limits or miss near-real-time semantics.
   - Fix: keep current polling narrow and low-volume. Before broad live use, prefer Linear webhooks or a deliberate approval command flow. Linear's own docs discourage polling for updates and recommend filtering, specific queries, and webhooks where updates matter.

42. API availability does not prove every needed Linear operation has a durable local wrapper.
   - Risk: one-off GraphQL snippets can work but remain hard to repeat, review, or keep idempotent.
   - Proper fix before broad team operation: add small reviewed scripts for the approved Linear operations: status check, issue sync/upsert, approval label/state change, dependency check, evidence comment, failure comment/label, and review handoff.

43. Linear API completion and human acceptance are different concepts.
   - Risk: an API transition to `Done` can imply product acceptance even when browser/iPad validation, code review, or parent approval is still pending.
   - Fix: do not use automatic `Done` as the default live-agent completion target. Prefer a review/handoff state or an evidence comment plus explicit human transition.

44. "100% confidence" can only apply inside a bounded strategy.
   - Risk: the phrase can be misread as "the whole automation system is ready for unattended implementation."
   - Fix: define confidence in two layers: 100% confident in API-first, pre-live coordination with fail-closed live-agent; not confident in broad unattended live execution until the pre-live gates and regression smokes are completed.

45. The worker prompt did not explicitly state the API-authoritative Linear rule.
   - Risk: future workers could treat the browser board as current truth even though the orchestration state must come from API reads.
   - Fix: `WORKFLOW.md` now states that the Linear API is authoritative and browser-visible Linear state is only a visual aid unless API-reconciled.

46. In-memory `completed` and `claimed` bookkeeping can suppress redispatch in the same process.
   - Risk: a restarted or manually reopened issue may behave differently from an issue reopened while the same orchestrator process is still alive, and max-attempt failures leave local bookkeeping until process restart.
   - Proper fix before live: reconcile `claimed` and `completed` from current Linear state each tick, or remove `completed` from dispatch gating and rely on tracker state plus a durable failure/approval policy.

47. Retry accounting can spend attempts on infrastructure waits rather than agent attempts.
   - Risk: retry polling failures or "no available slot" conditions can increment attempts and exhaust a task before any useful worker retry happens.
   - Proper fix before live: separate worker-attempt count from scheduler-reschedule count, and only consume `agent.max_attempts` when a worker actually starts and fails.

48. Stall handling can mark a run stalled without aborting the child worker.
   - Risk: the child worker can continue after the orchestrator has removed it from `running`, then still execute `after_run` or Linear completion if it eventually succeeds.
   - Proper fix before live: wire stall detection to an abort signal or process kill, and make post-run handoff/completion re-check that the issue is still the active claimed run.

49. Completion target is hard-coded to `Done`.
   - Risk: adding workspace hooks later could make live mode technically startable while still moving issues to a terminal acceptance state too early.
   - Proper fix before live: make completion target configurable, default Dino Quest to a non-terminal review/handoff state, or disable orchestrator completion transitions and require explicit API evidence comments plus human transition.

Current addendum: ad hoc Linear GraphQL can be stale even when the API-first strategy is correct.
- Risk: one-off project reconciliation queries can use invalid or outdated fields, such as `Project.team`, and create false confidence or noisy failures.
- Fix: keep repeated Linear operations in reviewed scripts or the Symphony harness, keep one-off GraphQL reads narrow, and schema-check/fix each query before relying on it. For current DINO project reconciliation, use `Project.teams.nodes` and `slugId`.

50. There is no reviewed idempotent Linear API operation layer yet.
   - Risk: one-off GraphQL snippets are enough for verification but not enough for repeated team operation, issue sync, approval, failure marking, or review handoff.
   - Proper fix before broad use: add small scripts for status, upsert/sync by stable task id, approve exactly one issue, comment evidence, mark failure, and hand off to review.

51. One-off GraphQL snippets can drift from Linear's current schema.
   - Risk: a manual check can fail or silently omit the field that the harness actually uses, as shown by querying Project `slug` instead of Linear's `slugId`.
   - Fix: keep ad hoc checks read-only, prefer the reviewed harness/API helper layer for repeated operations, and include schema-sensitive fields in typechecked code or focused smoke checks.

52. `.env` was untracked but not ignored.
   - Risk: a future baseline commit could accidentally include `LINEAR_API_KEY`, `ELEVENLABS_API_KEY`, or other local secrets.
   - Fix: `.gitignore` now ignores `/.env` and `/.env.*` while allowing `/.env.example`.

53. The repository has no tracked baseline even though future strategy mentions commit/merge.
   - Risk: every file is currently untracked on `master`, so branch isolation, merge review, and "what changed" evidence are not reliable yet.
   - Proper fix before live or final merge work: have the Git thread establish a reviewed baseline commit that excludes secrets and local-only artifacts, then choose whether the durable branch is `main` or `master`.

54. Live stall handling still does not cancel the underlying Codex worker.
   - Risk: the orchestrator can remove a run from memory and schedule a retry while the original child process continues and later executes `after_run` or Linear completion.
   - Proper fix before live: pass an abort signal to the runner, kill the child process on stall/cancel, and re-check that the issue is still the active claimed run immediately before `after_run` and completion mutation.

55. `agent.max_turns` is parsed but live execution is still effectively one Codex turn.
   - Risk: the config implies Symphony-style continuation behavior, but a successful first turn can be treated as a complete issue even if the worker would need additional turns.
   - Proper fix before live: either implement same-thread continuation up to `agent.max_turns` with issue-state rechecks, or remove/document the unsupported field so operators do not over-trust it.

56. Completion still transitions to `Done`.
   - Risk: a future hook addition could make `--live-agent` startable while still moving issues to terminal acceptance before human review, browser verification, or parent approval gates are done.
   - Proper fix before live: make the completion target configurable and default Dino Quest to a review/handoff state, or disable automatic completion and require an API evidence comment plus explicit human transition.

57. Retry accounting still mixes worker failures with scheduler/infrastructure waits.
   - Risk: retry poll failures or unavailable slots can consume the same attempt budget as real failed worker turns.
   - Proper fix before live: track scheduler reschedules separately from worker attempts and consume `agent.max_attempts` only after a worker actually starts and fails.

58. Same-process `completed` bookkeeping can hide reopened work.
   - Risk: if an issue is moved back to active while the orchestrator process is still running, the local `completed` set can suppress redispatch even though Linear now says the issue is active.
   - Proper fix before live: reconcile `completed` and `claimed` from Linear state on each tick, or rely on Linear state plus durable labels instead of local completion memory.

59. Hook commands are powerful but not yet constrained by a reviewed policy.
   - Risk: future workspace hooks could copy wrong files, merge unreviewed output, print secrets, or mutate outside the intended workspace.
   - Proper fix before live: keep hooks repo-relative, code-review them, assert source/destination containment, avoid secret-bearing output, and test success/failure/archive paths on disposable workspaces.

60. Strategy evidence can become too verbose to serve as an operator entry point.
   - Risk: a future agent may skim a long audit log, miss the current boundary, and over-interpret old evidence as approval for live implementation.
   - Fix: keep `docs/symphony.md` as the short operator entry point and use this file as the evidence log. Future updates should adjust `Current Confidence`, `Current Strategy`, and `Verified Facts` before appending detailed loopholes.

61. Team status docs can lag behind the execution task list.
   - Risk: a role thread could restart from P2-era assumptions even though P3 tasks have already been completed.
   - Fix: `docs/team-roster.md` now points to P3-004 as the latest completed local scope. Re-check the task list before assigning new implementation work.

62. "Execution source of truth" can be misread as overriding the product blueprint.
   - Risk: a worker could follow task-list mechanics when the blueprint or current user direction has changed.
   - Fix: `tasks/dino-island-build-task-list.md` now clarifies that the blueprint is the product source of truth and the task list controls execution order, owners, dependencies, and completion notes.

63. Root-level generated screenshots and untracked artifacts can pollute the Git baseline.
   - Risk: the Git thread may accidentally baseline temporary validation evidence, bloating the repo and obscuring future diffs.
   - Proper fix before baseline: inventory root artifacts, decide what evidence belongs under `docs/` or an ignored scratch path, and commit only reviewed durable files.

64. Dry-run refresh response shape can be misread by operator scripts.
   - Risk: a smoke script that expects `POST /api/v1/refresh` to return `ok: true` can report a false failure even when the endpoint accepted the refresh and the status surface is healthy.
   - Fix: treat successful HTTP response plus `/api/v1/state` availability as the dry-run status proof. The current refresh response reports `queued`, `coalesced`, and `requested_at`, not an `ok` boolean.

65. Local dev-server PID artifacts can pollute the reviewed baseline.
   - Risk: `.dino-dev.pid` can appear as an untracked file after local app runs and accidentally enter the first baseline commit.
   - Fix: `.gitignore` now ignores `.dino-dev.pid`. Keep local process artifacts out of the Git baseline and final merge scope.

1. Dry-run could mutate Linear.
   - Risk: an active labeled issue could be moved to `In Progress` and then `Done` even though no Codex work ran.
   - Fix: dry-run now uses `trackerMutations: false`; start/completion transitions only happen in live-agent mode.

2. Dry-run could still mutate local workspaces through lifecycle code.
   - Risk: once hooks are added, dry-run could create workspaces, run hooks, or remove terminal workspaces while being treated as read-only.
   - Fix: dry-run now uses `workspaceLifecycle: false`; it renders prompts without creating/removing workspaces or running lifecycle hooks. The terminal-state reconciliation cleanup path is also guarded by workspace lifecycle.

3. Per-issue workspaces are empty by default.
   - Risk: a live agent would start in `.symphony/workspaces/<issue>` without the repo, so it could not perform real project work.
   - Fix: `--live-agent` now requires `hooks.after_create` or `hooks.before_run`.
   - Remaining decision: choose the actual workspace strategy before live runs: git worktree after a baseline commit, or a deliberate copy/sync hook.

4. Live workspace output has no merge path yet.
   - Risk: an agent could change an isolated workspace and still mark the Linear issue complete without integrating the change into the main repo.
   - Fix: `--live-agent` now requires `hooks.after_run`, and `after_run` failure is fatal.
   - Remaining decision: define the exact `after_run` policy: patch export, branch/PR flow, or main-repo integration.

5. Linear issue gating depends on operator discipline.
   - Risk: labeling multiple active issues would dispatch by priority/age until concurrency is full.
   - Fix: dispatch and retry dispatch now refuse to start when active approved issues exceed `agent.max_concurrent_agents`; current `WORKFLOW.md` keeps that at `1`.

6. Blocker relation handling was too narrow.
   - Risk: dependency gates may be wrong if Linear relation direction differs from the current normalization.
   - Fix: Linear normalization now reads both direct `blocked_by` relations and inverse `blocks` relations, and the orchestrator applies blocker gates to all active issue states.
   - Remaining check: no sampled DINO issues currently have active relations, so run a real blocked-pair smoke test before dependency-heavy execution.

7. Live workflow preflight could drift after startup.
   - Risk: a running orchestrator could hot-reload a weaker `WORKFLOW.md` and bypass the live-agent hook requirements checked at startup.
   - Fix: live run-mode validation now runs after reload before every dispatch cycle.

8. Linear completion was fire-and-forget.
   - Risk: a successful local run could be marked completed in memory while the Linear transition failed, leaving stale active Linear state and possible duplicate work on restart.
   - Fix: live start and completion transitions are awaited. Transition failure now routes through the failure/retry path.

9. Retry exhaustion is not yet durable in Linear.
   - Risk: after max attempts, the current process stops retrying and logs the failure, but a process restart can see the issue as active and approved again.
   - Proper fix before live: add a durable failure action, such as removing `Symphony Run`, adding a `Symphony Failed` label/comment, or transitioning to a non-active failure state.

10. The repo has no clean git baseline yet.
   - Risk: the current working directory is entirely untracked, so a git-worktree execution strategy cannot safely isolate and integrate per-issue changes yet.
   - Proper fix before live: have the git thread establish a reviewed baseline commit, then use git worktrees or a deliberate copy/sync hook.

11. Live completion still depends on the agent's own validation quality.
   - Risk: Symphony can enforce process gates, but it cannot prove the game is correct unless the issue prompt and review workflow require real validation evidence.
   - Fix: keep `AGENTS.md`, `WORKFLOW.md`, and issue descriptions explicit about tablet/mobile validation, and route risky changes through Code Review / QA issues before broad runs.

12. Multiple orchestrator processes could race each other.
   - Risk: two local Symphony processes pointed at the same Linear project could both see the same active approved issue and dispatch duplicate work before either transition/state refresh wins.
   - Proper fix before live: add a repo-local single-runner lock or an API-level claim transition policy that is proven with a two-process smoke test. Until then, run at most one Symphony process.

13. Linear issues can drift from repo-owned planning docs.
   - Risk: seeded Linear issue descriptions may become stale while `tasks/dino-island-build-task-list.md`, `docs/product-blueprint.md`, and validation notes evolve.
   - Proper fix before live: before approving a Linear issue, refresh or verify its description against the current repo task and include the task id, dependencies, done criteria, validation command, and expected handoff artifact.

14. Future workspace hooks are trusted code.
   - Risk: hook commands can mutate files, integrate incomplete work, leak output, or run from the wrong directory if written loosely.
   - Proper fix before live: code-review hooks as production orchestration code, keep them repo-relative, verify workspace containment, avoid printing env values, and smoke-test success and failure paths.

15. Secrets are available locally by design.
   - Risk: careless diagnostics could print `LINEAR_API_KEY` or future provider keys from `.env`.
   - Fix: use env values only as process inputs, never echo `.env`, never include secret-bearing command output in docs, and keep `.env` untracked.

16. Harness coverage is still mostly smoke-level.
   - Risk: validation commands prove current behavior, but edge cases such as blocked-pair relations, retry exhaustion, multiple processes, and hook failure paths need explicit tests before live autonomy.
   - Proper fix before broad live use: add focused harness tests or repeatable smoke scripts for those cases and record the evidence in this audit.

17. Live-run semantics do not yet match the upstream multi-turn worker model.
   - Risk: the current Codex runner starts one turn and treats that turn as the whole worker result. The upstream Symphony draft expects a successful worker to re-check issue state and continue on the same thread up to `agent.max_turns` when the issue remains active.
   - Proper fix before live: implement or explicitly document a different live worker policy. If following the spec, add same-thread continuation turns, respect `agent.max_turns`, and use a short continuation retry after clean worker exit.

18. Linear completion currently targets a terminal done state.
   - Risk: a live agent could finish one local turn and the orchestrator could mark the Linear issue `Done` before human review, integration, or acceptance evidence is complete. The upstream spec allows successful runs to end in a workflow-defined handoff state, not necessarily `Done`.
   - Proper fix before live: add configurable completion behavior, preferably a non-terminal handoff state such as `Human Review` or `Ready for Review`, or disable orchestrator completion transitions and require the agent/handoff hook to update Linear with evidence.

19. `after_run` is intentionally fatal here, which is safer than the draft spec but must stay documented.
   - Risk: future agents may compare against the draft spec, see that `after_run` failures are usually logged and ignored, and weaken the local policy without realizing it protects this repo from marking issues complete before handoff.
   - Fix: keep the local policy that `after_run` failure prevents Linear completion, and document it as a Dino Quest safety extension rather than accidental spec drift.

20. Linear API query shape can hit complexity limits.
   - Risk: broad GraphQL setup/status queries that ask for project, teams, states, labels, issues, and relations in one request can exceed Linear's complexity limit and fail even when auth is valid.
   - Fix: keep Linear operations API-first, but use narrow paged queries for each operation. Do not build one giant "everything" query for orchestration or setup checks.

21. Replit run/deploy commands could drift from the actual Charlotte-facing app.
   - Risk: Replit could open a placeholder, API server, or wrong package even if local direct Vite commands worked.
   - Fix: add repo-root wrapper scripts `dev:dino`, `preview:dino`, and `build:replit`; wire `.replit` run/deployment commands to those wrappers; validate `pnpm run build:replit` and `pnpm run dev:dino` locally.

22. Windows process spawning can make portable wrappers look correct while failing in local/Replit-adjacent use.
   - Risk: Node child-process calls with shell arguments caused a deprecation warning, while direct `pnpm.cmd` spawning failed with `spawn EINVAL` on this machine.
   - Fix: use an explicit Windows `cmd.exe /d /s /c` wrapper in `scripts/run-dino.mjs` and validate the wrapper commands from PowerShell.

23. Browser checks can be biased by persisted game state.
   - Risk: opening the app with existing `localStorage` can skip the real first-run Home Base path and hide onboarding or layout regressions.
   - Fix: include both persisted-state and fresh-state checks for release validation. The latest smoke cleared `localStorage`, reloaded the tablet viewport, and verified first-run Home Base with no console warnings or errors.

24. Local Replit compatibility is not the same as hosted Replit proof.
   - Risk: local wrapper/build success does not prove Replit's hosted Run button, deployment environment, port forwarding, and autoscale behavior.
   - Proper fix before declaring Replit-hosted readiness: after the reviewed baseline is in GitHub/Replit, run the Replit Run button and deployment flow in the hosted Replit UI and record the result.

25. Playwright browser proof is not the same as real iPad Safari proof.
   - Risk: desktop Chromium tablet emulation can miss touch feel, safe-area behavior, PWA install behavior, and audio unlock differences on the actual primary device.
   - Proper fix before declaring device readiness: run a short real iPad Safari pass against the local network or deployed URL and record touch/audio/PWA findings.

26. Linear issue coverage can lag behind the actual product blueprint.
   - Risk: the repo task list now includes P3 work beyond the original Linear seeding, while `docs/product-blueprint.md` still names real iPad Safari, parent-approved audio, family/avatar polish, and broader content variety as next evidence gates. If Linear remains seeded from an older task list, Symphony could make the visible tracker look complete while important product gates are not represented as issues.
   - Proper fix before approving more Symphony work: extend or refresh `tasks/dino-island-build-task-list.md` from the current blueprint and validation notes, then sync or create matching Linear issues by API before moving any issue out of `Backlog`.

27. The safe CLI options should not be the only mutation guard.
   - Risk: a future local call site could instantiate the orchestrator with tracker mutations enabled but workspace lifecycle disabled, allowing Linear transitions without workspace handoff even though the current CLI does not do this.
   - Fix: the orchestrator now fails startup if `trackerMutations` is true while `workspaceLifecycle` is false.

28. The harness still relies on smoke checks more than automated regression tests.
   - Risk: future edits to orchestration behavior could accidentally weaken dry-run, live preflight, hook failure, or Linear completion semantics without immediate detection.
   - Proper fix before broad live use: add focused tests for dry-run no-mutation behavior, live preflight failure, hook failure fatality, completion transition failure, retry exhaustion, and the new tracker-mutation/workspace-lifecycle invariant.

29. Stall handling does not currently stop the underlying live Codex process.
   - Risk: if a live turn stalls, the orchestrator can remove the run from its in-memory running set and schedule retry logic while the child process may still continue, run hooks, or attempt completion.
   - Proper fix before live: add an abort/kill path from orchestrator stall detection into the runner, then test that a stalled worker cannot keep mutating the workspace or Linear after being marked stalled.

30. `after_run` could run even when the agent result failed.
   - Risk: a failed live agent could still trigger an integration/handoff hook before retry handling, which could export or merge incomplete workspace changes.
   - Fix: `after_run` now runs only when `result.ok` is true. Failure hooks, if added later, must be separate and must never mark work complete.

31. Startup terminal cleanup could delete terminal issue workspaces.
   - Risk: if a Linear issue is manually moved to a terminal state before workspace output has been reviewed or archived, startup cleanup can remove that per-issue workspace.
   - Fix: startup terminal cleanup is skipped unless `hooks.before_remove` exists. Before live use, test the archive/evidence hook on a disposable workspace.

32. Several `codex` config fields are parsed but not yet enforced by the runner.
   - Risk: future operators may assume `codex.approval_policy`, `codex.thread_sandbox`, or `codex.turn_sandbox_policy` in `WORKFLOW.md` affects live runs, while the runner currently hard-codes `approvalPolicy: "never"` and does not wire sandbox policy fields.
   - Proper fix before live: either remove unsupported config keys from the workflow contract or wire and test them explicitly. Keep `approvalPolicy: "never"` unless the operator intentionally changes the unattended-run safety posture.

33. The issue prompt did not explicitly restate that `docs/product-blueprint.md` is canonical.
   - Risk: a Linear issue seeded from an older task can look valid even when it conflicts with the current blueprint.
   - Fix: `WORKFLOW.md` now tells workers to treat `docs/product-blueprint.md` as canonical and stop/report conflicts instead of implementing stale Linear/task-list scope.
   - Remaining check before approving more Symphony work: refresh each issue description against the current blueprint.

34. The sample rendered prompt showed an empty retry attempt value.
   - Risk: low severity, but it can make prompt smoke output look less polished and hide whether retry rendering is behaving as intended.
   - Fix: `WORKFLOW.md` now phrases retry guidance without printing a possibly empty attempt value.

35. Strategy docs themselves can drift after implementation progress.
   - Risk: an older audit statement can stay technically plausible while becoming stale, such as a task-list endpoint moving from P3-001 to P3-002. Future agents may over-trust the audit instead of checking the current repo.
   - Fix: every approval loop must re-read `WORKFLOW.md`, `docs/product-blueprint.md`, `tasks/dino-island-build-task-list.md`, `docs/team-roster.md`, and the latest validation note before moving a Linear issue into an active Symphony state.

36. "100% confidence" can become a permission shortcut.
   - Risk: a future operator could read a confidence statement as permission to skip the remaining live-readiness gates.
   - Fix: keep confidence statements scoped. Current confidence is only for API-first manual coordination, dry-run prompt/config checks, and the fail-closed live guard. Live autonomy remains prohibited until every listed pre-live gate has current evidence.

## Revised Strategy

Use Linear API as the default and authoritative path for all Linear reads and mutations. Browser viewing can support visual inspection, but no orchestration decision should rely on browser state unless it is confirmed through the API. Keep DINO issues in `Backlog` until explicitly approved. To run one task, add `Symphony Run` and move exactly one issue to `Todo` or `In Progress` through the API.

Use dry-run for prompt/config verification only. Dry-run must not mutate Linear or local workspaces.

Use the repo-root app wrappers for local/Replit entry points so all agents and platforms start the same Charlotte-facing surface:

- Local/Replit dev: `pnpm run dev:dino`
- Replit-compatible build: `pnpm run build:replit`
- Preview/deployment run: `pnpm run preview:dino`

Do not start `--live-agent` until workspace population, result integration, durable failure handling, single-runner protection, and live worker semantics are explicitly configured. The preferred path is:

1. Have the git thread establish a clean baseline commit.
2. Extend the repo task list from the current blueprint and validation notes, then sync Linear issues by API so the tracker covers all known gates.
3. Add a single-runner lock or equivalent claim protection and prove a second process cannot duplicate dispatch.
4. Add a workspace hook that creates a per-issue git worktree or branch.
5. Add configurable completion behavior that hands off to review rather than blindly transitioning to `Done`.
6. Add an `after_run` completion/handoff hook that does not allow completion until changes are integrated or explicitly reviewed.
7. Implement or deliberately document live multi-turn behavior around `agent.max_turns` and continuation retries.
8. Add a durable Linear failure policy for max-attempt failures.
9. Verify each approved Linear issue against the current repo task before it leaves `Backlog`.
10. Fix or explicitly design the stall-abort, failed-run hook, terminal-cleanup, and parsed-but-unenforced Codex config behaviors.
11. Refresh each issue description against the current blueprint before approval.
12. Re-read the current workflow, blueprint, task list, roster, and validation notes before every approval batch.
13. Add idempotent API scripts for issue sync, approval, evidence comments, failure marking, and review handoff.
14. Reorder or explicitly redesign live startup so workspace hooks prove readiness before Linear moves to `In Progress`.
15. Run blocked-pair, hook-failure, setup-failure-before-start, retry-exhaustion, two-process, multi-turn, stall-abort, failed-run, terminal-cleanup, config-policy, API idempotency, and no-mutation regression smoke tests.
16. Run one low-risk issue end to end before broad use.

Allowed now:

- Use the Linear API for Linear setup, status checks, issue edits, and approval gating.
- Use the Linear browser UI only for visual inspection/debugging, with API confirmation before acting.
- Use `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md`.
- Use `pnpm --filter @workspace/scripts run symphony render-prompt WORKFLOW.md`.
- Use dry-run serving for prompt/status visibility.

Prohibited until the gates above pass:

- Starting `--live-agent` for real implementation work.
- Moving more than one issue at a time into an active state with the `Symphony Run` label.
- Treating Linear `Done` as the automatic output of a local agent turn.
- Using copy/sync workspace hooks or git worktrees before the git baseline is reviewed.
- Treating browser-visible Linear state as authoritative without an API reconciliation query.

## Confidence Statement

I am factually confident in the revised pre-live strategy: Linear API-first coordination is verified, browser state is non-authoritative unless API-confirmed, dry-run is read-only, approval gating is hardened, and live execution is prohibited until the missing workspace, integration, single-runner, completion-handoff, multi-turn, drift-control, hook-review, idempotent API operation, and durable failure policies are installed and tested. I am not confident in broad unattended live implementation yet; the strategy is explicitly to not use that mode. If someone asks whether the live-agent strategy is 100% ready today, the correct answer is no.

I am also confident in the local/Replit wrapper strategy as far as it can be proven locally: the wrapper build passes, the wrapper dev command serves the Charlotte-facing app, `.replit` points at those wrappers, and browser smoke passes in fresh and persisted states. I am not claiming hosted Replit or real iPad readiness until those environments are actually exercised.

## 2026-05-25 API-First Recheck

The user clarified: assume the Linear API is used for all AI Linear operations until told otherwise. That clarification is now part of the strategy boundary.

Fresh checks:

- Upstream `openai/symphony` `SPEC.md` was re-read from GitHub. The spec supports the current caution: Symphony is a scheduler/runner and tracker reader, workflow-specific success can hand off to a review state instead of `Done`, implementations must document their safety posture, active runs should stop when issue state changes make them ineligible, and worker failures should retry with exponential backoff.
- `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md` passed.
- `pnpm --filter @workspace/scripts run typecheck` passed for `@workspace/scripts`.
- `pnpm --filter @workspace/scripts run symphony render-prompt WORKFLOW.md` rendered the expected API-authoritative prompt guidance.
- `pnpm --filter @workspace/scripts run symphony serve WORKFLOW.md --live-agent --port 0` failed closed because no workspace population/sync hook is configured.
- Dry-run status serving responded on `/api/v1/state` and `/api/v1/refresh` without tracker mutation mode or workspace lifecycle mode enabled.
- Linear API resolved organization `mem-dev`, project `DINO [f48a68feb930]`, and one `Symphony Run` label. Current active approved issue count is `0`.
- `.gitignore` ignores `/.env`, `/.env.*`, `.symphony/`, local dev logs, and `private-family-source/`.
- `git status --short` still shows the imported repo as broadly untracked, so worktree/merge automation remains blocked until the git baseline is handled.

Additional loopholes and fixes:

37. "API-only" could be misread as "never open the browser."
   - Risk: browser inspection is still useful for human visual confirmation, especially because Linear is open in Chrome, but it is not authoritative.
   - Fix: browser use is allowed only as visual/debug support. Any state used for orchestration, approval, or completion must be re-read through the Linear API before action.

38. Manual Linear UI edits can race the orchestrator.
   - Risk: someone can change state, labels, or descriptions in the browser after an API check.
   - Fix: run an immediate API reconciliation query before approving, dispatching, marking failure, or handing off review.

39. API writes can still create duplicate or stale issues.
   - Risk: an API-first sync script can duplicate tickets or preserve old task wording if it lacks stable IDs and idempotency.
   - Fix: add reviewed idempotent API scripts keyed by task ID or Linear identifier, and refresh descriptions from `docs/product-blueprint.md` plus the current task list before activation.

40. A personal Linear API key can make automated work look like a human manual edit.
   - Risk: audit history may not clearly show that an orchestration agent made the change.
   - Fix: add evidence comments such as "via Dino Quest orchestrator" for material state transitions, approvals, failures, and review handoffs.

41. Polling does not make the system safe for broad autonomous dispatch.
   - Risk: a 30s poll with max concurrency 1 is fine for supervised local use, but not a complete production control plane.
   - Fix: keep one approved issue at a time until single-runner locking, stale-claim cleanup, retry exhaustion, and review handoff are tested.

42. API success is not product acceptance.
   - Risk: moving an issue to `Done` through the API could falsely imply parent/child UX acceptance.
   - Fix: prefer a review/handoff state or evidence comment until browser, tablet/iPad, audio, and any parent approval gates pass.

43. Dry-run status can be mistaken for implementation progress.
   - Risk: dry-run serves status and can render prompts, but it does not integrate code or mutate Linear/workspaces.
   - Fix: label dry-run evidence as prompt/config/status validation only.

44. The current implementation still falls short of the upstream live-runner expectations.
   - Risk: stall abort, durable retry/failure handling, live multi-turn semantics, and codex config pass-through are not fully proven.
   - Fix: keep `--live-agent` prohibited until these are implemented or intentionally documented and smoke-tested against disposable issues/workspaces.

45. Live startup currently mutates Linear before workspace hooks prove readiness.
   - Risk: once hooks are added, `markIssueStarted` can move an issue to `In Progress` before workspace creation, population, and `before_run` have succeeded. A hook/setup failure could leave Linear showing active work that never actually started.
   - Fix: before live use, reorder the live dispatch path so workspace creation/population readiness is proven before the started transition, or use an explicit non-work claim/comment first and transition to `In Progress` only after hooks pass. Add a disposable issue smoke test proving setup failure does not leave stale active Linear state.

Updated confidence statement: I am 100% confident only in the bounded pre-live strategy: Linear API is authoritative for Linear operations; browser state is non-authoritative unless API-confirmed; dry-run/validate/render/status are safe coordination tools; and live-agent implementation is blocked by design. I am not 100% confident in autonomous live Symphony implementation yet, and the strategy explicitly forbids treating it as ready.

## 2026-05-25 Current Strategy Recheck

The strategy was rechecked after the user clarified that Linear API should be assumed for all AI Linear operations until stated otherwise.

Fresh evidence:

- `WORKFLOW.md` still renders the correct worker instruction: Linear API is authoritative, and browser-visible Linear state is only a visual aid unless API-reconciled.
- `pnpm --filter @workspace/scripts run symphony validate WORKFLOW.md` passed.
- `pnpm --filter @workspace/scripts run symphony render-prompt WORKFLOW.md` passed and included the API-authoritative Linear guidance.
- Linear GraphQL API resolved organization `mem-dev`, project `DINO [f48a68feb930]`, one `Symphony Run` label, and `0` active approved issues in `Todo` or `In Progress`.
- `pnpm --filter @workspace/scripts run typecheck` passed.
- `pnpm --filter @workspace/scripts run symphony serve WORKFLOW.md --live-agent --port 0` failed closed because no workspace population/sync hook is configured.
- `pnpm run build:replit` passed.

No new loophole changed the strategy. The durable answer remains scoped: I am 100% confident in the bounded pre-live coordination strategy, not in broad autonomous live Symphony execution. Live implementation remains intentionally prohibited until workspace readiness before Linear start, single-runner protection, idempotent API operations, durable failure/review handoff, stall-abort behavior, and disposable-issue smoke tests are implemented and verified.
