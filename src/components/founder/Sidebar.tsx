"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { founderNav } from "@/lib/founder-nav";
import { logoutAction } from "@/lib/actions/auth-actions";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {founderNav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
              active ? "bg-emerald-500/15 text-emerald-400" : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 bg-navy-950 px-4 py-3 lg:hidden">
        <Link href="/founder" className="flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-electric-500 text-xs font-black">
            DA
          </span>
          <span className="text-sm font-bold">Founder Admin</span>
        </Link>
        <button
          type="button"
          aria-label="Toggle admin menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-navy-950 p-4 lg:flex">
        <Link href="/founder" className="mb-6 flex items-center gap-2 px-2 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-electric-500 font-black">
            DA
          </span>
          <span className="text-sm font-bold leading-tight">
            Founder Admin
            <br />
            <span className="font-normal text-white/40">{email}</span>
          </span>
        </Link>
        <NavLinks />
        <form action={logoutAction} className="mt-4 border-t border-white/10 pt-4">
          <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white">
            ↩ Sign out
          </button>
        </form>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative flex w-72 flex-col bg-navy-950 p-4">
            <div className="mb-6 flex items-center justify-between px-2">
              <span className="text-sm font-bold text-white">{email}</span>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="text-white/60">
                ✕
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <form action={logoutAction} className="mt-4 border-t border-white/10 pt-4">
              <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-white/60">
                ↩ Sign out
              </button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
