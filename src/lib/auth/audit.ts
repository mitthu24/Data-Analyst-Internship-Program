import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export type AuditAction =
  | "login.success"
  | "login.failure"
  | "login.locked"
  | "logout"
  | "password.changed"
  | "email.changed"
  | "sessions.revoked"
  | "founder.bootstrapped"
  | "content.published"
  | "content.unpublished"
  | "content.updated"
  | "lead.status_changed"
  | "lead.sheets_retry";

export async function recordAuditEvent(params: {
  founderId?: string | null;
  action: AuditAction;
  detail?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  try {
    await prisma.auditEvent.create({
      data: {
        founderId: params.founderId ?? null,
        action: params.action,
        detail: (params.detail as Prisma.InputJsonValue) ?? undefined,
        ip: params.ip?.slice(0, 64) ?? null,
        userAgent: params.userAgent?.slice(0, 255) ?? null,
      },
    });
  } catch {
    // Auditing must never block the primary action (e.g. a successful login)
    // if the audit write itself fails — swallow and move on.
  }
}
