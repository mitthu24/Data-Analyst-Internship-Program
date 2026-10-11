"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireFounderForAction } from "@/lib/auth/guard";
import { recordAuditEvent } from "@/lib/auth/audit";
import { testimonialSchema } from "@/lib/validation/testimonial";
import { safeAction, zodErrorToMessage, type FormState } from "./action-helpers";

function revalidatePublic() {
  revalidatePath("/testimonials");
  revalidatePath("/");
}

function parseInput(formData: FormData) {
  return testimonialSchema.safeParse({
    studentName: formData.get("studentName"),
    role: formData.get("role") ?? "",
    quote: formData.get("quote"),
    imageUrl: formData.get("imageUrl") ?? "",
    consent: formData.get("consent"),
    sortOrder: formData.get("sortOrder") ?? 0,
    status: formData.get("status"),
  });
}

export async function createTestimonialAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await prisma.testimonial.create({ data: parsed.data });
    revalidatePublic();
    revalidatePath("/founder/testimonials");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "testimonial", op: "create" } });
    return { success: "Testimonial created." };
  });
}

export async function updateTestimonialAction(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await prisma.testimonial.update({ where: { id }, data: parsed.data });
    revalidatePublic();
    revalidatePath("/founder/testimonials");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "testimonial", op: "update", id } });
    return { success: "Testimonial updated." };
  });
}

export async function deleteTestimonialAction(id: string): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.testimonial.delete({ where: { id } });
    revalidatePublic();
    revalidatePath("/founder/testimonials");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "testimonial", op: "delete", id } });
    return { success: "Testimonial deleted." };
  });
}

export async function toggleTestimonialStatusAction(id: string, nextStatus: "DRAFT" | "PUBLISHED"): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    if (nextStatus === "PUBLISHED") {
      const testimonial = await prisma.testimonial.findUnique({ where: { id } });
      if (!testimonial?.consent) {
        return { error: "Cannot publish: this testimonial has no recorded consent to publish. Edit it and confirm consent first." };
      }
    }
    await prisma.testimonial.update({ where: { id }, data: { status: nextStatus } });
    revalidatePublic();
    revalidatePath("/founder/testimonials");
    await recordAuditEvent({ action: nextStatus === "PUBLISHED" ? "content.published" : "content.unpublished", detail: { resource: "testimonial", id } });
    return { success: nextStatus === "PUBLISHED" ? "Published." : "Unpublished." };
  });
}
