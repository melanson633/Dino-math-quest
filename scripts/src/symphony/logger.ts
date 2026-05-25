import type { JsonMap, Logger } from "./types";

function redact(value: unknown): unknown {
  if (typeof value !== "string") return value;
  if (value.length > 0 && /(api[_-]?key|token|secret|authorization)/i.test(value)) return "[redacted]";
  return value;
}

function format(context: JsonMap | undefined): string {
  if (!context) return "";
  return Object.entries(context)
    .map(([key, value]) => `${key}=${JSON.stringify(redact(value))}`)
    .join(" ");
}

export class ConsoleLogger implements Logger {
  info(message: string, context?: JsonMap): void {
    console.log(`level=info message=${JSON.stringify(message)} ${format(context)}`.trim());
  }

  warn(message: string, context?: JsonMap): void {
    console.warn(`level=warn message=${JSON.stringify(message)} ${format(context)}`.trim());
  }

  error(message: string, context?: JsonMap): void {
    console.error(`level=error message=${JSON.stringify(message)} ${format(context)}`.trim());
  }

  debug(message: string, context?: JsonMap): void {
    if (process.env.SYMPHONY_DEBUG === "1") {
      console.error(`level=debug message=${JSON.stringify(message)} ${format(context)}`.trim());
    }
  }
}
