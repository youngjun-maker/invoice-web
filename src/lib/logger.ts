// Server-side structured logger — never import this in Client Components
// Formats log output based on NODE_ENV: JSON in production, readable in development

type LogLevel = "error" | "warn" | "info";

interface LogContext {
  [key: string]: unknown;
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const prefix = level === "error" ? "[ERROR]" : level === "warn" ? "[WARN]" : "[INFO]";
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `${prefix} ${message}${contextStr}`;
  }

  return JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

export const logger = {
  error(message: string, context?: LogContext): void {
    console.error(formatLog("error", message, context));
  },

  warn(message: string, context?: LogContext): void {
    console.warn(formatLog("warn", message, context));
  },

  info(message: string, context?: LogContext): void {
    console.log(formatLog("info", message, context));
  },
};
