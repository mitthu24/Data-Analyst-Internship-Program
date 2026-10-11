import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import {
  CONTENT_KEYS,
  heroContentSchema,
  defaultHeroContent,
  aboutContentSchema,
  defaultAboutContent,
  careerGuidanceContentSchema,
  defaultCareerGuidanceContent,
  footerContentSchema,
  defaultFooterContent,
  announcementBannerSchema,
  defaultAnnouncementBanner,
  seoContentSchema,
  defaultSeoContent,
  brochureContentSchema,
  defaultBrochureContent,
  type HeroContent,
  type AboutContent,
  type CareerGuidanceContent,
  type FooterContent,
  type AnnouncementBanner,
  type SeoContent,
  type BrochureContent,
} from "./site-schema";

/**
 * Reads one ContentEntry by key and validates it against the given schema,
 * falling back to `fallback` whenever the database is unconfigured,
 * unreachable, the row doesn't exist yet, or its stored shape no longer
 * validates. Public pages must always go through this — never read
 * ContentEntry directly — so a database hiccup degrades to the shipped
 * defaults instead of a broken page.
 */
async function getContentOrDefault<T>(key: string, schema: { safeParse: (v: unknown) => { success: boolean; data?: T } }, fallback: T): Promise<T> {
  if (!isDatabaseConfigured()) return fallback;
  try {
    const row = await prisma.contentEntry.findUnique({ where: { key } });
    if (!row) return fallback;
    const parsed = schema.safeParse(row.value);
    return parsed.success && parsed.data ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

export const getHeroContent = (): Promise<HeroContent> =>
  getContentOrDefault(CONTENT_KEYS.hero, heroContentSchema, defaultHeroContent);

export const getAboutContent = (): Promise<AboutContent> =>
  getContentOrDefault(CONTENT_KEYS.about, aboutContentSchema, defaultAboutContent);

export const getCareerGuidanceContent = (): Promise<CareerGuidanceContent> =>
  getContentOrDefault(CONTENT_KEYS.careerGuidance, careerGuidanceContentSchema, defaultCareerGuidanceContent);

export const getFooterContent = (): Promise<FooterContent> =>
  getContentOrDefault(CONTENT_KEYS.footer, footerContentSchema, defaultFooterContent);

export const getAnnouncementBanner = (): Promise<AnnouncementBanner> =>
  getContentOrDefault(CONTENT_KEYS.announcementBanner, announcementBannerSchema, defaultAnnouncementBanner);

export const getSeoContent = (): Promise<SeoContent> =>
  getContentOrDefault(CONTENT_KEYS.seo, seoContentSchema, defaultSeoContent);

export const getBrochureContent = (): Promise<BrochureContent> =>
  getContentOrDefault(CONTENT_KEYS.brochure, brochureContentSchema, defaultBrochureContent);
