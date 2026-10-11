export function EmptyState({ icon = "📭", title, description }: { icon?: string; title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <span className="mb-3 block text-4xl">{icon}</span>
      <h3 className="text-base font-bold text-navy-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}
