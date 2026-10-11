import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { TestimonialForm } from "@/components/founder/TestimonialForm";
import { updateTestimonialAction } from "@/lib/actions/testimonial-actions";

export const metadata: Metadata = { title: "Edit Testimonial", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  await requireFounder();
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={`Edit: ${testimonial.studentName}`} crumbs={[{ label: "Testimonials", href: "/founder/testimonials" }, { label: testimonial.studentName }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <TestimonialForm action={updateTestimonialAction.bind(null, id)} initial={testimonial} />
      </div>
    </div>
  );
}
