type MonthBucket = { key: string; label: string };

/** Returns the last `n` months as `{key, label}` buckets, oldest first. */
export function lastMonths(n: number): MonthBucket[] {
  const now = new Date();
  const out: MonthBucket[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en-US", { month: "short" }) });
  }
  return out;
}

/** Counts or sums `items` into the given month buckets by `createdAt`. */
export function bucketByMonth<T extends { createdAt: Date | string }>(
  items: T[],
  months: MonthBucket[],
  pick?: (item: T) => number
): number[] {
  const counts = new Array(months.length).fill(0) as number[];
  for (const item of items) {
    const d = new Date(item.createdAt);
    const idx = months.findIndex((m) => m.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (idx >= 0) counts[idx] += pick ? pick(item) : 1;
  }
  return counts;
}

/** Percent change between the last two values of a series (0 → 100 if growth from zero). */
export function pctChange(series: number[]): number {
  if (series.length < 2) return 0;
  const last = series[series.length - 1] ?? 0;
  const prev = series[series.length - 2] ?? 0;
  if (prev === 0) return last === 0 ? 0 : 100;
  return Math.round(((last - prev) / prev) * 100);
}
