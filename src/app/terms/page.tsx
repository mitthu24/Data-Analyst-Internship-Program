import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { getSettings } from "@/lib/content/settings";

export const metadata: Metadata = {
  title: "Terms",
  description: "Program terms for the Data Analyst Internship Program.",
};

export default async function TermsPage() {
  const settings = await getSettings();
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-14 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Program Terms</h1>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-6 text-slate-700 leading-relaxed">
          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Program structure</h2>
            <p>
              The Data Analyst Internship Program is an {settings.durationLabel.toLowerCase()} program consisting of{" "}
              {settings.totalSessions} sessions ({settings.coreClasses} core classes and {settings.mentorSessions}{" "}
              corporate expert mentoring sessions), each {settings.classDurationMinutes} minutes long, for a total of{" "}
              {settings.totalHours} instructional hours. {settings.scheduleNote}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Enrollment and payment</h2>
            <p>
              Enrollment begins with an initial payment of ₹{settings.pricing.enrollmentPaymentInr.toLocaleString("en-IN")}{" "}
              to reserve your seat, against a launch price of ₹{settings.pricing.launchPriceInr.toLocaleString("en-IN")}{" "}
              (reference price ₹{settings.pricing.referencePriceInr.toLocaleString("en-IN")}). The remaining payment
              terms are confirmed by the organizer at the time of enrollment.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Refunds</h2>
            <p>
              A {settings.refundWindowDays}-day, 100% money-back guarantee applies — see our{" "}
              <a href="/refund-policy" className="font-semibold text-emerald-600">Refund Policy</a> for full terms.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">No employment guarantee</h2>
            <p>
              This program provides practical training, projects, and career guidance. It does not guarantee
              employment, job placement, or any specific salary outcome.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Mentor and schedule changes</h2>
            <p>
              Mentor assignments for sessions not yet confirmed, and the exact daily schedule for a batch, may be
              updated by the founder before the batch begins.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Code of conduct</h2>
            <p>
              Participants are expected to engage respectfully with trainers, mentors, and fellow participants
              throughout the program.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Changes to these terms</h2>
            <p>We may update these terms from time to time. Material changes will be communicated to enrolled participants.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
