"use client";

import React from "react";
import Link from "next/link";
import {
  Cpu,
  Shirt,
  Home,
  Dumbbell,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

export interface CategoryNavItem {
  id: number;
  name: string;
  slug: string;
}

function HealthBeautyIcon({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22c4-4 8-7.5 8-12A8 8 0 0 0 4 10c0 4.5 4 8 8 12z" />
      <path d="M12 22V10" />
      <path d="M8 14c1.5-1 2.5-2.5 4-4" />
      <circle cx="17" cy="5" r="2" fill="currentColor" stroke="none" opacity="0.35" />
    </svg>
  );
}

const CATEGORY_META: Record<
  string,
  { icon: LucideIcon | ((props: { className?: string; strokeWidth?: number }) => React.ReactElement); image: string; color: string }
> = {
  electronics: {
    icon: Cpu,
    image: "/cat-electronics.jpg",
    color: "from-[#2D3A3A]/80 to-[#2D3A3A]/40",
  },
  fashion: {
    icon: Shirt,
    image: "/cat-fashion.jpg",
    color: "from-[#3D2B1F]/80 to-[#3D2B1F]/40",
  },
  accessories: {
    icon: Home,
    image: "/cat-accessories.jpg",
    color: "from-[#4A3728]/80 to-[#4A3728]/40",
  },
  sports: {
    icon: Dumbbell,
    image: "/cat-sports.jpg",
    color: "from-[#3A2E25]/80 to-[#3A2E25]/40",
  },
  beauty: {
    icon: HealthBeautyIcon,
    image: "/cat-beauty-skincare.jpg",
    color: "from-[#2E4A3E]/80 to-[#2E4A3E]/40",
  },
};

const DEFAULT_META = { icon: Home, image: "/hero-core.jpg", color: "from-clay/80 to-clay/40" };

/* ─── Variation A: Image Cards with Gradient Overlay ─── */
export function CategoryVariationA({ categories }: { categories: CategoryNavItem[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {categories.map((cat, idx) => {
        const meta = CATEGORY_META[cat.slug] ?? DEFAULT_META;
        const Icon = meta.icon;
        const isLast = idx === categories.length - 1;
        const isOddCount = categories.length % 2 !== 0;
        return (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(cat.name)}`}
            className={`group relative h-44 sm:h-52 lg:h-60 rounded-2xl overflow-hidden ${isLast && isOddCount ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <img
              src={meta.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${meta.color} group-hover:opacity-80 transition-opacity duration-500`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="relative h-full flex flex-col justify-end p-5 z-10">
              <span className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:bg-white/25 transition-colors duration-300">
                <Icon className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-semibold text-white leading-tight">{cat.name}</span>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] font-label text-white/60 group-hover:text-white/90 transition-colors whitespace-nowrap">
                Shop Now
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ─── Variation B: Horizontal Scroll Strip ─── */
export function CategoryVariationB({ categories }: { categories: CategoryNavItem[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 snap-x snap-mandatory scrollbar-hide">
      {categories.map((cat) => {
        const meta = CATEGORY_META[cat.slug] ?? DEFAULT_META;
        const Icon = meta.icon;
        return (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group relative flex-shrink-0 w-[200px] sm:w-[240px] h-36 sm:h-40 rounded-2xl overflow-hidden snap-start"
          >
            <img
              src={meta.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

            <div className="relative h-full flex items-center gap-3 p-5 z-10">
              <span className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
              </span>
              <div>
                <span className="text-sm font-semibold text-white block leading-tight">{cat.name}</span>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] font-label text-white/50 group-hover:text-white/80 transition-colors">
                  Browse
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ─── Variation C: Asymmetric Masonry ─── */
export function CategoryVariationC({ categories }: { categories: CategoryNavItem[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[180px] lg:auto-rows-[200px]">
      {categories.map((cat, idx) => {
        const meta = CATEGORY_META[cat.slug] ?? DEFAULT_META;
        const Icon = meta.icon;
        const isLarge = idx === 0 || idx === 3;
        return (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(cat.name)}`}
            className={`group relative rounded-2xl overflow-hidden ${
              isLarge ? "col-span-2 lg:col-span-1 row-span-2" : ""
            }`}
          >
            <img
              src={meta.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${meta.color}`} />
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20" />

            <div className="relative h-full flex flex-col justify-between p-5 z-10">
              <span className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center self-end group-hover:bg-white/25 transition-colors">
                <Icon className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />
              </span>
              <div>
                <span className="text-base sm:text-lg font-semibold text-white leading-tight block">{cat.name}</span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] font-label text-white/50 group-hover:text-white/80 transition-colors">
                  Explore
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ─── Variation D: Minimal Floating Tags ─── */
export function CategoryVariationD({ categories }: { categories: CategoryNavItem[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((cat) => {
        const meta = CATEGORY_META[cat.slug] ?? DEFAULT_META;
        const Icon = meta.icon;
        return (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group relative flex items-center gap-3 h-14 sm:h-16 pl-2 pr-5 sm:pr-6 rounded-full bg-white border border-clay/10 hover:border-terracotta/30 hover:shadow-[0_8px_24px_-12px_rgba(61,43,31,0.15)] transition-all duration-500"
          >
            <span className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-clay/8">
              <img
                src={meta.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </span>
            <span className="text-sm font-semibold text-clay/80 group-hover:text-terracotta transition-colors whitespace-nowrap">
              {cat.name}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-clay/55 group-hover:text-terracotta group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
        );
      })}
    </div>
  );
}
