"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  SearchSortBarS3A,
  SearchSortBarS3B,
  SearchSortBarS3C,
} from "./search-sort-variations";
import { ProductCardSwitcher } from "./product-card-switcher";
import { FilterPanelF3 } from "./filter-variations";
import type { ShopProduct } from "./shop-types";

interface FilterOptions {
  categories: string[];
  vendors: string[];
  priceRange: { min: number; max: number };
  inStock: boolean;
  rating: number;
  featuredOnly: boolean;
}

const DEFAULT_FILTERS: FilterOptions = {
  categories: [],
  vendors: [],
  priceRange: { min: 0, max: Infinity },
  inStock: false,
  rating: 0,
  featuredOnly: false,
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
  initialSort,
  searchSortStyle = "S1",
}: {
  products: ShopProduct[];
  allCategories: string[];
  allVendors: string[];
  query?: string;
  initialCategory?: string;
  initialSort?: string;
  searchSortStyle?: string;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterOptions>(
    initialCategory
      ? { ...DEFAULT_FILTERS, categories: [initialCategory] }
      : DEFAULT_FILTERS
  );
  const [sort, setSort] = useState(initialSort || "featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(query);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    const q = value.trim();
    if (q === query) {
      setSearchInput(q);
      return;
    }
    searchTimer.current = setTimeout(() => {
      router.replace(
        q ? `/products?q=${encodeURIComponent(q)}` : "/products",
        { scroll: false }
      );
    }, 350);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
    setSort("featured");
    setCurrentPage(1);
    setSearchInput("");
    router.replace("/products", { scroll: false });
  }

  function updateFilter<K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) {
    setFilters((f) => ({ ...f, [key]: value }));
    setCurrentPage(1);
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
      if (needle && !p.name.toLowerCase().includes(needle))
        return false;
      if (
        filters.categories.length &&
        !filters.categories.includes(p.categoryName ?? "")
      )
        return false;
      if (
        filters.vendors.length &&
        !filters.vendors.includes(p.storeName)
      )
        return false;
      if (
        p.price < filters.priceRange.min ||
        p.price > filters.priceRange.max
      )
        return false;
      if (filters.inStock && p.stock <= 0) return false;
      if (
        filters.rating > 0 &&
        (p.rating ?? 0) < filters.rating
      )
        return false;
      if (
        filters.featuredOnly &&
        !p.tags?.includes("Featured")
      )
        return false;
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
          return (
            b.createdAt.getTime() - a.createdAt.getTime()
          );
        default:
          return (b.ratingCount ?? 0) - (a.ratingCount ?? 0);
      }
    });

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const visible = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort, query]);

  const activeFilterCount =
    filters.categories.length +
    filters.vendors.length +
    (filters.priceRange.min > 0 ||
    filters.priceRange.max !== Infinity
      ? 1
      : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0);

  const filterBody = (
    <FilterPanelF3
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

  const searchSortProps = {
    searchInput,
    query,
    onSearchChange: handleSearchChange,
    filteredCount: filtered.length,
    sort,
    onSortChange: setSort,
    sortOptions: SORT_OPTIONS,
    activeFilterCount,
    onOpenMobileFilters: () => setShowMobileFilters(true),
    onOpenMobileSort: () => setShowMobileSort(true),
  };

  return (
    <div data-section="shop-area" className="section-shop-area">
      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/60">
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
          {searchSortStyle === "S3B" ? (
            <SearchSortBarS3B {...searchSortProps} />
          ) : searchSortStyle === "S3C" ? (
            <SearchSortBarS3C {...searchSortProps} />
          ) : (
            <SearchSortBarS3A {...searchSortProps} />
          )}

          {/* Mobile sort sheet */}
          {showMobileSort && (
            <MobileSheet
              title="Sort"
              onClose={() => setShowMobileSort(false)}
            >
              <div className="flex flex-col gap-0.5 p-4">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value);
                      setShowMobileSort(false);
                    }}
                    className={
                      "text-left px-4 py-3 rounded-lg text-sm transition-colors cursor-pointer " +
                      (sort === opt.value
                        ? "bg-clay/5 text-clay font-semibold"
                        : "text-clay/50 hover:bg-clay/5 hover:text-clay")
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </MobileSheet>
          )}

          {/* Mobile filter sheet */}
          {showMobileFilters && (
            <MobileSheet
              title="Filter"
              onClose={() => setShowMobileFilters(false)}
            >
              <div className="p-4">
                {filterBody}
                <div className="flex gap-3 mt-6 border-t border-clay/8 pt-5">
                  <button
                    onClick={clearFilters}
                    className="flex-1 h-11 rounded-lg border border-clay/15 text-clay text-xs font-bold uppercase tracking-[0.12em] hover:bg-clay/5 transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 h-11 rounded-lg bg-clay text-sand text-xs font-bold uppercase tracking-[0.12em] hover:bg-terracotta transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </MobileSheet>
          )}

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="py-32 text-center">
              <p className="font-heading text-2xl text-clay/50">
                Nothing here yet.
              </p>
              <p className="text-sm text-clay/50 mt-2">
                No products match your selection.
              </p>
              <button
                onClick={clearFilters}
                className="mt-8 px-8 py-2.5 rounded-lg border border-clay/15 text-[11px] font-bold uppercase tracking-[0.15em] text-clay/60 hover:text-clay hover:border-clay/30 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>
          ) : (
            <ProductCardSwitcher products={visible} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-12">
              {currentPage > 1 && (
                <button
                  onClick={() =>
                    setCurrentPage((p) => p - 1)
                  }
                  className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-clay/50 hover:text-clay transition-colors cursor-pointer"
                >
                  Prev
                </button>
              )}
              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={
                    "w-9 h-9 rounded-lg text-[12px] font-bold transition-all cursor-pointer " +
                    (currentPage === page
                      ? "bg-clay text-sand"
                      : "text-clay/60 hover:text-clay hover:bg-clay/5")
                  }
                >
                  {page}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  onClick={() =>
                    setCurrentPage((p) => p + 1)
                  }
                  className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-clay/50 hover:text-clay transition-colors cursor-pointer"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </div>
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
      <div
        className="absolute inset-0 bg-clay/30"
        onClick={onClose}
      />
      <div className="absolute bottom-0 inset-x-0 bg-[#F1EDE1] rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 h-14 border-b border-clay/8 sticky top-0 bg-[#F1EDE1]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay">
            {title}
          </p>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-clay/5 flex items-center justify-center text-clay/50 hover:text-clay transition-colors cursor-pointer"
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
