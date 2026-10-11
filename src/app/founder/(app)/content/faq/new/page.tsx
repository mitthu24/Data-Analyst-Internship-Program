import type { Metadata } from "next";
import { requireFounder } from "@/lib/auth/guard";
import { PageHeader } from "@/components/founder/PageHeader";
import { FaqForm } from "@/components/founder/FaqForm";
import { createFaqAction } from "@/lib/actions/faq-actions";

export const metadata: Metadata = { title: "Add FAQ", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewFaqPage() {
  await requireFounder();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Add FAQ" crumbs={[{ label: "FAQ", href: "/founder/content/faq" }, { label: "New" }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FaqForm action={createFaqAction} />
      </div>
    </div>
  );
}
