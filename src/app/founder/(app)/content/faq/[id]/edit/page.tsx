import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { FaqForm } from "@/components/founder/FaqForm";
import { updateFaqAction } from "@/lib/actions/faq-actions";

export const metadata: Metadata = { title: "Edit FAQ", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  await requireFounder();
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Edit FAQ" crumbs={[{ label: "FAQ", href: "/founder/content/faq" }, { label: "Edit" }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FaqForm action={updateFaqAction.bind(null, id)} initial={faq} />
      </div>
    </div>
  );
}
