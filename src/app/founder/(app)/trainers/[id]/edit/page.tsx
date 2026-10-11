import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { TrainerForm } from "@/components/founder/TrainerForm";
import { updateTrainerAction } from "@/lib/actions/trainer-actions";
import { isUploadConfigured } from "@/lib/uploads/storage";

export const metadata: Metadata = { title: "Edit Trainer", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditTrainerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireFounder();
  const { id } = await params;
  const trainer = await prisma.trainer.findUnique({ where: { id } });
  if (!trainer) notFound();

  const backHref = trainer.isMentor ? "/founder/mentors" : "/founder/trainers";

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={`Edit: ${trainer.name}`} crumbs={[{ label: trainer.isMentor ? "Mentors" : "Trainers", href: backHref }, { label: trainer.name }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <TrainerForm action={updateTrainerAction.bind(null, id)} initial={trainer} lockMentorFlag={trainer.isMentor} uploadsConfigured={isUploadConfigured()} />
      </div>
    </div>
  );
}
