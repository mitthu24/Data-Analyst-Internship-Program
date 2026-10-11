export function KpiCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-transform hover:-translate-y-1 hover:border-lime-400/40">
      <div className="text-2xl font-black text-lime-400 sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs font-semibold text-white/70 sm:text-sm">{label}</div>
    </div>
  );
}
