export interface GalleryItem {
  caption: string;
  imageUrl: string;
  altText?: string;
}

// No real photos have been supplied yet. Do not add stock/placeholder images
// presented as real program photos — the /gallery page renders a clean empty
// state until the founder supplies genuine photos via the admin panel.
export const galleryItems: GalleryItem[] = [];

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { prisma, isDatabaseConfigured } = await import("@/lib/db/prisma");
  if (!isDatabaseConfigured()) return galleryItems;
  try {
    const rows = await prisma.galleryItem.findMany({ where: { status: "PUBLISHED" }, orderBy: { sortOrder: "asc" } });
    return rows.map((r) => ({ caption: r.caption ?? r.altText, imageUrl: r.imageUrl, altText: r.altText }));
  } catch {
    return galleryItems;
  }
}
