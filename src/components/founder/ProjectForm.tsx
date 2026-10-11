"use client";

import { useFormState } from "react-dom";
import { Field, TextInput, TextArea, SelectInput } from "./fields";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/lib/actions/action-helpers";

export interface ProjectFormValues {
  title: string;
  slug: string;
  businessProblem: string;
  tools: string[];
  learningObjectives: string[];
  deliverables: string[];
  difficulty: string;
  isPlannedExample: boolean;
  imageUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  sortOrder: number;
  status: string;
}

export function ProjectForm({
  action,
  initial,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Partial<ProjectFormValues>;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title">
          <TextInput name="title" required maxLength={160} defaultValue={initial?.title} />
        </Field>
        <Field label="Slug" hint="Leave blank to auto-generate from the title">
          <TextInput name="slug" defaultValue={initial?.slug ?? ""} />
        </Field>
      </div>

      <Field label="Business problem">
        <TextArea name="businessProblem" required defaultValue={initial?.businessProblem} />
      </Field>

      <Field label="Tools" hint="One per line or comma-separated">
        <TextArea name="tools" defaultValue={initial?.tools?.join("\n")} />
      </Field>
      <Field label="Learning objectives" hint="One per line or comma-separated">
        <TextArea name="learningObjectives" defaultValue={initial?.learningObjectives?.join("\n")} />
      </Field>
      <Field label="Deliverables" hint="One per line or comma-separated">
        <TextArea name="deliverables" defaultValue={initial?.deliverables?.join("\n")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Difficulty">
          <SelectInput name="difficulty" defaultValue={initial?.difficulty ?? "BEGINNER"}>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </SelectInput>
        </Field>
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

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <input type="checkbox" name="isPlannedExample" defaultChecked={initial?.isPlannedExample ?? true} />
        Label as a planned example project (not yet built/completed)
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Image URL" hint="An https:// link, or a root-relative path like /projects/photo.jpg">
          <TextInput name="imageUrl" type="text" defaultValue={initial?.imageUrl ?? ""} />
        </Field>
        <Field label="Live demo URL" hint="Only if a real, working demo exists">
          <TextInput name="demoUrl" type="url" defaultValue={initial?.demoUrl ?? ""} />
        </Field>
        <Field label="GitHub URL">
          <TextInput name="githubUrl" type="url" defaultValue={initial?.githubUrl ?? ""} />
        </Field>
      </div>

      <FormMessage state={state} />
      <SubmitButton>Save Project</SubmitButton>
    </form>
  );
}
