import http from "node:http";
import { ConsoleLogger } from "./logger";
import { loadWorkflow } from "./workflow";
import { resolveConfig, validateDispatchConfig } from "./config";
import { renderPrompt } from "./prompt";
import { DryRunAgentRunner, CodexAppServerRunner } from "./runner";
import { SymphonyOrchestrator } from "./orchestrator";
import type { Issue, SymphonyConfig } from "./types";

interface CliOptions {
  command: "validate" | "render-prompt" | "serve";
  workflowPath?: string;
  port?: number;
  liveAgent: boolean;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const logger = new ConsoleLogger();

  if (options.command === "validate") {
    const workflow = await loadWorkflow(options.workflowPath);
    const config = resolveConfig(workflow);
    validateDispatchConfig(config);
    logger.info("workflow validation completed", { path: workflow.path });
    return;
  }

  if (options.command === "render-prompt") {
    const workflow = await loadWorkflow(options.workflowPath);
    const issue = sampleIssue();
    console.log(renderPrompt(workflow.prompt_template, issue, null));
    return;
  }

  if (options.liveAgent) {
    const workflow = await loadWorkflow(options.workflowPath);
    const config = resolveConfig(workflow);
    validateDispatchConfig(config);
    validateLiveAgentPreflight(config);
  }

  const runner = options.liveAgent ? new CodexAppServerRunner() : new DryRunAgentRunner();
  const orchestrator = new SymphonyOrchestrator(options.workflowPath, runner, logger, {
    trackerMutations: options.liveAgent,
    workspaceLifecycle: options.liveAgent,
  });
  await orchestrator.start();
  const server = options.port === undefined ? null : startHttpServer(options.port, orchestrator, logger);

  process.on("SIGINT", () => {
    orchestrator.stop();
    server?.close();
    process.exit(0);
  });
}

function validateLiveAgentPreflight(config: SymphonyConfig): void {
  if (!config.hooks.after_create && !config.hooks.before_run) {
    throw new Error(
      "--live-agent requires hooks.after_create or hooks.before_run to populate/sync per-issue workspaces; otherwise workers start in empty directories.",
    );
  }
  if (!config.hooks.after_run) {
    throw new Error("--live-agent requires hooks.after_run so completed workspace changes are integrated or handed off before Linear completion.");
  }
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = { command: "serve", liveAgent: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;
    if (arg === "validate" || arg === "render-prompt" || arg === "serve") {
      options.command = arg;
    } else if (arg === "--port") {
      options.port = Number(args[++index]);
    } else if (arg === "--live-agent") {
      options.liveAgent = true;
    } else if (arg === "--dry-run") {
      options.liveAgent = false;
    } else if (!arg.startsWith("--")) {
      options.workflowPath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function startHttpServer(port: number, orchestrator: SymphonyOrchestrator, logger: ConsoleLogger): http.Server {
  const server = http.createServer((request, response) => {
    if (request.url === "/" && request.method === "GET") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(`<html><body><pre>${escapeHtml(JSON.stringify(orchestrator.snapshot(), null, 2))}</pre></body></html>`);
      return;
    }
    if (request.url === "/api/v1/state" && request.method === "GET") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(orchestrator.snapshot()));
      return;
    }
    if (request.url === "/api/v1/refresh" && request.method === "POST") {
      void orchestrator.tick();
      response.writeHead(202, { "content-type": "application/json" });
      response.end(JSON.stringify({ queued: true, coalesced: false, requested_at: new Date().toISOString(), operations: ["poll", "reconcile"] }));
      return;
    }
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: { code: "not_found", message: "Route not found." } }));
  });
  server.listen(port, "127.0.0.1", () => {
    logger.info("symphony status server listening", { url: `http://127.0.0.1:${(server.address() as { port: number }).port}` });
  });
  return server;
}

function sampleIssue(): Issue {
  return {
    id: "sample",
    identifier: "DINO-1",
    title: "Sample Symphony issue",
    description: "Rendered locally without contacting Linear.",
    priority: 1,
    state: "Todo",
    branch_name: null,
    url: null,
    labels: ["sample"],
    blocked_by: [],
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

main().catch((error) => {
  console.error(`level=error message=${JSON.stringify(error instanceof Error ? error.message : String(error))}`);
  process.exit(1);
});
