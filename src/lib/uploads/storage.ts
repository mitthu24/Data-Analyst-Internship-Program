import "server-only";

/**
 * Pluggable image-upload abstraction. The repository had no object storage
 * configured when this was built, so the default (and only implemented)
 * provider is Vercel Blob — the zero-config option for a Vercel
 * deployment — behind this interface so swapping providers later only
 * means implementing `UploadProvider` again, not touching callers.
 *
 * Deliberately NOT using the local filesystem: Vercel's production
 * filesystem is read-only/ephemeral per request, so anything written to
 * disk at runtime would vanish on the next deploy or cold start.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export interface UploadResult {
  url: string;
}

export interface UploadProvider {
  isConfigured(): boolean;
  upload(file: File, pathPrefix: string): Promise<UploadResult>;
}

function safeFilename(originalName: string): string {
  const ext = (originalName.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const random = crypto.randomUUID();
  return `${random}.${ext || "bin"}`;
}

class VercelBlobProvider implements UploadProvider {
  isConfigured(): boolean {
    return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  }

  async upload(file: File, pathPrefix: string): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new Error(
        "Image uploads are not configured. Set BLOB_READ_WRITE_TOKEN (from a Vercel Blob store) to enable them — see docs/DEPLOYMENT.md. Until then, paste an image URL directly.",
      );
    }
    const { put } = await import("@vercel/blob");
    const filename = `${pathPrefix}/${safeFilename(file.name)}`;
    const blob = await put(filename, file, { access: "public", addRandomSuffix: false });
    return { url: blob.url };
  }
}

export const uploadProvider: UploadProvider = new VercelBlobProvider();

export function isUploadConfigured(): boolean {
  return uploadProvider.isConfigured();
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (file.size === 0) return { valid: false, error: "The selected file is empty." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return { valid: false, error: `Image is too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024}MB).` };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return { valid: false, error: "Only JPEG, PNG, WebP, or GIF images are allowed." };
  }
  return { valid: true };
}
