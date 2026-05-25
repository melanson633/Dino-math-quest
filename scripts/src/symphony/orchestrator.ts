import { resolveConfig, validateDispatchConfig } from "./config";
import { loadWorkflow } from "./workflow";
import { renderPrompt } from "./prompt";
import { WorkspaceManager } from "./workspace";
import { LinearClient } from "./linear";
import type { AgentEvent, AgentRunner, Issue, Logger, SymphonyConfig, TrackerClient, WorkflowDefinition } from "./types";

interface RunningEntry {
  issue: Issue;
  attempt: number;
  session_id: string | null;
  last_codex_event: string | null;
  last_codex_timestamp: number | null;
  last_codex_message: string | null;
  started_at: number;
  turn_count: number;
  tokens: { input_tokens: number; output_tokens: number; total_tokens: number };
}

interface RetryEntry {
  issue_id: string;
  identifier: string;
  attempt: number;
  due_at_ms: number;
  timer_handle: NodeJS.Timeout;
  error: string | null;
}

export class SymphonyOrchestrator {
  private workflow: WorkflowDefinition | null = null;
  private config: SymphonyConfig | null = null;
  private tracker: TrackerClient | null = null;
  private readonly running = new Map<string, RunningEntry>();
  private readonly claimed = new Set<string>();
  private readonly retryAttempts = new Map<string, RetryEntry>();
  private readonly completed = new Set<string>();
  private readonly codexTotals = { input_tokens: 0, output_tokens: 0, total_tokens: 0, seconds_running: 0 };
  private codexRateLimits: unknown = null;
  private pollTimer: NodeJS.Timeout | null = null;
  private watching: NodeJS.Timeout | null = null;
  private ticking = false;

  constructor(
    private readonly workflowPath: string | undefined,
    private readonly runner: AgentRunner,
    private readonly logger: Logger,
    private readonly options: { trackerMutations: boolean; workspaceLifecycle: boolean } = { trackerMutations: true, workspaceLifecycle: true },
  ) {}

  async start(): Promise<void> {
    if (this.options.trackerMutations && !this.options.workspaceLifecycle) {
      throw new Error("tracker mutations require workspace lifecycle hooks so Linear cannot advance without workspace handoff.");
    }
    await this.reload(true);
    validateDispatchConfig(this.requireConfig());
    this.validateRunModeConfig();
    this.tracker = new LinearClient(this.requireConfig());
    if (this.options.workspaceLifecycle) await this.startupTerminalWorkspaceCleanup();
    this.watchWorkflow();
    this.scheduleTick(0);
  }

  stop(): void {
    if (this.pollTimer) clearTimeout(this.pollTimer);
    if (this.watching) clearInterval(this.watching);
    for (const retry of this.retryAttempts.values()) clearTimeout(retry.timer_handle);
  }

  async tick(): Promise<void> {
    if (this.ticking) return;
    this.ticking = true;
    try {
      await this.reload(false);
      await this.reconcileRunningIssues();
      try {
        validateDispatchConfig(this.requireConfig());
        this.validateRunModeConfig();
      } catch (error) {
        this.logger.error("dispatch validation failed", { error: error instanceof Error ? error.message : String(error) });
        return;
      }
      const issues = await this.requireTracker().fetchCandidateIssues();
      if (this.hasTooManyApprovedIssues(issues)) return;
      for (const issue of sortForDispatch(issues)) {
        if (!this.hasGlobalSlot()) break;
        if (this.shouldDispatch(issue)) this.dispatch(issue, null);
      }
    } catch (error) {
      this.logger.error("tick failed", { error: error instanceof Error ? error.message : String(error) });
    } finally {
      this.ticking = false;
      this.scheduleTick(this.requireConfig().polling.interval_ms);
    }
  }

  snapshot(): unknown {
    const now = Date.now();
    return {
      generated_at: new Date().toISOString(),
      counts: { running: this.running.size, retrying: this.retryAttempts.size },
      running: [...this.running.entries()].map(([issue_id, entry]) => ({
        issue_id,
        issue_identifier: entry.issue.identifier,
        state: entry.issue.state,
        session_id: entry.session_id,
        turn_count: entry.turn_count,
        last_event: entry.last_codex_event,
        last_message: entry.last_codex_message,
        started_at: new Date(entry.started_at).toISOString(),
        last_event_at: entry.last_codex_timestamp ? new Date(entry.last_codex_timestamp).toISOString() : null,
        tokens: entry.tokens,
      })),
      retrying: [...this.retryAttempts.values()].map((entry) => ({
        issue_id: entry.issue_id,
        issue_identifier: entry.identifier,
        attempt: entry.attempt,
        due_at: new Date(entry.due_at_ms).toISOString(),
        error: entry.error,
      })),
      codex_totals: {
        ...this.codexTotals,
        seconds_running: this.codexTotals.seconds_running + [...this.running.values()].reduce((sum, entry) => sum + (now - entry.started_at) / 1000, 0),
      },
      rate_limits: this.codexRateLimits,
    };
  }

