"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FilterOptions {
  categories: string[];
  vendors: string[];
  priceRange: { min: number; max: number };
  inStock: boolean;
  rating: number;
  featuredOnly: boolean;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={
            "w-3.5 h-3.5 " +
            (i <= rating ? "fill-rating" : "fill-clay/15")
          }
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function CustomCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <span
      className={
        "relative flex h-4 w-4 items-center justify-center rounded border transition-all duration-200 cursor-pointer " +
        (checked
          ? "bg-terracotta border-terracotta"
          : "border-clay/25 bg-white hover:border-clay/40")
      }
    >
      {checked && (
        <svg
          className="h-2.5 w-2.5 text-white"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 6l3 3 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
    </span>
  );
}

function CustomRadio({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <span
      className={
        "relative flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer " +
        (checked
          ? "border-terracotta"
          : "border-clay/25 bg-white hover:border-clay/40")
      }
    >
      {checked && (
        <span className="h-2 w-2 rounded-full bg-terracotta" />
      )}
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
    </span>
  );
}

export function FilterPanelF3({
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
  onUpdateFilter: <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => void;
}) {
  return (
    <div className="flex flex-col">
      <AccordionSection title="Categories" defaultOpen>
        <div className="flex flex-col gap-0.5">
          {allCategories.map((name) => {
            const active = filters.categories.includes(name);
            return (
              <label
                key={name}
                className={
                  "flex items-center gap-3 py-2 px-1 cursor-pointer transition-colors " +
                  (active
                    ? "text-clay"
                    : "text-clay/60 hover:text-clay")
                }
              >
                <CustomCheckbox
                  checked={active}
                  onChange={() => onToggleCategory(name)}
                />
                <span className="flex-1 text-sm">{name}</span>
                <span
                  className={
                    "text-[11px] font-label " +
                    (active
                      ? "text-terracotta font-semibold"
                      : "text-clay/50")
                  }
                >
                  {categoryCount(name)}
                </span>
              </label>
            );
          })}
        </div>
      </AccordionSection>

      <AccordionSection title="Price">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-clay/45 text-sm">
              $
            </span>
            <input
              type="number"
              min={0}
              value={
                filters.priceRange.min === 0
                  ? ""
                  : filters.priceRange.min / 100
              }
              placeholder="Min"
              onChange={(e) =>
                onUpdateFilter("priceRange", {
                  ...filters.priceRange,
                  min:
                    e.target.value === ""
                      ? 0
                      : Math.max(0, Number(e.target.value)) * 100,
                })
              }
              className="w-full h-9 pl-7 pr-3 rounded-lg border border-clay/12 bg-white text-sm text-clay placeholder:text-clay/50 focus:outline-none focus:border-terracotta/40 transition-all"
            />
          </div>
          <span className="text-clay/30 text-xs">—</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-clay/45 text-sm">
              $
            </span>
            <input
              type="number"
              min={0}
              value={
                filters.priceRange.max === Infinity
                  ? ""
                  : filters.priceRange.max / 100
              }
              placeholder="Max"
              onChange={(e) =>
                onUpdateFilter("priceRange", {
                  ...filters.priceRange,
                  max:
                    e.target.value === ""
                      ? Infinity
                      : Number(e.target.value) * 100,
                })
              }
              className="w-full h-9 pl-7 pr-3 rounded-lg border border-clay/12 bg-white text-sm text-clay placeholder:text-clay/50 focus:outline-none focus:border-terracotta/40 transition-all"
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Store">
        <div className="flex flex-col gap-0.5">
          {allVendors.map((name) => {
            const active = filters.vendors.includes(name);
            return (
              <label
                key={name}
                className={
                  "flex items-center gap-3 py-2 px-1 cursor-pointer transition-colors " +
                  (active
                    ? "text-clay"
                    : "text-clay/60 hover:text-clay")
                }
              >
                <CustomCheckbox
                  checked={active}
                  onChange={() => onToggleVendor(name)}
                />
                <span className="flex-1 text-sm">{name}</span>
                <span
                  className={
                    "text-[11px] font-label " +
                    (active
                      ? "text-terracotta font-semibold"
                      : "text-clay/50")
                  }
                >
                  {vendorCount(name)}
                </span>
              </label>
            );
          })}
        </div>
      </AccordionSection>

      <AccordionSection title="Rating">
        <div className="flex flex-col gap-0.5">
          {[5, 4, 3, 2].map((r) => {
            const active = filters.rating === r;
            return (
              <label
                key={r}
                className={
                  "flex items-center gap-3 py-2 px-1 cursor-pointer transition-colors " +
                  (active
                    ? "text-clay"
                    : "text-clay/60 hover:text-clay")
                }
              >
                <CustomRadio
                  checked={active}
                  onChange={() =>
                    onUpdateFilter("rating", active ? 0 : r)
                  }
                />
                <Stars rating={r} />
                <span className="text-sm">&amp; up</span>
              </label>
            );
          })}
        </div>
      </AccordionSection>
    </div>
  );
}

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-clay/8 first:border-t-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 cursor-pointer group"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/70 group-hover:text-clay transition-colors">
          {title}
        </span>
        <ChevronDown
          className={
            "w-4 h-4 text-clay/35 transition-transform duration-300 " +
            (open ? "rotate-180" : "")
          }
        />
      </button>
      <div
        className={
          "overflow-hidden transition-all duration-300 ease-in-out " +
          (open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")
        }
      >
        <div className="pb-4">{children}</div>
      </div>
    </div>
  );
}
