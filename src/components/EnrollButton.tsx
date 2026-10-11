import { ButtonLink } from "./Button";

export function EnrollButton({
  enrollmentUrl,
  className,
  label = "Enroll Now — Pay ₹499",
}: {
  enrollmentUrl: string;
  className?: string;
  label?: string;
}) {
  return (
    <ButtonLink href={enrollmentUrl} external variant="primary" className={className}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 2 3 14h7l-1 8 11-14h-7l0-6z" fill="currentColor" />
      </svg>
      {label}
    </ButtonLink>
  );
}
