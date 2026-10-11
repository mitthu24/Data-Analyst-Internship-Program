import type { Metadata } from "next";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { ProgramSettingsForm } from "@/components/founder/ProgramSettingsForm";

export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderSettingsPage() {
  await requireFounder();
  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Program Settings" description="Schedule, duration, and contact details shown across the public site." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <ProgramSettingsForm initial={settings} />
      </div>
    </div>
  );
}
