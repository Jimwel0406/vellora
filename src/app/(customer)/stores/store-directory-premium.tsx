"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import {
  StoreCardC,
  StoreCardDominant,
} from "./store-card-artisan";
import { StoreFilterF1 } from "./store-filter-pill-tags";
import type { StoreFilters } from "./store-filter-pill-tags";
import type { StoreItem } from "./store-types";

const ITEMS_PER_PAGE = 9;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "az", label: "A\u2013Z" },
  { value: "za", label: "Z\u2013A" },
];

const DEFAULT_FILTERS: StoreFilters = {
  categories: [],
  types: [],
  locations: [],
  minRating: 0,
  featuredOnly: false,
  newOnly: false,
};

const EDITORIAL_CATEGORIES = [
  "Fashion",
  "Electronics",
  "Home Goods",
  "Accessories",
  "Skincare",
];

export function StoreDirectoryPremium({ items }: { items: StoreItem[] }) {
  const [filters, setFilters] = useState<StoreFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function update<K extends keyof StoreFilters>(
    key: K,
    value: StoreFilters[K]
  ) {
    setFilters((f) => ({ ...f, [key]: value }));
    setCurrentPage(1);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
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
        const hasCat = it.categories.some((c) =>
          filters.categories.includes(c)
        );
        if (!hasCat) return false;
      }
      if (filters.types.length && !filters.types.includes(it.storeType))
        return false;
      if (filters.locations.length && !filters.locations.includes(it.location))
        return false;
      if (filters.minRating > 0 && (it.rating ?? 0) < filters.minRating)
        return false;
      if (filters.featuredOnly && !it.featured) return false;
      if (filters.newOnly && !it.isNew) return false;
      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case "newest":
        sorted.sort(
          (a, b) => b.store.createdAt.getTime() - a.store.createdAt.getTime()
        );
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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const display = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // First store is the dominant/editorial one
  const dominantStore = display[0];
  const remainingStores = display.slice(1);

  const gridContent = (
    <>
      {display.length === 0 ? (
        <div className="py-28 text-center">
          <p className="font-heading text-2xl text-clay">No stores found</p>
          <p className="text-sm text-clay mt-2">Try adjusting your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-8 px-8 py-2.5 rounded-lg border border-clay/15 text-[11px] font-bold uppercase tracking-[0.15em] text-clay/60 hover:text-clay hover:border-clay/30 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {/* Dominant store — editorial hero */}
          {dominantStore && (
            <div className="mb-14 lg:mb-20">
              <StoreCardDominant item={dominantStore} />
            </div>
          )}

          {/* Remaining stores — editorial grid */}
          {remainingStores.length > 0 && (
            <div>
              <span className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-clay mb-5">
                More Stores
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                {remainingStores.map((item) => (
                  <StoreCardC key={item.store.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-12">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-clay hover:text-clay transition-colors cursor-pointer"
            >
              Prev
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-clay hover:text-clay transition-colors cursor-pointer"
            >
              Next
            </button>
          )}
        </div>
      )}
    </>
  );

  return (
    <div>
      {/* ─── Section 01: Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-20 lg:pt-28 pb-12 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-12 items-center">
            {/* Left — editorial content */}
            <div className="max-w-[560px]">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-[2.5px] bg-terracotta rounded-full" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-terracotta font-label">
                  Independent Sellers
                </span>
              </div>

              <h1 className="font-heading text-[44px] sm:text-[56px] lg:text-[72px] xl:text-[88px] text-clay font-semibold leading-[0.92] tracking-[-0.03em]">
                Discover
                <br />
                Stores
              </h1>

              <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-clay leading-relaxed max-w-md">
                Discover independent sellers offering thoughtfully made
                products — from electronics and home goods to fashion and
                lifestyle essentials.
              </p>

              <Link
                href="#store-directory"
                className="group mt-8 sm:mt-10 inline-flex items-center gap-2.5 h-12 px-7 bg-terracotta text-white text-[11px] font-bold uppercase tracking-[0.15em] rounded-lg hover:bg-terracotta-deep transition-colors"
              >
                Explore Stores
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <span className="text-sm text-clay/60 font-medium">
                  <span className="font-bold text-clay">{items.length}+</span>{" "}
                  stores
                </span>
                <span className="hidden sm:block h-4 w-px bg-clay/15" />
                <span className="text-sm text-clay/60 font-medium">
                  Verified sellers
                </span>
                <span className="hidden sm:block h-4 w-px bg-clay/15" />
                <span className="text-sm text-clay/60 font-medium">
                  Secure payments
                </span>
              </div>
            </div>

            {/* Right — editorial image composition */}
            <div className="relative hidden lg:block h-[480px]">
              {/* Dominant image — large, slightly left */}
              <div className="absolute top-0 left-0 w-[75%] overflow-hidden rounded-2xl">
                <img
                  src="/stores-hero.jpg"
                  alt="Modern retail space"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              {/* Secondary image — overlaps bottom-right of main */}
              <div className="absolute bottom-0 right-0 w-[50%] overflow-hidden rounded-xl shadow-[0_8px_30px_-8px_rgba(61,43,31,0.12)]">
                <img
                  src="/hero-garments.jpg"
                  alt="Garments display"
                  className="w-full h-[240px] object-cover"
                />
              </div>
              {/* Small accent — top-right corner, overlaps main */}
              <div className="absolute top-8 right-0 w-[30%] overflow-hidden rounded-lg shadow-[0_4px_16px_-4px_rgba(61,43,31,0.1)]">
                <img
                  src="/hero-handbag.jpg"
                  alt="Leather handbag"
                  className="w-full h-[140px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 02: Category Navigation ───────────────────────────── */}
      <section className="border-y border-clay/8">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="overflow-hidden py-6 sm:py-7">
            <div className="flex whitespace-nowrap animate-marquee">
              {[...EDITORIAL_CATEGORIES, ...EDITORIAL_CATEGORIES, ...EDITORIAL_CATEGORIES].map((cat, i) => (
                <span key={i} className="flex items-center shrink-0">
                  <span className="font-label text-sm sm:text-base lg:text-lg font-bold uppercase tracking-[0.25em] text-clay/60">
                    {cat}
                  </span>
                    <span className="mx-6 sm:mx-10 lg:mx-14 text-clay/45 text-lg">
                    ·
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 03: Store Directory ──────────────────────────────── */}
      <section
        id="store-directory"
        className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 lg:pt-16 pb-16 lg:pb-24 scroll-mt-20"
      >
        {/* Collection header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="font-heading text-2xl sm:text-3xl text-clay tracking-tight">
              All Stores
            </h2>
            <span className="text-sm text-clay/60 font-label">
              {filtered.length} store{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="hidden md:block relative" ref={sortRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 h-9 px-4 rounded-lg border border-clay/12 bg-white text-clay text-[11px] font-bold uppercase tracking-[0.12em] hover:border-clay/25 transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-clay" />
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
              <ChevronDown
                className={
                  "w-3.5 h-3.5 transition-transform duration-200 " +
                  (showSortDropdown ? "rotate-180" : "")
                }
              />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-clay/10 rounded-lg shadow-[0_8px_30px_-8px_rgba(61,43,31,0.12)] py-1 z-50">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value);
                      setShowSortDropdown(false);
                    }}
                    className={
                      "w-full text-left px-4 py-2.5 text-[11px] font-medium transition-colors cursor-pointer " +
                      (sort === opt.value
                        ? "bg-clay/5 text-clay"
                        : "text-clay hover:bg-clay/[0.03] hover:text-clay")
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <StoreFilterF1
          filters={filters}
          totalItems={filtered.length}
          onUpdate={update}
          onClearAll={clearFilters}
          onOpenMobileFilter={() => setShowMobileFilters(true)}
        >
          {gridContent}
        </StoreFilterF1>
      </section>

      {/* ─── Section 04: Seller CTA ───────────────────────────────────── */}
      <section className="bg-[#1a1410]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-16 items-center">
            {/* Left — typography */}
            <div>
              <p className="font-label text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white/30 mb-5">
                For Sellers
              </p>
              <h2 className="font-heading text-[40px] sm:text-[52px] lg:text-[64px] text-sand leading-[0.95] tracking-tight">
                Your store
                <br />
                belongs here.
              </h2>
              <p className="mt-6 text-base sm:text-lg text-white/40 leading-relaxed max-w-md">
                Join a community of independent sellers. We handle the
                technology, so you can focus on your business.
              </p>
              <Link
                href="/register"
                className="group mt-8 sm:mt-10 inline-flex items-center gap-2.5 h-12 px-7 bg-terracotta text-white text-[11px] font-bold uppercase tracking-[0.15em] rounded-lg hover:bg-terracotta-deep transition-colors"
              >
                Open your store
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Right — editorial image */}
            <div className="relative hidden lg:block">
              <div className="overflow-hidden rounded-2xl ml-8">
                <img
                  src="/seller-cta.jpg"
                  alt="Retail interior"
                  className="w-full h-[360px] object-cover"
                />
              </div>
            </div>

            {/* Mobile: image */}
            <div className="lg:hidden">
              <div className="overflow-hidden rounded-xl">
                <img
                  src="/seller-cta.jpg"
                  alt="Retail interior"
                  className="w-full h-[220px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mobile Filter Sheet ─────────────────────────────────────── */}
      {showMobileFilters && (
        <MobileSheet title="Filter" onClose={() => setShowMobileFilters(false)}>
          <div className="p-4">
            <MobileFilterBody filters={filters} update={update} />
            <div className="flex gap-3 mt-6 border-t border-clay/8 pt-5">
              <button
                onClick={clearFilters}
                className="flex-1 h-11 rounded-lg border border-clay/15 text-clay text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-clay/5 transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 h-11 rounded-lg bg-clay text-sand text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-terracotta transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </MobileSheet>
      )}

      {/* ─── Mobile Sort Sheet ────────────────────────────────────────── */}
      {showMobileSort && (
        <MobileSheet title="Sort" onClose={() => setShowMobileSort(false)}>
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
                    : "text-clay hover:bg-clay/5 hover:text-clay")
                }
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

/* ─── Mobile Filter Body ─────────────────────────────────────────────────── */

function MobileFilterBody({
  filters,
  update,
}: {
  filters: StoreFilters;
  update: <K extends keyof StoreFilters>(key: K, val: StoreFilters[K]) => void;
}) {
  const [openSection, setOpenSection] = useState<string | null>("category");

  function toggleList(list: string[], val: string) {
    return list.includes(val) ? list.filter((v) => v !== val) : [...list, val];
  }

  const CATEGORY_OPTIONS = [
    "Fashion & Apparel",
    "Accessories",
    "Electronics",
    "Sports & Outdoors",
    "Beauty & Skincare",
    "Streetwear",
  ];
  const TYPE_OPTIONS = ["Independent", "Brand"];
  const LOCATION_OPTIONS = ["Local", "National", "International"];
  const RATING_OPTIONS = [
    { value: 4, label: "4.0 & up" },
    { value: 4.5, label: "4.5 & up" },
  ];

  return (
    <div className="divide-y divide-clay/8">
      <MobileAccordion id="category" title="Category" count={filters.categories.length} open={openSection} setOpen={setOpenSection}>
        <div className="flex flex-col gap-0.5">
          {CATEGORY_OPTIONS.map((c) => {
            const active = filters.categories.includes(c);
            return (
              <label key={c} className={"flex items-center gap-3 py-2 px-1 cursor-pointer transition-colors " + (active ? "text-clay" : "text-clay hover:text-clay")}>
                <input type="checkbox" checked={active} onChange={() => update("categories", toggleList(filters.categories, c))} className="sr-only" />
                <span className={"relative flex h-4 w-4 items-center justify-center rounded border transition-all shrink-0 " + (active ? "bg-terracotta border-terracotta" : "border-clay/25 bg-white")}>
                  {active && <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
                <span className="flex-1 text-sm">{c}</span>
              </label>
            );
          })}
        </div>
      </MobileAccordion>

      <MobileAccordion id="type" title="Store Type" count={filters.types.length} open={openSection} setOpen={setOpenSection}>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((t) => {
            const active = filters.types.includes(t);
            return (
              <button key={t} onClick={() => update("types", toggleList(filters.types, t))} className={"inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all cursor-pointer border " + (active ? "bg-clay text-sand border-clay" : "bg-white text-clay border-clay/12")}>
                {t}
              </button>
            );
          })}
        </div>
      </MobileAccordion>

      <MobileAccordion id="location" title="Location" count={filters.locations.length} open={openSection} setOpen={setOpenSection}>
        <div className="flex flex-wrap gap-2">
          {LOCATION_OPTIONS.map((l) => {
            const active = filters.locations.includes(l);
            return (
              <button key={l} onClick={() => update("locations", toggleList(filters.locations, l))} className={"inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all cursor-pointer border " + (active ? "bg-clay text-sand border-clay" : "bg-white text-clay border-clay/12")}>
                {l}
              </button>
            );
          })}
        </div>
      </MobileAccordion>

      <MobileAccordion id="rating" title="Rating" count={filters.minRating > 0 ? 1 : 0} open={openSection} setOpen={setOpenSection}>
        <div className="flex flex-col gap-0.5">
          {RATING_OPTIONS.map((r) => {
            const active = filters.minRating === r.value;
            return (
              <label key={r.value} className={"flex items-center gap-3 py-2 px-1 cursor-pointer transition-colors " + (active ? "text-clay" : "text-clay hover:text-clay")}>
                <input type="radio" name="mobile-rating" checked={active} onChange={() => update("minRating", active ? 0 : r.value)} className="sr-only" />
                <span className={"relative flex h-4 w-4 items-center justify-center rounded-full border transition-all shrink-0 " + (active ? "border-terracotta" : "border-clay/25")}>
                  {active && <span className="h-2 w-2 rounded-full bg-terracotta" />}
                </span>
                <span className="text-sm">{r.label}</span>
              </label>
            );
          })}
        </div>
      </MobileAccordion>

      <MobileAccordion id="collections" title="Collections" count={(filters.featuredOnly ? 1 : 0) + (filters.newOnly ? 1 : 0)} open={openSection} setOpen={setOpenSection}>
        <div className="flex flex-col gap-0.5">
          <label className={"flex items-center gap-3 py-2 px-1 cursor-pointer transition-colors " + (filters.featuredOnly ? "text-clay" : "text-clay hover:text-clay")}>
            <input type="checkbox" checked={filters.featuredOnly} onChange={(e) => update("featuredOnly", e.target.checked)} className="sr-only" />
            <span className={"relative flex h-4 w-4 items-center justify-center rounded border transition-all shrink-0 " + (filters.featuredOnly ? "bg-terracotta border-terracotta" : "border-clay/25 bg-white")}>
              {filters.featuredOnly && <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            <span className="flex-1 text-sm">Featured Stores</span>
          </label>
          <label className={"flex items-center gap-3 py-2 px-1 cursor-pointer transition-colors " + (filters.newOnly ? "text-clay" : "text-clay hover:text-clay")}>
            <input type="checkbox" checked={filters.newOnly} onChange={(e) => update("newOnly", e.target.checked)} className="sr-only" />
            <span className={"relative flex h-4 w-4 items-center justify-center rounded border transition-all shrink-0 " + (filters.newOnly ? "bg-terracotta border-terracotta" : "border-clay/25 bg-white")}>
              {filters.newOnly && <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            <span className="flex-1 text-sm">New Stores</span>
          </label>
        </div>
      </MobileAccordion>
    </div>
  );
}

/* ─── Mobile Accordion ───────────────────────────────────────────────────── */

function MobileAccordion({
  id, title, count, open, setOpen, children,
}: {
  id: string; title: string; count?: number; open: string | null; setOpen: (id: string | null) => void; children: React.ReactNode;
}) {
  const isOpen = open === id;
  return (
    <div>
      <button type="button" onClick={() => setOpen(isOpen ? null : id)} className="w-full flex items-center justify-between py-4 cursor-pointer group" aria-expanded={isOpen}>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/70 group-hover:text-clay transition-colors">{title}</span>
        <ChevronDown className={"w-4 h-4 text-clay/35 transition-transform duration-300 " + (isOpen ? "rotate-180" : "")} />
      </button>
      <div className={"overflow-hidden transition-all duration-300 ease-in-out " + (isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0")}>
        <div className="pb-4">{children}</div>
      </div>
    </div>
  );
}

/* ─── Mobile Sheet ───────────────────────────────────────────────────────── */

function MobileSheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-clay/30" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-[#FAF7EF] rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 h-14 border-b border-clay/8 sticky top-0 bg-[#FAF7EF]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay">{title}</p>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-clay/5 flex items-center justify-center text-clay hover:text-clay transition-colors cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
