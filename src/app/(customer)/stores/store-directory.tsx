"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  LayoutGrid,
  Store,
  ArrowRight,
} from "lucide-react";
import { StoreCard } from "./store-card";
import type { StoreItem } from "./store-types";

const PAGE_SIZE = 6;

const CATEGORY_OPTIONS = [
  "Electronics",
  "Fashion & Apparel",
  "Home & Living",
  "Health & Beauty",
  "Sports & Outdoors",
  "Books & Stationery",
];

const TYPE_OPTIONS = ["Independent", "Brand"];

const LOCATION_OPTIONS = ["Local", "National", "International"];

const RATING_OPTIONS = [
  { value: 4, label: "4+ Stars" },
  { value: 4.5, label: "4.5+ Stars" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "az", label: "A–Z" },
  { value: "za", label: "Z–A" },
];

interface Filters {
  categories: string[];
  types: string[];
  locations: string[];
  minRating: number;
  featuredOnly: boolean;
  newOnly: boolean;
}

const DEFAULT_FILTERS: Filters = {
  categories: [],
  types: [],
  locations: [],
  minRating: 0,
  featuredOnly: false,
  newOnly: false,
};

export function StoreDirectory({ items }: { items: StoreItem[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
    setVisible(PAGE_SIZE);
  }

  function toggle(list: string[], value: string) {
    return list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
    setVisible(PAGE_SIZE);
  }

  const activeCount =
    filters.categories.length +
    filters.types.length +
    filters.locations.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.featuredOnly ? 1 : 0) +
    (filters.newOnly ? 1 : 0);

  const filtered = useMemo(() => {
    const result = items.filter((it) => {
      if (filters.categories.length) {
        const hasCat = it.categories.some((c) => filters.categories.includes(c));
        if (!hasCat) return false;
      }
      if (filters.types.length && !filters.types.includes(it.storeType)) return false;
      if (filters.locations.length && !filters.locations.includes(it.location)) return false;
      if (filters.minRating > 0 && (it.rating ?? 0) < filters.minRating) return false;
      if (filters.featuredOnly && !it.featured) return false;
      if (filters.newOnly && !it.isNew) return false;
      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => b.store.createdAt.getTime() - a.store.createdAt.getTime());
        break;
      case "popular":
        sorted.sort((a, b) => b.productCount - a.productCount);
        break;
      case "az":
        sorted.sort((a, b) => a.store.name.localeCompare(b.store.name));
        break;
      case "za":
        sorted.sort((a, b) => b.store.name.localeCompare(a.store.name));
        break;
      default:
        sorted.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            (b.rating ?? 0) - (a.rating ?? 0)
        );
    }
    return sorted;
  }, [items, filters, sort]);

  const display = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const filterBody = (
    <div className="space-y-8">
      {/* Categories */}
      <FilterSection title="Category">
        {CATEGORY_OPTIONS.map((c) => (
          <label key={c} className="flex items-center gap-3 py-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.categories.includes(c)}
              onChange={() =>
                update("categories", toggle(filters.categories, c))
              }
              className="w-4 h-4 rounded border-[#17201C]/25 accent-[#17201C] cursor-pointer"
            />
            <span className="flex-1 text-[13px] text-[#17201C]/75 group-hover:text-[#17201C] transition-colors">
              {c}
            </span>
            <span className="text-[11px] text-[#17201C]/40">
              {items.filter((it) => it.categories.includes(c)).length}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Store type */}
      <FilterSection title="Store Type">
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((t) => (
            <Pill
              key={t}
              active={filters.types.includes(t)}
              onClick={() => update("types", toggle(filters.types, t))}
            >
              {t}
            </Pill>
          ))}
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location">
        <div className="flex flex-wrap gap-2">
          {LOCATION_OPTIONS.map((l) => (
            <Pill
              key={l}
              active={filters.locations.includes(l)}
              onClick={() => update("locations", toggle(filters.locations, l))}
            >
              {l}
            </Pill>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating">
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((r) => (
            <Pill
              key={r.value}
              active={filters.minRating === r.value}
              onClick={() =>
                update(
                  "minRating",
                  filters.minRating === r.value ? 0 : r.value
                )
              }
            >
              {r.label}
            </Pill>
          ))}
        </div>
      </FilterSection>

      {/* Featured */}
      <FilterSection title="Collections">
        <div className="space-y-1">
          <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.featuredOnly}
              onChange={(e) => update("featuredOnly", e.target.checked)}
              className="w-4 h-4 rounded border-[#17201C]/25 accent-[#17201C] cursor-pointer"
            />
            <span className="text-[13px] text-[#17201C]/75 group-hover:text-[#17201C] transition-colors">
              Featured Stores
            </span>
          </label>
          <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.newOnly}
              onChange={(e) => update("newOnly", e.target.checked)}
              className="w-4 h-4 rounded border-[#17201C]/25 accent-[#17201C] cursor-pointer"
            />
            <span className="text-[13px] text-[#17201C]/75 group-hover:text-[#17201C] transition-colors">
              New Stores
            </span>
          </label>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div>
      {/* Hero */}
      <section data-section="store-directory-hero" className="section-store-directory-hero max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-16 sm:pt-24 lg:pt-32">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#17201C]/50 inline-flex items-center gap-2">
          <Store className="w-3.5 h-3.5" />
          Independent Sellers
        </p>
        <h1 className="mt-4 font-black uppercase tracking-tight text-[#17201C] text-6xl sm:text-7xl lg:text-8xl leading-[0.95]">
          Discover
          <br />
          Stores
        </h1>
        <p className="mt-6 max-w-md text-sm text-[#6B716D] leading-relaxed">
          Discover independent stores, makers, and brands curated for you.
        </p>
      </section>

      {/* Collection header */}
      <section data-section="store-directory-header" className="section-store-directory-header max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#17201C]/10 pt-6">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-[#17201C]">All Stores</h2>
            <span className="text-xs text-[#6B716D]">
              Showing {filtered.length} Store{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Desktop sort */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-[#6B716D]">Sort by:</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                  sort === opt.value
                    ? "bg-[#17201C] text-white"
                    : "text-[#17201C]/55 hover:text-[#17201C] hover:bg-[#17201C]/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section data-section="store-directory-content" className="section-store-directory-content max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-10 lg:pt-12 pb-20">
        <div className="lg:grid lg:grid-cols-[25%_75%] lg:gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#17201C] inline-flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                </p>
                {activeCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[11px] font-medium text-[#3E8F68] hover:text-[#17201C] transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {filterBody}
            </div>
          </aside>

          {/* Store grid */}
          <div>
            {/* Mobile toolbar */}
            <div className="lg:hidden sticky top-0 z-40 -mx-5 px-5 pt-3 pb-3 mb-3 bg-[#FAF7EF]/95 backdrop-blur-md flex gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-[#17201C]/15 bg-white text-[#17201C] text-xs font-bold uppercase tracking-[0.15em] hover:border-[#17201C]/30 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter{activeCount > 0 ? ` (${activeCount})` : ""}
              </button>
              <button
                onClick={() => setShowMobileSort(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-[#17201C]/15 bg-white text-[#17201C] text-xs font-bold uppercase tracking-[0.15em] hover:border-[#17201C]/30 transition-colors cursor-pointer"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort
              </button>
            </div>

            {display.length === 0 ? (
              <div className="border border-[#E5E8E5] rounded-2xl py-28 text-center bg-white">
                <LayoutGrid className="w-10 h-10 mx-auto text-[#17201C]/20" />
                <p className="mt-5 font-heading text-2xl text-[#17201C]/70">
                  No stores found
                </p>
                <p className="text-sm text-[#6B716D] mt-2">
                  Try adjusting your filters to discover more stores.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-7 px-8 py-2.5 rounded-full border border-[#17201C]/25 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17201C]/70 hover:text-white hover:bg-[#17201C] hover:border-[#17201C] transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {display.map((item) => (
                  <StoreCard key={item.store.id} item={item} />
                ))}
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="px-10 py-3.5 rounded-full border border-[#17201C]/25 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17201C]/70 hover:bg-[#17201C] hover:text-white hover:border-[#17201C] transition-all cursor-pointer"
                >
                  Load More Stores
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-section="store-directory-cta" className="section-store-directory-cta max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pb-24">
        <div className="border border-[#17201C]/10 rounded-3xl p-10 sm:p-14 flex flex-col items-center text-center relative overflow-hidden bg-white">
          <div className="relative z-10">
            <h2 className="font-black uppercase tracking-tight text-3xl sm:text-4xl text-[#17201C]">
              Your store belongs here.
            </h2>
            <p className="max-w-xl mx-auto text-sm text-[#6B716D] mt-4 leading-relaxed">
              Join a community of independent sellers. We handle the
              technology, so you can focus on your business.
            </p>
            <Link
              href="/register"
              className="group mt-8 inline-flex items-center gap-2 bg-[#17201C] text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#3E8F68] transition-colors"
            >
              Open your studio
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile filter sheet */}
      {showMobileFilters && (
        <MobileSheet title="Filter" onClose={() => setShowMobileFilters(false)}>
          <div className="p-4">
            {filterBody}
            <div className="flex gap-3 mt-6 border-t border-[#17201C]/10 pt-4">
              <button
                onClick={clearFilters}
                className="flex-1 h-12 rounded-xl border border-[#17201C]/20 text-[#17201C] text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#17201C]/5 transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 h-12 rounded-xl bg-[#17201C] text-white text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#3E8F68] transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </MobileSheet>
      )}

      {/* Mobile sort sheet */}
      {showMobileSort && (
        <MobileSheet title="Sort" onClose={() => setShowMobileSort(false)}>
          <div className="flex flex-col gap-1 p-3">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSort(opt.value);
                  setShowMobileSort(false);
                }}
                className={`text-left px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer ${
                  sort === opt.value
                    ? "bg-[#17201C]/5 text-[#17201C] font-semibold"
                    : "text-[#17201C]/60 hover:bg-[#17201C]/5 hover:text-[#17201C]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </MobileSheet>
      )}
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#17201C] mb-3">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer border ${
        active
          ? "bg-[#17201C] text-white border-[#17201C]"
          : "bg-white text-[#17201C]/60 border-[#17201C]/15 hover:border-[#17201C]/40 hover:text-[#17201C]"
      }`}
    >
      {children}
    </button>
  );
}

function MobileSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-[#17201C]/30" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-[#FAF7EF] rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 h-14 border-b border-[#17201C]/10 sticky top-0 bg-[#FAF7EF]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#17201C]">
            {title}
          </p>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#17201C]/5 flex items-center justify-center text-[#17201C]/60 hover:text-[#17201C] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}