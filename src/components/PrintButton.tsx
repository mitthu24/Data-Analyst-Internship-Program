"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-emerald-500"
    >
      🖨️ Print / Save as PDF
    </button>
  );
}
