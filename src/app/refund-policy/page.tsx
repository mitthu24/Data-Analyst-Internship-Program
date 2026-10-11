import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { settings } from "@/lib/content/settings";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "The 7-day refund policy for the Data Analyst Internship Program.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-14 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Refund Policy</h1>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl text-slate-700 leading-relaxed">
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h2 className="mb-2 text-lg font-bold text-emerald-800">
              {settings.refundWindowDays}-Day Money-Back Guarantee
            </h2>
            <p className="text-emerald-900">
              If you do not like the program or find it unsuitable within the first {settings.refundWindowDays} days
              of the batch starting, you are entitled to a 100% refund of amounts paid, subject to the terms below.
            </p>
          </div>

          <h3 className="mb-2 text-base font-bold text-navy-900">How to request a refund</h3>
          <p>
            Contact us through the <a href="/contact" className="text-emerald-600 font-semibold">Contact page</a>{" "}
            within {settings.refundWindowDays} days of your batch&apos;s start date, stating your enrollment details
            and the reason for your request.
          </p>

          <h3 className="mb-2 mt-6 text-base font-bold text-navy-900">Terms of the guarantee</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>The refund window is {settings.refundWindowDays} days from the start of your batch, not from your payment date.</li>
            <li>Refunds are processed to the original payment method unless otherwise agreed.</li>
            <li>This guarantee applies to the amount actually paid for the batch you are enrolled in.</li>
            <li>Final approval and processing of each refund request rests with the program founder.</li>
            <li>Misuse of the guarantee (e.g. repeated enroll-and-refund cycles) may result in a refund request being declined.</li>
          </ul>

          <h3 className="mb-2 mt-6 text-base font-bold text-navy-900">Questions</h3>
          <p>
            If you have questions about this policy before enrolling, please reach out via the{" "}
            <a href="/contact" className="text-emerald-600 font-semibold">Contact page</a> — we&apos;re happy to
            clarify the terms before you pay.
          </p>
        </div>
      </Section>
    </>
  );
}
