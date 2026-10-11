import { getSettings, formatInr } from "@/lib/content/settings";
import { EnrollButton } from "./EnrollButton";

export async function PriceCard() {
  const settings = await getSettings();
  const { referencePriceInr, launchPriceInr, enrollmentPaymentInr } = settings.pricing;
  const discountPct = Math.round(((referencePriceInr - launchPriceInr) / referencePriceInr) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-6 shadow-2xl shadow-black/40 sm:p-8">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-2xl" />
      <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-lime-500/15 px-3 py-1 text-xs font-bold text-lime-400">
        🔥 {discountPct}% OFF — Launch Price
      </span>
      <div className="mb-1 flex items-baseline gap-3">
        <span className="text-5xl font-black text-white sm:text-6xl">{formatInr(launchPriceInr)}</span>
        <span className="text-lg font-semibold text-white/40 line-through">{formatInr(referencePriceInr)}</span>
      </div>
      <p className="mb-6 text-sm font-medium text-white/60">Reference price {formatInr(referencePriceInr)}</p>

      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-bold text-white">
          Initial enrollment payment: {formatInr(enrollmentPaymentInr)}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/60">
          {formatInr(enrollmentPaymentInr)} reserves your seat. This is an initial enrollment payment, not the
          full program fee — the organizer confirms the remaining payment terms at the time of enrollment.
        </p>
      </div>

      <ul className="mb-6 space-y-2 text-sm text-white/80">
        <li className="flex gap-2">
          <span className="text-lime-400">✅</span> {settings.refundWindowDays}-day, 100% money-back guarantee
        </li>
        <li className="flex gap-2">
          <span className="text-lime-400">✅</span> {settings.totalSessions} sessions · {settings.totalHours} instructional hours
        </li>
        <li className="flex gap-2">
          <span className="text-lime-400">✅</span> {settings.mentorSessions} corporate expert mentoring sessions
        </li>
      </ul>

      <EnrollButton enrollmentUrl={settings.enrollmentUrl} className="w-full" />
      <p className="mt-3 text-center text-xs text-white/40">{settings.durationLabel} program · seats limited per batch</p>
    </div>
  );
}
