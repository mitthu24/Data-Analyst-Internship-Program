import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { EnrollButton } from "@/components/EnrollButton";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for your interest in the Data Analyst Internship Program.",
};

export default function ThankYouPage() {
  return (
    <Section className="min-h-[60vh]">
      <div className="mx-auto max-w-lg text-center">
        <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          ✅
        </span>
        <h1 className="text-3xl font-black text-navy-900 sm:text-4xl">Thank You!</h1>
        <p className="mt-4 text-slate-600">
          We&apos;ve received your inquiry and will get back to you soon. If you&apos;re ready to reserve your seat,
          you can enroll now with the initial ₹499 payment.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <EnrollButton />
          <ButtonLink href="/" variant="secondary">
            Back to Homepage
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
