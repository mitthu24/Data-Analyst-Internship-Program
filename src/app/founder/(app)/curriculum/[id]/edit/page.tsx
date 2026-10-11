import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { CurriculumForm } from "@/components/founder/CurriculumForm";
import { updateCurriculumSessionAction } from "@/lib/actions/curriculum-actions";

export const metadata: Metadata = { title: "Edit Session", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditCurriculumSessionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireFounder();
  const { id } = await params;

  const [session, trainers] = await Promise.all([
    prisma.curriculumSession.findUnique({ where: { id } }),
    prisma.trainer.findMany({ select: { id: true, name: true, isMentor: true }, orderBy: { name: "asc" } }),
  ]);

  if (!session) notFound();

  const updateAction = updateCurriculumSessionAction.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={`Edit: ${session.title}`}
        crumbs={[{ label: "Curriculum", href: "/founder/curriculum" }, { label: `Class ${session.classNumber}` }]}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <CurriculumForm action={updateAction} initial={session} trainers={trainers} />
      </div>
    </div>
  );
}
