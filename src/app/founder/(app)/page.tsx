import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/founder/PageHeader";
import { StatCard } from "@/components/founder/StatCard";
import { prisma, checkDatabaseHealth } from "@/lib/db/prisma";
import { requireFounder } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderDashboardPage() {
  // The (app) layout also guards this route, but Next.js can render a
  // page's subtree in parallel with its layout, so the layout check alone
  // is not a hard boundary — every founder page must re-verify itself
  // before doing any data fetching or rendering.
  await requireFounder();

  const dbHealth = await checkDatabaseHealth();

  const [
    totalLeads,
    newLeads,
    publishedProjects,
    totalProjects,
    publishedTrainers,
    publishedMentors,
    publishedSessions,
    totalSessions,
    recentEvents,
  ] = dbHealth.ok
    ? await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: "NEW" } }),
        prisma.project.count({ where: { status: "PUBLISHED" } }),
        prisma.project.count(),
        prisma.trainer.count({ where: { status: "PUBLISHED", isMentor: false } }),
        prisma.trainer.count({ where: { status: "PUBLISHED", isMentor: true } }),
        prisma.curriculumSession.count({ where: { status: "PUBLISHED" } }),
        prisma.curriculumSession.count(),
        prisma.auditEvent.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { founder: true } }),
      ])
    : [0, 0, 0, 0, 0, 0, 0, 0, []];

  return (
    <div>
      <PageHeader title="Dashboard" description="A live snapshot of the public site's database-backed content." />

      {!dbHealth.ok && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          Database connection unavailable: {dbHealth.error}. Counts below are shown as zero until it is reconnected.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Leads" value={totalLeads} hint={`${newLeads} new`} />
        <StatCard label="Published Projects" value={publishedProjects} hint={`${totalProjects} total`} />
        <StatCard label="Published Trainers" value={publishedTrainers} />
        <StatCard label="Published Mentors" value={publishedMentors} />
        <StatCard label="Published Sessions" value={publishedSessions} hint={`${totalSessions} total`} />
        <StatCard label="Database" value={dbHealth.ok ? "Connected" : "Offline"} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <Link href="/founder/leads" className="rounded-lg bg-slate-100 px-3 py-2 hover:bg-slate-200">
              View Leads →
            </Link>
            <Link href="/founder/curriculum" className="rounded-lg bg-slate-100 px-3 py-2 hover:bg-slate-200">
              Edit Curriculum →
            </Link>
            <Link href="/founder/pricing" className="rounded-lg bg-slate-100 px-3 py-2 hover:bg-slate-200">
              Update Pricing →
            </Link>
            <Link href="/founder/brochure" className="rounded-lg bg-slate-100 px-3 py-2 hover:bg-slate-200">
              Review Brochure →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Recent Activity</h2>
          {recentEvents.length === 0 ? (
            <p className="text-sm text-slate-400">No administrative activity recorded yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentEvents.map((event) => (
                <li key={event.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
                  <span className="font-semibold text-navy-900">{event.action}</span>
                  <span className="text-xs text-slate-400">{event.createdAt.toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
