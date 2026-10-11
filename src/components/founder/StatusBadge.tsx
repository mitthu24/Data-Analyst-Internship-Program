export function StatusBadge({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  return (
    <span
      className={
        status === "PUBLISHED"
          ? "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700"
          : "inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700"
      }
    >
      {status === "PUBLISHED" ? "Published" : "Draft"}
    </span>
  );
}
