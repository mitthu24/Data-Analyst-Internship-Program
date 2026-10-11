import type { Metadata } from "next";
import { requireFounder } from "@/lib/auth/guard";
import { PageHeader } from "@/components/founder/PageHeader";
import { GalleryForm } from "@/components/founder/GalleryForm";
import { createGalleryItemAction } from "@/lib/actions/gallery-actions";
import { isUploadConfigured } from "@/lib/uploads/storage";

export const metadata: Metadata = { title: "Add Image", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewGalleryItemPage() {
  await requireFounder();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Add Gallery Image" crumbs={[{ label: "Gallery", href: "/founder/gallery" }, { label: "New" }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <GalleryForm action={createGalleryItemAction} uploadsConfigured={isUploadConfigured()} />
      </div>
    </div>
  );
}
