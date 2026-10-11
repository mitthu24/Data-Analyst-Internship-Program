import { Section, SectionHeading } from "@/components/Section";
import { ScrollReveal } from "@/components/ScrollReveal";
import { EnrollButton } from "@/components/EnrollButton";
import { PriceCard } from "@/components/PriceCard";
import { KpiCard } from "@/components/KpiCard";
import { SkillTicker } from "@/components/SkillTicker";
import { SessionCard } from "@/components/SessionCard";
import { ProjectCard } from "@/components/ProjectCard";
import { TrainerCard } from "@/components/TrainerCard";
import { MentorCard } from "@/components/MentorCard";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ButtonLink } from "@/components/Button";
import { getSettings } from "@/lib/content/settings";
import { getCurriculum } from "@/lib/content/curriculum";
import { getTrainers, getCorporateMentors } from "@/lib/content/trainers";
import { getProjects } from "@/lib/content/projects";
import { getFaqs } from "@/lib/content/faq";
import { getProgramStats } from "@/lib/content/stats";
import { getHeroContent } from "@/lib/content/site-content";

const audiences = [
  { icon: "🎓", title: "MBA Students", desc: "Every specialization — finance, marketing, HR, operations, and more." },
  { icon: "📘", title: "Graduates", desc: "BBA, B.Com, B.Sc., and other graduates building practical skills." },
  { icon: "💼", title: "Freshers & Job Seekers", desc: "Stand out with real analytics projects and tool fluency." },
  { icon: "👔", title: "Working Professionals", desc: "Add practical analytics skills alongside your current role." },
];

const careerPaths = [
  { icon: "📊", title: "Data Analyst", desc: "Entry-level analytics roles across industries." },
  { icon: "📈", title: "MIS Executive", desc: "Reporting, dashboards, and management information systems." },
  { icon: "📣", title: "Marketing Analytics", desc: "Campaign performance and business metrics for marketing specializations." },
  { icon: "💰", title: "Finance Analytics", desc: "Reporting and analysis roles for finance specializations." },
  { icon: "👥", title: "HR Analytics", desc: "People-data reporting for HR specializations." },
  { icon: "⚙️", title: "Operations Analytics", desc: "Process and performance reporting for operations specializations." },
];

