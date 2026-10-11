import "server-only";
import { headers } from "next/headers";
import { prisma, classifyDatabaseError } from "@/lib/db/prisma";
import { verifyPassword } from "./password";
import { createSession } from "./session";
import { recordAuditEvent } from "./audit";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

async function getRequestMeta() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;
  const userAgent = h.get("user-agent");
  return { ip, userAgent };
}

/**
 * Database-backed login rate limiting: failure count and lockout timestamp
 * live on the Founder row, so lockouts hold across serverless instances
 * (unlike an in-memory counter, which would reset per cold start).
 *
 * The initial account lookup runs on every single login attempt before any
 * credential is checked, so it's wrapped and classified (see
 * classifyDatabaseError) — a connection or un-migrated-schema failure here
 * previously surfaced as the generic "Something went wrong" from
 * safeAction's catch-all; it now throws a specific, safe sentinel so the
 * founder sees a message that actually distinguishes "wrong password" from
 * "the database can't be reached" or "the database schema is out of date".
 */
export async function attemptLogin(email: string, password: string): Promise<LoginResult> {
  const { ip, userAgent } = await getRequestMeta();
  const normalizedEmail = email.trim().toLowerCase();

  let founder;
  try {
    founder = await prisma.founder.findUnique({ where: { email: normalizedEmail } });
  } catch (err) {
    console.error("[auth] founder lookup failed:", err instanceof Error ? err.message : err);
    throw new Error(classifyDatabaseError(err));
  }

  // Constant-shape response whether or not the account exists, to avoid
  // leaking which emails are registered.
  if (!founder) {
    await recordAuditEvent({ action: "login.failure", detail: { email: normalizedEmail, reason: "no_account" }, ip, userAgent });
    return { ok: false, error: "Invalid email or password." };
  }

  if (founder.lockedUntil && founder.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((founder.lockedUntil.getTime() - Date.now()) / 60000);
    await recordAuditEvent({ founderId: founder.id, action: "login.locked", detail: { minutesLeft }, ip, userAgent });
    return { ok: false, error: `Too many failed attempts. Try again in ${minutesLeft} minute(s).` };
  }

  const valid = await verifyPassword(founder.passwordHash, password);

  if (!valid) {
    const failedLoginAttempts = founder.failedLoginAttempts + 1;
    const lockedUntil = failedLoginAttempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS) : null;

    await prisma.founder.update({
      where: { id: founder.id },
      data: { failedLoginAttempts, lockedUntil },
    });
    await recordAuditEvent({
      founderId: founder.id,
      action: "login.failure",
      detail: { reason: "bad_password", failedLoginAttempts },
      ip,
      userAgent,
    });
    return { ok: false, error: "Invalid email or password." };
  }

  await prisma.founder.update({
    where: { id: founder.id },
    data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
  });

  await createSession({ founderId: founder.id, userAgent, ip });
  await recordAuditEvent({ founderId: founder.id, action: "login.success", ip, userAgent });

  return { ok: true };
}
