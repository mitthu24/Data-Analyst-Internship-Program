import type { Metadata } from "next";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { PricingSettingsForm } from "@/components/founder/PricingSettingsForm";

export const metadata: Metadata = { title: "Pricing", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderPricingPage() {
  await requireFounder();
  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div>
      <PageHeader
        title="Pricing"
        description="Changes here flow into the homepage, brochure, and refund policy page after you save."
      />
      <PricingSettingsForm initial={settings} />
    </div>
  );
}
