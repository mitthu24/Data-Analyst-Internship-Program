"use client";

import { usePathname } from "next/navigation";

/**
 * Decides whether the public Navbar/Footer/announcement banner wrap the
 * current page.
 *
 * `/founder/login` is a public-facing page (anyone can reach it, logged in
 * or not) and keeps the public header/footer, matching the rest of the
 * site and giving a logged-out visitor normal navigation — it's just kept
 * visually compact so the header/footer don't dominate the page.
 *
 * Everything else under `/founder/*` is the authenticated CMS — its own
 * self-contained app shell (the Sidebar-driven layout), deliberately kept
 * free of public marketing navigation so the admin UI doesn't compete with
 * (or let an admin accidentally click into) the public site chrome.
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
  const isFounderAppRoute = (pathname?.startsWith("/founder") ?? false) && pathname !== "/founder/login";

  if (isFounderAppRoute) {
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
