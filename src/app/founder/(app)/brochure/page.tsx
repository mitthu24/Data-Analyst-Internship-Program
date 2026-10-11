import type { Metadata } from "next";
import Link from "next/link";
import { requireFounder } from "@/lib/auth/guard";
import { PageHeader } from "@/components/founder/PageHeader";
import { BrochureForm } from "@/components/founder/BrochureForm";
import { getBrochureContent } from "@/lib/content/site-content";

export const metadata: Metadata = { title: "Brochure", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const relatedLinks = [
  { label: "Pricing & enrollment details", href: "/founder/pricing" },
  { label: "Trainer & mentor profiles", href: "/founder/trainers" },
  { label: "Curriculum sessions", href: "/founder/curriculum" },
  { label: "Refund policy wording", href: "/founder/pricing" },
  { label: "Contact details", href: "/founder/settings" },
];

export default async function FounderBrochurePage() {
  await requireFounder();
  const brochure = await getBrochureContent();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Brochure"
        description="The printable brochure pulls its curriculum, trainers, pricing, and policy text live from the rest of the admin panel."
        actions={
          <a href="/brochure" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-slate-200">
            Preview Brochure →
          </a>
        }
      />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Brochure-specific settings</h2>
        <BrochureForm initial={brochure} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Content pulled from elsewhere</h2>
        <ul className="space-y-2 text-sm">
          {relatedLinks.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="font-semibold text-electric-600 hover:underline">
                {l.label} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
