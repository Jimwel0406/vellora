import Link from "next/link";
import { Star, ArrowUpRight } from "lucide-react";
import type { StoreItem } from "./store-types";
import { formatRating } from "./store-types";

/* ─── Standard card (used in grid) ────────────────────────────────────────── */

export function StoreCardC({ item }: { item: StoreItem }) {
  const { store } = item;

  return (
    <div className="group relative">
      <Link
        href={`/stores/${store.slug}`}
        aria-label={`Visit ${store.name}`}
        className="block relative aspect-[4/3] bg-[#F9F7F3] overflow-hidden rounded-lg"
      >
        {item.coverImage ? (
          <img
            src={item.coverImage}
            alt={store.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
        ) : store.logo ? (
          <img
            src={store.logo}
            alt={`${store.name} logo`}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-terracotta/[0.06]">
            <span className="text-5xl font-heading font-bold text-terracotta/20">
              {store.name.charAt(0)}
            </span>
          </div>
        )}
        {item.isNew && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-[0.1em] bg-ochre text-white z-10">
            New
          </span>
        )}
      </Link>

      <div className="mt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[15px] font-heading font-semibold text-clay leading-snug">
              {store.name}
            </h3>
            {item.categories[0] && (
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-terracotta/70 mt-1">
                {item.categories[0]}
              </p>
            )}
          </div>
          <Link
            href={`/stores/${store.slug}`}
            className="shrink-0 mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-clay hover:text-terracotta transition-colors"
          >
            Visit
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {store.description && (
          <p className="mt-2 text-[13px] text-clay/60 leading-relaxed line-clamp-2">
            {store.description}
          </p>
        )}
        <div className="mt-2.5 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-rating text-rating" />
            <span className="text-[12px] font-bold text-clay">
              {formatRating(item.rating)}
            </span>
          </span>
          <span className="text-[11px] text-clay">
            {item.reviewCount > 0
              ? `${item.reviewCount} reviews`
              : "New"}
          </span>
          <span className="text-[11px] text-clay">
            {item.productCount} products
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Dominant store (editorial hero within directory) ─────────────────────── */

export function StoreCardDominant({ item }: { item: StoreItem }) {
  const { store } = item;

  return (
    <div className="group">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center">
        {/* Large image */}
        <Link
          href={`/stores/${store.slug}`}
          aria-label={`Visit ${store.name}`}
          className="block relative overflow-hidden rounded-2xl"
        >
          {item.coverImage ? (
            <img
              src={item.coverImage}
              alt={store.name}
              className="w-full h-[320px] sm:h-[400px] lg:h-[460px] object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          ) : store.logo ? (
            <img
              src={store.logo}
              alt={`${store.name} logo`}
              className="w-full h-[320px] sm:h-[400px] lg:h-[460px] object-cover"
            />
          ) : (
            <div className="w-full h-[320px] sm:h-[400px] lg:h-[460px] flex items-center justify-center bg-terracotta/[0.06]">
              <span className="text-7xl font-heading font-bold text-terracotta/15">
                {store.name.charAt(0)}
              </span>
            </div>
          )}
          {item.isNew && (
            <span className="absolute top-4 left-4 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-[0.1em] bg-ochre text-white z-10">
              New
            </span>
          )}
        </Link>

        {/* Editorial info */}
        <div className="flex flex-col">
          <span className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-terracotta/60 mb-3">
            {item.categories[0] || "Store"}
          </span>
          <h3 className="font-heading text-[32px] sm:text-[40px] lg:text-[48px] text-clay tracking-tight leading-[1.05]">
            {store.name}
          </h3>
          <p className="mt-5 text-base sm:text-lg text-clay/60 leading-relaxed max-w-md">
            {store.description ||
              `A curated collection of products from ${store.name}.`}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-rating text-rating" />
              <span className="text-sm font-bold text-clay">
                {formatRating(item.rating)}
              </span>
            </span>
            <span className="h-4 w-px bg-clay/10" />
            <span className="text-sm text-clay/60">
              {item.reviewCount > 0
                ? `${item.reviewCount} reviews`
                : "New store"}
            </span>
            <span className="h-4 w-px bg-clay/10" />
            <span className="text-sm text-clay/60">
              {item.productCount} products
            </span>
          </div>

          <Link
            href={`/stores/${store.slug}`}
            className="group/cta mt-8 inline-flex items-center gap-2 font-label text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-clay hover:text-terracotta transition-colors w-fit"
          >
            Visit Store
            <ArrowUpRight className="w-4 h-4 opacity-40 group-hover/cta:opacity-100 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
