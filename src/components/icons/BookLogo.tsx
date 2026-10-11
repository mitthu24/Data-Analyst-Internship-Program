/** Open-book mark used as the Skillo brand icon across the navbar, footer, and founder login. */
export function BookLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 5.5c-1.6-1.2-3.8-1.8-6.2-1.8-.7 0-1.3.55-1.3 1.25v11.8c0 .75.65 1.3 1.4 1.25 2.2-.15 4.3.4 5.7 1.5a.6.6 0 0 0 .8 0c1.4-1.1 3.5-1.65 5.7-1.5.75.05 1.4-.5 1.4-1.25V4.95c0-.7-.6-1.25-1.3-1.25-2.4 0-4.6.6-6.2 1.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 5.5v13.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
