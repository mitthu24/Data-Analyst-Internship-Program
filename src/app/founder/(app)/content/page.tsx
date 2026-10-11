import type { Metadata } from "next";
import Link from "next/link";
import { requireFounder } from "@/lib/auth/guard";
import { PageHeader } from "@/components/founder/PageHeader";
import {
  getHeroContent,
  getAboutContent,
  getCareerGuidanceContent,
  getFooterContent,
  getAnnouncementBanner,
  getSeoContent,
} from "@/lib/content/site-content";
import { HeroForm, AboutForm, CareerGuidanceForm, FooterForm, AnnouncementBannerForm, SeoForm } from "@/components/founder/ContentForms";

export const metadata: Metadata = { title: "Website Content", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderContentPage() {
  await requireFounder();

  const [hero, about, careerGuidance, footer, banner, seo] = await Promise.all([
    getHeroContent(),
    getAboutContent(),
    getCareerGuidanceContent(),
    getFooterContent(),
    getAnnouncementBanner(),
    getSeoContent(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Website Content"
        description="Edit copy shown across the public site. Contact info and schedule live under Settings; pricing lives under Pricing."
        actions={
          <Link href="/founder/content/faq" className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-slate-200">
            Manage FAQ →
          </Link>
        }
      />
      <div className="space-y-6">
        <HeroForm initial={hero} />
        <AboutForm initial={about} />
        <CareerGuidanceForm initial={careerGuidance} />
        <FooterForm initial={footer} />
        <AnnouncementBannerForm initial={banner} />
        <SeoForm initial={seo} />
      </div>
    </div>
  );
}
