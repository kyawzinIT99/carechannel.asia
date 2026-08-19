import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function hasModel(client: PrismaClient, name: string) {
  const delegate = (client as unknown as Record<string, { findMany?: unknown }>)[name];
  return typeof delegate?.findMany === "function";
}

function isFresh(client: PrismaClient) {
  return hasModel(client, "inquiry") && (hasModel(client, "siteContent") || hasModel(client, "promotion"));
}

export const prisma: PrismaClient = (() => {
  const cached = globalForPrisma.prisma;
  if (cached && isFresh(cached)) return cached;
  if (cached) void cached.$disconnect().catch(() => undefined);
  const client = createClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
})();
