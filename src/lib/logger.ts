import pino from "pino";
import * as Sentry from "@sentry/nextjs";

const isDev = process.env.NODE_ENV === "development";

export const logger = pino({
  level: isDev ? "debug" : "info",
});

export function logError(err: any, context?: any) {
  logger.error({ err, ...context }, err instanceof Error ? err.message : "An error occurred");
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(err, { extra: context });
  }
}

export default logger;
