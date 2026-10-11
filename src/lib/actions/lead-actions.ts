"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireFounderForAction } from "@/lib/auth/guard";
import { recordAuditEvent } from "@/lib/auth/audit";
import { leadStatusValues } from "@/lib/validation/lead";
import { syncLeadToSheets } from "@/lib/integrations/google-sheets";
import { safeAction, type FormState } from "./action-helpers";
import { z } from "zod";

const statusSchema = z.enum(leadStatusValues);

export async function updateLeadStatusAction(leadId: string, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    const founder = await requireFounderForAction();
    const parsed = statusSchema.safeParse(formData.get("status"));
    if (!parsed.success) return { error: "Invalid status." };

    await prisma.lead.update({ where: { id: leadId }, data: { status: parsed.data } });
    revalidatePath("/founder/leads");
    revalidatePath(`/founder/leads/${leadId}`);
    await recordAuditEvent({ founderId: founder.id, action: "lead.status_changed", detail: { leadId, status: parsed.data } });
    return { success: "Status updated." };
  });
}

export async function addLeadNoteAction(leadId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    const founder = await requireFounderForAction();
    const note = String(formData.get("note") ?? "").trim();
    if (!note) return { error: "Note cannot be empty." };
    if (note.length > 2000) return { error: "Note is too long (max 2000 characters)." };

    await prisma.leadNote.create({ data: { leadId, note, createdById: founder.id } });
    revalidatePath(`/founder/leads/${leadId}`);
    return { success: "Note added." };
  });
}

export async function retryLeadSheetsSyncAction(leadId: string): Promise<FormState> {
  return safeAction(async () => {
    const founder = await requireFounderForAction();
    await syncLeadToSheets(leadId);
    revalidatePath(`/founder/leads/${leadId}`);
    revalidatePath("/founder/leads");
    await recordAuditEvent({ founderId: founder.id, action: "lead.sheets_retry", detail: { leadId } });
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    return { success: `Sync attempted. Status: ${lead?.sheetsSyncStatus ?? "unknown"}.` };
  });
}
