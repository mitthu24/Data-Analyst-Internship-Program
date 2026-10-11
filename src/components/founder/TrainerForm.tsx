"use client";

import { useFormState } from "react-dom";
import { Field, TextInput, TextArea, SelectInput } from "./fields";
import { ImageUrlField } from "./ImageUrlField";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/lib/actions/action-helpers";

export interface TrainerFormValues {
  name: string;
  role: string;
  company?: string | null;
  location?: string | null;
  bio?: string | null;
  expertise: string[];
  photoUrl?: string | null;
  linkedin?: string | null;
  isMentor: boolean;
  sortOrder: number;
  status: string;
}

export function TrainerForm({
  action,
  initial,
  lockMentorFlag,
  uploadsConfigured,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Partial<TrainerFormValues>;
  /** When set from the /founder/mentors page, hides the isMentor checkbox and forces it true. */
  lockMentorFlag?: boolean;
  uploadsConfigured: boolean;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <TextInput name="name" required maxLength={120} defaultValue={initial?.name} />
        </Field>
        <Field label="Designation / role">
          <TextInput name="role" required maxLength={160} defaultValue={initial?.role} />
        </Field>
        <Field label="Organization">
          <TextInput name="company" defaultValue={initial?.company ?? ""} />
        </Field>
        <Field label="Location">
          <TextInput name="location" defaultValue={initial?.location ?? ""} />
        </Field>
      </div>

      <Field label="Biography" hint="Only verified, founder-approved information — no fabricated claims.">
        <TextArea name="bio" rows={4} defaultValue={initial?.bio ?? ""} />
      </Field>

      <Field label="Expertise / skills" hint="One per line or comma-separated">
        <TextArea name="expertise" defaultValue={initial?.expertise?.join("\n")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Profile image" hint="Leave blank to use the neutral placeholder">
          <ImageUrlField name="photoUrl" defaultValue={initial?.photoUrl ?? ""} uploadsConfigured={uploadsConfigured} />
        </Field>
        <Field label="LinkedIn URL">
          <TextInput name="linkedin" type="url" defaultValue={initial?.linkedin ?? ""} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {lockMentorFlag ? (
          <input type="hidden" name="isMentor" value="on" />
        ) : (
          <Field label="Type">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <input type="checkbox" name="isMentor" defaultChecked={initial?.isMentor ?? false} />
              This is a corporate expert mentor (not a core trainer)
            </label>
          </Field>
        )}
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
      <SubmitButton>Save Profile</SubmitButton>
    </form>
  );
}
