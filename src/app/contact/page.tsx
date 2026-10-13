import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { getSettings, formatInr } from "@/lib/content/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about the Skillo Academy Placement-Oriented Internship Program.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-white/75">
            Have a question before enrolling? Send us a message and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      <Section>
        <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 text-xl font-bold text-navy-900">Send an inquiry</h2>
            <ContactForm />
          </div>
          <div>
            <h2 className="mb-3 text-xl font-bold text-navy-900">Ready to enroll?</h2>
            <p className="mb-4 text-sm text-slate-600">
              Reserve your seat directly through our enrollment link — the initial payment is{" "}
              {formatInr(settings.pricing.enrollmentPaymentInr)}.
            </p>
            <a
              href={settings.enrollmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500"
            >
              Go to Enrollment Page
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
