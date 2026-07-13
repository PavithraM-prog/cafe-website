import fs from "fs";
import path from "path";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CURRENT_LEVEL = (process.env.LOG_LEVEL as LogLevel) || "DEBUG";

// ANSI escape codes for coloring terminal logs
const COLORS = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  redBold: "\x1b[1;31m",
};

class Logger {
  private logDir: string | null = null;
  private logFile: string | null = null;

  constructor() {
    // Only initialize file logging on the server (Node runtime)
    if (typeof window === "undefined") {
      this.logDir = path.join(process.cwd(), "logs");
      this.logFile = path.join(this.logDir, "app.log");
      
      try {
        if (!fs.existsSync(this.logDir)) {
          fs.mkdirSync(this.logDir, { recursive: true });
        }
      } catch (err) {
        // Fallback silently if file system is read-only
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[CURRENT_LEVEL];
  }

  private writeToFile(message: string) {
    if (!this.logFile) return;
    try {
      fs.appendFileSync(this.logFile, message + "\n", "utf8");
    } catch (err) {
      // Fail silently
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      // Beautiful console formatting for local development
      let color = COLORS.reset;
      if (level === "INFO") color = COLORS.green;
      else if (level === "WARN") color = COLORS.yellow;
      else if (level === "ERROR") color = COLORS.redBold;
      else if (level === "DEBUG") color = COLORS.cyan;

      const metaStr = meta ? `\n${COLORS.dim}${JSON.stringify(meta, null, 2)}${COLORS.reset}` : "";
      return `[${timestamp}] ${color}${level.padEnd(5)}${COLORS.reset}: ${message}${metaStr}`;
    }

    // Structured JSON logging for production environments
    const logObj: any = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    };
    return JSON.stringify(logObj);
  }

  info(message: string, meta?: any) {
    if (!this.shouldLog("INFO")) return;
    const formatted = this.formatMessage("INFO", message, meta);
    console.log(formatted);
    this.writeToFile(`[INFO] [${new Date().toISOString()}] ${message} ${meta ? JSON.stringify(meta) : ""}`);
  }

  error(message: string, error?: any, meta?: any) {
    if (!this.shouldLog("ERROR")) return;
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error;
    
    const combinedMeta = {
      ...(errorDetails && { error: errorDetails }),
      ...meta,
    };

    const formatted = this.formatMessage("ERROR", message, combinedMeta);
    console.error(formatted);
    this.writeToFile(`[ERROR] [${new Date().toISOString()}] ${message} ${JSON.stringify(combinedMeta)}`);
  }

  warn(message: string, meta?: any) {
    if (!this.shouldLog("WARN")) return;
    const formatted = this.formatMessage("WARN", message, meta);
    console.warn(formatted);
    this.writeToFile(`[WARN] [${new Date().toISOString()}] ${message} ${meta ? JSON.stringify(meta) : ""}`);
  }

  debug(message: string, meta?: any) {
    if (!this.shouldLog("DEBUG")) return;
    const formatted = this.formatMessage("DEBUG", message, meta);
    console.log(formatted);
    this.writeToFile(`[DEBUG] [${new Date().toISOString()}] ${message} ${meta ? JSON.stringify(meta) : ""}`);
  }
}

export const logger = new Logger();
