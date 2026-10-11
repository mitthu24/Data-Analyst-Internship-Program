import { requireFounder } from "@/lib/auth/guard";
import { Sidebar } from "@/components/founder/Sidebar";
import { MustChangePasswordBanner } from "@/components/founder/MustChangePasswordBanner";

export const dynamic = "force-dynamic";

export default async function FounderAppLayout({ children }: { children: React.ReactNode }) {
  // This call is the real authorization boundary for every nested /founder
  // page — it re-verifies the session against the database on every request.
  const founder = await requireFounder();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar email={founder.email} />
      <div className="flex min-w-0 flex-1 flex-col">
        {founder.mustChangePassword && <MustChangePasswordBanner />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