export default async function HomePage() {
  const [settings, curriculum, trainers, corporateMentors, projects, faqs, programStats, hero] = await Promise.all([
    getSettings(),
    getCurriculum(),
    getTrainers(),
    getCorporateMentors(),
    getProjects(),
    getFaqs(),
    getProgramStats(),
    getHeroContent(),
  ]);
  const previewSessions = curriculum.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-10 text-white sm:py-14">
        <div className="absolute inset-0 bg-grid-overlay opacity-40 [mask-image:linear-gradient(135deg,rgba(0,0,0,.6),transparent_65%)]" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-electric-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                  📅 {settings.durationLabel} Program
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                  🎓 {settings.totalSessions} Sessions
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                  🛡️ {settings.refundWindowDays}-Day Money-Back Guarantee
                </span>
              </div>
              <h1 className="text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
                {hero.title}
              </h1>
              <p className="mt-3 max-w-xl text-base font-medium text-white/75 sm:text-lg">{hero.description}</p>
              <div className="mt-5 flex flex-wrap gap-4">
                <EnrollButton enrollmentUrl={settings.enrollmentUrl} label={hero.ctaLabel} />
                <ButtonLink href="/curriculum" variant="ghost">
                  {hero.secondaryCtaLabel}
                </ButtonLink>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
                <KpiCard value={`${settings.totalSessions}`} label="Total Sessions" />
                <KpiCard value={`${settings.totalHours}`} label="Instructional Hours" />
                <KpiCard value={`${settings.mentorSessions}`} label="Corporate Mentors" />
              </div>
            </div>

            <div>
              <PriceCard />
            </div>
          </div>
        </div>
      </section>

      <SkillTicker />

      {/* VERIFIED STATS */}
      <Section className="bg-slate-50 py-10 sm:py-14">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {programStats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-black text-emerald-600">{stat.value}</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* WHO SHOULD JOIN */}
      <Section>
        <SectionHeading
          eyebrow="Who Should Join"
          title="Built for Every Background"
          description="No prior analytics experience required — the program meets you where you are."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a, i) => (
            <ScrollReveal key={a.title} delayMs={i * 80}>
              <div className="h-full rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
                <span className="mb-3 block text-3xl">{a.icon}</span>
                <h3 className="mb-1 text-base font-bold">{a.title}</h3>
                <p className="text-sm text-white/70">{a.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* CURRICULUM PREVIEW */}
      <Section className="bg-slate-50">
        <SectionHeading
          eyebrow="Curriculum"
          title={`All ${settings.totalSessions} Sessions, 90 Minutes Each`}
          description={`${settings.coreClasses} core classes plus ${settings.mentorSessions} corporate expert mentoring sessions — ${settings.totalHours} instructional hours in total.`}
        />
        <div className="space-y-3">
          {previewSessions.map((session) => (
            <SessionCard key={session.classNumber} session={session} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/curriculum" variant="secondary">
            See All {settings.totalSessions} Sessions →
          </ButtonLink>
        </div>
      </Section>

      {/* TRAINERS & MENTORS */}
      <Section>
        <SectionHeading eyebrow="Trainers & Mentors" title="Learn From People Who Do This Work" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {trainers.map((trainer) => (
            <TrainerCard key={trainer.name} trainer={trainer} />
          ))}
        </div>
        <div className="mt-8">
          <h3 className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-slate-500">
            Corporate Expert Mentoring Sessions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {corporateMentors.map((m) => (
              <MentorCard key={m.session} mentor={m} />
            ))}
          </div>
        </div>
      </Section>

      {/* PROJECTS */}
      <Section className="bg-slate-50">
        <SectionHeading
          eyebrow="Practical Projects"
          title="Build a Real Portfolio"
          description="Planned example projects you work through during the program."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/projects" variant="secondary">
            View All Projects →
          </ButtonLink>
        </div>
      </Section>

      {/* CAREER PATHS */}
      <Section>
        <SectionHeading
          eyebrow="Career Paths"
          title="Relevant Across Specializations"
          description="See how analytics applies to your specific MBA specialization or background."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {careerPaths.map((c) => (
            <div key={c.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="mb-2 block text-2xl">{c.icon}</span>
              <h3 className="font-bold text-navy-900">{c.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/career-guidance" variant="secondary">
            Explore Career Guidance →
          </ButtonLink>
        </div>
      </Section>

      {/* REFUND OFFER */}
      <Section className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-4xl">🛡️</span>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">{settings.refundWindowDays}-Day Money-Back Guarantee</h2>
          <p className="mt-3 text-white/85">
            If you don&apos;t like the program or find it unsuitable within the first week, you get a 100% refund —
            subject to our founder-approved refund policy terms.
          </p>
          <ButtonLink href="/refund-policy" variant="secondary" className="mt-5">
            Read the Refund Policy
          </ButtonLink>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-slate-50">
        <SectionHeading eyebrow="FAQ" title="Common Questions" />
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={faqs.slice(0, 5)} />
          <div className="mt-6 text-center">
            <ButtonLink href="/faq" variant="secondary">
              View All FAQs →
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="bg-navy-950 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl">
            Reserve Your Seat for{" "}
            <span className="text-gradient-lime">₹{settings.pricing.enrollmentPaymentInr.toLocaleString("en-IN")}</span>
          </h2>
          <p className="mt-3 text-white/70">
            Launch price {settings.pricing.launchPriceInr && `₹${settings.pricing.launchPriceInr.toLocaleString("en-IN")}`} (reference ₹
            {settings.pricing.referencePriceInr.toLocaleString("en-IN")}). Seats are limited per batch.
          </p>
          <div className="mt-6 flex justify-center">
            <EnrollButton enrollmentUrl={settings.enrollmentUrl} />
          </div>
        </div>
      </Section>
    </>
  );
}
