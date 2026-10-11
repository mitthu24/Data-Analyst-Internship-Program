"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireFounderForAction } from "@/lib/auth/guard";
import { recordAuditEvent } from "@/lib/auth/audit";
import { faqSchema } from "@/lib/validation/faq";
import { safeAction, zodErrorToMessage, type FormState } from "./action-helpers";

function revalidatePublic() {
  revalidatePath("/faq");
  revalidatePath("/");
  revalidatePath("/brochure");
}

function parseInput(formData: FormData) {
  return faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder") ?? 0,
    status: formData.get("status"),
  });
}

export async function createFaqAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await prisma.faq.create({ data: parsed.data });
    revalidatePublic();
    revalidatePath("/founder/content/faq");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "faq", op: "create" } });
    return { success: "FAQ created." };
  });
}

export async function updateFaqAction(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await prisma.faq.update({ where: { id }, data: parsed.data });
    revalidatePublic();
    revalidatePath("/founder/content/faq");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "faq", op: "update", id } });
    return { success: "FAQ updated." };
  });
}

export async function deleteFaqAction(id: string): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.faq.delete({ where: { id } });
    revalidatePublic();
    revalidatePath("/founder/content/faq");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "faq", op: "delete", id } });
    return { success: "FAQ deleted." };
  });
}

export async function toggleFaqStatusAction(id: string, nextStatus: "DRAFT" | "PUBLISHED"): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.faq.update({ where: { id }, data: { status: nextStatus } });
    revalidatePublic();
    revalidatePath("/founder/content/faq");
    await recordAuditEvent({ action: nextStatus === "PUBLISHED" ? "content.published" : "content.unpublished", detail: { resource: "faq", id } });
    return { success: nextStatus === "PUBLISHED" ? "Published." : "Unpublished." };
  });
}
