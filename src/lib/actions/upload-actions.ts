"use server";

import { requireFounderForAction } from "@/lib/auth/guard";
import { uploadProvider, validateImageFile, isUploadConfigured } from "@/lib/uploads/storage";

export interface UploadState {
  url?: string;
  error?: string;
}

export async function uploadImageAction(_prev: UploadState, formData: FormData): Promise<UploadState> {
  try {
    await requireFounderForAction();
  } catch {
    return { error: "Your session has expired. Please sign in again." };
  }

  if (!isUploadConfigured()) {
    return { error: "Image uploads are not configured yet. Paste an image URL instead — see docs/DEPLOYMENT.md." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file selected." };
  }

  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { error: validation.error };
  }

  try {
    const result = await uploadProvider.upload(file, "founder-uploads");
    return { url: result.url };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}
