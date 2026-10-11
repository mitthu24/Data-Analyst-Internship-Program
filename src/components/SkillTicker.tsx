const skills = [
  "Advanced Excel",
  "Power BI",
  "SQL",
  "VBA Automation",
  "Google Sheets",
  "DAX",
  "ChatGPT",
  "Claude Code",
  "GitHub",
  "Vercel",
  "MIS Reporting",
  "Dashboards",
];

export function SkillTicker() {
  const items = [...skills, ...skills];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-navy-950">
      <div className="flex w-max animate-ticker">
        {items.map((skill, i) => (
          <span
            key={`${skill}-${i}`}
            className="flex h-12 items-center whitespace-nowrap border-r border-white/10 px-6 text-sm font-bold text-white/80"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
