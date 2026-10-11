"use client";

import { useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";
import clsx from "clsx";

interface ScrollRevealProps extends PropsWithChildren {
  className?: string;
  delayMs?: number;
}

/** Fades/slides content in once it scrolls into view. Degrades gracefully with no JS. */
export function ScrollReveal({ children, className, delayMs = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={clsx("reveal", className)} style={{ transitionDelay: `${delayMs}ms` }}>
      {children}
    </div>
  );
}
