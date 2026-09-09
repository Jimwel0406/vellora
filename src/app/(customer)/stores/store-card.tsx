import Link from "next/link";
import { Star, ArrowRight, MapPin, BadgeCheck } from "lucide-react";
import type { StoreItem } from "./store-types";
import { formatRating } from "./store-types";

export function StoreCard({ item }: { item: StoreItem }) {
  const { store } = item;
  const badge = item.featured
    ? "Featured"
    : item.isNew
      ? "New"
      : "Verified";
  const badgeClasses =
    badge === "Featured"
      ? "bg-[#17201C] text-white"
      : badge === "New"
        ? "bg-white/95 text-[#17201C]"
        : "bg-white/95 text-[#17201C]";

  return (
    <div className="group flex flex-col bg-white border border-[#E5E8E5] rounded-xl overflow-hidden hover:border-[#17201C]/30 hover:shadow-[0_18px_40px_-28px_rgba(23,32,28,0.35)] transition-all duration-300">
      {/* Cover */}
      <Link href={`/stores/${store.slug}`} aria-label={`Visit ${store.name}`}>
        <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-[#F2F1EC]">
          {item.coverImage ? (
            <img
              src={item.coverImage}
              alt={store.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-black text-[#17201C]/10">
                {store.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Badge */}
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.18em] ${badgeClasses}`}
          >
            {badge}
          </span>

          {/* Logo avatar */}
          {store.logo ? (
            <img
              src={store.logo}
              alt={`${store.name} logo`}
              className="absolute bottom-3 left-3 w-10 h-10 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <span className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-[#17201C] text-white flex items-center justify-center text-sm font-bold ring-2 ring-white">
              {store.name.charAt(0)}
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-base font-bold text-[#17201C] leading-tight">
          {store.name}
        </h3>

        <p className="mt-1.5 text-xs text-[#6B716D] leading-relaxed line-clamp-2 flex-1">
          {store.description || `${item.categories[0] ?? "Independent"} store`}
        </p>

        {/* Category */}
        {item.categories[0] && (
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B716D]">
            {item.categories[0]}
          </p>
        )}

        {/* Rating */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="hidden min-[360px]:flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 ${
                  i <= Math.round(item.rating ?? 5)
                    ? "fill-rating text-rating"
                    : "fill-clay/15 text-clay/15"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#17201C]">
            {formatRating(item.rating)}
          </span>
          {item.reviewCount > 0 && (
            <span className="hidden sm:inline text-[11px] text-[#6B716D]">
              ({item.reviewCount})
            </span>
          )}
        </div>

        {/* Products */}
        <p className="mt-1.5 text-[11px] text-[#6B716D]">
          {item.productCount} product{item.productCount !== 1 ? "s" : ""}
          {item.location && (
            <span className="inline-flex items-center gap-1 ml-2">
              <MapPin className="w-3 h-3" />
              {item.location}
            </span>
          )}
        </p>

        {/* CTA */}
        <div className="mt-3 pt-3 border-t border-[#E5E8E5] flex items-center justify-between">
          <Link
            href={`/stores/${store.slug}`}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#17201C] group-hover:text-[#3E8F68] transition-colors"
          >
            Visit Store
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <BadgeCheck className="w-4 h-4 text-[#3E8F68]" />
        </div>
      </div>
    </div>
  );
}