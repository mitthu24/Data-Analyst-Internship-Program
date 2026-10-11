import type { Metadata } from "next";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { CurriculumForm } from "@/components/founder/CurriculumForm";
import { createCurriculumSessionAction } from "@/lib/actions/curriculum-actions";

export const metadata: Metadata = { title: "Add Session", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewCurriculumSessionPage() {
  await requireFounder();
  const trainers = await prisma.trainer.findMany({ select: { id: true, name: true, isMentor: true }, orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Add Curriculum Session" crumbs={[{ label: "Curriculum", href: "/founder/curriculum" }, { label: "New" }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <CurriculumForm action={createCurriculumSessionAction} trainers={trainers} />
      </div>
    </div>
  );
}
