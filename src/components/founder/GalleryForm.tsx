"use client";

import { useFormState } from "react-dom";
import { Field, TextInput, SelectInput } from "./fields";
import { ImageUrlField } from "./ImageUrlField";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/lib/actions/action-helpers";

export interface GalleryFormValues {
  imageUrl: string;
  caption?: string | null;
  altText: string;
  category?: string | null;
  sortOrder: number;
  status: string;
}

export function GalleryForm({
  action,
  initial,
  uploadsConfigured,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Partial<GalleryFormValues>;
  uploadsConfigured: boolean;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Image">
        <ImageUrlField name="imageUrl" required defaultValue={initial?.imageUrl} uploadsConfigured={uploadsConfigured} />
      </Field>
      <Field label="Alt text" hint="Required for accessibility — describe what's in the photo">
        <TextInput name="altText" required maxLength={200} defaultValue={initial?.altText} />
      </Field>
      <Field label="Caption (optional)">
        <TextInput name="caption" defaultValue={initial?.caption ?? ""} />
      </Field>
      <Field label="Category (optional)" hint='e.g. "Corporate Mentoring", "Team"'>
        <TextInput name="category" defaultValue={initial?.category ?? ""} />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Display order">
          <TextInput name="sortOrder" type="number" min={0} defaultValue={initial?.sortOrder ?? 0} />
        </Field>
        <Field label="Status">
          <SelectInput name="status" defaultValue={initial?.status ?? "DRAFT"}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </SelectInput>
        </Field>
      </div>

      <FormMessage state={state} />
      <SubmitButton>Save Image</SubmitButton>
    </form>
  );
}
