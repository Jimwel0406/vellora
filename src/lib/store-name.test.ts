import { describe, it, expect } from "vitest";
import { slugify, nameError, STORE_NAME_MAX } from "./store-name";

describe("slugify", () => {
  it("lowercases and replaces non-alphanumeric runs with a dash", () => {
    expect(slugify("Tech Hub!")).toBe("tech-hub");
    expect(slugify("  Home&Craft  ")).toBe("home-craft");
  });

  it("strips leading and trailing dashes", () => {
    expect(slugify("--FitGear--")).toBe("fitgear");
  });

  it("drops unsupported characters entirely", () => {
    expect(slugify("Café & Co.")).toBe("caf-co");
    expect(slugify("100% Pure")).toBe("100-pure");
  });
});

describe("nameError", () => {
  it("accepts a normal store name", () => {
    expect(nameError("Tech Hub")).toBeNull();
    expect(nameError("GreenLeaf")).toBeNull();
  });

  it("rejects non-strings and empty strings", () => {
    expect(nameError("")).toBe("Store name is required.");
    expect(nameError("   ")).toBe("Store name is required.");
    expect(nameError(42)).toBe("Store name is required.");
    expect(nameError(null)).toBe("Store name is required.");
  });

  it("trims before validating length", () => {
    expect(nameError("x".repeat(STORE_NAME_MAX))).toBeNull();
    expect(nameError(`  ${"x".repeat(STORE_NAME_MAX + 1)}  `)).toBe(
      `Store name must be ${STORE_NAME_MAX} characters or fewer.`
    );
  });

  it("rejects unsafe characters", () => {
    expect(nameError("<script>alert(1)</script>")).toContain(
      "Store name can only contain"
    );
    expect(nameError('drop table "users"')).toContain(
      "Store name can only contain"
    );
  });

  it("accepts accented letters and allowed punctuation", () => {
    expect(nameError("Café & Sons, Co.")).toBeNull();
    expect(nameError("O'Brien's! (Outlet)")).toBeNull();
  });
});