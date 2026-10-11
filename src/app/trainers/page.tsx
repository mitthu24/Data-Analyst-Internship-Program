import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { TrainerCard } from "@/components/TrainerCard";
import { getTrainers, getCorporateMentors } from "@/lib/content/trainers";

export const metadata: Metadata = {
  title: "Trainers & Mentors",
  description: "Meet the trainers and corporate mentors of the Data Analyst Internship Program.",
};

export default async function TrainersPage() {
  const [trainers, corporateMentors] = await Promise.all([getTrainers(), getCorporateMentors()]);
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Trainers & Corporate Mentors</h1>
          <p className="mt-4 text-lg text-white/75">
            Meet the trainers and corporate mentors running the program.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow="Core Trainers" title="Who Teaches the Program" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {trainers.map((trainer) => (
            <TrainerCard key={trainer.name} trainer={trainer} />
          ))}
        </div>
      </Section>

      <Section className="bg-slate-50">
        <SectionHeading
          eyebrow="Corporate Expert Mentoring"
          title="4 Sessions With Industry Practitioners"
          description="Two mentors are confirmed; the remaining two sessions can still be reassigned by the founder."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {corporateMentors.map((m) => (
            <div key={m.session} className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <span
                className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                  m.assigned ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {m.session}
              </span>
              <h3 className="font-bold text-navy-900">{m.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{m.title}</p>
              <p className="mt-3 text-sm text-slate-600">{m.topic}</p>
              {!m.assigned && (
                <p className="mt-2 text-xs font-semibold text-amber-600">Mentor and topic to be confirmed</p>
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
