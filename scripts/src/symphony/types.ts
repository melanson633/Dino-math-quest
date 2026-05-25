export type JsonMap = Record<string, unknown>;

export interface IssueBlockerRef {
  id: string | null;
  identifier: string | null;
  state: string | null;
}

export interface Issue {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  priority: number | null;
  state: string;
  branch_name: string | null;
  url: string | null;
  labels: string[];
  blocked_by: IssueBlockerRef[];
  created_at: string | null;
  updated_at: string | null;
}

export interface WorkflowDefinition {
  path: string;
  config: JsonMap;
  prompt_template: string;
  mtime_ms: number;
}

export interface SymphonyConfig {
  workflow_path: string;
  tracker: {
    kind: "linear";
    endpoint: string;
    api_key: string;
    project_slug: string;
    required_label: string | null;
    active_states: string[];
    terminal_states: string[];
  };
  polling: {
    interval_ms: number;
  };
  workspace: {
    root: string;
  };
  hooks: {
    after_create: string | null;
    before_run: string | null;
    after_run: string | null;
    before_remove: string | null;
    timeout_ms: number;
  };
  agent: {
    max_concurrent_agents: number;
    max_turns: number;
    max_attempts: number;
    max_retry_backoff_ms: number;
    max_concurrent_agents_by_state: Map<string, number>;
  };
  codex: {
    command: string;
    approval_policy: unknown;
    thread_sandbox: unknown;
    turn_sandbox_policy: unknown;
    turn_timeout_ms: number;
    read_timeout_ms: number;
    stall_timeout_ms: number;
  };
}

export interface WorkspaceRef {
  path: string;
  workspace_key: string;
  created_now: boolean;
}

export interface AgentEvent {
  event: string;
  timestamp: string;
  codex_app_server_pid?: string | null;
  session_id?: string | null;
  message?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  rate_limits?: unknown;
}

export interface AgentRunInput {
  issue: Issue;
  attempt: number | null;
  workspace: WorkspaceRef;
  prompt: string;
  config: SymphonyConfig;
  onEvent: (event: AgentEvent) => void;
}

export interface AgentRunResult {
  ok: boolean;
  status: "succeeded" | "failed" | "timed_out" | "stalled" | "canceled";
  error?: string;
}

export interface AgentRunner {
  run(input: AgentRunInput): Promise<AgentRunResult>;
}

export interface TrackerClient {
  fetchCandidateIssues(): Promise<Issue[]>;
  fetchIssuesByStates(stateNames: string[]): Promise<Issue[]>;
  fetchIssueStatesByIds(issueIds: string[]): Promise<Issue[]>;
  markIssueStarted?(issue: Issue): Promise<void>;
  markIssueCompleted?(issue: Issue): Promise<void>;
}

export interface Logger {
  info(message: string, context?: JsonMap): void;
  warn(message: string, context?: JsonMap): void;
  error(message: string, context?: JsonMap): void;
  debug(message: string, context?: JsonMap): void;
}

export class SymphonyError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "SymphonyError";
  }
}
