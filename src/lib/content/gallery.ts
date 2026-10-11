export interface GalleryItem {
  caption: string;
  imageUrl: string;
}

// No real photos have been supplied yet. Do not add stock/placeholder images
// presented as real program photos — the /gallery page renders a clean empty
// state until the founder supplies genuine photos (Phase 2 admin panel).
export const galleryItems: GalleryItem[] = [];
