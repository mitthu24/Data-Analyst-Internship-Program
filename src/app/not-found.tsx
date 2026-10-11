import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-black text-navy-900">404</h1>
      <p className="mt-3 text-lg text-slate-600">This page could not be found.</p>
      <Link href="/" className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500">
        Back to Homepage
      </Link>
    </div>
  );
}
