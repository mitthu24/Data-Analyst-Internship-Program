"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireFounderForAction } from "@/lib/auth/guard";
import { recordAuditEvent } from "@/lib/auth/audit";
import { programSettingsSchema, pricingSettingsSchema } from "@/lib/validation/settings";
import { safeAction, zodErrorToMessage, type FormState } from "./action-helpers";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/curriculum");
  revalidatePath("/brochure");
  revalidatePath("/refund-policy");
  revalidatePath("/terms");
  revalidatePath("/faq");
  revalidatePath("/contact");
}

export async function updateProgramSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();

    const parsed = programSettingsSchema.safeParse({
      programName: formData.get("programName"),
      durationLabel: formData.get("durationLabel"),
      classDurationMinutes: formData.get("classDurationMinutes"),
      coreClasses: formData.get("coreClasses"),
      mentorSessions: formData.get("mentorSessions"),
      totalSessions: formData.get("totalSessions"),
      totalHours: formData.get("totalHours"),
      scheduleNote: formData.get("scheduleNote"),
      batchDates: formData.get("batchDates") ?? "",
      batchTiming: formData.get("batchTiming") ?? "",
      batchMode: formData.get("batchMode") ?? "",
      batchVenue: formData.get("batchVenue") ?? "",
      contactEmail: formData.get("contactEmail") ?? "",
      contactPhone: formData.get("contactPhone") ?? "",
    });
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await prisma.settings.upsert({
      where: { id: "singleton" },
      update: parsed.data,
      create: { id: "singleton", ...parsed.data },
    });

    revalidatePublic();
    revalidatePath("/founder/settings");
    revalidatePath("/founder");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "settings.program" } });

    const actualSessions = await prisma.curriculumSession.count({ where: { status: "PUBLISHED" } });
    const warning =
      actualSessions !== parsed.data.totalSessions
        ? ` Note: the curriculum currently has ${actualSessions} published sessions, which no longer matches the ${parsed.data.totalSessions} you just set here.`
        : "";

    return { success: `Settings saved.${warning}` };
  });
}

export async function updatePricingSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();

    const parsed = pricingSettingsSchema.safeParse({
      currency: formData.get("currency"),
      referencePriceInr: formData.get("referencePriceInr"),
      launchPriceInr: formData.get("launchPriceInr"),
      enrollmentPaymentInr: formData.get("enrollmentPaymentInr"),
      enrollmentUrl: formData.get("enrollmentUrl"),
      refundWindowDays: formData.get("refundWindowDays"),
      refundPolicyText: formData.get("refundPolicyText") ?? "",
    });
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };
    const data = { ...parsed.data, refundPolicyText: parsed.data.refundPolicyText ?? "" };

    await prisma.settings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });

    revalidatePublic();
    revalidatePath("/founder/pricing");
    revalidatePath("/founder");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "settings.pricing" } });
    return { success: "Pricing saved." };
  });
}
