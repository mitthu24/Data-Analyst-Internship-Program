"use client";

import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { TextInput } from "./fields";
import { uploadImageAction, type UploadState } from "@/lib/actions/upload-actions";

function ChooseFileButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={onClick}
      className="shrink-0 rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
    >
      {pending ? "Uploading..." : "Upload File"}
    </button>
  );
}

/**
 * An image URL text field with an optional inline file-upload button. The
 * text input always works on its own (paste any URL) — the upload button
 * is a convenience that fills it in automatically when object storage is
 * configured (see docs/DEPLOYMENT.md); the field never requires it.
 */
export function ImageUrlField({
  name,
  defaultValue,
  uploadsConfigured,
  required,
}: {
  name: string;
  defaultValue?: string;
  uploadsConfigured: boolean;
  required?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [state, formAction] = useFormState(async (_prev: UploadState, fd: FormData) => {
    const result = await uploadImageAction(_prev, fd);
    if (result.url) setUrl(result.url);
    return result;
  }, {} as UploadState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <TextInput name={name} type="url" required={required} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        {uploadsConfigured && (
          <form action={formAction}>
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) e.target.form?.requestSubmit();
              }}
            />
            <ChooseFileButton onClick={() => fileInputRef.current?.click()} />
          </form>
        )}
      </div>
      {!uploadsConfigured && (
        <p className="text-xs text-slate-400">Direct image uploads aren&apos;t configured yet — paste an image URL above.</p>
      )}
      {state.error && <p className="text-xs font-semibold text-rose-600">{state.error}</p>}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Preview"
          className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
    </div>
  );
}
