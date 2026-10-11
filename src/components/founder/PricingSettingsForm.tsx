"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { Field, TextInput, TextArea } from "./fields";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import { updatePricingSettingsAction } from "@/lib/actions/settings-actions";

export interface PricingSettingsValues {
  currency: string;
  referencePriceInr: number;
  launchPriceInr: number;
  enrollmentPaymentInr: number;
  enrollmentUrl: string;
  refundWindowDays: number;
  refundPolicyText?: string | null;
}

export function PricingSettingsForm({ initial }: { initial: PricingSettingsValues }) {
  const [state, formAction] = useFormState(updatePricingSettingsAction, {});
  const [preview, setPreview] = useState(initial);

  const formatInr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form
        action={formAction}
        className="space-y-5"
        onChange={(e) => {
          const form = e.currentTarget;
          const fd = new FormData(form);
          setPreview({
            currency: String(fd.get("currency") ?? "INR"),
            referencePriceInr: Number(fd.get("referencePriceInr") ?? 0),
            launchPriceInr: Number(fd.get("launchPriceInr") ?? 0),
            enrollmentPaymentInr: Number(fd.get("enrollmentPaymentInr") ?? 0),
            enrollmentUrl: String(fd.get("enrollmentUrl") ?? ""),
            refundWindowDays: Number(fd.get("refundWindowDays") ?? 0),
            refundPolicyText: String(fd.get("refundPolicyText") ?? ""),
          });
        }}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Currency">
            <TextInput name="currency" required defaultValue={initial.currency} />
          </Field>
          <Field label="Reference price">
            <TextInput name="referencePriceInr" type="number" min={0} required defaultValue={initial.referencePriceInr} />
          </Field>
          <Field label="Launch price">
            <TextInput name="launchPriceInr" type="number" min={0} required defaultValue={initial.launchPriceInr} />
          </Field>
          <Field label="Initial payment">
            <TextInput name="enrollmentPaymentInr" type="number" min={0} required defaultValue={initial.enrollmentPaymentInr} />
          </Field>
        </div>

        <Field label="Enrollment URL">
          <TextInput name="enrollmentUrl" type="url" required defaultValue={initial.enrollmentUrl} />
        </Field>

        <Field label="Refund window (days)">
          <TextInput name="refundWindowDays" type="number" min={0} required defaultValue={initial.refundWindowDays} />
        </Field>

        <Field label="Refund policy text" hint="Shown on the Refund Policy page. Review and approve the exact wording before publishing.">
          <TextArea name="refundPolicyText" rows={6} defaultValue={initial.refundPolicyText ?? ""} />
        </Field>

        <FormMessage state={state} />
        <SubmitButton>Save Pricing</SubmitButton>
      </form>

      <aside className="h-fit rounded-2xl border border-navy-900 bg-navy-950 p-5 text-white">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/50">Live Preview</p>
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-2xl font-black">{formatInr(preview.launchPriceInr)}</span>
          <span className="text-sm text-white/40 line-through">{formatInr(preview.referencePriceInr)}</span>
        </div>
        <p className="mb-3 text-xs text-white/60">
          Initial enrollment payment: <strong>{formatInr(preview.enrollmentPaymentInr)}</strong> — not the full fee.
        </p>
        <p className="text-xs text-white/60">{preview.refundWindowDays}-day money-back guarantee.</p>
        <p className="mt-3 truncate text-[11px] text-emerald-400">{preview.enrollmentUrl}</p>
      </aside>
    </div>
  );
}
