"use client";

import {
  Search,
  X,
  Loader2,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

interface SearchSortBarProps {
  searchInput: string;
  query: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  sort: string;
  onSortChange: (value: string) => void;
  sortOptions: { value: string; label: string }[];
  activeFilterCount: number;
  onOpenMobileFilters: () => void;
  onOpenMobileSort: () => void;
}

function SearchInput({
  searchInput,
  query,
  onSearchChange,
}: {
  searchInput: string;
  query: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-clay/40 pointer-events-none" />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="w-full h-12 pl-11 pr-11 rounded-lg bg-white border border-clay/10 text-[15px] text-clay placeholder:text-clay/50 focus:outline-none focus:border-terracotta/40 transition-all"
      />
      {searchInput !== query ? (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-clay/40 animate-spin pointer-events-none" />
      ) : searchInput ? (
        <button
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-clay/40 hover:text-clay hover:bg-clay/5 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : null}
    </div>
  );
}

function SortButtons({
  sort,
  onSortChange,
  sortOptions,
}: {
  sort: string;
  onSortChange: (value: string) => void;
  sortOptions: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-1">
      {sortOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSortChange(opt.value)}
          className={
            "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200 cursor-pointer " +
            (sort === opt.value
              ? "bg-clay text-sand"
              : "text-clay/50 hover:text-clay/70 hover:bg-clay/5")
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── S3A: All in one bar ─────────────────────────────────────────────────────

export function SearchSortBarS3A({
  searchInput,
  query,
  onSearchChange,
  filteredCount,
  sort,
  onSortChange,
  sortOptions,
  activeFilterCount,
  onOpenMobileFilters,
  onOpenMobileSort,
}: SearchSortBarProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Mobile sticky toolbar */}
      <div className="lg:hidden sticky top-0 z-40 -mx-5 px-5 pt-3 pb-3 bg-[#F1EDE1]/95 backdrop-blur-md flex gap-3">
        <button
          onClick={onOpenMobileFilters}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-clay/12 bg-white text-clay text-xs font-bold uppercase tracking-[0.12em] hover:border-clay/25 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-terracotta" />
          Filter
          {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
        <button
          onClick={onOpenMobileSort}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-clay/12 bg-white text-clay text-xs font-bold uppercase tracking-[0.12em] hover:border-clay/25 transition-colors cursor-pointer"
        >
          <ArrowUpDown className="w-4 h-4 text-terracotta" />
          Sort
        </button>
      </div>

      {/* Desktop toolbar */}
      <div className="hidden lg:flex items-center gap-4">
        <SearchInput
          searchInput={searchInput}
          query={query}
          onSearchChange={onSearchChange}
        />
        <p className="text-sm text-clay/50 whitespace-nowrap font-label">
          <span className="font-bold text-clay">{filteredCount}</span>{" "}
          products
        </p>
        <div className="flex-1" />
        <SortButtons
          sort={sort}
          onSortChange={onSortChange}
          sortOptions={sortOptions}
        />
      </div>
    </div>
  );
}

// ─── S3B: Search full width, sort below ──────────────────────────────────────

export function SearchSortBarS3B({
  searchInput,
  query,
  onSearchChange,
  filteredCount,
  sort,
  onSortChange,
  sortOptions,
  activeFilterCount,
  onOpenMobileFilters,
  onOpenMobileSort,
}: SearchSortBarProps) {
  return (
    <div className="space-y-3 mb-6">
      <div className="lg:hidden sticky top-0 z-40 -mx-5 px-5 pt-3 pb-3 bg-[#F1EDE1]/95 backdrop-blur-md flex gap-3">
        <button
          onClick={onOpenMobileFilters}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-clay/12 bg-white text-clay text-xs font-bold uppercase tracking-[0.12em] hover:border-clay/25 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-terracotta" />
          Filter
          {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
        <button
          onClick={onOpenMobileSort}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-clay/12 bg-white text-clay text-xs font-bold uppercase tracking-[0.12em] hover:border-clay/25 transition-colors cursor-pointer"
        >
          <ArrowUpDown className="w-4 h-4 text-terracotta" />
          Sort
        </button>
      </div>

      <div className="hidden lg:block">
        <SearchInput
          searchInput={searchInput}
          query={query}
          onSearchChange={onSearchChange}
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-clay/50 font-label">
            <span className="font-bold text-clay">{filteredCount}</span>{" "}
            products
          </p>
          <SortButtons
            sort={sort}
            onSortChange={onSortChange}
            sortOptions={sortOptions}
          />
        </div>
      </div>
    </div>
  );
}

// ─── S3C: Minimal with sort buttons ──────────────────────────────────────────

export function SearchSortBarS3C({
  searchInput,
  query,
  onSearchChange,
  filteredCount,
  sort,
  onSortChange,
  sortOptions,
  activeFilterCount,
  onOpenMobileFilters,
  onOpenMobileSort,
}: SearchSortBarProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Mobile sticky toolbar */}
      <div className="lg:hidden sticky top-0 z-40 -mx-5 px-5 pt-3 pb-3 bg-[#F1EDE1]/95 backdrop-blur-md flex gap-3">
        <button
          onClick={onOpenMobileFilters}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-clay/12 bg-white text-clay text-xs font-bold uppercase tracking-[0.12em] hover:border-clay/25 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-terracotta" />
          Filter
          {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
        <button
          onClick={onOpenMobileSort}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-clay/12 bg-white text-clay text-xs font-bold uppercase tracking-[0.12em] hover:border-clay/25 transition-colors cursor-pointer"
        >
          <ArrowUpDown className="w-4 h-4 text-terracotta" />
          Sort
        </button>
      </div>

      {/* Desktop toolbar */}
      <div className="hidden lg:block space-y-3">
        <SearchInput
          searchInput={searchInput}
          query={query}
          onSearchChange={onSearchChange}
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-clay/50 font-label">
            <span className="font-bold text-clay">{filteredCount}</span>{" "}
            products
          </p>
          <SortButtons
            sort={sort}
            onSortChange={onSortChange}
            sortOptions={sortOptions}
          />
        </div>
      </div>
    </div>
  );
}
