import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { CurriculumExplorer } from "@/components/CurriculumExplorer";
import { getSettings } from "@/lib/content/settings";
import { getCurriculum } from "@/lib/content/curriculum";

export const metadata: Metadata = {
  title: "Curriculum",
  description: "The full 25-session Data Analyst Internship Program curriculum.",
};

export default async function CurriculumPage() {
  const [settings, curriculum] = await Promise.all([getSettings(), getCurriculum()]);

  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Complete Curriculum</h1>
          <p className="mt-4 text-lg text-white/75">
            {curriculum.length} sessions | {settings.classDurationMinutes} minutes per session |{" "}
            {settings.totalHours} instructional hours | {settings.durationLabel} program
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/55">{settings.scheduleNote}</p>
        </div>
      </section>

      <Section>
        <SectionHeading
          title="Filter by Module"
          description="Expand any session to see topics, a practical example, the hands-on exercise, and the expected deliverable."
        />
        <CurriculumExplorer curriculum={curriculum} />
      </Section>
    </>
  );
}
