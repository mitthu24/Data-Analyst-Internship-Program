"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireFounderForAction } from "@/lib/auth/guard";
import { recordAuditEvent } from "@/lib/auth/audit";
import { trainerSchema } from "@/lib/validation/trainer";
import { safeAction, zodErrorToMessage, type FormState } from "./action-helpers";

function revalidatePublic() {
  revalidatePath("/trainers");
  revalidatePath("/");
  revalidatePath("/brochure");
  revalidatePath("/curriculum");
}

function parseInput(formData: FormData) {
  return trainerSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    company: formData.get("company") ?? "",
    location: formData.get("location") ?? "",
    bio: formData.get("bio") ?? "",
    expertise: formData.get("expertise") ?? "",
    photoUrl: formData.get("photoUrl") ?? "",
    linkedin: formData.get("linkedin") ?? "",
    isMentor: formData.get("isMentor"),
    sortOrder: formData.get("sortOrder") ?? 0,
    status: formData.get("status"),
  });
}

export async function createTrainerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await prisma.trainer.create({ data: parsed.data });
    revalidatePublic();
    revalidatePath("/founder/trainers");
    revalidatePath("/founder/mentors");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "trainer", op: "create" } });
    return { success: "Profile created." };
  });
}

export async function updateTrainerAction(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await prisma.trainer.update({ where: { id }, data: parsed.data });
    revalidatePublic();
    revalidatePath("/founder/trainers");
    revalidatePath("/founder/mentors");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "trainer", op: "update", id } });
    return { success: "Profile updated." };
  });
}

export async function deleteTrainerAction(id: string): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.curriculumSession.updateMany({ where: { trainerId: id }, data: { trainerId: null } });
    await prisma.trainer.delete({ where: { id } });
    revalidatePublic();
    revalidatePath("/founder/trainers");
    revalidatePath("/founder/mentors");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "trainer", op: "delete", id } });
    return { success: "Profile deleted." };
  });
}

export async function toggleTrainerStatusAction(id: string, nextStatus: "DRAFT" | "PUBLISHED"): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.trainer.update({ where: { id }, data: { status: nextStatus } });
    revalidatePublic();
    revalidatePath("/founder/trainers");
    revalidatePath("/founder/mentors");
    await recordAuditEvent({ action: nextStatus === "PUBLISHED" ? "content.published" : "content.unpublished", detail: { resource: "trainer", id } });
    return { success: nextStatus === "PUBLISHED" ? "Published." : "Unpublished." };
  });
}
