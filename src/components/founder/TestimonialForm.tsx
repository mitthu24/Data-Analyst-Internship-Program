"use client";

import { useFormState } from "react-dom";
import { Field, TextInput, TextArea, SelectInput } from "./fields";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/lib/actions/action-helpers";

export interface TestimonialFormValues {
  studentName: string;
  role?: string | null;
  quote: string;
  imageUrl?: string | null;
  consent: boolean;
  sortOrder: number;
  status: string;
}

export function TestimonialForm({
  action,
  initial,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Partial<TestimonialFormValues>;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Student name">
          <TextInput name="studentName" required maxLength={120} defaultValue={initial?.studentName} />
        </Field>
        <Field label="Role / description" hint='e.g. "MBA Finance, Batch 2026"'>
          <TextInput name="role" defaultValue={initial?.role ?? ""} />
        </Field>
      </div>

      <Field label="Testimonial text">
        <TextArea name="quote" required rows={4} defaultValue={initial?.quote} />
      </Field>

      <Field label="Photo URL (optional)">
        <TextInput name="imageUrl" type="url" defaultValue={initial?.imageUrl ?? ""} />
      </Field>

      <label className="flex items-start gap-2 text-sm font-semibold text-slate-600">
        <input type="checkbox" name="consent" defaultChecked={initial?.consent ?? false} className="mt-0.5" />
        The student has given consent for this testimonial to be published on the public website.
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Display order">
          <TextInput name="sortOrder" type="number" min={0} defaultValue={initial?.sortOrder ?? 0} />
        </Field>
        <Field label="Status" hint="Publishing requires consent to be checked">
          <SelectInput name="status" defaultValue={initial?.status ?? "DRAFT"}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </SelectInput>
        </Field>
      </div>

      <FormMessage state={state} />
      <SubmitButton>Save Testimonial</SubmitButton>
    </form>
  );
}
