import type { PropsWithChildren } from "react";
import clsx from "clsx";
import { Container } from "./Container";

interface SectionProps extends PropsWithChildren {
  className?: string;
  containerClassName?: string;
  id?: string;
}

export function Section({ children, className, containerClassName, id }: SectionProps) {
  return (
    <section id={id} className={clsx("py-14 sm:py-20", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={clsx("mx-auto mb-10 max-w-2xl", align === "center" ? "text-center" : "text-left ml-0")}>
      {eyebrow && (
        <span
          className={clsx(
            "mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
            light ? "bg-white/10 text-electric-400" : "bg-electric-500/10 text-electric-600",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={clsx(
          "text-3xl font-extrabold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={clsx("mt-3 text-base sm:text-lg", light ? "text-white/70" : "text-slate-600")}>
          {description}
        </p>
      )}
    </div>
  );
}
