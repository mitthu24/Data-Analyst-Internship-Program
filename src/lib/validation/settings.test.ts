import { describe, it, expect } from "vitest";
import { pricingSettingsSchema } from "./settings";

const basePricing = {
  currency: "INR",
  referencePriceInr: 19999,
  launchPriceInr: 1999,
  enrollmentPaymentInr: 499,
  enrollmentUrl: "https://superprofile.bio/vp/data-analyst-internship-program",
  refundWindowDays: 7,
  refundPolicyText: "",
};

describe("pricingSettingsSchema", () => {
  it("accepts valid, consistent pricing", () => {
    expect(pricingSettingsSchema.safeParse(basePricing).success).toBe(true);
  });

  it("rejects a launch price higher than the reference price", () => {
    const result = pricingSettingsSchema.safeParse({ ...basePricing, launchPriceInr: 25000 });
    expect(result.success).toBe(false);
  });

  it("rejects an enrollment payment higher than the launch price", () => {
    const result = pricingSettingsSchema.safeParse({ ...basePricing, enrollmentPaymentInr: 5000 });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid enrollment URL", () => {
    const result = pricingSettingsSchema.safeParse({ ...basePricing, enrollmentUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });
});
