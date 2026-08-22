import { describe, it, expect } from "vitest";
import { normalizePromoCode, evaluatePromoCode } from "./promo";

function row(overrides: Partial<Parameters<typeof evaluatePromoCode>[0]> = {}) {
  return {
    id: 1,
    code: "SAVE10",
    discountType: "percent" as const,
    discountValue: 10,
    minOrderAmount: null,
    maxUses: null,
    usedCount: 0,
    active: true,
    expiresAt: null,
    createdAt: new Date(),
    ...overrides,
  };
}

describe("normalizePromoCode", () => {
  it("trims, uppercases, and strips internal whitespace", () => {
    expect(normalizePromoCode("  save 10 ")).toBe("SAVE10");
    expect(normalizePromoCode("welcome\n20")).toBe("WELCOME20");
  });

  it("passes through already-normalized codes", () => {
    expect(normalizePromoCode("SAVE10")).toBe("SAVE10");
  });
});

describe("evaluatePromoCode", () => {
  it("applies a percent discount", () => {
    const result = evaluatePromoCode(row(), 10000);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.discountAmount).toBe(1000);
  });

  it("applies a fixed discount", () => {
    const result = evaluatePromoCode(row({ discountType: "fixed", discountValue: 500 }), 10000);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.discountAmount).toBe(500);
  });

  it("rounds percent discounts to whole cents", () => {
    const result = evaluatePromoCode(row({ discountValue: 15 }), 9999);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.discountAmount).toBe(1500);
  });

  it("rejects disabled codes", () => {
    const result = evaluatePromoCode(row({ active: false }), 10000);
    expect(result).toEqual({ ok: false, error: "This promo code has been disabled." });
  });

  it("rejects expired codes", () => {
    const result = evaluatePromoCode(row({ expiresAt: new Date(Date.now() - 1000) }), 10000);
    expect(result).toEqual({ ok: false, error: "This promo code has expired." });
  });

  it("accepts codes that expire in the future", () => {
    const result = evaluatePromoCode(row({ expiresAt: new Date(Date.now() + 3600_000) }), 10000);
    expect(result.ok).toBe(true);
  });

  it("rejects below-minimum totals", () => {
    const result = evaluatePromoCode(row({ minOrderAmount: 20000 }), 10000);
    expect(result.ok).toBe(false);
    expect(result).toEqual({
      ok: false,
      error: "This code requires a minimum order of $200.00.",
    });
  });

  it("accepts totals at or above the minimum", () => {
    const result = evaluatePromoCode(row({ minOrderAmount: 20000 }), 20000);
    expect(result.ok).toBe(true);
  });

  it("rejects exhausted usage limits", () => {
    const result = evaluatePromoCode(row({ maxUses: 5, usedCount: 5 }), 10000);
    expect(result).toEqual({ ok: false, error: "This promo code has reached its usage limit." });
  });

  it("accepts codes with remaining uses", () => {
    const result = evaluatePromoCode(row({ maxUses: 5, usedCount: 4 }), 10000);
    expect(result.ok).toBe(true);
  });

  it("rejects discounts that exceed the order total", () => {
    const result = evaluatePromoCode(row({ discountValue: 100 }), 10000);
    expect(result).toEqual({ ok: false, error: "This promo discount exceeds your order total." });
  });
});