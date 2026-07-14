import { PrismaClient, Prisma } from "@prisma/client";
import { logger } from "./logger";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const client = new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
    ],
  });

  client.$on("query", (e: Prisma.QueryEvent) => {
    logger.debug(
      {
        query: e.query,
        params: e.params,
        duration: `${e.duration}ms`,
      },
      "Prisma Query"
    );
  });

  client.$on("error", (e: Prisma.LogEvent) => {
    logger.error(
      {
        message: e.message,
        target: e.target,
      },
      "Prisma Error"
    );
  });

  return client;
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
