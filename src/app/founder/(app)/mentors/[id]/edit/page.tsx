// Mentors are just Trainer rows with isMentor=true, so editing reuses the
// same form and logic as /founder/trainers/[id]/edit (route-segment config
// exports like `dynamic` cannot be re-exported from another file, so this
// page is duplicated rather than imported).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { TrainerForm } from "@/components/founder/TrainerForm";
import { updateTrainerAction } from "@/lib/actions/trainer-actions";
import { isUploadConfigured } from "@/lib/uploads/storage";

export const metadata: Metadata = { title: "Edit Mentor", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditMentorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireFounder();
  const { id } = await params;
  const trainer = await prisma.trainer.findUnique({ where: { id } });
  if (!trainer) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={`Edit: ${trainer.name}`} crumbs={[{ label: "Mentors", href: "/founder/mentors" }, { label: trainer.name }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <TrainerForm action={updateTrainerAction.bind(null, id)} initial={trainer} lockMentorFlag uploadsConfigured={isUploadConfigured()} />
      </div>
    </div>
  );
}
