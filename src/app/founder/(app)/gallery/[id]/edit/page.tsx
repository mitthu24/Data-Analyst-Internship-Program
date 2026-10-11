import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { GalleryForm } from "@/components/founder/GalleryForm";
import { updateGalleryItemAction } from "@/lib/actions/gallery-actions";
import { isUploadConfigured } from "@/lib/uploads/storage";

export const metadata: Metadata = { title: "Edit Image", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  await requireFounder();
  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Edit Gallery Image" crumbs={[{ label: "Gallery", href: "/founder/gallery" }, { label: "Edit" }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <GalleryForm action={updateGalleryItemAction.bind(null, id)} initial={item} uploadsConfigured={isUploadConfigured()} />
      </div>
    </div>
  );
}
