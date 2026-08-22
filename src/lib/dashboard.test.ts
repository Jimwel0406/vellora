import { describe, it, expect } from "vitest";
import { lastMonths, bucketByMonth, pctChange } from "./dashboard";

describe("lastMonths", () => {
  it("returns the requested number of months, oldest first", () => {
    const months = lastMonths(3);
    expect(months).toHaveLength(3);
    expect(months[0].label).toBeTruthy();
    expect(months[0].key < months[1].key).toBe(true);
    expect(months[1].key < months[2].key).toBe(true);
  });

  it("labels months with the short English month name", () => {
    const months = lastMonths(12);
    expect(months).toHaveLength(12);
    const labels = months.map((m) => m.label);
    expect(labels).toContain("Jan");
    expect(new Set(labels).size).toBe(12);
  });
});

describe("bucketByMonth", () => {
  const months = [
    { key: "2024-0", label: "Jan" },
    { key: "2024-1", label: "Feb" },
    { key: "2024-2", label: "Mar" },
  ];

  it("counts items into matching buckets", () => {
    const items = [
      { createdAt: new Date(2024, 0, 15) },
      { createdAt: new Date(2024, 1, 10) },
      { createdAt: new Date(2024, 1, 20) },
      { createdAt: new Date(2024, 5, 10) }, // outside range
    ];
    expect(bucketByMonth(items, months)).toEqual([1, 2, 0]);
  });

  it("sums picked values when a picker is given", () => {
    const items = [
      { createdAt: new Date(2024, 0, 15), amount: 100 },
      { createdAt: new Date(2024, 2, 3), amount: 250 },
    ];
    expect(bucketByMonth(items, months, (i) => i.amount)).toEqual([100, 0, 250]);
  });

  it("accepts date-string inputs", () => {
    const items = [{ createdAt: "2024-01-15T00:00:00Z" }];
    expect(bucketByMonth(items, months)).toEqual([1, 0, 0]);
  });
});

describe("pctChange", () => {
  it("computes growth between the last two values", () => {
    expect(pctChange([100, 150])).toBe(50);
  });

  it("computes negative growth", () => {
    expect(pctChange([200, 100])).toBe(-50);
  });

  it("returns 100 when growing from zero", () => {
    expect(pctChange([0, 100])).toBe(100);
  });

  it("returns 0 when both zero", () => {
    expect(pctChange([0, 0])).toBe(0);
  });

  it("returns 0 for a single-value series", () => {
    expect(pctChange([150])).toBe(0);
  });

  it("returns 0 for an empty series", () => {
    expect(pctChange([])).toBe(0);
  });
});