import type { CorporateMentor } from "@/lib/content/trainers";

export function MentorCard({ mentor }: { mentor: CorporateMentor }) {
  const initials = mentor.assigned
    ? mentor.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
    : "?";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950">
        {mentor.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mentor.photoUrl} alt={mentor.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-black text-lime-400">
            {initials}
          </div>
        )}
        <span
          className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            mentor.assigned ? "bg-emerald-500 text-white" : "bg-amber-400 text-amber-950"
          }`}
        >
          {mentor.session}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-navy-900">{mentor.name}</h3>
        <p className="mt-1 text-xs text-slate-500">{mentor.title}</p>
        <p className="mt-3 text-sm text-slate-600">{mentor.topic}</p>

        {mentor.expertise && mentor.expertise.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {mentor.expertise.map((skill) => (
              <span key={skill} className="rounded-full bg-navy-900/5 px-2 py-0.5 text-[10px] font-bold text-navy-900">
                {skill}
              </span>
            ))}
          </div>
        )}

        {!mentor.assigned && (
          <p className="mt-2 text-xs font-semibold text-amber-600">Mentor and topic to be confirmed</p>
        )}
      </div>
    </div>
  );
}
