import { describe, it, expect } from "vitest";
import { PRODUCT_TAGS, isProductTag, DEFAULT_STOCK } from "./product-options";

describe("isProductTag", () => {
  it("accepts known tags", () => {
    expect(isProductTag("Best Seller")).toBe(true);
    expect(isProductTag("Gaming")).toBe(true);
    expect(isProductTag("Zero Waste")).toBe(true);
  });

  it("rejects unknown tags and non-tags", () => {
    expect(isProductTag("Totally Fake")).toBe(false);
    expect(isProductTag("")).toBe(false);
  });

  it("is a valid type guard for the tag union", () => {
    const value: string = "New";
    if (isProductTag(value)) {
      const tag: (typeof PRODUCT_TAGS)[number] = value;
      expect(tag).toBe("New");
    }
  });
});

describe("DEFAULT_STOCK", () => {
  it("is a large positive number", () => {
    expect(DEFAULT_STOCK).toBe(999999);
    expect(DEFAULT_STOCK).toBeGreaterThan(0);
  });
});