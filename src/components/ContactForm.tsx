"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      specialization: fd.get("specialization"),
      profile: fd.get("profile") || undefined,
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      // Honeypot field — left blank by real visitors, filled by most bots.
      website: fd.get("website"),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-bold text-navy-900">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-bold text-navy-900">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-bold text-navy-900">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>
      <div>
        <label htmlFor="specialization" className="mb-1 block text-sm font-bold text-navy-900">
          Education / MBA specialization
        </label>
        <input
          id="specialization"
          name="specialization"
          type="text"
          placeholder="e.g. MBA Finance, B.Com, B.Tech"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>
      <div>
        <label htmlFor="profile" className="mb-1 block text-sm font-bold text-navy-900">
          You are a...
        </label>
        <select
          id="profile"
          name="profile"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Prefer not to say</option>
          <option value="STUDENT">Student</option>
          <option value="FRESHER">Fresher</option>
          <option value="WORKING_PROFESSIONAL">Working Professional</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-bold text-navy-900">
          Message (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Honeypot: hidden from real users via CSS, so only bots fill it in. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-2 text-xs font-medium text-slate-600">
        <input id="consent" name="consent" type="checkbox" required className="mt-0.5" />
        I consent to being contacted about this program and to the processing of the information above as
        described in the{" "}
        <a href="/privacy-policy" className="font-semibold text-emerald-600">
          Privacy Policy
        </a>
        .
      </label>

      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
