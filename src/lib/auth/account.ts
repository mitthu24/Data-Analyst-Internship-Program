import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword, checkPasswordPolicy } from "./password";
import { revokeAllSessions } from "./session";
import { recordAuditEvent } from "./audit";

async function getRequestMeta() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;
  const userAgent = h.get("user-agent");
  return { ip, userAgent };
}

export type MutationResult = { ok: true } | { ok: false; error: string };

export async function changePassword(
  founderId: string,
  currentPassword: string,
  newPassword: string,
): Promise<MutationResult> {
  const founder = await prisma.founder.findUnique({ where: { id: founderId } });
  if (!founder) return { ok: false, error: "Account not found." };

  const currentValid = await verifyPassword(founder.passwordHash, currentPassword);
  if (!currentValid) return { ok: false, error: "Current password is incorrect." };

  const policy = checkPasswordPolicy(newPassword);
  if (!policy.valid) return { ok: false, error: policy.errors.join(" ") };

  const passwordHash = await hashPassword(newPassword);
  await prisma.founder.update({
    where: { id: founderId },
    data: { passwordHash, mustChangePassword: false, passwordChangedAt: new Date() },
  });

  // Keep the session that just made this change; force every other device to re-authenticate.
  await revokeAllSessions(founderId, true);

  const { ip, userAgent } = await getRequestMeta();
  await recordAuditEvent({ founderId, action: "password.changed", ip, userAgent });
  await recordAuditEvent({ founderId, action: "sessions.revoked", detail: { reason: "password_change" }, ip, userAgent });

  return { ok: true };
}

export async function changeEmail(
  founderId: string,
  currentPassword: string,
  newEmail: string,
): Promise<MutationResult> {
  const founder = await prisma.founder.findUnique({ where: { id: founderId } });
  if (!founder) return { ok: false, error: "Account not found." };

  const currentValid = await verifyPassword(founder.passwordHash, currentPassword);
  if (!currentValid) return { ok: false, error: "Current password is incorrect." };

  const normalized = newEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const existing = await prisma.founder.findUnique({ where: { email: normalized } });
  if (existing && existing.id !== founderId) {
    return { ok: false, error: "That email is already in use." };
  }

  const previousEmail = founder.email;
  await prisma.founder.update({ where: { id: founderId }, data: { email: normalized } });

  // No transactional email provider is configured yet (see docs/SECURITY.md) —
  // until one is, we treat "current password re-entry" as the verification
  // step and force re-authentication everywhere as a compensating control.
  await revokeAllSessions(founderId, true);

  const { ip, userAgent } = await getRequestMeta();
  await recordAuditEvent({ founderId, action: "email.changed", detail: { previousEmail, newEmail: normalized }, ip, userAgent });
  await recordAuditEvent({ founderId, action: "sessions.revoked", detail: { reason: "email_change" }, ip, userAgent });

  return { ok: true };
}
