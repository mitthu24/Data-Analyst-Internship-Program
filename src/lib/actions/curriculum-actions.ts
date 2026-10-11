"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireFounderForAction } from "@/lib/auth/guard";
import { recordAuditEvent } from "@/lib/auth/audit";
import { curriculumSessionSchema } from "@/lib/validation/curriculum";
import { safeAction, zodErrorToMessage, type FormState } from "./action-helpers";

function revalidatePublic() {
  revalidatePath("/curriculum");
  revalidatePath("/");
  revalidatePath("/brochure");
}

function parseInput(formData: FormData) {
  return curriculumSessionSchema.safeParse({
    classNumber: formData.get("classNumber"),
    module: formData.get("module"),
    title: formData.get("title"),
    durationMinutes: formData.get("durationMinutes"),
    topics: formData.get("topics") ?? "",
    practicalExample: formData.get("practicalExample"),
    handsOnExercise: formData.get("handsOnExercise"),
    learningOutcome: formData.get("learningOutcome"),
    deliverable: formData.get("deliverable"),
    tools: formData.get("tools") ?? "",
    trainerId: formData.get("trainerId") ?? "",
    mentorName: formData.get("mentorName") ?? "",
    mentorTitle: formData.get("mentorTitle") ?? "",
    order: formData.get("order") ?? formData.get("classNumber"),
    status: formData.get("status"),
  });
}

/** Compares the curriculum's live totals against the advertised Settings totals; never blocks a save. */
async function warnIfTotalsDrifted(): Promise<string | undefined> {
  const [agg, settings] = await Promise.all([
    prisma.curriculumSession.aggregate({
      where: { status: "PUBLISHED" },
      _count: true,
      _sum: { durationMinutes: true },
    }),
    prisma.settings.findUnique({ where: { id: "singleton" } }),
  ]);
  const totalSessions = agg._count;
  const totalHours = (agg._sum.durationMinutes ?? 0) / 60;
  if (!settings) return undefined;
  if (totalSessions !== settings.totalSessions || totalHours !== settings.totalHours) {
    return `Note: published curriculum is now ${totalSessions} sessions / ${totalHours}h, which no longer matches the advertised ${settings.totalSessions} sessions / ${settings.totalHours}h in Settings. Update Settings or this session to keep them in sync.`;
  }
  return undefined;
}

export async function createCurriculumSessionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    try {
      await prisma.curriculumSession.create({ data: parsed.data });
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unique constraint")) {
        return { error: `Class number ${parsed.data.classNumber} is already in use.` };
      }
      throw err;
    }

    revalidatePublic();
    revalidatePath("/founder/curriculum");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "curriculum", op: "create", classNumber: parsed.data.classNumber } });

    const drift = await warnIfTotalsDrifted();
    return { success: drift ?? "Session created." };
  });
}

export async function updateCurriculumSessionAction(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    try {
      await prisma.curriculumSession.update({ where: { id }, data: parsed.data });
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unique constraint")) {
        return { error: `Class number ${parsed.data.classNumber} is already in use.` };
      }
      throw err;
    }

    revalidatePublic();
    revalidatePath("/founder/curriculum");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "curriculum", op: "update", id } });

    const drift = await warnIfTotalsDrifted();
    return { success: drift ?? "Session updated." };
  });
}

export async function deleteCurriculumSessionAction(id: string): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.curriculumSession.delete({ where: { id } });
    revalidatePublic();
    revalidatePath("/founder/curriculum");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "curriculum", op: "delete", id } });
    const drift = await warnIfTotalsDrifted();
    return { success: drift ?? "Session deleted." };
  });
}

export async function toggleCurriculumSessionStatusAction(id: string, nextStatus: "DRAFT" | "PUBLISHED"): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.curriculumSession.update({ where: { id }, data: { status: nextStatus } });
    revalidatePublic();
    revalidatePath("/founder/curriculum");
    await recordAuditEvent({ action: nextStatus === "PUBLISHED" ? "content.published" : "content.unpublished", detail: { resource: "curriculum", id } });
    const drift = await warnIfTotalsDrifted();
    return { success: drift ?? (nextStatus === "PUBLISHED" ? "Session published." : "Session unpublished.") };
  });
}
