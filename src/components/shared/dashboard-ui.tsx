import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/charts/sparkline";

export type Accent = "terracotta" | "ochre" | "emerald" | "clay" | "blue" | "amber";

const accentChip: Record<Accent, string> = {
  terracotta: "bg-terracotta/10 text-terracotta",
  ochre: "bg-ochre/15 text-ochre",
  emerald: "bg-emerald-50 text-emerald-700",
  clay: "bg-clay/10 text-clay",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
};

/* -- Page header -- */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">
      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase font-label tracking-[0.25em] text-terracotta mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-clay">{title}</h1>
        {description && <p className="text-sm text-clay/60 mt-1.5 max-w-xl">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </header>
  );
}

/* -- Trend delta -- */
function TrendDelta({ value, label }: { value: number; label?: string }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums",
        up ? "text-emerald-600" : "text-red-600"
      )}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden />
      {up ? "+" : ""}
      {value}%
      {label && <span className="text-clay/40 font-normal">· {label}</span>}
    </span>
  );
}

/* -- Stat tile (KPI) -- */
export function StatTile({
  icon: Icon,
  label,
  value,
  accent = "terracotta",
  hint,
  trend,
  spark,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  accent?: Accent;
  hint?: string;
  trend?: { value: number; label?: string };
  spark?: number[];
}) {
  return (
    <div className="bg-white border border-clay/10 rounded-xl p-5 shadow-[0_1px_2px_rgba(61,43,31,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(61,43,31,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center", accentChip[accent])}>
            <Icon className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-clay/50">
            {label}
          </span>
        </div>
        {spark && spark.length > 1 && (
          <Sparkline data={spark} width={72} height={28} className="text-clay/25" label={`${label} trend`} />
        )}
      </div>
      <p className="text-2xl font-bold text-clay tabular-nums mt-3">{value}</p>
      {(trend || hint) && (
        <div className="mt-1 flex items-center gap-2">
          {trend && <TrendDelta value={trend.value} label={trend.label} />}
          {hint && !trend && <p className="text-xs text-clay/50">{hint}</p>}
        </div>
      )}
    </div>
  );
}

/* -- Status pill -- */
const statusStyles: Record<string, { wrap: string; dot: string }> = {
  paid: { wrap: "bg-emerald-50 text-emerald-700 ring-emerald-600/10", dot: "bg-emerald-600" },
  completed: { wrap: "bg-emerald-50 text-emerald-700 ring-emerald-600/10", dot: "bg-emerald-600" },
  shipped: { wrap: "bg-blue-50 text-blue-700 ring-blue-600/10", dot: "bg-blue-600" },
  delivered: { wrap: "bg-emerald-50 text-emerald-700 ring-emerald-600/10", dot: "bg-emerald-600" },
  pending: { wrap: "bg-amber-50 text-amber-700 ring-amber-600/10", dot: "bg-amber-500" },
  processing: { wrap: "bg-amber-50 text-amber-700 ring-amber-600/10", dot: "bg-amber-500" },
  cancelled: { wrap: "bg-clay/5 text-clay/60 ring-clay/10", dot: "bg-clay/40" },
  failed: { wrap: "bg-clay/5 text-clay/60 ring-clay/10", dot: "bg-clay/40" },
  refunded: { wrap: "bg-clay/5 text-clay/60 ring-clay/10", dot: "bg-clay/40" },
};

export function StatusPill({ status }: { status: string }) {
  const key = status.toLowerCase();
  const s = statusStyles[key] ?? { wrap: "bg-clay/5 text-clay/60 ring-clay/10", dot: "bg-clay/40" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset whitespace-nowrap",
        s.wrap
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} aria-hidden />
      {status}
    </span>
  );
}

/* -- Card (simple surface) -- */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-white border border-clay/10 rounded-xl shadow-[0_1px_2px_rgba(61,43,31,0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}

/* -- Panel (card with optional header) -- */
export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("bg-white border border-clay/10 rounded-xl shadow-[0_1px_2px_rgba(61,43,31,0.04)]", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-clay/10">
          <div>
            {title && <h2 className="text-sm font-bold text-clay">{title}</h2>}
            {description && <p className="text-xs text-clay/50 mt-0.5">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export const primaryButton =
  "inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-terracotta text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-clay transition-colors duration-200 disabled:opacity-50 shrink-0 cursor-pointer";

export const outlineButton =
  "inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg border border-clay/15 bg-white text-clay/70 text-[11px] font-bold uppercase tracking-[0.15em] hover:border-clay/30 hover:text-clay transition-colors duration-200 shrink-0 cursor-pointer";

export const fieldInput =
  "mt-2 w-full h-11 px-4 rounded-lg border border-clay/20 bg-white text-clay text-sm placeholder:text-clay/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-shadow";

export const fieldLabel =
  "block text-[10px] font-bold uppercase tracking-[0.2em] text-clay/50";

export const tableHead =
  "text-left p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-clay/50";

/* -- Empty state -- */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center px-6 py-12", className)}>
      <span className="w-12 h-12 rounded-xl bg-clay/[0.06] flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-clay/40" aria-hidden />
      </span>
      <p className="font-semibold text-clay">{title}</p>
      {description && <p className="text-sm text-clay/50 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* -- Skeleton (loading) -- */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-clay/[0.06] motion-reduce:animate-none animate-pulse",
        className
      )}
      aria-hidden
    />
  );
}
