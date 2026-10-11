import type { Metadata } from "next";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { ChangePasswordForm, ChangeEmailForm, RevokeSessionsButton } from "@/components/founder/SecurityForms";

export const metadata: Metadata = { title: "Security", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderSecurityPage() {
  const founder = await requireFounder();

  const [activeSessions, recentEvents] = await Promise.all([
    prisma.session.count({ where: { founderId: founder.id, revokedAt: null, expiresAt: { gt: new Date() } } }),
    prisma.auditEvent.findMany({ where: { founderId: founder.id }, orderBy: { createdAt: "desc" }, take: 15 }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Security" description="Manage your founder account's credentials and active sessions." />

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-bold text-navy-900">Change Password</h2>
        <ChangePasswordForm />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-bold text-navy-900">Change Email</h2>
        <ChangeEmailForm currentEmail={founder.email} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-1 text-base font-bold text-navy-900">Active Sessions</h2>
        <p className="mb-4 text-sm text-slate-500">{activeSessions} active session(s) for this account.</p>
        <RevokeSessionsButton />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-bold text-navy-900">Recent Security Activity</h2>
        {recentEvents.length === 0 ? (
          <p className="text-sm text-slate-400">No activity recorded yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {recentEvents.map((e) => (
              <li key={e.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
                <span className="font-semibold text-navy-900">{e.action}</span>
                <span className="text-xs text-slate-400">{e.createdAt.toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
