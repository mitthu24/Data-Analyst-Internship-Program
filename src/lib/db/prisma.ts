import { PrismaClient } from "@prisma/client";

declare global {
   
  var __prisma: PrismaClient | undefined;
}

/**
 * Lazily-created singleton Prisma client. `DATABASE_URL` may be unset in
 * environments that haven't provisioned Postgres yet — callers that need to
 * degrade gracefully (public content loaders) should use `isDatabaseConfigured()`
 * and catch connection errors rather than assuming this succeeds.
 */
export function getPrisma(): PrismaClient {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return global.__prisma;
}

export const prisma = getPrisma();

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0);
}

/** Health check used by /founder dashboard and an internal status endpoint. */
export async function checkDatabaseHealth(): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "DATABASE_URL is not configured." };
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown database error" };
  }
}
