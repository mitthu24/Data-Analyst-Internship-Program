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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Skillo — Data Analyst Internship Program",
    template: "%s · Skillo",
  },
  description:
    "Skillo's 8-week, practical Data Analyst Internship Program covering Advanced Excel, Power BI, SQL, automation, and AI-assisted dashboards. 25 sessions, 37.5 instructional hours.",
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
