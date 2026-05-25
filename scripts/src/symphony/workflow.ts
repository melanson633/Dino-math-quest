import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { SymphonyError, type JsonMap, type WorkflowDefinition } from "./types";

export async function loadWorkflow(explicitPath?: string): Promise<WorkflowDefinition> {
  const invocationCwd = process.env.INIT_CWD || process.cwd();
  const workflowPath = explicitPath
    ? path.resolve(invocationCwd, explicitPath)
    : path.join(invocationCwd, "WORKFLOW.md");
  let text: string;
  let metadata: Awaited<ReturnType<typeof stat>>;
  try {
    text = await readFile(workflowPath, "utf8");
    metadata = await stat(workflowPath);
  } catch (error) {
    throw new SymphonyError("missing_workflow_file", `Cannot read workflow file: ${workflowPath}`);
  }

  const { config, prompt } = parseWorkflowText(text);
  return {
    path: workflowPath,
    config,
    prompt_template: prompt.trim(),
    mtime_ms: metadata.mtimeMs,
  };
}

function parseWorkflowText(text: string): { config: JsonMap; prompt: string } {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  if (lines[0] !== "---") return { config: {}, prompt: text };

  const end = lines.findIndex((line, index) => index > 0 && line === "---");
  if (end === -1) {
    throw new SymphonyError("workflow_parse_error", "YAML front matter is missing a closing delimiter.");
  }

  const yaml = lines.slice(1, end).join("\n");
  const parsed = parseYamlMap(yaml);
  if (!isPlainObject(parsed)) {
    throw new SymphonyError("workflow_front_matter_not_a_map", "Workflow front matter must decode to a map.");
  }
  return { config: parsed, prompt: lines.slice(end + 1).join("\n") };
}

export function parseYamlMap(text: string): JsonMap {
  const lines = text.split(/\r?\n/);
  const root: JsonMap = {};
  const stack: Array<{ indent: number; value: JsonMap }> = [{ indent: -1, value: root }];

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i] ?? "";
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    const indent = raw.match(/^ */)?.[0].length ?? 0;
    const trimmed = raw.trim();
    const match = /^([A-Za-z0-9_.-]+):(?:\s*(.*))?$/.exec(trimmed);
    if (!match) {
      throw new SymphonyError("workflow_parse_error", `Unsupported YAML line: ${trimmed}`);
    }

    while (stack.length > 1 && indent <= stack[stack.length - 1]!.indent) stack.pop();
    const parent = stack[stack.length - 1]!.value;
    const key = match[1]!;
    const rest = match[2] ?? "";

    if (rest === "|" || rest === ">") {
      const blockIndent = findNextIndent(lines, i + 1, indent);
      const block: string[] = [];
      while (i + 1 < lines.length) {
        const next = lines[i + 1] ?? "";
        const nextIndent = next.match(/^ */)?.[0].length ?? 0;
        if (next.trim() && nextIndent <= indent) break;
        i += 1;
        block.push(next.slice(Math.min(blockIndent, next.length)));
      }
      parent[key] = rest === ">" ? block.join(" ").trimEnd() : block.join("\n").trimEnd();
      continue;
    }

    if (rest === "") {
      const child: JsonMap = {};
      parent[key] = child;
      stack.push({ indent, value: child });
      continue;
    }

    parent[key] = parseScalar(rest);
  }

  return root;
}

function findNextIndent(lines: string[], start: number, fallback: number): number {
  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i] ?? "";
    if (line.trim()) return line.match(/^ */)?.[0].length ?? fallback + 2;
  }
  return fallback + 2;
}

function parseScalar(raw: string): unknown {
  const value = stripComment(raw.trim());
  if (value === "null" || value === "~") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+$/.test(value)) return Number(value);
  if (/^-?\d+\.\d+$/.test(value)) return Number(value);
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return splitInlineArray(inner).map(parseScalar);
  }
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function splitInlineArray(value: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quote: string | null = null;
  for (const char of value) {
    if ((char === "'" || char === '"') && quote === null) quote = char;
    else if (char === quote) quote = null;
    if (char === "," && quote === null) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function stripComment(value: string): string {
  let quote: string | null = null;
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if ((char === "'" || char === '"') && quote === null) quote = char;
    else if (char === quote) quote = null;
    if (char === "#" && quote === null && /\s/.test(value[i - 1] ?? " ")) return value.slice(0, i).trim();
  }
  return value;
}

function isPlainObject(value: unknown): value is JsonMap {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
