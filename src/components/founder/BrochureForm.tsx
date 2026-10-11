"use client";

import { useFormState } from "react-dom";
import { Field, TextArea } from "./fields";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import { updateBrochureContentAction } from "@/lib/actions/content-actions";
import type { BrochureContent } from "@/lib/content/site-schema";

export function BrochureForm({ initial }: { initial: BrochureContent }) {
  const [state, formAction] = useFormState(updateBrochureContentAction, {});
  return (
    <form action={formAction} className="space-y-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <input type="checkbox" name="visible" defaultChecked={initial.visible} />
        Brochure page is visible to the public
      </label>
      <Field label="Introduction override (optional)" hint="Leave blank to use the standard About the Program text.">
        <TextArea name="introOverride" rows={4} defaultValue={initial.introOverride ?? ""} />
      </Field>
      <FormMessage state={state} />
      <SubmitButton>Save Brochure Settings</SubmitButton>
    </form>
  );
}
