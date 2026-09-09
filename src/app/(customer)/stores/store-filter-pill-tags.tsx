"use client";

import { useState } from "react";
import { ChevronDown, Star, X, SlidersHorizontal, Check } from "lucide-react";

export interface StoreFilters {
  categories: string[];
  types: string[];
  locations: string[];
  minRating: number;
  featuredOnly: boolean;
  newOnly: boolean;
}

export const CATEGORY_OPTIONS = [
  "Fashion & Apparel",
  "Accessories",
  "Electronics",
  "Sports & Outdoors",
  "Beauty & Skincare",
  "Streetwear",
];

export const TYPE_OPTIONS = ["Independent", "Brand"];
export const LOCATION_OPTIONS = ["Local", "National", "International"];
export const RATING_OPTIONS = [
  { value: 4, label: "4.0 & up" },
  { value: 4.5, label: "4.5 & up" },
];

export function StoreFilterF1({
  filters,
  totalItems,
  onUpdate,
  onClearAll,
  onOpenMobileFilter,
  children,
}: {
  filters: StoreFilters;
  totalItems: number;
  onUpdate: <K extends keyof StoreFilters>(key: K, val: StoreFilters[K]) => void;
  onClearAll: () => void;
  onOpenMobileFilter?: () => void;
  children: React.ReactNode;
}) {
  const count =
    filters.categories.length +
    filters.types.length +
    filters.locations.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.featuredOnly ? 1 : 0) +
    (filters.newOnly ? 1 : 0);

  const chips: { label: string; onRemove: () => void }[] = [
    ...filters.categories.map((c) => ({
      label: c,
      onRemove: () => onUpdate("categories", filters.categories.filter((v) => v !== c)),
    })),
    ...filters.types.map((t) => ({
      label: t,
      onRemove: () => onUpdate("types", filters.types.filter((v) => v !== t)),
    })),
    ...filters.locations.map((l) => ({
      label: l,
      onRemove: () => onUpdate("locations", filters.locations.filter((v) => v !== l)),
    })),
    ...(filters.minRating > 0
      ? [{ label: `${filters.minRating}+ stars`, onRemove: () => onUpdate("minRating", 0 as number) }]
      : []),
    ...(filters.featuredOnly
      ? [{ label: "Featured", onRemove: () => onUpdate("featuredOnly", false) }]
      : []),
    ...(filters.newOnly
      ? [{ label: "New", onRemove: () => onUpdate("newOnly", false) }]
      : []),
  ];

  const [openSection, setOpenSection] = useState<string | null>("category");

  function toggleList(list: string[], val: string) {
    return list.includes(val) ? list.filter((v) => v !== val) : [...list, val];
  }

  return (
    <div>
      {/* Desktop sidebar + content area */}
      <div className="flex gap-10">
        <aside className="hidden lg:block w-[260px] shrink-0">
          <div className="sticky top-24">
            {/* Filter header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-clay inline-flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-terracotta" />
                Filters
              </p>
              {count > 0 && (
                <button onClick={onClearAll} className="text-[11px] font-semibold text-terracotta hover:text-clay transition-colors cursor-pointer">
                  Clear all
                </button>
              )}
            </div>

            {/* Filter panel */}
            <div className="rounded-2xl border border-clay/10 bg-white overflow-hidden shadow-[0_1px_3px_rgba(61,43,31,0.04)]">
              {count > 0 && (
                <div className="px-5 py-3 bg-terracotta/5 border-b border-clay/8">
                  <p className="text-[11px] font-semibold text-terracotta">
                    {count} filter{count > 1 ? "s" : ""} active
                  </p>
                </div>
              )}

              <FilterAccordion id="category" title="Category" count={filters.categories.length} open={openSection} setOpen={setOpenSection}>
                <div className="space-y-0.5">
                  {CATEGORY_OPTIONS.map((c) => {
                    const active = filters.categories.includes(c);
                    return (
                      <label key={c} className={"flex items-center gap-3 py-2 px-1 rounded-lg cursor-pointer transition-colors " + (active ? "bg-terracotta/5" : "hover:bg-clay/5")}>
                        <input type="checkbox" checked={active} onChange={() => onUpdate("categories", toggleList(filters.categories, c))} className="sr-only" />
                        <span className={"relative flex h-4 w-4 items-center justify-center rounded border transition-all shrink-0 " + (active ? "bg-terracotta border-terracotta" : "border-clay/25 bg-white")}>
                          {active && <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </span>
                        <span className={"flex-1 text-sm transition-colors " + (active ? "text-clay font-medium" : "text-clay/80")}>{c}</span>
                      </label>
                    );
                  })}
                </div>
              </FilterAccordion>

              <FilterAccordion id="type" title="Store Type" count={filters.types.length} open={openSection} setOpen={setOpenSection}>
                <div className="flex flex-wrap gap-2">
                  {TYPE_OPTIONS.map((t) => {
                    const active = filters.types.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => onUpdate("types", toggleList(filters.types, t))}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer border ${
                          active
                            ? "bg-clay text-sand border-clay shadow-sm"
                            : "bg-white text-clay/55 border-clay/12 hover:border-clay/30 hover:text-clay"
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        {t}
                      </button>
                    );
                  })}
                </div>
              </FilterAccordion>

              <FilterAccordion id="location" title="Location" count={filters.locations.length} open={openSection} setOpen={setOpenSection}>
                <div className="flex flex-wrap gap-2">
                  {LOCATION_OPTIONS.map((l) => {
                    const active = filters.locations.includes(l);
                    return (
                      <button
                        key={l}
                        onClick={() => onUpdate("locations", toggleList(filters.locations, l))}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer border ${
                          active
                            ? "bg-clay text-sand border-clay shadow-sm"
                            : "bg-white text-clay/55 border-clay/12 hover:border-clay/30 hover:text-clay"
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        {l}
                      </button>
                    );
                  })}
                </div>
              </FilterAccordion>

              <FilterAccordion id="rating" title="Rating" count={filters.minRating > 0 ? 1 : 0} open={openSection} setOpen={setOpenSection}>
                <div className="space-y-0.5">
                  {RATING_OPTIONS.map((r) => {
                    const active = filters.minRating === r.value;
                    return (
                      <label
                        key={r.value}
                        className={`flex items-center gap-3 py-2.5 px-1 rounded-lg cursor-pointer transition-colors duration-200 ${
                          active ? "bg-terracotta/5" : "hover:bg-clay/[0.03]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="store-min-rating-f1"
                          checked={active}
                          onChange={() => onUpdate("minRating", active ? 0 : r.value)}
                          className="sr-only"
                        />
                        <span className={`relative flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200 shrink-0 ${
                          active ? "border-terracotta" : "border-clay/20 hover:border-clay/35"
                        }`}>
                          {active && <span className="h-2.5 w-2.5 rounded-full bg-terracotta" />}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-ochre text-ochre" />
                          <span className={`text-sm transition-colors duration-200 ${active ? "text-clay font-medium" : "text-clay/70"}`}>
                            {r.label}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </FilterAccordion>

              <FilterAccordion id="collections" title="Collections" count={(filters.featuredOnly ? 1 : 0) + (filters.newOnly ? 1 : 0)} open={openSection} setOpen={setOpenSection}>
                <div className="space-y-0.5">
                  <ToggleRow label="Featured Stores" active={filters.featuredOnly} onChange={() => onUpdate("featuredOnly", !filters.featuredOnly)} />
                  <ToggleRow label="New Stores" active={filters.newOnly} onChange={() => onUpdate("newOnly", !filters.newOnly)} />
                </div>
              </FilterAccordion>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {count > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={chip.onRemove}
                  className="group/chip inline-flex items-center gap-1.5 pl-3.5 pr-2.5 py-1.5 rounded-full bg-terracotta/10 text-terracotta text-[11px] font-semibold hover:bg-terracotta/15 transition-colors duration-200 cursor-pointer"
                >
                  {chip.label}
                  <X className="w-3 h-3 opacity-50 group-hover/chip:opacity-100 transition-opacity" />
                </button>
              ))}
              <button
                onClick={onClearAll}
                className="text-[11px] font-semibold text-clay/70 hover:text-terracotta underline underline-offset-2 transition-colors duration-200 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Mobile filter/sort toolbar */}
          <div className="lg:hidden sticky top-0 z-40 -mx-5 px-5 pt-3 pb-3 mb-3 bg-[#FAF7EF]/95 backdrop-blur-md flex gap-3">
            <button onClick={onOpenMobileFilter} className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-clay/12 bg-white text-clay text-[11px] font-bold uppercase tracking-[0.15em] hover:border-clay/25 transition-colors duration-200 cursor-pointer shadow-[0_1px_3px_rgba(61,43,31,0.04)]">
              <SlidersHorizontal className="w-4 h-4" />
              Filter{count > 0 ? ` (${count})` : ""}
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Filter Accordion ────────────────────────────────────────────────────── */

function FilterAccordion({
  id,
  title,
  count,
  open,
  setOpen,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  open: string | null;
  setOpen: (id: string | null) => void;
  children: React.ReactNode;
}) {
  const isOpen = open === id;
  return (
    <div className="border-b border-clay/8 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(isOpen ? null : id)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-clay/[0.02] transition-colors duration-200 cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay">{title}</span>
          {count != null && count > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold text-white">
              {count}
            </span>
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

/* ─── Toggle Row ──────────────────────────────────────────────────────────── */

function ToggleRow({ label, active, onChange }: { label: string; active: boolean; onChange: () => void }) {
  return (
    <label
      className={`flex items-center gap-3 py-2.5 px-1 rounded-lg cursor-pointer transition-colors duration-200 ${
        active ? "bg-terracotta/5" : "hover:bg-clay/[0.03]"
      }`}
    >
      <input type="checkbox" checked={active} onChange={onChange} className="sr-only" />
      <span className={`relative flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-200 shrink-0 ${
        active ? "bg-terracotta border-terracotta" : "border-clay/20 bg-white hover:border-clay/35"
      }`}>
        {active && (
          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={`flex-1 text-sm transition-colors duration-200 ${active ? "text-clay font-medium" : "text-clay/70"}`}>
        {label}
      </span>
    </label>
  );
}
