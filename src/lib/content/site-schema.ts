import { z } from "zod";

/**
 * Typed contracts for the generic ContentEntry key/value store. Each key
 * below maps to a Zod shape; src/lib/actions/content-actions.ts validates
 * against these before writing, and the matching default is what public
 * pages fall back to if the database is unavailable or the row is missing.
 */

export const heroContentSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(3).max(600),
  ctaLabel: z.string().trim().min(1).max(60),
  secondaryCtaLabel: z.string().trim().min(1).max(60),
});
export type HeroContent = z.infer<typeof heroContentSchema>;
export const defaultHeroContent: HeroContent = {
  title: "Build Job-Ready Skills. Prepare for Your Next Career Opportunity.",
  description:
    "Move beyond theory. Build practical corporate skills, work on real-world projects, learn from industry professionals, and prepare for interviews through an intensive 8-week learning experience.",
  ctaLabel: "Start Your Career Journey",
  secondaryCtaLabel: "Explore the Program",
};

export const aboutContentSchema = z.object({
  intro: z.string().trim().min(3).max(2000),
});
export type AboutContent = z.infer<typeof aboutContentSchema>;
export const defaultAboutContent: AboutContent = {
  intro:
    "Skillo Academy's Placement-Oriented Internship Program is a practical, career-preparation program designed for MBA and BBA students and graduates, students from other degree programs who want corporate careers, freshers preparing for entry-level roles, and early-career professionals who want to sharpen workplace skills — without a multi-month commitment.",
};

export const careerGuidanceContentSchema = z.object({
  intro: z.string().trim().min(3).max(2000),
});
export type CareerGuidanceContent = z.infer<typeof careerGuidanceContentSchema>;
export const defaultCareerGuidanceContent: CareerGuidanceContent = {
  intro:
    "Resume preparation, project presentation, interview practice, and the corporate readiness skills covered in the program — described honestly, as placement-oriented preparation. This program does not promise guaranteed placement, a guaranteed salary, or a job offer.",
};

export const footerContentSchema = z.object({
  text: z.string().trim().min(3).max(600),
});
export type FooterContent = z.infer<typeof footerContentSchema>;
export const defaultFooterContent: FooterContent = {
  text: "An 8-week, placement-oriented internship program building practical corporate skills — Excel, Power BI, SQL, automation, and AI-assisted dashboards — for MBA/BBA students, other graduates, freshers, and early-career professionals.",
};

export const announcementBannerSchema = z.object({
  enabled: z.boolean(),
  text: z.string().trim().max(200),
  url: z.string().trim().max(500).optional().nullable(),
});
export type AnnouncementBanner = z.infer<typeof announcementBannerSchema>;
export const defaultAnnouncementBanner: AnnouncementBanner = {
  enabled: false,
  text: "",
  url: null,
};

export const seoContentSchema = z.object({
  homeTitle: z.string().trim().max(70).optional(),
  homeDescription: z.string().trim().max(200).optional(),
  aboutTitle: z.string().trim().max(70).optional(),
  aboutDescription: z.string().trim().max(200).optional(),
  ogImageUrl: z.string().trim().max(500).optional(),
});
export type SeoContent = z.infer<typeof seoContentSchema>;
export const defaultSeoContent: SeoContent = {};

export const brochureContentSchema = z.object({
  visible: z.boolean(),
  introOverride: z.string().trim().max(2000).optional().nullable(),
});
export type BrochureContent = z.infer<typeof brochureContentSchema>;
export const defaultBrochureContent: BrochureContent = {
  visible: true,
  introOverride: null,
};

export const CONTENT_KEYS = {
  hero: "site.hero",
  about: "site.about",
  careerGuidance: "site.careerGuidance",
  footer: "site.footer",
  announcementBanner: "site.announcementBanner",
  seo: "site.seo",
  brochure: "site.brochure",
} as const;
