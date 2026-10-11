import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFounder } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db/prisma";
import { LoginForm } from "@/components/founder/LoginForm";
import { BookLogo } from "@/components/icons/BookLogo";

export const metadata: Metadata = { title: "Founder Login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderLoginPage() {
  const founder = await getCurrentFounder();
  if (founder) {
    redirect("/founder");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-electric-500">
            <BookLogo className="h-7 w-7 text-navy-950" />
          </span>
          <h1 className="text-xl font-bold text-white">Skillo — Founder Admin</h1>
          <p className="mt-1 text-sm text-white/50">Data Analyst Internship Program</p>
        </div>

        {!isDatabaseConfigured() && (
          <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
            The database is not configured in this environment yet. Login is disabled until{" "}
            <code className="text-amber-100">DATABASE_URL</code> is set — see{" "}
            <code className="text-amber-100">docs/DATABASE.md</code>.
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  );
}
