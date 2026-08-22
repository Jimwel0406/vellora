import { describe, it, expect } from "vitest";
import { cn, formatPrice, slugify } from "./utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", null, undefined, false, "b")).toBe("a b");
  });

  it("supports conditional object syntax", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });
});

describe("formatPrice", () => {
  it("formats cents as dollars", () => {
    expect(formatPrice(100)).toBe("$1.00");
    expect(formatPrice(0)).toBe("$0.00");
    expect(formatPrice(1234)).toBe("$12.34");
  });

  it("handles large amounts", () => {
    expect(formatPrice(1000000)).toBe("$10000.00");
  });
});

describe("slugify", () => {
  it("lowercases and dashes words", () => {
    expect(slugify("Tech Hub!")).toBe("tech-hub");
  });

  it("strips trailing slashes and cleans up dashes", () => {
    expect(slugify("Home  && Craft")).toBe("home-craft");
    expect(slugify("  Spaced  Out  ")).toBe("spaced-out");
  });

  it("handles empty input", () => {
    expect(slugify("")).toBe("");
  });
});