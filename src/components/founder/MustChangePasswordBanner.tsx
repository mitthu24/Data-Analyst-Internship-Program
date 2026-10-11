import Link from "next/link";

export function MustChangePasswordBanner() {
  return (
    <div className="border-b border-amber-300 bg-amber-100 px-4 py-2.5 text-center text-sm font-semibold text-amber-900 sm:px-6">
      You&apos;re signed in with the bootstrap password. For security, please{" "}
      <Link href="/founder/security" className="underline">
        set a new password
      </Link>{" "}
      before this account is treated as fully configured.
    </div>
  );
}
