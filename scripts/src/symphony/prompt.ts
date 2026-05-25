import { SymphonyError, type Issue } from "./types";

const DEFAULT_PROMPT = "You are working on an issue from Linear.";

export function renderPrompt(template: string, issue: Issue, attempt: number | null): string {
  const source = template.trim() || DEFAULT_PROMPT;
  const context = { issue, attempt };
  const withLoops = source.replace(
    /{%\s*for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+([A-Za-z0-9_.]+)\s*%}([\s\S]*?){%\s*endfor\s*%}/g,
    (_all, itemName: string, collectionPath: string, body: string) => {
      const collection = resolvePath(context, collectionPath);
      if (!Array.isArray(collection)) {
        throw new SymphonyError("template_render_error", `Template loop target is not an array: ${collectionPath}`);
      }
      return collection
        .map((item) => renderInterpolations(body, { ...context, [itemName]: item }))
        .join("");
    },
  );
  return renderInterpolations(withLoops, context).trim();
}

function renderInterpolations(source: string, context: Record<string, unknown>): string {
  return source.replace(/{{\s*([^}]+?)\s*}}/g, (_all, expression: string) => {
    const [pathPart, ...filters] = expression.split("|").map((part) => part.trim());
    if (!pathPart) throw new SymphonyError("template_parse_error", "Empty template expression.");
    let value = resolvePath(context, pathPart);
    for (const filter of filters) value = applyFilter(filter, value);
    return stringify(value);
  });
}

function applyFilter(filter: string, value: unknown): unknown {
  if (filter === "json") return JSON.stringify(value, null, 2);
  if (filter === "upcase") return String(value).toUpperCase();
  if (filter === "downcase") return String(value).toLowerCase();
  if (filter.startsWith("join:")) {
    if (!Array.isArray(value)) throw new SymphonyError("template_render_error", "join filter target is not an array.");
    const delimiter = filter.slice("join:".length).trim().replace(/^['"]|['"]$/g, "");
    return value.join(delimiter);
  }
  throw new SymphonyError("template_render_error", `Unknown template filter: ${filter}`);
}

function resolvePath(context: Record<string, unknown>, rawPath: string): unknown {
  const segments = rawPath.split(".");
  let value: unknown = context;
  for (const segment of segments) {
    if (!segment) throw new SymphonyError("template_parse_error", `Invalid template path: ${rawPath}`);
    if (typeof value !== "object" || value === null || !(segment in value)) {
      throw new SymphonyError("template_render_error", `Unknown template variable: ${rawPath}`);
    }
    value = (value as Record<string, unknown>)[segment];
  }
  return value;
}

function stringify(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}
