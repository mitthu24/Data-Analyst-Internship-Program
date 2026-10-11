"use client";

import { usePathname } from "next/navigation";

/**
 * Decides whether the public Navbar/Footer/announcement banner wrap the
 * current page. The founder admin area (/founder/*) is its own self-
 * contained app shell (a full-screen login card, or the Sidebar-driven CMS
 * layout) — it was previously always nested inside the public chrome via
 * the single root layout, which added a full marketing navbar and a long
 * multi-column footer above and below every founder page, including the
 * login screen. That's the main cause of "excessive vertical space" on
 * /founder/login: the login card itself was never oversized, it was just
 * sandwiched between unrelated public-site chrome.
 */
export function SiteChrome({
  announcementBanner,
  navbar,
  footer,
  children,
}: {
  announcementBanner: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFounderRoute = pathname?.startsWith("/founder") ?? false;

  if (isFounderRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {announcementBanner}
      {navbar}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
