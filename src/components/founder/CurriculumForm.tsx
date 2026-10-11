"use client";

import { useFormState } from "react-dom";
import { Field, TextInput, TextArea, SelectInput } from "./fields";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import { sessionModuleValues, sessionModuleLabels } from "@/lib/validation/curriculum";
import type { FormState } from "@/lib/actions/action-helpers";

export interface CurriculumFormValues {
  classNumber: number;
  module: string;
  title: string;
  durationMinutes: number;
  topics: string[];
  practicalExample: string;
  handsOnExercise: string;
  learningOutcome: string;
  deliverable: string;
  tools: string[];
  trainerId: string | null;
  mentorName: string | null;
  mentorTitle: string | null;
  order: number;
  status: string;
}

export function CurriculumForm({
  action,
  initial,
  trainers,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Partial<CurriculumFormValues>;
  trainers: { id: string; name: string; isMentor: boolean }[];
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Class number">
          <TextInput name="classNumber" type="number" required min={1} defaultValue={initial?.classNumber} />
        </Field>
        <Field label="Module">
          <SelectInput name="module" required defaultValue={initial?.module ?? "EXCEL"}>
            {sessionModuleValues.map((m) => (
              <option key={m} value={m}>
                {sessionModuleLabels[m]}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Duration (minutes)">
          <TextInput name="durationMinutes" type="number" required min={15} defaultValue={initial?.durationMinutes ?? 90} />
        </Field>
        <Field label="Display order">
          <TextInput name="order" type="number" min={0} defaultValue={initial?.order ?? initial?.classNumber ?? 0} />
        </Field>
      </div>

      <Field label="Title">
        <TextInput name="title" required maxLength={200} defaultValue={initial?.title} />
      </Field>

      <Field label="Topics" hint="One per line or comma-separated">
        <TextArea name="topics" defaultValue={initial?.topics?.join("\n")} />
      </Field>

      <Field label="Tools used" hint="One per line or comma-separated">
        <TextArea name="tools" defaultValue={initial?.tools?.join("\n")} />
      </Field>

      <Field label="Practical corporate example">
        <TextArea name="practicalExample" required defaultValue={initial?.practicalExample} />
      </Field>

      <Field label="Hands-on exercise">
        <TextArea name="handsOnExercise" required defaultValue={initial?.handsOnExercise} />
      </Field>

      <Field label="Expected learning outcome">
        <TextArea name="learningOutcome" required defaultValue={initial?.learningOutcome} />
      </Field>

      <Field label="Expected deliverable">
        <TextArea name="deliverable" required defaultValue={initial?.deliverable} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Assigned trainer/mentor" hint="Optional — links to a Trainer record">
          <SelectInput name="trainerId" defaultValue={initial?.trainerId ?? ""}>
            <option value="">None</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} {t.isMentor ? "(mentor)" : ""}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Mentor name override" hint="Shown if no trainer is linked">
          <TextInput name="mentorName" defaultValue={initial?.mentorName ?? ""} />
        </Field>
        <Field label="Mentor title override">
          <TextInput name="mentorTitle" defaultValue={initial?.mentorTitle ?? ""} />
        </Field>
      </div>

      <Field label="Status">
        <SelectInput name="status" defaultValue={initial?.status ?? "DRAFT"}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </SelectInput>
      </Field>

      <FormMessage state={state} />
      <SubmitButton>Save Session</SubmitButton>
    </form>
  );
}
