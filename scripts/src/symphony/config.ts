import os from "node:os";
import path from "node:path";
import { readFileSync } from "node:fs";
import { SymphonyError, type JsonMap, type SymphonyConfig, type WorkflowDefinition } from "./types";

const DEFAULT_ACTIVE = ["Todo", "In Progress"];
const DEFAULT_TERMINAL = ["Closed", "Cancelled", "Canceled", "Duplicate", "Done"];

export function resolveConfig(workflow: WorkflowDefinition, env: NodeJS.ProcessEnv = process.env): SymphonyConfig {
  const baseDir = path.dirname(workflow.path);
  const resolvedEnv = envWithDotenv(baseDir, env);
  const tracker = objectAt(workflow.config, "tracker");
  const polling = objectAt(workflow.config, "polling");
  const workspace = objectAt(workflow.config, "workspace");
  const hooks = objectAt(workflow.config, "hooks");
  const agent = objectAt(workflow.config, "agent");
  const codex = objectAt(workflow.config, "codex");

  const kind = stringAt(tracker, "kind", "") || "linear";
  if (kind !== "linear") throw new SymphonyError("unsupported_tracker_kind", `Unsupported tracker kind: ${kind}`);

  const apiKeyRaw = stringAt(tracker, "api_key", "$LINEAR_API_KEY");
  const apiKey = resolveDollar(apiKeyRaw, resolvedEnv);
  const projectSlug = stringAt(tracker, "project_slug", "");
  const rootRaw = stringAt(workspace, "root", path.join(os.tmpdir(), "symphony_workspaces"));

  return {
    workflow_path: workflow.path,
    tracker: {
      kind,
      endpoint: stringAt(tracker, "endpoint", "https://api.linear.app/graphql"),
      api_key: apiKey,
      project_slug: projectSlug,
      required_label: nullableStringAt(tracker, "required_label"),
      active_states: stringListAt(tracker, "active_states", DEFAULT_ACTIVE),
      terminal_states: stringListAt(tracker, "terminal_states", DEFAULT_TERMINAL),
    },
    polling: {
      interval_ms: positiveIntegerAt(polling, "interval_ms", 30000),
    },
    workspace: {
      root: resolvePath(rootRaw, baseDir, resolvedEnv),
    },
    hooks: {
      after_create: nullableStringAt(hooks, "after_create"),
      before_run: nullableStringAt(hooks, "before_run"),
      after_run: nullableStringAt(hooks, "after_run"),
      before_remove: nullableStringAt(hooks, "before_remove"),
      timeout_ms: positiveIntegerAt(hooks, "timeout_ms", 60000),
    },
    agent: {
      max_concurrent_agents: positiveIntegerAt(agent, "max_concurrent_agents", 10),
      max_turns: positiveIntegerAt(agent, "max_turns", 20),
      max_attempts: positiveIntegerAt(agent, "max_attempts", 3),
      max_retry_backoff_ms: positiveIntegerAt(agent, "max_retry_backoff_ms", 300000),
      max_concurrent_agents_by_state: stateLimitMap(objectAt(agent, "max_concurrent_agents_by_state")),
    },
    codex: {
      command: stringAt(codex, "command", "codex app-server"),
      approval_policy: codex.approval_policy,
      thread_sandbox: codex.thread_sandbox,
      turn_sandbox_policy: codex.turn_sandbox_policy,
      turn_timeout_ms: positiveIntegerAt(codex, "turn_timeout_ms", 3600000),
      read_timeout_ms: positiveIntegerAt(codex, "read_timeout_ms", 5000),
      stall_timeout_ms: integerAt(codex, "stall_timeout_ms", 300000),
    },
  };
}

export function validateDispatchConfig(config: SymphonyConfig): void {
  if (config.tracker.kind !== "linear") throw new SymphonyError("unsupported_tracker_kind", config.tracker.kind);
  if (!config.tracker.api_key) throw new SymphonyError("missing_tracker_api_key", "tracker.api_key is missing after environment resolution.");
  if (!config.tracker.project_slug) throw new SymphonyError("missing_tracker_project_slug", "tracker.project_slug is required for Linear.");
  if (!config.codex.command.trim()) throw new SymphonyError("missing_codex_command", "codex.command must be non-empty.");
}

function objectAt(object: JsonMap, key: string): JsonMap {
  const value = object[key];
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as JsonMap) : {};
}

function stringAt(object: JsonMap, key: string, fallback: string): string {
  const value = object[key];
  return typeof value === "string" ? value : fallback;
}

function nullableStringAt(object: JsonMap, key: string): string | null {
  const value = object[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function integerAt(object: JsonMap, key: string, fallback: number): number {
  const value = object[key];
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value);
  return fallback;
}

function positiveIntegerAt(object: JsonMap, key: string, fallback: number): number {
  const value = integerAt(object, key, fallback);
  if (value <= 0) throw new SymphonyError("invalid_config", `${key} must be a positive integer.`);
  return value;
}

function stringListAt(object: JsonMap, key: string, fallback: string[]): string[] {
  const value = object[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : fallback;
}

function stateLimitMap(object: JsonMap): Map<string, number> {
  const result = new Map<string, number>();
  for (const [key, value] of Object.entries(object)) {
    const limit = typeof value === "number" ? value : typeof value === "string" && /^\d+$/.test(value) ? Number(value) : 0;
    if (limit > 0) result.set(key.toLowerCase(), limit);
  }
  return result;
}

function envWithDotenv(baseDir: string, env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const dotenvPath = path.join(baseDir, ".env");
  let fileEnv: Record<string, string> = {};
  try {
    fileEnv = parseDotenv(readFileSync(dotenvPath, "utf8"));
  } catch {
    fileEnv = {};
  }
  return { ...fileEnv, ...env };
}

function parseDotenv(text: string): Record<string, string> {
  const values: Record<string, string> = {};
  for (const line of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(trimmed);
    if (!match) continue;
    values[match[1]!] = unquoteEnvValue(match[2] ?? "");
  }
  return values;
}

function unquoteEnvValue(value: string): string {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  const commentIndex = trimmed.search(/\s#/);
  return commentIndex === -1 ? trimmed : trimmed.slice(0, commentIndex).trimEnd();
}

function resolveDollar(value: string, env: NodeJS.ProcessEnv): string {
  if (/^\$[A-Za-z_][A-Za-z0-9_]*$/.test(value)) return env[value.slice(1)] ?? "";
  return value;
}

function resolvePath(raw: string, baseDir: string, env: NodeJS.ProcessEnv): string {
  let value = resolveDollar(raw, env);
  if (value === "~") value = os.homedir();
  else if (value.startsWith("~/") || value.startsWith("~\\")) value = path.join(os.homedir(), value.slice(2));
  return path.resolve(path.isAbsolute(value) ? value : path.join(baseDir, value));
}
