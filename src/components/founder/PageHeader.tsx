import Link from "next/link";
import type { PropsWithChildren } from "react";

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
}: PropsWithChildren<{
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}>) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-1 text-xs font-semibold text-slate-400">
            {crumbs.map((c, i) => (
              <span key={c.label}>
                {i > 0 && <span className="mx-1.5">/</span>}
                {c.href ? (
                  <Link href={c.href} className="hover:text-emerald-600">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-slate-500">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-black text-navy-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
