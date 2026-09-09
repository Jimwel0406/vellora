import { Trophy, Star, TrendingUp } from "lucide-react";

/* Variation A — Trophy icon with text-stroke */
export function TrophyBadge() {
  return (
    <span className="hidden sm:flex flex-col items-center gap-1 select-none" aria-hidden="true">
      <Trophy
        className="w-16 h-16 lg:w-24 lg:h-24 text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.1)]"
        strokeWidth={1}
      />
      <span className="font-heading text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-white/10">
        Top Rated
      </span>
    </span>
  );
}

/* Variation B — Compact stats card */
export function ProductCount({ count }: { count: number }) {
  return (
    <span className="hidden sm:flex items-center gap-5 select-none" aria-hidden="true">
      <span className="w-px h-12 bg-white/15" />
      <div className="flex flex-col items-center gap-1">
        <span className="flex items-baseline gap-1">
          <span className="font-heading text-4xl lg:text-5xl font-bold text-white leading-none">
            {count}
          </span>
          <span className="font-heading text-lg lg:text-xl font-bold text-terracotta leading-none">
            +
          </span>
        </span>
        <span className="font-label text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-white/50">
          Best Picks
        </span>
      </div>
    </span>
  );
}

/* Variation C — Star icon with text-stroke */
export function StarDecoration() {
  return (
    <span className="hidden sm:flex items-center gap-3 select-none" aria-hidden="true">
      <span className="font-heading text-[80px] lg:text-[140px] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.08)]">
        ★
      </span>
      <span className="flex flex-col">
        <span className="font-heading text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-white/10">
          Curated
        </span>
        <span className="font-heading text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-white/10">
          Selection
        </span>
      </span>
    </span>
  );
}