  private async reload(startup: boolean): Promise<void> {
    try {
      const nextWorkflow = await loadWorkflow(this.workflowPath);
      if (!startup && this.workflow && nextWorkflow.mtime_ms === this.workflow.mtime_ms) return;
      const nextConfig = resolveConfig(nextWorkflow);
      this.workflow = nextWorkflow;
      this.config = nextConfig;
      this.tracker = new LinearClient(nextConfig);
      this.logger.info("workflow loaded", { path: nextWorkflow.path, startup });
    } catch (error) {
      if (startup || !this.workflow) throw error;
      this.logger.error("workflow reload failed; keeping last good config", { error: error instanceof Error ? error.message : String(error) });
    }
  }

  private watchWorkflow(): void {
    this.watching = setInterval(() => void this.reload(false), 1000);
  }

  private async startupTerminalWorkspaceCleanup(): Promise<void> {
    try {
      const config = this.requireConfig();
      if (!config.hooks.before_remove) {
        this.logger.warn("startup terminal workspace cleanup skipped; hooks.before_remove is required before removing terminal issue workspaces");
        return;
      }
      const terminal = await this.requireTracker().fetchIssuesByStates(config.tracker.terminal_states);
      const manager = new WorkspaceManager(config, this.logger);
      for (const issue of terminal) await manager.removeForIdentifier(issue.identifier);
    } catch (error) {
      this.logger.warn("startup terminal workspace cleanup failed", { error: error instanceof Error ? error.message : String(error) });
    }
  }

  private async reconcileRunningIssues(): Promise<void> {
    const config = this.requireConfig();
    if (config.codex.stall_timeout_ms > 0) {
      for (const [issueId, entry] of this.running.entries()) {
        const last = entry.last_codex_timestamp ?? entry.started_at;
        if (Date.now() - last > config.codex.stall_timeout_ms) this.finishRun(issueId, "stalled");
      }
    }
    if (this.running.size === 0) return;
    let refreshed: Issue[];
    try {
      refreshed = await this.requireTracker().fetchIssueStatesByIds([...this.running.keys()]);
    } catch (error) {
      this.logger.warn("state refresh failed; keeping workers running", { error: error instanceof Error ? error.message : String(error) });
      return;
    }
    const byId = new Map(refreshed.map((issue) => [issue.id, issue]));
    for (const [issueId, entry] of this.running.entries()) {
      const issue = byId.get(issueId);
      if (!issue) continue;
      if (isState(issue.state, config.tracker.terminal_states)) {
        this.finishRun(issueId, "canceled");
        if (this.options.workspaceLifecycle) await new WorkspaceManager(config, this.logger).removeForIdentifier(issue.identifier);
      } else if (isState(issue.state, config.tracker.active_states)) {
        entry.issue = issue;
      } else {
        this.finishRun(issueId, "canceled");
      }
    }
  }

  private dispatch(issue: Issue, attempt: number | null): void {
    this.claimed.add(issue.id);
    const retry = this.retryAttempts.get(issue.id);
    if (retry) clearTimeout(retry.timer_handle);
    this.retryAttempts.delete(issue.id);
    this.running.set(issue.id, {
      issue,
      attempt: attempt ?? 0,
      session_id: null,
      last_codex_event: null,
      last_codex_timestamp: null,
      last_codex_message: null,
      started_at: Date.now(),
      turn_count: 0,
      tokens: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
    });
    void this.runIssue(issue, attempt);
  }

