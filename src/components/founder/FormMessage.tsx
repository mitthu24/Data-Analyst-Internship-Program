export function FormMessage({ state }: { state: { error?: string; success?: string } }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
        {state.success}
      </p>
    );
  }
  return null;
}
