import { cn } from "@/lib/utils";

type AreaChartProps = {
  data: number[];
  labels?: string[];
  height?: number;
  className?: string;
  label?: string;
  formatValue?: (n: number) => string;
};

const VIEW_W = 640;

/** Brand-safe area trend chart (hand-built SVG, no deps). Terracotta line + soft fill, hairline gridlines. */
export function AreaChart({
  data,
  labels,
  height = 240,
  className,
  label = "Trend chart",
  formatValue = (n) => String(n),
}: AreaChartProps) {
  if (data.length === 0) return null;

  const padL = 40;
  const padR = 12;
  const padT = 16;
  const padB = 28;
  const innerW = VIEW_W - padL - padR;
  const innerH = height - padT - padB;

  const max = Math.max(...data, 0);
  const niceMax = max <= 0 ? 1 : Math.ceil(max / 4) * 4 || 1;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const x = (i: number) => padL + stepX * i;
  const y = (v: number) => padT + innerH * (1 - v / niceMax);

  const linePts = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const line = linePts.join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${(padT + innerH).toFixed(1)} L${padL},${(
    padT + innerH
  ).toFixed(1)} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <figure className={cn("m-0", className)}>
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${VIEW_W} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gridlines + y labels */}
        {gridLines.map((g) => {
          const gy = padT + innerH * (1 - g);
          return (
            <g key={g}>
              <line
                x1={padL}
                y1={gy}
                x2={VIEW_W - padR}
                y2={gy}
                style={{ stroke: "var(--color-hairline)" }}
                strokeWidth={1}
              />
              <text
                x={padL - 8}
                y={gy + 4}
                textAnchor="end"
                style={{ fill: "var(--color-clay-mute)" }}
                fontSize={11}
              >
                {formatValue(Math.round(niceMax * g))}
              </text>
            </g>
          );
        })}

        {/* Area + line */}
        <path d={area} style={{ fill: "var(--color-terracotta)" }} fillOpacity={0.1} stroke="none" />
        <path
          d={line}
          fill="none"
          style={{ stroke: "var(--color-terracotta)" }}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Points + hover titles */}
        {data.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={3} style={{ fill: "var(--color-terracotta)" }}>
            <title>
              {labels?.[i] ? `${labels[i]}: ${formatValue(v)}` : formatValue(v)}
            </title>
          </circle>
        ))}

        {/* X labels */}
        {labels?.map((lb, i) => (
          <text
            key={i}
            x={x(i)}
            y={height - 8}
            textAnchor="middle"
            style={{ fill: "var(--color-clay-mute)" }}
            fontSize={11}
          >
            {lb}
          </text>
        ))}
      </svg>
    </figure>
  );
}
