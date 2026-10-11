"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireFounderForAction } from "@/lib/auth/guard";
import { recordAuditEvent } from "@/lib/auth/audit";
import { projectSchema, slugify } from "@/lib/validation/project";
import { safeAction, zodErrorToMessage, type FormState } from "./action-helpers";

function revalidatePublic() {
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/brochure");
}

function parseInput(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") ?? "",
    businessProblem: formData.get("businessProblem"),
    tools: formData.get("tools") ?? "",
    learningObjectives: formData.get("learningObjectives") ?? "",
    deliverables: formData.get("deliverables") ?? "",
    difficulty: formData.get("difficulty"),
    isPlannedExample: formData.get("isPlannedExample"),
    imageUrl: formData.get("imageUrl") ?? "",
    demoUrl: formData.get("demoUrl") ?? "",
    githubUrl: formData.get("githubUrl") ?? "",
    sortOrder: formData.get("sortOrder") ?? 0,
    status: formData.get("status"),
  });
}

export async function createProjectAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    const slug = parsed.data.slug || slugify(parsed.data.title);
    try {
      await prisma.project.create({ data: { ...parsed.data, slug } });
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unique constraint")) {
        return { error: `The slug "${slug}" is already in use — choose a different title or slug.` };
      }
      throw err;
    }

    revalidatePublic();
    revalidatePath("/founder/projects");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "project", op: "create", slug } });
    return { success: "Project created." };
  });
}

export async function updateProjectAction(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    const parsed = parseInput(formData);
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    const slug = parsed.data.slug || slugify(parsed.data.title);
    try {
      await prisma.project.update({ where: { id }, data: { ...parsed.data, slug } });
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unique constraint")) {
        return { error: `The slug "${slug}" is already in use — choose a different title or slug.` };
      }
      throw err;
    }

    revalidatePublic();
    revalidatePath("/founder/projects");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "project", op: "update", id } });
    return { success: "Project updated." };
  });
}

export async function deleteProjectAction(id: string): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.project.delete({ where: { id } });
    revalidatePublic();
    revalidatePath("/founder/projects");
    await recordAuditEvent({ action: "content.updated", detail: { resource: "project", op: "delete", id } });
    return { success: "Project deleted." };
  });
}

export async function toggleProjectStatusAction(id: string, nextStatus: "DRAFT" | "PUBLISHED"): Promise<FormState> {
  return safeAction(async () => {
    await requireFounderForAction();
    await prisma.project.update({ where: { id }, data: { status: nextStatus } });
    revalidatePublic();
    revalidatePath("/founder/projects");
    await recordAuditEvent({ action: nextStatus === "PUBLISHED" ? "content.published" : "content.unpublished", detail: { resource: "project", id } });
    return { success: nextStatus === "PUBLISHED" ? "Published." : "Unpublished." };
  });
}
