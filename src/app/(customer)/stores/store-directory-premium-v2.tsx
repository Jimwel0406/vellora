"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  ChevronDown,
  Store,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Lock,
  Shield,
} from "lucide-react";
import { StoreCardC } from "./store-card-artisan";
import { StoreFilterF1 } from "./store-filter-pill-tags";
import type { StoreFilters } from "./store-filter-pill-tags";
import { HeroImageRotator } from "./hero-image-rotator";
import { MarqueeM2 } from "./marquee-variations";
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

export function StoreDirectoryPremiumV2({ items }: { items: StoreItem[] }) {
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

  function update<K extends keyof StoreFilters>(key: K, value: StoreFilters[K]) {
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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const display = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const gridContent = (
    <>
      {/* Mobile toolbar */}
      <div className="lg:hidden sticky top-0 z-40 -mx-5 px-5 pt-3 pb-3 mb-3 bg-[#FAF7EF]/95 backdrop-blur-md flex gap-3">
        <button onClick={() => setShowMobileFilters(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-clay/12 bg-white text-clay text-[11px] font-bold uppercase tracking-[0.15em] hover:border-clay/25 transition-colors duration-200 cursor-pointer shadow-[0_1px_3px_rgba(61,43,31,0.04)]">
          <SlidersHorizontal className="w-4 h-4" />
          Filter{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        <button onClick={() => setShowMobileSort(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-clay/12 bg-white text-clay text-[11px] font-bold uppercase tracking-[0.15em] hover:border-clay/25 transition-colors duration-200 cursor-pointer shadow-[0_1px_3px_rgba(61,43,31,0.04)]">
          <ArrowUpDown className="w-4 h-4" />
          Sort
        </button>
      </div>

      {display.length === 0 ? (
        <div className="rounded-2xl border border-clay/10 bg-white py-24 text-center shadow-[0_1px_3px_rgba(61,43,31,0.04)]">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-clay/5 flex items-center justify-center">
            <Store className="w-7 h-7 text-clay/55" />
          </div>
          <p className="mt-6 font-heading text-xl text-clay/70">No stores found</p>
          <p className="mt-2 text-sm text-clay/65 max-w-xs mx-auto leading-relaxed">
            Try adjusting your filters to discover more stores.
          </p>
          <button onClick={clearFilters}
            className="mt-8 px-8 py-3 rounded-xl bg-clay text-sand text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-terracotta transition-colors duration-250 cursor-pointer">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {display.map((item) => (
            <StoreCardC key={item.store.id} item={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-14">
          {currentPage > 1 && (
            <button onClick={() => setCurrentPage((p) => p - 1)}
              className="px-5 py-2.5 rounded-xl border border-clay/15 text-[11px] font-bold uppercase tracking-[0.15em] text-clay/75 hover:bg-clay hover:text-sand hover:border-clay transition-all duration-250 cursor-pointer">
              Prev
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl text-[11px] font-bold transition-all duration-250 cursor-pointer ${
                currentPage === page
                  ? "bg-clay text-sand shadow-[0_2px_8px_rgba(61,43,31,0.2)]"
                  : "border border-clay/15 text-clay/75 hover:bg-clay hover:text-sand hover:border-clay"
              }`}>
              {page}
            </button>
          ))}
          {currentPage < totalPages && (
            <button onClick={() => setCurrentPage((p) => p + 1)}
              className="px-5 py-2.5 rounded-xl border border-clay/15 text-[11px] font-bold uppercase tracking-[0.15em] text-clay/75 hover:bg-clay hover:text-sand hover:border-clay transition-all duration-250 cursor-pointer">
              Next
            </button>
          )}
        </div>
      )}
    </>
  );

  return (
    <div>
      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section data-section="store-directory-hero" className="section-store-directory-hero relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-terracotta/5 blur-3xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-ochre/5 blur-3xl" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-16 sm:pt-24 lg:pt-32 pb-12 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta mb-5 inline-flex items-center gap-2">
                <Store className="w-3.5 h-3.5" />
                Independent Sellers
              </p>
              <h1 className="font-heading text-[52px] sm:text-[64px] lg:text-[76px] xl:text-[88px] text-clay font-semibold leading-[0.92] tracking-[-0.03em]">
                Discover<br />Stores
              </h1>
              <p className="mt-8 text-xl sm:text-2xl text-clay/80 leading-[1.7] max-w-lg">
                Discover independent sellers offering thoughtfully made products — from electronics and home goods to fashion and lifestyle essentials.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="#store-directory-header"
                  className="group inline-flex items-center gap-3 h-14 px-8 bg-terracotta text-white text-sm font-bold uppercase tracking-[0.15em] rounded-xl hover:bg-terracotta-deep transition-colors duration-250 shadow-[0_4px_16px_rgba(166,99,75,0.3)]">
                  Explore Stores
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <span className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white border border-clay/10 text-sm text-clay/70 shadow-[0_1px_3px_rgba(61,43,31,0.04)]">
                  <BadgeCheck className="w-4 h-4 text-terracotta" />
                  Trusted by <span className="font-bold text-clay">200+</span> sellers
                </span>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <span className="flex items-center gap-2 text-sm text-clay/70">
                  <ShieldCheck className="w-4 h-4 text-terracotta" />
                  Verified Sellers
                </span>
                <span className="flex items-center gap-2 text-sm text-clay/70">
                  <Lock className="w-4 h-4 text-terracotta" />
                  Secure Payments
                </span>
                <span className="flex items-center gap-2 text-sm text-clay/70">
                  <Shield className="w-4 h-4 text-terracotta" />
                  Buyer Protection
                </span>
              </div>
            </div>
            <HeroImageRotator />
          </div>
        </div>
      </section>

      {/* ─── Marquee ─────────────────────────────────────────────────────── */}
      <MarqueeM2 />

      {/* ─── Collection Header ───────────────────────────────────────────── */}
      <section id="store-directory-header" data-section="store-directory-header" className="section-store-directory-header max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-clay/10 pt-6">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-clay">All Stores</h2>
            <span className="text-[11px] text-clay/65 font-medium">
              {filtered.length} store{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="hidden md:block relative" ref={sortRef}>
            <button onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 h-10 px-4 rounded-xl border border-clay/12 bg-white text-clay text-[11px] font-bold uppercase tracking-[0.12em] hover:border-clay/25 transition-colors duration-200 cursor-pointer shadow-[0_1px_3px_rgba(61,43,31,0.04)]">
              <ArrowUpDown className="w-4 h-4 text-clay/35" />
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSortDropdown ? "rotate-180" : ""}`} />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-clay/12 rounded-xl shadow-[0_8px_30px_-8px_rgba(61,43,31,0.12)] py-1 z-50">
                {SORT_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => { setSort(opt.value); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[11px] font-medium transition-colors duration-200 cursor-pointer ${
                      sort === opt.value ? "bg-clay/5 text-clay" : "text-clay/55 hover:bg-clay/[0.03] hover:text-clay"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Content ─────────────────────────────────────────────────────── */}
      <section id="store-directory-content" data-section="store-directory-content" className="section-store-directory-content max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-10 lg:pt-12 pb-20">
        <StoreFilterF1 filters={filters} totalItems={filtered.length} onUpdate={update} onClearAll={clearFilters}>
          {gridContent}
        </StoreFilterF1>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section data-section="store-directory-cta" className="section-store-directory-cta max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pb-24">
        <div className="relative overflow-hidden rounded-2xl bg-clay text-sand py-16 sm:py-20 px-8 sm:px-14 text-center">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight text-sand">
              Your store belongs here.
            </h2>
            <p className="max-w-xl mx-auto text-sm text-sand/55 mt-5 leading-relaxed">
              Join a community of independent sellers. We handle the technology, so you can focus on your business.
            </p>
            <Link href="/register"
              className="group mt-8 inline-flex items-center gap-2 bg-terracotta text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-terracotta-deep transition-colors duration-250 shadow-[0_4px_16px_rgba(166,99,75,0.3)]">
              Open your studio
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Mobile Filter Sheet ─────────────────────────────────────────── */}
      {showMobileFilters && (
        <MobileSheet title="Filter" onClose={() => setShowMobileFilters(false)}>
          <div className="p-4">
            <div className="rounded-2xl border border-clay/10 bg-white overflow-hidden shadow-[0_1px_3px_rgba(61,43,31,0.04)]">
              {activeCount > 0 && (
                <div className="px-5 py-3 bg-terracotta/5 border-b border-clay/8">
                  <p className="text-[11px] font-semibold text-terracotta">
                    {activeCount} filter{activeCount > 1 ? "s" : ""} active
                  </p>
                </div>
              )}
              <MobileFilterBody filters={filters} update={update} />
            </div>
            <div className="flex gap-3 mt-6 border-t border-clay/10 pt-4">
              <button onClick={clearFilters}
                className="flex-1 h-12 rounded-xl border border-clay/15 text-clay text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-clay/5 transition-colors duration-200 cursor-pointer">
                Clear All
              </button>
              <button onClick={() => setShowMobileFilters(false)}
                className="flex-1 h-12 rounded-xl bg-clay text-sand text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-terracotta transition-colors duration-250 cursor-pointer">
                Apply Filters
              </button>
            </div>
          </div>
        </MobileSheet>
      )}

      {/* ─── Mobile Sort Sheet ───────────────────────────────────────────── */}
      {showMobileSort && (
        <MobileSheet title="Sort" onClose={() => setShowMobileSort(false)}>
          <div className="flex flex-col gap-1 p-3">
            {SORT_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => { setSort(opt.value); setShowMobileSort(false); }}
                className={`text-left px-4 py-3 rounded-xl text-sm transition-colors duration-200 cursor-pointer ${
                  sort === opt.value ? "bg-clay/5 text-clay font-semibold" : "text-clay/55 hover:bg-clay/[0.03] hover:text-clay"
                }`}>
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
    "Fashion & Apparel", "Accessories", "Electronics",
    "Sports & Outdoors", "Beauty & Skincare", "Streetwear",
  ];
  const TYPE_OPTIONS = ["Independent", "Brand"];
  const LOCATION_OPTIONS = ["Local", "National", "International"];
  const RATING_OPTIONS = [{ value: 4, label: "4.0 & up" }, { value: 4.5, label: "4.5 & up" }];

  return (
    <div className="divide-y divide-clay/8">
      <MobileAccordion id="category" title="Category" count={filters.categories.length} open={openSection} setOpen={setOpenSection}>
        <div className="space-y-0.5">
          {CATEGORY_OPTIONS.map((c) => {
            const active = filters.categories.includes(c);
            return (
              <label key={c} className={`flex items-center gap-3 py-2.5 px-1 rounded-lg cursor-pointer transition-colors duration-200 ${active ? "bg-terracotta/5" : "hover:bg-clay/[0.03]"}`}>
                <input type="checkbox" checked={active} onChange={() => update("categories", toggleList(filters.categories, c))} className="peer sr-only" />
                <span className={`relative flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-200 shrink-0 ${active ? "bg-terracotta border-terracotta" : "border-clay/20 bg-white"}`}>
                  {active && <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
                <span className={`flex-1 text-sm ${active ? "text-clay font-medium" : "text-clay/70"}`}>{c}</span>
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
              <button key={t} onClick={() => update("types", toggleList(filters.types, t))}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer border ${active ? "bg-clay text-sand border-clay" : "bg-white text-clay/55 border-clay/12"}`}>
                {active && <span className="w-3 h-3 flex items-center justify-center"><svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
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
              <button key={l} onClick={() => update("locations", toggleList(filters.locations, l))}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer border ${active ? "bg-clay text-sand border-clay" : "bg-white text-clay/55 border-clay/12"}`}>
                {active && <span className="w-3 h-3 flex items-center justify-center"><svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
                {l}
              </button>
            );
          })}
        </div>
      </MobileAccordion>

      <MobileAccordion id="rating" title="Rating" count={filters.minRating > 0 ? 1 : 0} open={openSection} setOpen={setOpenSection}>
        <div className="space-y-0.5">
          {RATING_OPTIONS.map((r) => {
            const active = filters.minRating === r.value;
            return (
              <label key={r.value} className={`flex items-center gap-3 py-2.5 px-1 rounded-lg cursor-pointer transition-colors duration-200 ${active ? "bg-terracotta/5" : "hover:bg-clay/[0.03]"}`}>
                <input type="radio" name="mobile-rating" checked={active} onChange={() => update("minRating", active ? 0 : r.value)} className="sr-only" />
                <span className={`relative flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200 shrink-0 ${active ? "border-terracotta" : "border-clay/20"}`}>
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-terracotta" />}
                </span>
                <span className={`text-sm ${active ? "text-clay font-medium" : "text-clay/70"}`}>{r.label}</span>
              </label>
            );
          })}
        </div>
      </MobileAccordion>

      <MobileAccordion id="collections" title="Collections" count={(filters.featuredOnly ? 1 : 0) + (filters.newOnly ? 1 : 0)} open={openSection} setOpen={setOpenSection}>
        <div className="space-y-0.5">
          <label className={`flex items-center gap-3 py-2.5 px-1 rounded-lg cursor-pointer transition-colors duration-200 ${filters.featuredOnly ? "bg-terracotta/5" : "hover:bg-clay/[0.03]"}`}>
            <input type="checkbox" checked={filters.featuredOnly} onChange={(e) => update("featuredOnly", e.target.checked)} className="sr-only" />
            <span className={`relative flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-200 shrink-0 ${filters.featuredOnly ? "bg-terracotta border-terracotta" : "border-clay/20 bg-white"}`}>
              {filters.featuredOnly && <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            <span className={`flex-1 text-sm ${filters.featuredOnly ? "text-clay font-medium" : "text-clay/70"}`}>Featured Stores</span>
          </label>
          <label className={`flex items-center gap-3 py-2.5 px-1 rounded-lg cursor-pointer transition-colors duration-200 ${filters.newOnly ? "bg-terracotta/5" : "hover:bg-clay/[0.03]"}`}>
            <input type="checkbox" checked={filters.newOnly} onChange={(e) => update("newOnly", e.target.checked)} className="sr-only" />
            <span className={`relative flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-200 shrink-0 ${filters.newOnly ? "bg-terracotta border-terracotta" : "border-clay/20 bg-white"}`}>
              {filters.newOnly && <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            <span className={`flex-1 text-sm ${filters.newOnly ? "text-clay font-medium" : "text-clay/70"}`}>New Stores</span>
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
      <button type="button" onClick={() => setOpen(isOpen ? null : id)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-clay/[0.02] transition-colors duration-200 cursor-pointer" aria-expanded={isOpen}>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay">{title}</span>
          {count != null && count > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold text-white">{count}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-clay/55 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}

/* ─── Mobile Sheet ───────────────────────────────────────────────────────── */

function MobileSheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-clay/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-[#FAF7EF] rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 h-14 border-b border-clay/10 sticky top-0 bg-[#FAF7EF]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay">{title}</p>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-clay/5 flex items-center justify-center text-clay/55 hover:text-clay transition-colors duration-200 cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
