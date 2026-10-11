import type { Trainer } from "@/lib/content/trainers";

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  const initials = trainer.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-navy-800 to-navy-900 text-2xl font-black text-lime-400 ring-4 ring-emerald-500/15">
        {initials}
      </div>
      <h3 className="text-lg font-bold text-navy-900">{trainer.name}</h3>
      <p className="mt-1 text-sm font-semibold text-emerald-600">{trainer.role}</p>
      {(trainer.company || trainer.location) && (
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {[trainer.company, trainer.location].filter(Boolean).join(" · ")}
        </p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{trainer.bio}</p>
    </div>
  );
}
