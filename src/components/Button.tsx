import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  external?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5",
  secondary:
    "bg-white text-navy-900 shadow-lg shadow-black/10 hover:-translate-y-0.5",
  ghost: "border border-white/25 text-white hover:bg-white/10",
};

export function ButtonLink({ href, variant = "primary", external, className, children, ...props }: ButtonLinkProps) {
  const classes = clsx(
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 sm:text-base",
    variants[variant],
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
