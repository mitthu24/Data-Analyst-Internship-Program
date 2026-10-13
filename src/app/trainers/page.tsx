import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { TrainerCard } from "@/components/TrainerCard";
import { MentorCard } from "@/components/MentorCard";
import { getTrainers, getCorporateMentors } from "@/lib/content/trainers";

export const metadata: Metadata = {
  title: "Trainers & Mentors",
  description: "Meet the trainers and corporate mentors of the Skillo Academy Placement-Oriented Internship Program.",
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
            <MentorCard key={m.session} mentor={m} />
          ))}
        </div>
      </Section>
    </>
  );
}
