"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireFounderForAction } from "@/lib/auth/guard";
import { recordAuditEvent } from "@/lib/auth/audit";
import {
  CONTENT_KEYS,
  heroContentSchema,
  aboutContentSchema,
  careerGuidanceContentSchema,
  footerContentSchema,
  announcementBannerSchema,
  seoContentSchema,
  brochureContentSchema,
} from "@/lib/content/site-schema";
import { safeAction, zodErrorToMessage, type FormState } from "./action-helpers";
import type { Prisma } from "@prisma/client";

async function saveEntry(key: string, value: Prisma.InputJsonValue, founderId: string) {
  await prisma.contentEntry.upsert({
    where: { key },
    update: { value, updatedBy: founderId },
    create: { key, value, updatedBy: founderId },
  });
}

function revalidateAllPublic() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/career-guidance");
}

export async function updateHeroContentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    const founder = await requireFounderForAction();
    const parsed = heroContentSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      ctaLabel: formData.get("ctaLabel"),
      secondaryCtaLabel: formData.get("secondaryCtaLabel"),
    });
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await saveEntry(CONTENT_KEYS.hero, parsed.data, founder.id);
    revalidateAllPublic();
    await recordAuditEvent({ founderId: founder.id, action: "content.updated", detail: { resource: "site.hero" } });
    return { success: "Homepage hero updated." };
  });
}

export async function updateAboutContentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    const founder = await requireFounderForAction();
    const parsed = aboutContentSchema.safeParse({ intro: formData.get("intro") });
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await saveEntry(CONTENT_KEYS.about, parsed.data, founder.id);
    revalidateAllPublic();
    await recordAuditEvent({ founderId: founder.id, action: "content.updated", detail: { resource: "site.about" } });
    return { success: "About page updated." };
  });
}

export async function updateCareerGuidanceContentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    const founder = await requireFounderForAction();
    const parsed = careerGuidanceContentSchema.safeParse({ intro: formData.get("intro") });
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await saveEntry(CONTENT_KEYS.careerGuidance, parsed.data, founder.id);
    revalidateAllPublic();
    await recordAuditEvent({ founderId: founder.id, action: "content.updated", detail: { resource: "site.careerGuidance" } });
    return { success: "Career guidance page updated." };
  });
}

export async function updateFooterContentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    const founder = await requireFounderForAction();
    const parsed = footerContentSchema.safeParse({ text: formData.get("text") });
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await saveEntry(CONTENT_KEYS.footer, parsed.data, founder.id);
    revalidateAllPublic();
    await recordAuditEvent({ founderId: founder.id, action: "content.updated", detail: { resource: "site.footer" } });
    return { success: "Footer text updated." };
  });
}

export async function updateAnnouncementBannerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    const founder = await requireFounderForAction();
    const parsed = announcementBannerSchema.safeParse({
      enabled: formData.get("enabled") === "on",
      text: formData.get("text") ?? "",
      url: formData.get("url") || null,
    });
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await saveEntry(CONTENT_KEYS.announcementBanner, parsed.data, founder.id);
    revalidateAllPublic();
    await recordAuditEvent({ founderId: founder.id, action: "content.updated", detail: { resource: "site.announcementBanner" } });
    return { success: "Announcement banner updated." };
  });
}

export async function updateBrochureContentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    const founder = await requireFounderForAction();
    const parsed = brochureContentSchema.safeParse({
      visible: formData.get("visible") === "on",
      introOverride: formData.get("introOverride") || null,
    });
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await saveEntry(CONTENT_KEYS.brochure, parsed.data, founder.id);
    revalidatePath("/brochure");
    await recordAuditEvent({ founderId: founder.id, action: "content.updated", detail: { resource: "site.brochure" } });
    return { success: "Brochure settings updated." };
  });
}

export async function updateSeoContentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return safeAction(async () => {
    const founder = await requireFounderForAction();
    const parsed = seoContentSchema.safeParse({
      homeTitle: formData.get("homeTitle") || undefined,
      homeDescription: formData.get("homeDescription") || undefined,
      aboutTitle: formData.get("aboutTitle") || undefined,
      aboutDescription: formData.get("aboutDescription") || undefined,
      ogImageUrl: formData.get("ogImageUrl") || undefined,
    });
    if (!parsed.success) return { error: zodErrorToMessage(parsed.error) };

    await saveEntry(CONTENT_KEYS.seo, parsed.data, founder.id);
    revalidateAllPublic();
    await recordAuditEvent({ founderId: founder.id, action: "content.updated", detail: { resource: "site.seo" } });
    return { success: "SEO settings updated." };
  });
}