  private async runIssue(issue: Issue, attempt: number | null): Promise<void> {
    const config = this.requireConfig();
    const manager = new WorkspaceManager(config, this.logger);
    try {
      if (this.options.trackerMutations) {
        await this.requireTracker().markIssueStarted?.(issue);
      } else {
        this.logger.info("tracker mutation skipped", { issue_id: issue.id, issue_identifier: issue.identifier, mutation: "mark_started" });
      }
      const workspace = this.options.workspaceLifecycle ? await manager.createForIssue(issue.identifier) : manager.referenceForIssue(issue.identifier);
      if (this.options.workspaceLifecycle) await manager.beforeRun(workspace);
      const prompt = renderPrompt(this.requireWorkflow().prompt_template, issue, attempt);
      const result = await this.runner.run({
        issue,
        attempt,
        workspace,
        prompt,
        config,
          onEvent: (event) => this.applyAgentEvent(issue.id, event),
      });
      if (result.ok && this.options.workspaceLifecycle) await manager.afterRun(workspace);
      if (result.ok && this.options.trackerMutations) {
        await this.requireTracker().markIssueCompleted?.(issue);
      } else if (result.ok) {
        this.logger.info("tracker mutation skipped", { issue_id: issue.id, issue_identifier: issue.identifier, mutation: "mark_completed" });
      }
      this.finishRun(issue.id, result.ok ? "normal" : "failed", result.error);
    } catch (error) {
      this.finishRun(issue.id, "failed", error instanceof Error ? error.message : String(error));
    }
  }

  private applyAgentEvent(issueId: string, event: AgentEvent): void {
    const entry = this.running.get(issueId);
    if (!entry) return;
    entry.last_codex_event = event.event;
    entry.last_codex_timestamp = Date.parse(event.timestamp) || Date.now();
    entry.last_codex_message = event.message ?? null;
    if (event.session_id) entry.session_id = event.session_id;
    if (event.event === "turn_completed") entry.turn_count += 1;
    if (event.rate_limits) this.codexRateLimits = event.rate_limits;
    if (event.usage) {
      entry.tokens.input_tokens = event.usage.input_tokens ?? entry.tokens.input_tokens;
      entry.tokens.output_tokens = event.usage.output_tokens ?? entry.tokens.output_tokens;
      entry.tokens.total_tokens = event.usage.total_tokens ?? entry.tokens.total_tokens;
    }
  }

  private finishRun(issueId: string, reason: "normal" | "failed" | "stalled" | "canceled", error: string | null = null): void {
    const entry = this.running.get(issueId);
    if (!entry) return;
    this.running.delete(issueId);
    this.codexTotals.seconds_running += (Date.now() - entry.started_at) / 1000;
    this.codexTotals.input_tokens += entry.tokens.input_tokens;
    this.codexTotals.output_tokens += entry.tokens.output_tokens;
    this.codexTotals.total_tokens += entry.tokens.total_tokens;
    if (reason === "normal") {
      this.completed.add(issueId);
    } else {
      const nextAttempt = entry.attempt + 1;
      if (nextAttempt >= this.requireConfig().agent.max_attempts) {
        this.logger.error("max attempts reached; not retrying issue", {
          issue_id: issueId,
          issue_identifier: entry.issue.identifier,
          attempts: nextAttempt,
          error: error ?? reason,
        });
        return;
      }
      const delay = this.retryDelay(nextAttempt);
      this.scheduleRetry(issueId, entry.issue.identifier, nextAttempt, error ?? reason, delay);
    }
  }

  private scheduleRetry(issueId: string, identifier: string, attempt: number, error: string | null, delayMs: number): void {
    const existing = this.retryAttempts.get(issueId);
    if (existing) clearTimeout(existing.timer_handle);
    const timer = setTimeout(() => void this.onRetry(issueId), delayMs);
    this.retryAttempts.set(issueId, { issue_id: issueId, identifier, attempt, due_at_ms: Date.now() + delayMs, timer_handle: timer, error });
    this.logger.info("retry scheduled", { issue_id: issueId, issue_identifier: identifier, attempt, delay_ms: delayMs, error });
  }

  private async onRetry(issueId: string): Promise<void> {
    const retry = this.retryAttempts.get(issueId);
    if (!retry) return;
    this.retryAttempts.delete(issueId);
    let candidates: Issue[];
    try {
      candidates = await this.requireTracker().fetchCandidateIssues();
    } catch {
      this.scheduleRetry(issueId, retry.identifier, retry.attempt + 1, "retry poll failed", this.retryDelay(retry.attempt + 1));
      return;
    }
    if (this.hasTooManyApprovedIssues(candidates)) {
      this.scheduleRetry(issueId, retry.identifier, retry.attempt, "too many active approved issues", this.retryDelay(retry.attempt));
      return;
    }
    const issue = candidates.find((candidate) => candidate.id === issueId);
    if (!issue) {
      this.claimed.delete(issueId);
      return;
    }
    if (!this.hasGlobalSlot()) {
      this.scheduleRetry(issueId, issue.identifier, retry.attempt + 1, "no available orchestrator slots", this.retryDelay(retry.attempt + 1));
      return;
    }
    this.claimed.delete(issueId);
    if (this.shouldDispatch(issue)) this.dispatch(issue, retry.attempt);
  }

