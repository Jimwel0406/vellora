"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Category Data ───────────────────────────────────────────────────────────

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
}

const CATEGORY_IMAGE: Record<string, string> = {
  fashion: "/cat-fashion.jpg",
  accessories: "/cat-accessories.jpg",
  electronics: "/cat-electronics.jpg",
  sports: "/cat-sports.jpg",
  beauty: "/cat-beauty-skincare.jpg",
  "health-beauty": "/cat-beauty-skincare.jpg",
  "home-living": "/cat-home.jpg",
  books: "/cat-books.jpg",
};

const EDITORIAL_CATEGORIES: {
  name: string;
  slug: string;
  image: string;
  tagline: string;
}[] = [
  {
    name: "Fashion & Apparel",
    slug: "fashion",
    image: "/cat-fashion.jpg",
    tagline: "Curated style for every season",
  },
  {
    name: "Electronics",
    slug: "electronics",
    image: "/cat-electronics.jpg",
    tagline: "Innovation meets design",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "/cat-accessories.jpg",
    tagline: "The details that define you",
  },
  {
    name: "Sports & Outdoors",
    slug: "sports",
    image: "/cat-sports.jpg",
    tagline: "Gear for every adventure",
  },
  {
    name: "Beauty & Skincare",
    slug: "beauty",
    image: "/cat-beauty-skincare.jpg",
    tagline: "Essentials for radiant living",
  },
];

function getCategoryImage(slug: string) {
  return CATEGORY_IMAGE[slug] || "/hero-core.jpg";
}

// ─── Category Card ───────────────────────────────────────────────────────────

function CategoryCard({
  category,
  className = "",
  imageClassName = "",
  showTagline = false,
}: {
  category: (typeof EDITORIAL_CATEGORIES)[number];
  className?: string;
  imageClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.name)}`}
      className={`group relative overflow-hidden block ${className}`}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${imageClassName}`}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-5 sm:p-6 lg:p-7 z-10">
        <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-semibold text-white leading-tight">
          {category.name}
        </h3>
        {showTagline && (
          <p className="mt-1.5 text-xs sm:text-[13px] text-white/55 font-medium leading-relaxed max-w-[260px]">
            {category.tagline}
          </p>
        )}
        <span className="mt-3 inline-flex items-center gap-1.5 font-label text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50 group-hover:text-white/90 transition-colors duration-300">
          Explore
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function BestSellers({ categories }: { categories: CategoryItem[] }) {
  if (categories.length === 0) return null;

  // Map DB categories to editorial data, fallback to hardcoded list
  const mapped = EDITORIAL_CATEGORIES.map((ec) => {
    const dbCat = categories.find(
      (c) => c.slug === ec.slug || c.name === ec.name
    );
    return {
      ...ec,
      id: dbCat?.id ?? 0,
      href: dbCat
        ? `/products?category=${encodeURIComponent(dbCat.name)}`
        : `/products?category=${encodeURIComponent(ec.name)}`,
    };
  });

  const [fashion, electronics, accessories, sports, beauty] = mapped;

  return (
    <section data-section="best-sellers" className="section-best-sellers">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28 lg:pt-32 pb-10 sm:pb-12 lg:pb-14">
        {/* Editorial header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12 mb-14 sm:mb-18 lg:mb-20">
          <div className="flex flex-col">
            <span className="font-label text-2xl font-bold uppercase tracking-[0.3em] text-terracotta mb-3 sm:mb-4">
              Shop by Category
            </span>
            <h2 className="font-heading text-[44px] sm:text-[56px] lg:text-[72px] font-semibold text-clay tracking-[-0.02em] leading-[0.92]">
              Best Sellers
            </h2>
          </div>
          <div className="flex flex-col gap-4 lg:items-end lg:text-right lg:min-w-[280px]">
            <p className="text-base sm:text-lg text-clay/60 font-medium max-w-[320px] lg:max-w-none leading-relaxed">
              Explore our most loved categories — from fashion essentials to tech innovations.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-label text-sm sm:text-base font-semibold uppercase tracking-[0.14em] text-clay hover:text-terracotta transition-colors duration-300 group/link"
            >
              View All
              <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* ─── Desktop: Asymmetric editorial grid ─── */}
        <div className="hidden lg:grid grid-cols-[1.1fr_0.9fr] gap-4 auto-rows-[420px]">
          {/* Left column: Fashion (large) */}
          <CategoryCard
            category={fashion}
            className="rounded-lg row-span-2"
            showTagline
          />

          {/* Right column: Electronics + Accessories stacked */}
          <div className="flex flex-col gap-4 row-span-2">
            <CategoryCard
              category={electronics}
              className="flex-1 rounded-lg"
            />
            <CategoryCard
              category={accessories}
              className="flex-1 rounded-lg"
            />
          </div>
        </div>

        {/* Bottom row: Sports + Beauty — offset asymmetrically */}
        <div className="hidden lg:grid grid-cols-[0.85fr_1.15fr] gap-4 mt-4 h-[320px]">
          <CategoryCard
            category={sports}
            className="rounded-lg"
          />
          <CategoryCard
            category={beauty}
            className="rounded-lg"
            showTagline
          />
        </div>

        {/* ─── Tablet: 2-column balanced ─── */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3 auto-rows-[260px]">
          <CategoryCard
            category={fashion}
            className="col-span-2 rounded-lg"
            showTagline
          />
          <CategoryCard
            category={electronics}
            className="rounded-lg"
          />
          <CategoryCard
            category={accessories}
            className="rounded-lg"
          />
          <CategoryCard
            category={sports}
            className="rounded-lg"
          />
          <CategoryCard
            category={beauty}
            className="rounded-lg"
          />
        </div>

        {/* ─── Mobile: editorial sequence ─── */}
        <div className="flex sm:hidden flex-col gap-3">
          {/* Hero category — full width, dominant */}
          <CategoryCard
            category={fashion}
            className="w-full h-[320px] rounded-lg"
            showTagline
          />

          {/* Two side-by-side */}
          <div className="grid grid-cols-2 gap-3 h-[200px]">
            <CategoryCard
              category={electronics}
              className="rounded-lg"
            />
            <CategoryCard
              category={accessories}
              className="rounded-lg"
            />
          </div>

          {/* Two side-by-side */}
          <div className="grid grid-cols-2 gap-3 h-[200px]">
            <CategoryCard
              category={sports}
              className="rounded-lg"
            />
            <CategoryCard
              category={beauty}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
