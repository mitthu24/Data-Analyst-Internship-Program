import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { getTestimonials } from "@/lib/content/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Approved student testimonials for the Skillo Academy Placement-Oriented Internship Program.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Testimonials</h1>
          <p className="mt-4 text-lg text-white/75">Only approved, genuine student testimonials are shown here.</p>
        </div>
      </section>

      <Section>
        {testimonials.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <span className="mb-3 block text-4xl">💬</span>
            <h2 className="text-lg font-bold text-navy-900">No testimonials published yet</h2>
            <p className="mt-2 text-sm text-slate-600">
              This program is new — approved testimonials will appear here as students complete the internship and
              share feedback.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.studentName} className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm italic text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-bold text-navy-900">{t.studentName}</p>
                {t.role && <p className="text-xs text-slate-500">{t.role}</p>}
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
