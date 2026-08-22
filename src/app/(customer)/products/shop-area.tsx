"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderTree, SlidersHorizontal, ArrowUpDown, X, Search, Loader2 } from "lucide-react";
import { ProductMiniCard } from "./product-mini-card";
import type { ShopProduct } from "./shop-types";

interface FilterOptions {
  categories: string[];
  vendors: string[];
  priceRange: { min: number; max: number };
  inStock: boolean;
  rating: number;
}

const DEFAULT_FILTERS: FilterOptions = {
  categories: [],
  vendors: [],
  priceRange: { min: 0, max: Infinity },
  inStock: false,
  rating: 0,
};

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Popular" },
];

export function ShopArea({
  products,
  allCategories,
  allVendors,
  query = "",
  initialCategory = "",
}: {
  products: ShopProduct[];
  allCategories: string[];
  allVendors: string[];
  query?: string;
  initialCategory?: string;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterOptions>(
    initialCategory ? { ...DEFAULT_FILTERS, categories: [initialCategory] } : DEFAULT_FILTERS
  );
  const [sort, setSort] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchInput, setSearchInput] = useState(query);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
  }, []);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    const q = value.trim();
    if (q === query) {
      setSearchInput(q);
      return;
    }
    searchTimer.current = setTimeout(() => {
      router.replace(q ? `/products?q=${encodeURIComponent(q)}` : "/products", { scroll: false });
    }, 350);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
    setSort("featured");
    setVisibleCount(12);
    setSearchInput("");
    router.replace("/products", { scroll: false });
  }

  function updateFilter<K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
    setVisibleCount(12);
  }

  function toggleCategory(name: string) {
    updateFilter(
      "categories",
      filters.categories.includes(name)
        ? filters.categories.filter((c) => c !== name)
        : [...filters.categories, name]
    );
  }

  function toggleVendor(name: string) {
    updateFilter(
      "vendors",
      filters.vendors.includes(name)
        ? filters.vendors.filter((v) => v !== name)
        : [...filters.vendors, name]
    );
  }

  function categoryCount(name: string) {
    return products.filter((p) => p.categoryName === name).length;
  }

  function vendorCount(name: string) {
    return products.filter((p) => p.storeName === name).length;
  }

  const filtered = [...products]
    .filter((p) => {
      const needle = query.trim().toLowerCase();
      if (needle && !p.name.toLowerCase().includes(needle)) return false;
      if (filters.categories.length && !filters.categories.includes(p.categoryName ?? "")) return false;
      if (filters.vendors.length && !filters.vendors.includes(p.storeName)) return false;
      if (p.price < filters.priceRange.min || p.price > filters.priceRange.max) return false;
      if (filters.inStock && p.stock <= 0) return false;
      if (filters.rating > 0 && (p.rating ?? 0) < filters.rating) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "popular":
          return b.ratingCount - a.ratingCount;
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return (b.ratingCount ?? 0) - (a.ratingCount ?? 0);
      }
    });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const activeFilterCount =
    filters.categories.length +
    filters.vendors.length +
    (filters.priceRange.min > 0 || filters.priceRange.max !== Infinity ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0);

  const filterBody = (
    <FilterPanel
      allCategories={allCategories}
      allVendors={allVendors}
      filters={filters}
      categoryCount={categoryCount}
      vendorCount={vendorCount}
      onToggleCategory={toggleCategory}
      onToggleVendor={toggleVendor}
      onUpdateFilter={updateFilter}
    />
  );

  return (
    <div data-section="shop-area" className="section-shop-area">
      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-clay inline-flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta" />
                Filters
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-medium text-terracotta hover:text-clay transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
            {filterBody}
          </div>
        </aside>

        {/* Main column */}
        <div>
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-clay/40 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full h-12 pl-11 pr-10 rounded-xl border border-clay/15 bg-white text-sm text-clay placeholder:text-clay/40 focus:outline-none focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/15 transition-all"
            />
            {searchInput !== query ? (
              <Loader2
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-clay/40 animate-spin pointer-events-none"
                aria-hidden
              />
            ) : (
              searchInput && (
                <button
                  onClick={() => handleSearchChange("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-clay/40 hover:text-clay hover:bg-clay/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )
            )}
          </div>

          {/* Mobile filter/sort toolbar */}
          <div className="lg:hidden sticky top-0 z-40 -mx-5 px-5 pt-3 pb-3 mb-3 bg-[#F1EDE1]/95 backdrop-blur-md flex gap-3">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-clay/15 bg-white text-clay text-xs font-bold uppercase tracking-[0.15em] hover:border-clay/30 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-terracotta" />
              Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
            <button
              onClick={() => setShowMobileSort(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-clay/15 bg-white text-clay text-xs font-bold uppercase tracking-[0.15em] hover:border-clay/30 transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4 text-terracotta" />
              Sort
            </button>
          </div>

          {/* Sort bar (desktop) */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-clay/50">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                    sort === opt.value
                      ? "bg-clay text-sand"
                      : "text-clay/50 hover:text-clay hover:bg-clay/5"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

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
                        ? "bg-clay/5 text-clay font-semibold"
                        : "text-clay/60 hover:bg-clay/5 hover:text-clay"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </MobileSheet>
          )}

          {/* Mobile filter sheet */}
          {showMobileFilters && (
            <MobileSheet title="Filter" onClose={() => setShowMobileFilters(false)}>
              <div className="p-3">
                {filterBody}
                <div className="flex gap-3 mt-5 border-t border-clay/10 pt-4">
                  <button
                    onClick={clearFilters}
                    className="flex-1 h-11 rounded-xl border border-clay/20 text-clay text-xs font-bold uppercase tracking-[0.15em] hover:bg-clay/5 transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 h-11 rounded-xl bg-clay text-sand text-xs font-bold uppercase tracking-[0.15em] hover:bg-terracotta transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </MobileSheet>
          )}

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="border border-clay/15 rounded-2xl py-32 text-center">
              <p className="font-serif italic text-2xl text-clay/60">Nothing here yet.</p>
              <p className="text-xs text-clay/40 mt-2">No products match your selection.</p>
              <button
                onClick={clearFilters}
                className="mt-7 px-8 py-2.5 rounded-full border border-clay/25 text-[10px] font-bold uppercase tracking-[0.2em] text-clay/70 hover:text-clay hover:border-clay/40 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {visible.map((product) => (
                <ProductMiniCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((c) => c + 12)}
                className="px-10 py-3 rounded-full border border-clay/25 text-[10px] font-bold uppercase tracking-[0.2em] text-clay/70 hover:bg-clay hover:text-sand hover:border-clay transition-all cursor-pointer"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  allCategories,
  allVendors,
  filters,
  categoryCount,
  vendorCount,
  onToggleCategory,
  onToggleVendor,
  onUpdateFilter,
}: {
  allCategories: string[];
  allVendors: string[];
  filters: FilterOptions;
  categoryCount: (name: string) => number;
  vendorCount: (name: string) => number;
  onToggleCategory: (name: string) => void;
  onToggleVendor: (name: string) => void;
  onUpdateFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const displayCategories = showAllCategories ? allCategories : allCategories.slice(0, 5);

  return (
    <div className="space-y-7">
      {/* Categories */}
      <FilterSection
        title="Categories"
        icon={<FolderTree className="w-3.5 h-3.5 text-terracotta" />}
      >
        <div className="space-y-1">
          {displayCategories.map((name) => (
            <label
              key={name}
              className="flex items-center gap-3 py-1.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(name)}
                onChange={() => onToggleCategory(name)}
                className="w-4 h-4 rounded border-clay/30 accent-terracotta cursor-pointer"
              />
              <span className="flex-1 text-[13px] text-clay/70 group-hover:text-clay transition-colors">
                {name}
              </span>
              <span className="text-[11px] text-clay/40">{categoryCount(name)}</span>
            </label>
          ))}
          {allCategories.length > 5 && (
            <button
              onClick={() => setShowAllCategories((s) => !s)}
              className="text-[11px] font-semibold text-terracotta hover:text-clay transition-colors mt-1 cursor-pointer"
            >
              {showAllCategories ? "Show less" : "Show all"}
            </button>
          )}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={filters.priceRange.min === 0 ? "" : filters.priceRange.min / 100}
              placeholder="Min"
              onChange={(e) =>
                onUpdateFilter("priceRange", {
                  ...filters.priceRange,
                  min: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)) * 100,
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-clay/20 bg-white text-sm text-clay placeholder:text-clay/30 focus:outline-none focus:border-terracotta/60"
            />
            <span className="text-clay/40 text-xs">to</span>
            <input
              type="number"
              min={0}
              value={filters.priceRange.max === Infinity ? "" : filters.priceRange.max / 100}
              placeholder="Max"
              onChange={(e) =>
                onUpdateFilter("priceRange", {
                  ...filters.priceRange,
                  max: e.target.value === "" ? Infinity : Number(e.target.value) * 100,
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-clay/20 bg-white text-sm text-clay placeholder:text-clay/30 focus:outline-none focus:border-terracotta/60"
            />
          </div>
          <div className="text-[11px] text-clay/50 text-center">
            ${(filters.priceRange.min / 100).toFixed(0)} &mdash;{" "}
            {filters.priceRange.max === Infinity ? "$500+" : `$${(filters.priceRange.max / 100).toFixed(0)}`}
          </div>
        </div>
      </FilterSection>

      {/* Vendors */}
      <FilterSection title="Store">
        <div className="space-y-1">
          {allVendors.map((name) => (
            <label key={name} className="flex items-center gap-3 py-1.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.vendors.includes(name)}
                onChange={() => onToggleVendor(name)}
                className="w-4 h-4 rounded border-clay/30 accent-terracotta cursor-pointer"
              />
              <span className="flex-1 text-[13px] text-clay/70 group-hover:text-clay transition-colors">
                {name}
              </span>
              <span className="text-[11px] text-clay/40">{vendorCount(name)}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onUpdateFilter("inStock", e.target.checked)}
            className="w-4 h-4 rounded border-clay/30 accent-terracotta cursor-pointer"
          />
          <span className="text-[13px] text-clay/70 group-hover:text-clay transition-colors">In stock</span>
        </label>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating">
        <div className="space-y-1">
          {[5, 4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-3 py-1.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === r}
                onChange={() => onUpdateFilter("rating", filters.rating === r ? 0 : r)}
                className="w-4 h-4 rounded-full border-clay/30 accent-terracotta cursor-pointer"
              />
              <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    viewBox="0 0 20 20"
                    className={`w-3.5 h-3.5 ${i <= r ? "fill-ochre" : "fill-clay/15"}`}
                  >
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                  </svg>
                ))}
              </span>
              <span className="text-[11px] text-clay/50">&amp; up</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay mb-3 inline-flex items-center gap-2">
        {icon}
        {title}
      </h4>
      {children}
    </div>
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
      <div className="absolute inset-0 bg-clay/30" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-[#F1EDE1] rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 h-14 border-b border-clay/10 sticky top-0 bg-[#F1EDE1]">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-clay">{title}</p>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-clay/5 flex items-center justify-center text-clay/60 hover:text-clay transition-colors cursor-pointer"
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