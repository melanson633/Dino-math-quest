import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { assertInsideRoot } from "./workspace";
import type { AgentEvent, AgentRunner, AgentRunInput, AgentRunResult, JsonMap } from "./types";

export class DryRunAgentRunner implements AgentRunner {
  async run(input: AgentRunInput): Promise<AgentRunResult> {
    input.onEvent({
      event: "session_started",
      timestamp: new Date().toISOString(),
      session_id: `dry-run-${input.issue.identifier}`,
      message: "Dry-run runner rendered the prompt and skipped Codex launch.",
    });
    input.onEvent({
      event: "turn_completed",
      timestamp: new Date().toISOString(),
      session_id: `dry-run-${input.issue.identifier}`,
      message: input.prompt.slice(0, 240),
    });
    return { ok: true, status: "succeeded" };
  }
}

export class CodexAppServerRunner implements AgentRunner {
  async run(input: AgentRunInput): Promise<AgentRunResult> {
    assertInsideRoot(input.config.workspace.root, input.workspace.path);
    const command = input.config.codex.command;
    const child = spawnShell(command, input.workspace.path);
    input.onEvent({
      event: "session_started",
      timestamp: new Date().toISOString(),
      codex_app_server_pid: child.pid ? String(child.pid) : null,
      session_id: null,
    });

    try {
      const client = new AppServerJsonLinesClient(child, input.config.codex.read_timeout_ms, input.onEvent);
      await client.request("initialize", {
        clientInfo: { name: "dino-quest-symphony", title: "Dino Quest Symphony", version: "0.0.0" },
        capabilities: { experimentalApi: true, requestAttestation: false },
      });
      const threadResponse = await client.request("thread/start", {
        cwd: input.workspace.path,
        approvalPolicy: "never",
        ephemeral: false,
        threadSource: "subagent",
      });
      const thread = asMap(threadResponse).thread;
      const threadId = asMap(thread).id;
      if (typeof threadId !== "string") throw new Error("thread/start response did not include thread.id");
      input.onEvent({
        event: "session_started",
        timestamp: new Date().toISOString(),
        session_id: threadId,
      });

      await client.request("turn/start", {
        threadId,
        cwd: input.workspace.path,
        approvalPolicy: "never",
        input: [{ type: "text", text: input.prompt, text_elements: [] }],
      });

      const completion = await client.waitForTurnCompletion(threadId, input.config.codex.turn_timeout_ms);
      return completion.ok ? { ok: true, status: "succeeded" } : { ok: false, status: "failed", error: completion.error };
    } catch (error) {
      return { ok: false, status: "failed", error: error instanceof Error ? error.message : String(error) };
    } finally {
      child.kill();
    }
  }
}

function spawnShell(command: string, cwd: string) {
  if (process.platform === "win32") {
    return spawn("powershell.exe", ["-NoLogo", "-NoProfile", "-Command", command], { cwd, stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
  }
  return spawn("bash", ["-lc", command], { cwd, stdio: ["pipe", "pipe", "pipe"] });
}

class AppServerJsonLinesClient {
  private requestId = 0;
  private readonly pending = new Map<
    number,
    { resolve: (value: unknown) => void; reject: (error: Error) => void; timer: NodeJS.Timeout }
  >();
  private readonly completionWaiters = new Map<
    string,
    { resolve: (value: { ok: boolean; error?: string }) => void; timer: NodeJS.Timeout }
  >();
  private stderr = "";

  constructor(
    private readonly child: ReturnType<typeof spawn>,
    private readonly requestTimeoutMs: number,
    private readonly onEvent: (event: AgentEvent) => void,
  ) {
    if (!child.stdout || !child.stdin) throw new Error("codex app-server stdio unavailable");
    const lines = createInterface({ input: child.stdout });
    lines.on("line", (line) => this.handleLine(line));
    child.stderr?.on("data", (chunk: Buffer) => {
      this.stderr = `${this.stderr}${chunk.toString("utf8")}`.slice(-4000);
    });
    child.once("error", (error) => this.rejectAll(error));
    child.once("exit", (code) => this.rejectAll(new Error(`codex app-server exited with code ${code}${this.stderr ? `: ${this.stderr.trim()}` : ""}`)));
  }

  async request(method: string, params: unknown): Promise<unknown> {
    if (!this.child.stdin) throw new Error("codex app-server stdin unavailable");
    const id = ++this.requestId;
    const payload = params === undefined ? { id, method } : { id, method, params };
    const result = await new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, this.requestTimeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.child.stdin!.write(`${JSON.stringify(payload)}\n`);
    });
    return result;
  }

  async waitForTurnCompletion(threadId: string, timeoutMs: number): Promise<{ ok: boolean; error?: string }> {
    return await new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.completionWaiters.delete(threadId);
        resolve({ ok: false, error: "turn_completion_timeout" });
      }, timeoutMs);
      this.completionWaiters.set(threadId, { resolve, timer });
    });
  }

  private handleLine(line: string): void {
    let message: JsonMap;
    try {
      message = JSON.parse(line) as JsonMap;
    } catch {
      return;
    }
    if (typeof message.id === "number" && this.pending.has(message.id)) {
      const pending = this.pending.get(message.id)!;
      this.pending.delete(message.id);
      clearTimeout(pending.timer);
      if ("error" in message) pending.reject(new Error(JSON.stringify(message.error)));
      else pending.resolve(message.result);
      return;
    }
    this.handleNotification(message);
  }

  private handleNotification(message: JsonMap): void {
    const method = typeof message.method === "string" ? message.method : "notification";
    const params = asMap(message.params);
    const timestamp = new Date().toISOString();
    if (method === "thread/tokenUsage/updated") {
      const usage = asMap(asMap(params.tokenUsage).total);
      this.onEvent({
        event: "token_usage",
        timestamp,
        usage: {
          input_tokens: asNumber(usage.inputTokens),
          output_tokens: asNumber(usage.outputTokens),
          total_tokens: asNumber(usage.totalTokens),
        },
      });
      return;
    }
    if (method === "turn/started") {
      this.onEvent({ event: "turn_started", timestamp, session_id: typeof params.threadId === "string" ? params.threadId : null });
      return;
    }
    if (method === "turn/completed") {
      const threadId = typeof params.threadId === "string" ? params.threadId : null;
      const turn = asMap(params.turn);
      const status = typeof turn.status === "string" ? turn.status : "unknown";
      this.onEvent({ event: "turn_completed", timestamp, session_id: threadId, message: status });
      if (threadId) {
        const waiter = this.completionWaiters.get(threadId);
        if (waiter) {
          this.completionWaiters.delete(threadId);
          clearTimeout(waiter.timer);
          waiter.resolve(status === "completed" ? { ok: true } : { ok: false, error: `turn_${status}` });
        }
      }
      return;
    }
    if (method === "error" || method === "warning" || method === "guardianWarning" || method === "configWarning") {
      this.onEvent({ event: method, timestamp, message: JSON.stringify(params).slice(0, 1000) });
    }
  }

  private rejectAll(error: Error): void {
    for (const [id, pending] of this.pending.entries()) {
      this.pending.delete(id);
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    for (const [threadId, waiter] of this.completionWaiters.entries()) {
      this.completionWaiters.delete(threadId);
      clearTimeout(waiter.timer);
      waiter.resolve({ ok: false, error: error.message });
    }
  }
}

function asMap(value: unknown): JsonMap {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as JsonMap) : {};
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
