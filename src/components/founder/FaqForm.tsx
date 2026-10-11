"use client";

import { useFormState } from "react-dom";
import { Field, TextInput, TextArea, SelectInput } from "./fields";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/lib/actions/action-helpers";

export function FaqForm({
  action,
  initial,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: { question?: string; answer?: string; sortOrder?: number; status?: string };
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Question">
        <TextInput name="question" required maxLength={300} defaultValue={initial?.question} />
      </Field>
      <Field label="Answer">
        <TextArea name="answer" required rows={5} defaultValue={initial?.answer} />
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
      <SubmitButton>Save FAQ</SubmitButton>
    </form>
  );
}
