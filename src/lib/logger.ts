import pino from "pino";
import * as Sentry from "@sentry/nextjs";

const isDev = process.env.NODE_ENV === "development";

const pinoLogger = pino({
  level: isDev ? "debug" : "info",
});

const formatLog = (arg1: any, arg2: any) => {
  if (typeof arg1 === "object" && arg1 !== null) {
    return { msg: typeof arg2 === "string" ? arg2 : "", meta: arg1 };
  } else {
    return { msg: typeof arg1 === "string" ? arg1 : "", meta: arg2 };
  }
};

export const logger = {
  info: (arg1: any, arg2?: any) => {
    const { msg, meta } = formatLog(arg1, arg2);
    pinoLogger.info(meta, msg);
  },
  warn: (arg1: any, arg2?: any) => {
    const { msg, meta } = formatLog(arg1, arg2);
    pinoLogger.warn(meta, msg);
  },
  debug: (arg1: any, arg2?: any) => {
    const { msg, meta } = formatLog(arg1, arg2);
    pinoLogger.debug(meta, msg);
  },
  error: (arg1: any, arg2?: any, arg3?: any) => {
    if (typeof arg1 === "object" && arg1 !== null) {
      // Pino style: error(obj, msg)
      pinoLogger.error(arg1, arg2);
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.captureException(arg1.err || arg1, { extra: arg1 });
      }
    } else {
      // Filesystem style: error(msg, err, meta)
      pinoLogger.error({ err: arg2, ...arg3 }, arg1);
      if (arg2 && process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.captureException(arg2, { extra: { msg: arg1, ...arg3 } });
      }
    }
  }
};

export function logError(err: any, context?: any) {
  pinoLogger.error({ err, ...context }, err instanceof Error ? err.message : "An error occurred");
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(err, { extra: context });
  }
}

export default logger;
