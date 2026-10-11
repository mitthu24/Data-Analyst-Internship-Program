import type { Metadata } from "next";
import { requireFounder } from "@/lib/auth/guard";
import { PageHeader } from "@/components/founder/PageHeader";
import { TestimonialForm } from "@/components/founder/TestimonialForm";
import { createTestimonialAction } from "@/lib/actions/testimonial-actions";

export const metadata: Metadata = { title: "Add Testimonial", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  await requireFounder();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Add Testimonial" crumbs={[{ label: "Testimonials", href: "/founder/testimonials" }, { label: "New" }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <TestimonialForm action={createTestimonialAction} />
      </div>
    </div>
  );
}
