type LogLevel = "info" | "warn" | "error";

interface RealtimeLogEntry {
  level: LogLevel;
  scope: string;
  message: string;
  detail?: unknown;
  timestamp: string;
}

const logs: RealtimeLogEntry[] = [];
const MAX_LOGS = 50;

function pushLog(level: LogLevel, scope: string, message: string, detail?: unknown) {
  const entry: RealtimeLogEntry = {
    level,
    scope,
    message,
    detail,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(entry);
  if (logs.length > MAX_LOGS) logs.pop();

  const prefix = `[Vexride Realtime:${scope}]`;
  if (level === "error") console.error(prefix, message, detail ?? "");
  else if (level === "warn") console.warn(prefix, message, detail ?? "");
  else console.info(prefix, message, detail ?? "");
}

export const realtimeLogger = {
  info: (scope: string, message: string, detail?: unknown) =>
    pushLog("info", scope, message, detail),
  warn: (scope: string, message: string, detail?: unknown) =>
    pushLog("warn", scope, message, detail),
  error: (scope: string, message: string, detail?: unknown) =>
    pushLog("error", scope, message, detail),
  getRecent: () => [...logs],
};
