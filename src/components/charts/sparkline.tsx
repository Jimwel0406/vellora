import { cn } from "@/lib/utils";

type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  fill?: boolean;
  className?: string;
  label?: string;
};

/** Tiny inline trend line. Color comes from `currentColor` (set text-* on the parent). Server-safe. */
export function Sparkline({
  data,
  width = 120,
  height = 36,
  strokeWidth = 1.75,
  fill = true,
  className,
  label,
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pad = strokeWidth + 0.5;

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = pad + (height - pad * 2) * (1 - (d - min) / range);
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${width.toFixed(2)},${height} L0,${height} Z`;

  return (
    <svg
      role="img"
      aria-label={label ?? "Trend sparkline"}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      preserveAspectRatio="none"
    >
      {fill && <path d={area} fill="currentColor" fillOpacity={0.1} stroke="none" />}
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
