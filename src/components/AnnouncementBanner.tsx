import type { AnnouncementBanner as AnnouncementBannerContent } from "@/lib/content/site-schema";

export function AnnouncementBanner({ banner }: { banner: AnnouncementBannerContent }) {
  if (!banner.enabled || !banner.text) return null;

  const content = (
    <p className="py-2 text-center text-xs font-bold text-navy-950 sm:text-sm">{banner.text}</p>
  );

  return (
    <div className="no-print bg-lime-400">
      {banner.url ? (
        <a href={banner.url} className="block hover:underline">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
