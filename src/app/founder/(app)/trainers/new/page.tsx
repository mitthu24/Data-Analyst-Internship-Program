import type { Metadata } from "next";
import { requireFounder } from "@/lib/auth/guard";
import { PageHeader } from "@/components/founder/PageHeader";
import { TrainerForm } from "@/components/founder/TrainerForm";
import { createTrainerAction } from "@/lib/actions/trainer-actions";
import { isUploadConfigured } from "@/lib/uploads/storage";

export const metadata: Metadata = { title: "Add Trainer", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewTrainerPage() {
  await requireFounder();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Add Trainer" crumbs={[{ label: "Trainers", href: "/founder/trainers" }, { label: "New" }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <TrainerForm action={createTrainerAction} uploadsConfigured={isUploadConfigured()} />
      </div>
    </div>
  );
}
