import { describe, it, expect } from "vitest";
import {
  splitVendorPayout,
  clampCommissionRate,
  DEFAULT_COMMISSION_RATE,
} from "./vendor-payout";

describe("clampCommissionRate", () => {
  it("keeps rates within bounds", () => {
    expect(clampCommissionRate(0.1)).toBe(0.1);
    expect(clampCommissionRate(0)).toBe(0);
    expect(clampCommissionRate(0.5)).toBe(0.5);
  });

  it("clamps negative and over-50% rates", () => {
    expect(clampCommissionRate(-0.2)).toBe(0);
    expect(clampCommissionRate(0.7)).toBe(0.5);
  });

  it("falls back to default on NaN", () => {
    expect(clampCommissionRate(NaN)).toBe(DEFAULT_COMMISSION_RATE);
  });
});

describe("splitVendorPayout", () => {
  it("splits a subtotal at the default 10% rate", () => {
    expect(splitVendorPayout(10000, DEFAULT_COMMISSION_RATE)).toEqual({
      subtotal: 10000,
      commission: 1000,
      vendorPayout: 9000,
    });
  });

  it("rounds commission to whole cents", () => {
    // 15% of $99.99 = $14.9985 -> rounds to 1500
    const r = splitVendorPayout(9999, 0.15);
    expect(r.commission).toBe(1500);
    expect(r.vendorPayout).toBe(9999 - 1500);
  });

  it("never lets commission exceed the subtotal", () => {
    const r = splitVendorPayout(500, 0.5);
    expect(r.commission).toBe(250);
    expect(r.vendorPayout).toBe(250);
  });

  it("yields full payout at 0% commission", () => {
    const r = splitVendorPayout(10000, 0);
    expect(r.commission).toBe(0);
    expect(r.vendorPayout).toBe(10000);
  });

  it("keeps payout non-negative with zero subtotal", () => {
    const r = splitVendorPayout(0, 0.1);
    expect(r.commission).toBe(0);
    expect(r.vendorPayout).toBe(0);
  });
});