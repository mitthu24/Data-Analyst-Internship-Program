import { PrismaClient, Prisma } from "@prisma/client";

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

/**
 * Classifies a caught Prisma error into one of a small set of safe,
 * specific sentinels, instead of letting the raw error (which can include
 * connection-string fragments, hostnames, or internal Prisma detail)
 * propagate or collapse into a single generic "something went wrong".
 *
 * Every auth code path that talks to the database (session verification,
 * login) should catch its Prisma call, run the error through this, and
 * throw `Error(classifyDatabaseError(err))` instead of the original error —
 * see src/lib/auth/session.ts and src/lib/auth/login.ts. This turned a
 * previously-opaque "Something went wrong" on production login into one of:
 *   - DATABASE_UNAVAILABLE: can't reach the database at all (wrong
 *     DATABASE_URL, network/SSL issue, connection-pool exhaustion).
 *   - DATABASE_SCHEMA_MISMATCH: reached the database, but a table/column
 *     Prisma expects doesn't exist — almost always means
 *     `prisma migrate deploy` was never run against this database.
 *   - DATABASE_ERROR: reached the database, something else went wrong.
 */
export function classifyDatabaseError(err: unknown): "DATABASE_UNAVAILABLE" | "DATABASE_SCHEMA_MISMATCH" | "DATABASE_ERROR" {
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return "DATABASE_UNAVAILABLE";
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P1xxx = connection-layer errors; P2021/P2022 = missing table/column
    // (an un-migrated database); everything else is a real query-time error.
    if (err.code.startsWith("P1")) return "DATABASE_UNAVAILABLE";
    if (err.code === "P2021" || err.code === "P2022") return "DATABASE_SCHEMA_MISMATCH";
  }
  return "DATABASE_ERROR";
}

/**
 * Logs a caught database error server-side with its classification and
 * (if present) the actual Prisma error code — e.g. `P1001` (can't reach
 * server) vs `P2021` (table missing) — which is the detail that actually
 * distinguishes "wrong/unreachable connection string" from "database
 * reachable but never migrated" in server logs, without ever logging the
 * connection string itself, a password, a hash, or a session token (none
 * of which appear in a Prisma error's `.code` or redacted message).
 */
export function logDatabaseError(context: string, err: unknown): void {
  const category = classifyDatabaseError(err);
  const code = err instanceof Prisma.PrismaClientKnownRequestError ? err.code : "n/a";
  const message = err instanceof Error ? err.message.split("\n")[0].slice(0, 200) : String(err);
  console.error(`[db] ${context} failed — category=${category} code=${code}:`, message);
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
