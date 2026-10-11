import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";
import { generateQrDataUrl } from "@/lib/qr";
import { getSettings, formatInr } from "@/lib/content/settings";
import { getCurriculum, modules } from "@/lib/content/curriculum";
import { getTrainers, getCorporateMentors } from "@/lib/content/trainers";
import { getProjects } from "@/lib/content/projects";
import { getBrochureContent } from "@/lib/content/site-content";

export const metadata: Metadata = {
  title: "Brochure",
  description: "Download the printable Data Analyst Internship Program brochure.",
};

export default async function BrochurePage() {
  const [settings, curriculum, trainers, corporateMentors, projects, brochure] = await Promise.all([
    getSettings(),
    getCurriculum(),
    getTrainers(),
    getCorporateMentors(),
    getProjects(),
    getBrochureContent(),
  ]);

  if (!brochure.visible) notFound();

  const allTools = Array.from(new Set(curriculum.flatMap((s) => s.tools))).filter(Boolean);
  const qrDataUrl = await generateQrDataUrl(settings.enrollmentUrl);

  return (
    <div className="bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 flex max-w-[210mm] items-center justify-between px-4">
        <p className="text-sm font-semibold text-slate-600">
          Printable, A4-formatted brochure — use the button to save as PDF.
        </p>
        <PrintButton />
      </div>

      <div className="mx-auto max-w-[210mm] space-y-6 print:space-y-0">
        {/* PAGE 1 — COVER */}
        <section className="print-page relative mx-auto min-h-[297mm] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-10 text-white shadow-xl print:rounded-none print:p-[15mm] print:shadow-none">
          <div className="absolute inset-0 bg-grid-overlay opacity-20" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wide text-lime-400">
                  Official Program Brochure
                </span>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold">
                  {new Date().getFullYear()}
                </span>
              </div>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                Data Analyst <span className="text-gradient-lime">Internship Program</span>
              </h1>
              <p className="mt-4 max-w-md text-white/75">
                An {settings.durationLabel.toLowerCase()}, practical analytics internship for MBA students,
                graduates, freshers, and working professionals — {settings.totalSessions} sessions,{" "}
                {settings.totalHours} instructional hours.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-center">
                  <div className="text-2xl font-black text-lime-400">{settings.totalSessions}</div>
                  <div className="text-[11px] font-semibold text-white/60">Sessions</div>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-center">
                  <div className="text-2xl font-black text-lime-400">{settings.totalHours}</div>
                  <div className="text-[11px] font-semibold text-white/60">Hours</div>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-center">
                  <div className="text-2xl font-black text-lime-400">{settings.mentorSessions}</div>
                  <div className="text-[11px] font-semibold text-white/60">Mentor Sessions</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 p-5 text-navy-950">
              <div className="border-r border-navy-950/20 pr-6 text-center">
                <p className="text-xs font-bold uppercase">Launch Price</p>
                <p className="text-3xl font-black">{formatInr(settings.pricing.launchPriceInr)}</p>
                <p className="text-xs font-semibold line-through opacity-60">
                  {formatInr(settings.pricing.referencePriceInr)}
                </p>
              </div>
              <div className="text-sm font-semibold">
                <p className="font-bold">Reserve with {formatInr(settings.pricing.enrollmentPaymentInr)}</p>
                <p className="opacity-80">
                  Initial enrollment payment — remaining terms confirmed by the organizer.
                </p>
                <p className="mt-1 opacity-80">{settings.refundWindowDays}-day money-back guarantee.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 2 — ABOUT + CURRICULUM */}
        <section className="print-page min-h-[297mm] w-full rounded-2xl bg-white p-10 shadow-xl print:rounded-none print:p-[15mm] print:shadow-none">
          <h2 className="mb-3 text-2xl font-black text-navy-900">About the Program</h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600">
            {brochure.introOverride ||
              `Built for MBA students from every specialization, BBA/B.Com/B.Sc. and other graduates, freshers, job seekers, and working professionals. ${settings.scheduleNote}`}
          </p>

          <h2 className="mb-3 text-2xl font-black text-navy-900">
            Complete Curriculum — {curriculum.length} Sessions
          </h2>
          <div className="space-y-5">
            {modules.map((mod) => {
              const sessions = curriculum.filter((s) => s.module === mod);
              if (sessions.length === 0) return null;
              return (
                <div key={mod} className="print-avoid-break">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-600">{mod}</h3>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {sessions.map((s) => (
                      <div key={s.classNumber} className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2">
                        <span className="shrink-0 text-xs font-black text-slate-400">
                          {String(s.classNumber).padStart(2, "0")}
                        </span>
                        <span className="text-xs font-semibold text-navy-900">{s.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-400">
            {curriculum.length} sessions | 90 minutes per session | {settings.totalHours} instructional hours |{" "}
            {settings.durationLabel} program.
          </p>
        </section>

        {/* PAGE 3 — TRAINERS + PROJECTS + TOOLS */}
        <section className="print-page min-h-[297mm] w-full rounded-2xl bg-white p-10 shadow-xl print:rounded-none print:p-[15mm] print:shadow-none">
          <h2 className="mb-3 text-2xl font-black text-navy-900">Trainers & Corporate Mentors</h2>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {trainers.map((t) => (
              <div key={t.name} className="rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-sm font-bold text-navy-900">{t.name}</p>
                <p className="text-xs font-semibold text-emerald-600">{t.role}</p>
                {t.company && <p className="text-[11px] text-slate-500">{t.company}</p>}
              </div>
            ))}
          </div>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {corporateMentors.map((m) => (
              <div key={m.session} className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-[11px] font-bold text-emerald-600">{m.session}</p>
                <p className="text-xs font-bold text-navy-900">{m.name}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-3 text-2xl font-black text-navy-900">Practical Projects</h2>
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {projects.map((p) => (
              <div key={p.title} className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-navy-900">
                {p.title}
              </div>
            ))}
          </div>

          <h2 className="mb-3 text-2xl font-black text-navy-900">Skills & Tools Covered</h2>
          <div className="flex flex-wrap gap-2">
            {allTools.map((tool) => (
              <span key={tool} className="rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-lime-400">
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* PAGE 4 — SCHEDULE + PRICING + ENROLL */}
        <section className="print-page flex min-h-[297mm] w-full flex-col justify-between rounded-2xl bg-gradient-to-br from-navy-950 to-navy-900 p-10 text-white shadow-xl print:rounded-none print:p-[15mm] print:shadow-none">
          <div>
            <h2 className="mb-4 text-2xl font-black">8-Week Schedule Format</h2>
            <p className="mb-6 text-sm text-white/70">{settings.scheduleNote}</p>

            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <p className="text-xl font-black text-lime-400">{settings.durationLabel}</p>
                <p className="text-[11px] text-white/60">Duration</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <p className="text-xl font-black text-lime-400">{settings.totalSessions}</p>
                <p className="text-[11px] text-white/60">Total Sessions</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <p className="text-xl font-black text-lime-400">90 min</p>
                <p className="text-[11px] text-white/60">Per Session</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <p className="text-xl font-black text-lime-400">{settings.totalHours}</p>
                <p className="text-[11px] text-white/60">Total Hours</p>
              </div>
            </div>

            <div className="rounded-xl border border-lime-400/30 bg-lime-400/10 p-4 text-sm font-semibold text-lime-100">
              🛡️ {settings.refundWindowDays}-day, 100% money-back guarantee if you find the program unsuitable in
              week one — see our Refund Policy for full terms.
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase text-white/50">Enroll Now</p>
              <p className="text-3xl font-black">
                {formatInr(settings.pricing.launchPriceInr)}{" "}
                <span className="text-base font-semibold text-white/40 line-through">
                  {formatInr(settings.pricing.referencePriceInr)}
                </span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                Reserve with an initial payment of {formatInr(settings.pricing.enrollmentPaymentInr)}. Remaining
                payment terms are confirmed by the organizer at enrollment.
              </p>
              <p className="mt-3 break-all text-xs font-semibold text-lime-400">{settings.enrollmentUrl}</p>
            </div>
            <div className="flex flex-col items-center gap-2 justify-self-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR code to the enrollment page" width={140} height={140} className="rounded-lg bg-white p-2" />
              <p className="text-center text-[11px] font-semibold text-white/60">Scan to enroll</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
