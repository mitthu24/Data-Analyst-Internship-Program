import type { Metadata } from "next";
import Link from "next/link";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { EmptyState } from "@/components/founder/EmptyState";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { PublishToggleButton } from "@/components/founder/PublishToggleButton";
import { DeleteButton } from "@/components/founder/DeleteButton";
import { deleteGalleryItemAction, toggleGalleryItemStatusAction } from "@/lib/actions/gallery-actions";

export const metadata: Metadata = { title: "Gallery", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderGalleryPage() {
  await requireFounder();
  const items = await prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <PageHeader
        title="Gallery"
        actions={
          <Link href="/founder/gallery/new" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
            + Add Image
          </Link>
        }
      />

      {items.length === 0 ? (
        <EmptyState title="No gallery images yet" description="The public gallery shows a clean empty state until real photos are added." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.altText} className="aspect-square w-full object-cover" />
              <div className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <StatusBadge status={item.status} />
                </div>
                <p className="mb-2 truncate text-xs text-slate-500">{item.caption ?? item.altText}</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/founder/gallery/${item.id}/edit`} className="text-xs font-bold text-electric-600 hover:underline">
                    Edit
                  </Link>
                  <PublishToggleButton id={item.id} status={item.status} action={toggleGalleryItemStatusAction} />
                  <DeleteButton id={item.id} action={deleteGalleryItemAction} confirmMessage="Delete this image?" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
