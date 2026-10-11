import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { EnrollButton } from "@/components/EnrollButton";
import { getSettings } from "@/lib/content/settings";
import { getAboutContent } from "@/lib/content/site-content";

export const metadata: Metadata = {
  title: "About the Program",
  description: "Program overview and learning methodology for the Data Analyst Internship Program.",
};

const methodology = [
  { icon: "🧩", title: "Learn by doing", desc: "Every session pairs a concept with a hands-on exercise using corporate-style sample data." },
  { icon: "🏢", title: "Corporate scenarios", desc: "Topics are taught through practical examples drawn from real reporting and MIS workflows." },
  { icon: "📦", title: "Portfolio-first", desc: "You leave with deliverables — dashboards, queries, and automations — not just notes." },
  { icon: "🧑‍🏫", title: "Mentor access", desc: "Four dedicated corporate expert mentoring sessions complement the 21 core classes." },
];

export default async function AboutPage() {
  const [settings, about] = await Promise.all([getSettings(), getAboutContent()]);
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">About the Program</h1>
          <p className="mt-4 text-lg text-white/75">
            A {settings.durationLabel.toLowerCase()}, practical internship that takes you from fundamentals to a
            working analytics portfolio — {settings.totalSessions} sessions, {settings.totalHours} instructional
            hours.
          </p>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-5 text-slate-700">
          <p>{about.intro}</p>
          <p>
            Across {settings.coreClasses} core classes and {settings.mentorSessions} corporate expert mentoring
            sessions ({settings.totalSessions} sessions in total, {settings.classDurationMinutes} minutes each), you
            work through Advanced Excel, Power BI, SQL, automation tools, and AI-assisted dashboard building —
            always tied to a practical corporate example and a hands-on exercise.
          </p>
          <p>{settings.scheduleNote}</p>
        </div>
      </Section>

      <Section className="bg-slate-50">
        <SectionHeading eyebrow="Methodology" title="How You Learn" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {methodology.map((m) => (
            <div key={m.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="mb-3 block text-3xl">{m.icon}</span>
              <h3 className="font-bold text-navy-900">{m.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{m.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-navy-950 text-center text-white">
        <h2 className="text-2xl font-black sm:text-3xl">Ready to get started?</h2>
        <div className="mt-6 flex justify-center">
          <EnrollButton enrollmentUrl={settings.enrollmentUrl} />
        </div>
      </Section>
    </>
  );
}
