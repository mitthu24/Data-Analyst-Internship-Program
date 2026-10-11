import Link from "next/link";
import { footerLegalNav, footerProgramNav } from "@/lib/content/nav";
import { getSettings, formatInr } from "@/lib/content/settings";
import { getFooterContent } from "@/lib/content/site-content";

export async function Footer() {
  const [settings, footer] = await Promise.all([getSettings(), getFooterContent()]);

  return (
    <footer className="no-print border-t border-white/10 bg-navy-950 text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-electric-500 font-black text-white">
                DA
              </span>
              <span className="text-sm font-extrabold text-white">{settings.programName}</span>
            </div>
            <p className="text-sm leading-relaxed">{footer.text}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Program</h3>
            <ul className="space-y-2 text-sm">
              {footerProgramNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-lime-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              {footerLegalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-lime-400">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/career-guidance" className="hover:text-lime-400">
                  Career Guidance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Enroll</h3>
            <p className="mb-3 text-sm">
              Reserve your seat with an initial payment of {formatInr(settings.pricing.enrollmentPaymentInr)}. Launch
              price {formatInr(settings.pricing.launchPriceInr)} (reference price{" "}
              {formatInr(settings.pricing.referencePriceInr)}).
            </p>
            <a
              href={settings.enrollmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500"
            >
              Enroll Now
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.programName}. All rights reserved.</p>
          <p>No guaranteed placement, salary, or employment outcomes are promised.</p>
        </div>
      </div>
    </footer>
  );
}
