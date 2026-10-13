import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { SiteChrome } from "@/components/SiteChrome";
import { getSettings } from "@/lib/content/settings";
import { getAnnouncementBanner } from "@/lib/content/site-content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

const defaultTitle = "Skillo Academy — Placement-Oriented Internship Program";
const defaultDescription =
  "Skillo Academy's 8-week, placement-oriented internship program: build job-ready skills, work on real-world projects, and prepare for interviews. Practical training in Excel, Power BI, SQL, automation, and AI-assisted dashboards for MBA/BBA students, freshers, and early-career professionals. 25 sessions, 37.5 instructional hours.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s · Skillo Academy",
  },
  description: defaultDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Skillo Academy",
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, banner] = await Promise.all([getSettings(), getAnnouncementBanner()]);

  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-navy-900 antialiased">
        <SiteChrome
          announcementBanner={<AnnouncementBanner banner={banner} />}
          navbar={<Navbar enrollmentUrl={settings.enrollmentUrl} />}
          footer={<Footer />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
