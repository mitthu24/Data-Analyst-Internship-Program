import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { getGalleryItems } from "@/lib/content/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Corporate learning and team gallery for the Data Analyst Internship Program.",
};

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Gallery</h1>
          <p className="mt-4 text-lg text-white/75">Photos from corporate learning sessions and the team.</p>
        </div>
      </section>

      <Section>
        {galleryItems.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <span className="mb-3 block text-4xl">📷</span>
            <h2 className="text-lg font-bold text-navy-900">Gallery coming soon</h2>
            <p className="mt-2 text-sm text-slate-600">
              Photos from live sessions and corporate mentoring will be added here as the program runs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {galleryItems.map((item) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.imageUrl}
                src={item.imageUrl}
                alt={item.altText ?? item.caption}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
