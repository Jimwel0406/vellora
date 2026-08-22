import { cn } from "@/lib/utils";

export type DonutSegment = { label: string; value: number; color: string };

type DonutChartProps = {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
  label?: string;
};

/** Order-status donut. Colors are CSS tokens passed via `segments[].color`. Server-safe. */
export function DonutChart({
  segments,
  size = 168,
  thickness = 18,
  centerLabel,
  centerValue,
  className,
  label = "Breakdown",
}: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((seg) => {
      const len = total > 0 ? (seg.value / total) * circumference : 0;
      const arc = { ...seg, len, dashoffset: -offset };
      offset += len;
      return arc;
    });

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <svg
        role="img"
        aria-label={label}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0"
      >
        <circle cx={c} cy={c} r={r} style={{ stroke: "var(--color-hairline)" }} strokeWidth={thickness} fill="none" />
        {total > 0 &&
          arcs.map((arc, i) => (
            <circle
              key={i}
              cx={c}
              cy={c}
              r={r}
              fill="none"
              style={{ stroke: arc.color }}
              strokeWidth={thickness}
              strokeLinecap="butt"
              strokeDasharray={`${arc.len} ${circumference - arc.len}`}
              strokeDashoffset={arc.dashoffset}
              transform={`rotate(-90 ${c} ${c})`}
            />
          ))}
        {centerValue && (
          <text x={c} y={c - 2} textAnchor="middle" style={{ fill: "var(--color-clay)" }} fontSize={22} fontWeight={700}>
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text x={c} y={c + 16} textAnchor="middle" style={{ fill: "var(--color-clay-mute)" }} fontSize={11}>
            {centerLabel}
          </text>
        )}
      </svg>

      <ul className="w-full space-y-1.5">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} aria-hidden />
              <span className="text-clay/70 truncate">{seg.label}</span>
            </span>
            <span className="font-medium text-clay tabular-nums shrink-0">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
