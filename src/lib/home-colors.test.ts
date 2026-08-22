import { describe, it, expect } from "vitest";
import { getProductGradient, getProductTextColor, getInitials } from "./home-colors";

describe("getProductGradient", () => {
  it("is deterministic for the same id", () => {
    expect(getProductGradient(42)).toBe(getProductGradient(42));
    expect(getProductGradient(7, true)).toBe(getProductGradient(7, true));
  });

  it("cycles through the gradient palette", () => {
    expect(getProductGradient(0)).toBe(getProductGradient(6));
    expect(getProductGradient(0, true)).toBe(getProductGradient(6, true));
  });

  it("uses dark variants in dark mode", () => {
    expect(getProductGradient(1, true)).toContain("900");
    expect(getProductGradient(1, true)).not.toBe(getProductGradient(1, false));
  });
});

describe("getProductTextColor", () => {
  it("returns a tailwind text color class", () => {
    expect(getProductTextColor(0)).toMatch(/^text-\w+-\d+$/);
  });

  it("cycles deterministically", () => {
    expect(getProductTextColor(0)).toBe(getProductTextColor(6));
  });
});

describe("getInitials", () => {
  it("takes first letters of words", () => {
    expect(getInitials("Tech Hub")).toBe("TH");
    expect(getInitials("Style Nest")).toBe("SN");
  });

  it("caps at two characters", () => {
    expect(getInitials("Mighty Oak Gallery")).toBe("MO");
  });

  it("handles empty and single-word names", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials("Vellora")).toBe("V");
  });
});