import { mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { SymphonyError, type Logger, type SymphonyConfig, type WorkspaceRef } from "./types";

export function workspaceKey(identifier: string): string {
  return identifier.replace(/[^A-Za-z0-9._-]/g, "_");
}

export function assertInsideRoot(root: string, workspacePath: string): void {
  const relative = path.relative(path.resolve(root), path.resolve(workspacePath));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new SymphonyError("invalid_workspace_path", `Workspace path escapes root: ${workspacePath}`);
  }
}

export class WorkspaceManager {
  constructor(
    private readonly config: SymphonyConfig,
    private readonly logger: Logger,
  ) {}

  async createForIssue(identifier: string): Promise<WorkspaceRef> {
    const ref = this.referenceForIssue(identifier);
    const workspacePath = ref.path;
    await mkdir(this.config.workspace.root, { recursive: true });

    let created = false;
    try {
      const existing = await stat(workspacePath);
      if (!existing.isDirectory()) throw new SymphonyError("workspace_not_directory", `${workspacePath} exists and is not a directory.`);
    } catch (error) {
      if (error instanceof SymphonyError) throw error;
      await mkdir(workspacePath, { recursive: true });
      created = true;
    }

    const createdRef = { ...ref, created_now: created };
    if (created && this.config.hooks.after_create) {
      await runHook("after_create", this.config.hooks.after_create, createdRef.path, this.config.hooks.timeout_ms, true, this.logger);
    }
    return createdRef;
  }

  referenceForIssue(identifier: string): WorkspaceRef {
    const key = workspaceKey(identifier);
    const workspacePath = path.resolve(this.config.workspace.root, key);
    assertInsideRoot(this.config.workspace.root, workspacePath);
    return { path: workspacePath, workspace_key: key, created_now: false };
  }

  async beforeRun(workspace: WorkspaceRef): Promise<void> {
    if (this.config.hooks.before_run) {
      await runHook("before_run", this.config.hooks.before_run, workspace.path, this.config.hooks.timeout_ms, true, this.logger);
    }
  }

  async afterRun(workspace: WorkspaceRef): Promise<void> {
    if (this.config.hooks.after_run) {
      await runHook("after_run", this.config.hooks.after_run, workspace.path, this.config.hooks.timeout_ms, true, this.logger);
    }
  }

  async removeForIdentifier(identifier: string): Promise<void> {
    const workspacePath = path.resolve(this.config.workspace.root, workspaceKey(identifier));
    assertInsideRoot(this.config.workspace.root, workspacePath);
    try {
      await stat(workspacePath);
    } catch {
      return;
    }
    if (this.config.hooks.before_remove) {
      await runHook("before_remove", this.config.hooks.before_remove, workspacePath, this.config.hooks.timeout_ms, false, this.logger);
    }
    await rm(workspacePath, { recursive: true, force: true });
  }
}

export async function runHook(
  name: string,
  script: string,
  cwd: string,
  timeoutMs: number,
  fatal: boolean,
  logger: Logger,
): Promise<void> {
  logger.info("hook starting", { hook: name, cwd });
  const shell = process.platform === "win32" ? "powershell.exe" : "sh";
  const args = process.platform === "win32" ? ["-NoLogo", "-NoProfile", "-Command", script] : ["-lc", script];
  const result = await runProcess(shell, args, cwd, timeoutMs);
  if (result.ok) {
    logger.info("hook completed", { hook: name, cwd });
    return;
  }
  const message = `hook ${name} failed: ${result.error}`;
  logger[fatal ? "error" : "warn"](message, { hook: name, cwd });
  if (fatal) throw new SymphonyError("hook_failed", message);
}

async function runProcess(command: string, args: string[], cwd: string, timeoutMs: number): Promise<{ ok: boolean; error?: string }> {
  return await new Promise((resolve) => {
    const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill();
      resolve({ ok: false, error: "timeout" });
    }, timeoutMs);
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8").slice(0, 4096);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ ok: false, error: error.message });
    });
    child.on("exit", (code) => {
      clearTimeout(timer);
      resolve(code === 0 ? { ok: true } : { ok: false, error: stderr.trim() || `exit_code_${code}` });
    });
  });
}
