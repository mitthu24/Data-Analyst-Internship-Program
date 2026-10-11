import "server-only";
import { cookies } from "next/headers";
import { randomBytes, createHash } from "crypto";
import { prisma, classifyDatabaseError } from "@/lib/db/prisma";
import { isProduction } from "@/lib/env";

export const SESSION_COOKIE_NAME = "founder_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export interface CreateSessionInput {
  founderId: string;
  userAgent?: string | null;
  ip?: string | null;
}

/**
 * Creates a DB-backed session and sets the http-only cookie on the current
 * response. Throws a classified `Error("DATABASE_UNAVAILABLE" |
 * "DATABASE_SCHEMA_MISMATCH" | "DATABASE_ERROR")` — never the raw Prisma
 * error — if the write fails, so a login that got past the password check
 * but fails here (e.g. the Session table doesn't exist because migrations
 * were never applied) surfaces a specific, safe message instead of a
 * generic one.
 */
export async function createSession({ founderId, userAgent, ip }: CreateSessionInput): Promise<void> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  try {
    await prisma.session.create({
      data: {
        founderId,
        tokenHash: hashToken(token),
        userAgent: userAgent?.slice(0, 255) ?? null,
        ip: ip?.slice(0, 64) ?? null,
        expiresAt,
      },
    });
  } catch (err) {
    console.error("[auth] session creation failed:", err instanceof Error ? err.message : err);
    throw new Error(classifyDatabaseError(err));
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export interface AuthenticatedFounder {
  id: string;
  email: string;
  mustChangePassword: boolean;
}

/**
 * Verifies the session cookie against the database. Returns null if absent,
 * expired, or revoked.
 *
 * Throws a classified `Error("DATABASE_UNAVAILABLE" | "DATABASE_SCHEMA_MISMATCH"
 * | "DATABASE_ERROR")` — never the raw Prisma error, which can include
 * connection details — if the database itself can't be reached or queried,
 * so callers (requireFounder/requireFounderForAction, and the /founder
 * error boundary) can show a clear "try again" message instead of either
 * crashing with Next's generic error page or silently treating a transient
 * outage as "not logged in."
 */
export async function getCurrentFounder(): Promise<AuthenticatedFounder | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  let session;
  try {
    session = await prisma.session.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { founder: true },
    });
  } catch (err) {
    console.error("[auth] session lookup failed:", err instanceof Error ? err.message : err);
    throw new Error(classifyDatabaseError(err));
  }

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }

  return {
    id: session.founder.id,
    email: session.founder.email,
    mustChangePassword: session.founder.mustChangePassword,
  };
}

/** Revokes the session tied to the current cookie (logout) and clears the cookie. */
export async function destroyCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.updateMany({
      where: { tokenHash: hashToken(token) },
      data: { revokedAt: new Date() },
    });
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Revokes every session for a founder except, optionally, the current one — used after credential changes. */
export async function revokeAllSessions(founderId: string, keepCurrentCookie = false): Promise<void> {
  const cookieStore = await cookies();
  const currentToken = keepCurrentCookie ? cookieStore.get(SESSION_COOKIE_NAME)?.value : undefined;
  const currentHash = currentToken ? hashToken(currentToken) : undefined;

  await prisma.session.updateMany({
    where: {
      founderId,
      revokedAt: null,
      ...(currentHash ? { tokenHash: { not: currentHash } } : {}),
    },
    data: { revokedAt: new Date() },
  });
}
