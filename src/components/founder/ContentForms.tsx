"use client";

import { useFormState } from "react-dom";
import { Field, TextInput, TextArea } from "./fields";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import {
  updateHeroContentAction,
  updateAboutContentAction,
  updateCareerGuidanceContentAction,
  updateFooterContentAction,
  updateAnnouncementBannerAction,
  updateSeoContentAction,
} from "@/lib/actions/content-actions";
import type { HeroContent, AboutContent, CareerGuidanceContent, FooterContent, AnnouncementBanner, SeoContent } from "@/lib/content/site-schema";

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-bold text-navy-900">{title}</h2>
      {description && <p className="mb-4 mt-1 text-xs text-slate-500">{description}</p>}
      <div className={description ? "mt-4" : "mt-3"}>{children}</div>
    </div>
  );
}

export function HeroForm({ initial }: { initial: HeroContent }) {
  const [state, formAction] = useFormState(updateHeroContentAction, {});
  return (
    <SectionCard title="Homepage Hero" description="The main headline and description at the top of the homepage.">
      <form action={formAction} className="space-y-4">
        <Field label="Title">
          <TextInput name="title" required defaultValue={initial.title} />
        </Field>
        <Field label="Description">
          <TextArea name="description" required rows={3} defaultValue={initial.description} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Primary CTA label">
            <TextInput name="ctaLabel" required defaultValue={initial.ctaLabel} />
          </Field>
          <Field label="Secondary CTA label">
            <TextInput name="secondaryCtaLabel" required defaultValue={initial.secondaryCtaLabel} />
          </Field>
        </div>
        <FormMessage state={state} />
        <SubmitButton>Save Hero</SubmitButton>
      </form>
    </SectionCard>
  );
}

export function AboutForm({ initial }: { initial: AboutContent }) {
  const [state, formAction] = useFormState(updateAboutContentAction, {});
  return (
    <SectionCard title="About Page Introduction">
      <form action={formAction} className="space-y-4">
        <Field label="Intro paragraph">
          <TextArea name="intro" required rows={4} defaultValue={initial.intro} />
        </Field>
        <FormMessage state={state} />
        <SubmitButton>Save About</SubmitButton>
      </form>
    </SectionCard>
  );
}

export function CareerGuidanceForm({ initial }: { initial: CareerGuidanceContent }) {
  const [state, formAction] = useFormState(updateCareerGuidanceContentAction, {});
  return (
    <SectionCard title="Career Guidance Introduction">
      <form action={formAction} className="space-y-4">
        <Field label="Intro paragraph">
          <TextArea name="intro" required rows={3} defaultValue={initial.intro} />
        </Field>
        <FormMessage state={state} />
        <SubmitButton>Save Career Guidance</SubmitButton>
      </form>
    </SectionCard>
  );
}

export function FooterForm({ initial }: { initial: FooterContent }) {
  const [state, formAction] = useFormState(updateFooterContentAction, {});
  return (
    <SectionCard title="Footer Text">
      <form action={formAction} className="space-y-4">
        <Field label="Footer description">
          <TextArea name="text" required rows={3} defaultValue={initial.text} />
        </Field>
        <FormMessage state={state} />
        <SubmitButton>Save Footer</SubmitButton>
      </form>
    </SectionCard>
  );
}

export function AnnouncementBannerForm({ initial }: { initial: AnnouncementBanner }) {
  const [state, formAction] = useFormState(updateAnnouncementBannerAction, {});
  return (
    <SectionCard title="Announcement Banner" description="An optional banner shown site-wide — e.g. for a limited-time offer.">
      <form action={formAction} className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input type="checkbox" name="enabled" defaultChecked={initial.enabled} />
          Show the banner
        </label>
        <Field label="Banner text">
          <TextInput name="text" maxLength={200} defaultValue={initial.text} />
        </Field>
        <Field label="Link URL (optional)">
          <TextInput name="url" type="url" defaultValue={initial.url ?? ""} />
        </Field>
        <FormMessage state={state} />
        <SubmitButton>Save Banner</SubmitButton>
      </form>
    </SectionCard>
  );
}

export function SeoForm({ initial }: { initial: SeoContent }) {
  const [state, formAction] = useFormState(updateSeoContentAction, {});
  return (
    <SectionCard title="SEO" description="Overrides for the homepage and about page's title/description meta tags.">
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Home page title">
            <TextInput name="homeTitle" maxLength={70} defaultValue={initial.homeTitle ?? ""} />
          </Field>
          <Field label="Home page description">
            <TextInput name="homeDescription" maxLength={200} defaultValue={initial.homeDescription ?? ""} />
          </Field>
          <Field label="About page title">
            <TextInput name="aboutTitle" maxLength={70} defaultValue={initial.aboutTitle ?? ""} />
          </Field>
          <Field label="About page description">
            <TextInput name="aboutDescription" maxLength={200} defaultValue={initial.aboutDescription ?? ""} />
          </Field>
        </div>
        <Field label="Open Graph image URL (optional)">
          <TextInput name="ogImageUrl" type="url" defaultValue={initial.ogImageUrl ?? ""} />
        </Field>
        <FormMessage state={state} />
        <SubmitButton>Save SEO</SubmitButton>
      </form>
    </SectionCard>
  );
}
