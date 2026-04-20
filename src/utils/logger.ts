/**
 * Simple logger utility for the POLYVANERA SDK.
 * Provides structured logging with debug mode support.
 */
export interface Logger {
  info: (msg: string, meta?: Record<string, any>) => void;
  warn: (msg: string, meta?: Record<string, any>) => void;
  error: (msg: string, meta?: Record<string, any>) => void;
  debug: (msg: string, meta?: Record<string, any>) => void;
}

export function createLogger(debugEnabled = false): Logger {
  const log = (level: string, msg: string, meta?: Record<string, any>) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${msg}${metaStr}`);
  };

  return {
    info: (msg, meta) => log("info", msg, meta),
    warn: (msg, meta) => log("warn", msg, meta),
    error: (msg, meta) => log("error", msg, meta),
    debug: (msg, meta) => {
      if (debugEnabled) log("debug", msg, meta);
    }
  };
}
