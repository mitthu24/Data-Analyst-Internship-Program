"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireFounderForAction } from "@/lib/auth/guard";
import { recordAuditEvent } from "@/lib/auth/audit";
import { galleryItemSchema } from "@/lib/validation/gallery";
import { safeAction, zodErrorToMessage, type FormState } from "./action-helpers";

function revalidatePublic() {
  revalidatePath("/gallery");
}

function parseInput(formData: FormData) {
  return galleryItemSchema.safeParse({
    imageUrl: formData.get("imageUrl"),
    caption: formData.get("caption") ?? "",
    altText: formData.get("altText"),
    category: formData.get("category") ?? "",
    sortOrder: formData.get("sortOrder") ?? 0,
    status: formData.get("status"),
  });
}

export async function createGalleryItemAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await prisma.galleryItem.create({ data: parsed.data });
    revalidatePublic();
    revalidatePath("/founder/gallery");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "gallery", op: "create" } });
    return { success: "Image added." };
  });
}

export async function updateGalleryItemAction(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await prisma.galleryItem.update({ where: { id }, data: parsed.data });
    revalidatePublic();
    revalidatePath("/founder/gallery");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "gallery", op: "update", id } });
    return { success: "Image updated." };
  });
}

export async function deleteGalleryItemAction(id: string): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.galleryItem.delete({ where: { id } });
    revalidatePublic();
    revalidatePath("/founder/gallery");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "gallery", op: "delete", id } });
    return { success: "Image deleted." };
  });
}

export async function toggleGalleryItemStatusAction(id: string, nextStatus: "DRAFT" | "PUBLISHED"): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.galleryItem.update({ where: { id }, data: { status: nextStatus } });
    revalidatePublic();
    revalidatePath("/founder/gallery");
    await recordAuditEvent({ action: nextStatus === "PUBLISHED" ? "content.published" : "content.unpublished", detail: { resource: "gallery", id } });
    return { success: nextStatus === "PUBLISHED" ? "Published." : "Unpublished." };
  });
}
