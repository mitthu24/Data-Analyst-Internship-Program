import type { Metadata } from "next";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for the Data Analyst Internship Program website.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-14 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Privacy Policy</h1>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-6 text-slate-700 leading-relaxed">
          <p>
            This Privacy Policy explains how the Data Analyst Internship Program (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
            collects, uses, and protects information submitted through this website.
          </p>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Information we collect</h2>
            <p>
              When you submit the Contact form or an enrollment inquiry, we collect your name, email address, phone
              number (if provided), and any message you send. We do not collect payment card details directly —
              enrollment payments are processed by our third-party enrollment partner.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">How we use your information</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>To respond to your inquiries and enrollment questions.</li>
              <li>To record leads in our internal tracking sheet for follow-up.</li>
              <li>To send you information about the program you have expressed interest in.</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Third-party services</h2>
            <p>
              Enrollment payments are handled by our enrollment partner (Superprofile). Lead information submitted
              through our Contact form may also be recorded in a Google Sheet used internally for follow-up. We do
              not sell your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Data retention</h2>
            <p>We retain inquiry and lead information for as long as necessary to respond to you and manage enrollments.</p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Your rights</h2>
            <p>
              You may ask us to update or delete information you have submitted by contacting us through the{" "}
              <a href="/contact" className="font-semibold text-emerald-600">Contact page</a>.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-navy-900">Changes to this policy</h2>
            <p>We may update this policy from time to time. Continued use of the website after changes means you accept the updated policy.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
