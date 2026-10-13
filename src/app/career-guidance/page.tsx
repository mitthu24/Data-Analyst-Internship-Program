import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { EnrollButton } from "@/components/EnrollButton";
import { getSettings } from "@/lib/content/settings";
import { getCareerGuidanceContent } from "@/lib/content/site-content";

export const metadata: Metadata = {
  title: "Career Guidance",
  description: "Career paths and corporate readiness guidance from the Skillo Academy Placement-Oriented Internship Program.",
};

const specializationPaths = [
  { icon: "💰", specialization: "Finance", roles: ["Financial Reporting Analyst", "MIS Executive — Finance"] },
  { icon: "📣", specialization: "Marketing", roles: ["Marketing Analyst", "Campaign Performance Reporting"] },
  { icon: "👥", specialization: "HR", roles: ["HR Analytics Associate", "People Reporting Executive"] },
  { icon: "⚙️", specialization: "Operations", roles: ["Operations Reporting Analyst", "Process MIS Executive"] },
  { icon: "🛒", specialization: "Sales / Retail", roles: ["Sales Analyst", "Retail Reporting Executive"] },
  { icon: "🏭", specialization: "General Management", roles: ["Business Analyst", "Data Analyst (Entry-Level)"] },
];

const readinessSkills = [
  { title: "Stakeholder communication", desc: "Present findings clearly to non-technical decision-makers." },
  { title: "Reporting cycles", desc: "Understand how and when businesses expect recurring reports." },
  { title: "Portfolio presentation", desc: "Explain your projects the way an interviewer expects." },
  { title: "Professional behaviour", desc: "Corporate etiquette and working norms covered in Class 21." },
];

export default async function CareerGuidancePage() {
  const [settings, careerGuidance] = await Promise.all([getSettings(), getCareerGuidanceContent()]);
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Career Guidance</h1>
          <p className="mt-4 text-lg text-white/75">{careerGuidance.intro}</p>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="By Specialization"
          title="Where Analytics Skills Apply"
          description="A starting point for connecting your specialization to an analytics-adjacent role."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {specializationPaths.map((p) => (
            <div key={p.specialization} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="mb-2 block text-3xl">{p.icon}</span>
              <h3 className="font-bold text-navy-900">{p.specialization}</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {p.roles.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-emerald-500">→</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-slate-500">
          These are illustrative directions, not guaranteed roles — eligibility and outcomes depend on your
          background, performance, and the job market.
        </p>
      </Section>

      <Section className="bg-slate-50">
        <SectionHeading eyebrow="Corporate Readiness" title="What Class 21 Covers" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {readinessSkills.map((s) => (
            <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-navy-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-navy-950 text-center text-white">
        <h2 className="text-2xl font-black sm:text-3xl">Build a career-ready portfolio in 8 weeks</h2>
        <div className="mt-6 flex justify-center">
          <EnrollButton enrollmentUrl={settings.enrollmentUrl} />
        </div>
      </Section>
    </>
  );
}
