"use client";

import { useFormState } from "react-dom";
import { Field, TextInput, TextArea } from "./fields";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import { updateProgramSettingsAction } from "@/lib/actions/settings-actions";

export interface ProgramSettingsValues {
  programName: string;
  durationLabel: string;
  classDurationMinutes: number;
  coreClasses: number;
  mentorSessions: number;
  totalSessions: number;
  totalHours: number;
  scheduleNote: string;
  batchDates?: string | null;
  batchTiming?: string | null;
  batchMode?: string | null;
  batchVenue?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

export function ProgramSettingsForm({ initial }: { initial: ProgramSettingsValues }) {
  const [state, formAction] = useFormState(updateProgramSettingsAction, {});

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Program name">
        <TextInput name="programName" required defaultValue={initial.programName} />
      </Field>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Duration label">
          <TextInput name="durationLabel" required defaultValue={initial.durationLabel} />
        </Field>
        <Field label="Minutes / session">
          <TextInput name="classDurationMinutes" type="number" min={15} required defaultValue={initial.classDurationMinutes} />
        </Field>
        <Field label="Core classes">
          <TextInput name="coreClasses" type="number" min={0} required defaultValue={initial.coreClasses} />
        </Field>
        <Field label="Mentor sessions">
          <TextInput name="mentorSessions" type="number" min={0} required defaultValue={initial.mentorSessions} />
        </Field>
        <Field label="Total sessions">
          <TextInput name="totalSessions" type="number" min={1} required defaultValue={initial.totalSessions} />
        </Field>
        <Field label="Total hours">
          <TextInput name="totalHours" type="number" step="0.5" min={0.5} required defaultValue={initial.totalHours} />
        </Field>
      </div>

      <Field label="Schedule note" hint="Shown publicly instead of fixed dates — e.g. explaining the organizer shares exact timings before the batch starts.">
        <TextArea name="scheduleNote" required rows={3} defaultValue={initial.scheduleNote} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Batch dates (optional)">
          <TextInput name="batchDates" defaultValue={initial.batchDates ?? ""} />
        </Field>
        <Field label="Batch timing (optional)">
          <TextInput name="batchTiming" defaultValue={initial.batchTiming ?? ""} />
        </Field>
        <Field label="Mode (optional)" hint="e.g. Live Online / In-person">
          <TextInput name="batchMode" defaultValue={initial.batchMode ?? ""} />
        </Field>
        <Field label="Venue (optional)">
          <TextInput name="batchVenue" defaultValue={initial.batchVenue ?? ""} />
        </Field>
        <Field label="Contact email (optional)">
          <TextInput name="contactEmail" type="email" defaultValue={initial.contactEmail ?? ""} />
        </Field>
        <Field label="Contact phone (optional)">
          <TextInput name="contactPhone" defaultValue={initial.contactPhone ?? ""} />
        </Field>
      </div>

      <FormMessage state={state} />
      <SubmitButton>Save Settings</SubmitButton>
    </form>
  );
}
