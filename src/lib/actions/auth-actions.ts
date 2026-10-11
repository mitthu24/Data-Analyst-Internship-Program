"use server";

import { redirect } from "next/navigation";
import { attemptLogin } from "@/lib/auth/login";
import { destroyCurrentSession, revokeAllSessions } from "@/lib/auth/session";
import { changePassword, changeEmail } from "@/lib/auth/account";
import { requireFounderForAction } from "@/lib/auth/guard";
import { recordAuditEvent } from "@/lib/auth/audit";
import { isDatabaseConfigured } from "@/lib/db/prisma";

export interface FormState {
  error?: string;
  success?: string;
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isDatabaseConfigured()) {
    return { error: "The database is not configured yet. See docs/DATABASE.md to connect Postgres." };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await attemptLogin(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  redirect("/founder");
}

export async function logoutAction(): Promise<void> {
  await destroyCurrentSession();
  redirect("/founder/login");
}

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const founder = await requireFounderForAction();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match." };
  }

  const result = await changePassword(founder.id, currentPassword, newPassword);
  if (!result.ok) return { error: result.error };

  return { success: "Password changed. Other signed-in devices have been logged out." };
}

export async function changeEmailAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const founder = await requireFounderForAction();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newEmail = String(formData.get("newEmail") ?? "");

  const result = await changeEmail(founder.id, currentPassword, newEmail);
  if (!result.ok) return { error: result.error };

  redirect("/founder/login");
}

export async function revokeOtherSessionsAction(): Promise<FormState> {
  const founder = await requireFounderForAction();
  await revokeAllSessions(founder.id, true);
  await recordAuditEvent({ founderId: founder.id, action: "sessions.revoked", detail: { reason: "manual" } });
  return { success: "All other sessions have been signed out." };
}
