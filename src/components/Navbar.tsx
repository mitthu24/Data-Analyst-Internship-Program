"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { mainNav } from "@/lib/content/nav";
import { EnrollButton } from "./EnrollButton";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-white" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-electric-500 font-black">
            DA
          </span>
          <span className="text-sm font-extrabold leading-tight sm:text-base">
            Data Analyst
            <br className="sm:hidden" /> Internship Program
          </span>
        </Link>

        <div className="hidden items-center gap-4 xl:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "whitespace-nowrap text-sm font-semibold transition-colors hover:text-lime-400",
                pathname === item.href ? "text-lime-400" : "text-white/75",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden xl:block">
          <EnrollButton label="Enroll — ₹499" />
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white xl:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-navy-950 px-4 py-4 xl:hidden">
          <div className="flex flex-col gap-3">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-lg px-3 py-2 text-sm font-semibold",
                  pathname === item.href ? "bg-white/10 text-lime-400" : "text-white/80",
                )}
              >
                {item.label}
              </Link>
            ))}
            <EnrollButton className="mt-2 w-full" label="Enroll — ₹499" />
          </div>
        </div>
      )}
    </header>
  );
}
