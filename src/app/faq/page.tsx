import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { FaqAccordion } from "@/components/FaqAccordion";
import { getFaqs } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about the Data Analyst Internship Program.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Frequently Asked Questions</h1>
        </div>
      </section>

      <Section>
        <SectionHeading title="Everything You Need to Know" />
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={faqs} />
        </div>
      </Section>
    </>
  );
}