  private retryDelay(attempt: number): number {
    return Math.min(10000 * 2 ** (attempt - 1), this.requireConfig().agent.max_retry_backoff_ms);
  }

  private shouldDispatch(issue: Issue): boolean {
    const config = this.requireConfig();
    if (!this.isApprovedActiveIssue(issue)) return false;
    if (isState(issue.state, config.tracker.terminal_states)) return false;
    if (this.running.has(issue.id) || this.claimed.has(issue.id) || this.completed.has(issue.id)) return false;
    if (!this.hasGlobalSlot()) return false;
    if (!this.hasStateSlot(issue.state)) return false;
    return !issue.blocked_by.some((blocker) => blocker.state && !isState(blocker.state, config.tracker.terminal_states));
  }

  private isApprovedActiveIssue(issue: Issue): boolean {
    const config = this.requireConfig();
    if (!issue.id || !issue.identifier || !issue.title || !issue.state) return false;
    if (!isState(issue.state, config.tracker.active_states)) return false;
    if (config.tracker.required_label && !issue.labels.includes(config.tracker.required_label.toLowerCase())) return false;
    return true;
  }

  private hasGlobalSlot(): boolean {
    return this.running.size < this.requireConfig().agent.max_concurrent_agents;
  }

  private hasStateSlot(state: string): boolean {
    const key = state.toLowerCase();
    const limit = this.requireConfig().agent.max_concurrent_agents_by_state.get(key) ?? this.requireConfig().agent.max_concurrent_agents;
    const runningInState = [...this.running.values()].filter((entry) => entry.issue.state.toLowerCase() === key).length;
    return runningInState < limit;
  }

  private hasTooManyApprovedIssues(issues: Issue[]): boolean {
    const config = this.requireConfig();
    if (!config.tracker.required_label) return false;
    const approved = issues.filter((issue) => this.isApprovedActiveIssue(issue));
    if (approved.length <= config.agent.max_concurrent_agents) return false;
    this.logger.error("too many active approved issues; refusing dispatch", {
      approved_count: approved.length,
      max_concurrent_agents: config.agent.max_concurrent_agents,
      issue_identifiers: approved.map((issue) => issue.identifier).join(","),
    });
    return true;
  }

  private validateRunModeConfig(): void {
    const config = this.requireConfig();
    if (!this.options.workspaceLifecycle) return;
    if (!config.hooks.after_create && !config.hooks.before_run) {
      throw new Error("--live-agent requires hooks.after_create or hooks.before_run to populate/sync per-issue workspaces; otherwise workers start in empty directories.");
    }
    if (!config.hooks.after_run) {
      throw new Error("--live-agent requires hooks.after_run so completed workspace changes are integrated or handed off before Linear completion.");
    }
  }

  private scheduleTick(delayMs: number): void {
    if (this.pollTimer) clearTimeout(this.pollTimer);
    this.pollTimer = setTimeout(() => void this.tick(), delayMs);
  }

  private requireWorkflow(): WorkflowDefinition {
    if (!this.workflow) throw new Error("workflow not loaded");
    return this.workflow;
  }

  private requireConfig(): SymphonyConfig {
    if (!this.config) throw new Error("config not loaded");
    return this.config;
  }

  private requireTracker(): TrackerClient {
    if (!this.tracker) throw new Error("tracker not loaded");
    return this.tracker;
  }
}

export function sortForDispatch(issues: Issue[]): Issue[] {
  return [...issues].sort((a, b) => {
    const priorityA = a.priority ?? Number.POSITIVE_INFINITY;
    const priorityB = b.priority ?? Number.POSITIVE_INFINITY;
    if (priorityA !== priorityB) return priorityA - priorityB;
    const createdA = a.created_at ? Date.parse(a.created_at) : Number.POSITIVE_INFINITY;
    const createdB = b.created_at ? Date.parse(b.created_at) : Number.POSITIVE_INFINITY;
    if (createdA !== createdB) return createdA - createdB;
    return a.identifier.localeCompare(b.identifier);
  });
}

function isState(state: string, list: string[]): boolean {
  return list.some((candidate) => candidate.toLowerCase() === state.toLowerCase());
}
