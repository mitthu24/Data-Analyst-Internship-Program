import type { Trainer } from "@/lib/content/trainers";

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  const initials = trainer.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950">
        {trainer.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trainer.photoUrl}
            alt={`${trainer.name}, ${trainer.role}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-black text-lime-400">
            {initials}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-lime-300 backdrop-blur-sm">
          {trainer.isMentor ? "Corporate Mentor" : "Core Trainer"}
        </span>
      </div>

      <div className="p-5 text-center">
        <h3 className="text-lg font-bold text-navy-900">{trainer.name}</h3>
        <p className="mt-1 text-sm font-semibold text-emerald-600">{trainer.role}</p>
        {(trainer.company || trainer.location) && (
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {[trainer.company, trainer.location].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{trainer.bio}</p>

        {trainer.expertise && trainer.expertise.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {trainer.expertise.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-navy-900/5 px-2.5 py-1 text-[11px] font-bold text-navy-900"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {trainer.linkedin && (
          <a
            href={trainer.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-electric-600 hover:text-electric-700"
          >
            View LinkedIn
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 17L17 7M17 7H8M17 7v9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
