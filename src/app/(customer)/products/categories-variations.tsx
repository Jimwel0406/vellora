"use client";

import Link from "next/link";
import { Reveal } from "@/components/home/reveal";

const CATEGORY_IMAGES: Record<string, string> = {
  Electronics: "/cat-electronics.jpg",
  "Fashion & Apparel": "/cat-fashion.jpg",
  Accessories: "/cat-accessories.jpg",
  "Sports & Outdoors": "/cat-sports.jpg",
  "Beauty & Skincare": "/cat-beauty-skincare.jpg",
};

const EDITORIAL_CATEGORIES = [
  { name: "Fashion & Apparel", slug: "fashion", number: "01" },
  { name: "Electronics", slug: "electronics", number: "02" },
  { name: "Accessories", slug: "accessories", number: "03" },
  { name: "Sports & Outdoors", slug: "sports", number: "04" },
  { name: "Beauty & Skincare", slug: "beauty", number: "05" },
];

function CategoryCard({
  category,
  className = "",
  imageClassName = "",
}: {
  category: (typeof EDITORIAL_CATEGORIES)[number];
  className?: string;
  imageClassName?: string;
}) {
  const imgSrc =
    CATEGORY_IMAGES[category.name] || "/cat-fashion.jpg";

  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.name)}`}
      className={`group relative overflow-hidden block ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imgSrc}
          alt={category.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${imageClassName}`}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
      <div className="relative h-full flex flex-col justify-end p-5 sm:p-6 lg:p-7 z-10">
        <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-semibold text-white leading-tight">
          {category.name}
        </h3>
        <span className="mt-3 inline-flex items-center gap-1.5 font-label text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50 group-hover:text-white/90 transition-colors duration-300">
          Explore
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export function ShopByCategoriesSwitcher({
  categories,
}: {
  categories: string[];
}) {
  const mapped = EDITORIAL_CATEGORIES.filter((ec) =>
    categories.includes(ec.name)
  );
  const [fashion, electronics, accessories, sports, beauty] = mapped;

  return (
    <Reveal>
      <section className="py-6 lg:py-8">
        {/* Editorial header */}
        <div className="flex items-center gap-3 mb-8 lg:mb-12">
          <span className="w-8 h-[2.5px] bg-terracotta rounded-full" />
          <span className="font-label text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-terracotta">
            Browse
          </span>
        </div>

        {/* Desktop: Asymmetric editorial grid */}
        <div className="hidden lg:grid grid-cols-[1.1fr_0.9fr] gap-4 auto-rows-[400px]">
          {/* Left column: Fashion (large, spans 2 rows) */}
          {fashion && (
            <CategoryCard
              category={fashion}
              className="rounded-lg row-span-2"
            />
          )}

          {/* Right column: Electronics + Accessories stacked */}
          <div className="flex flex-col gap-4 row-span-2">
            {electronics && (
              <CategoryCard
                category={electronics}
                className="flex-1 rounded-lg"
              />
            )}
            {accessories && (
              <CategoryCard
                category={accessories}
                className="flex-1 rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Bottom row: Sports + Beauty — offset */}
        <div className="hidden lg:grid grid-cols-[0.85fr_1.15fr] gap-4 mt-4 h-[300px]">
          {sports && (
            <CategoryCard category={sports} className="rounded-lg" />
          )}
          {beauty && (
            <CategoryCard category={beauty} className="rounded-lg" />
          )}
        </div>

        {/* Tablet: 2-column */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3 auto-rows-[240px]">
          {fashion && (
            <CategoryCard
              category={fashion}
              className="col-span-2 rounded-lg"
            />
          )}
          {electronics && (
            <CategoryCard category={electronics} className="rounded-lg" />
          )}
          {accessories && (
            <CategoryCard category={accessories} className="rounded-lg" />
          )}
          {sports && (
            <CategoryCard category={sports} className="rounded-lg" />
          )}
          {beauty && (
            <CategoryCard category={beauty} className="rounded-lg" />
          )}
        </div>

        {/* Mobile: editorial sequence */}
        <div className="flex sm:hidden flex-col gap-3">
          {fashion && (
            <CategoryCard
              category={fashion}
              className="w-full h-[280px] rounded-lg"
            />
          )}
          <div className="grid grid-cols-2 gap-3 h-[180px]">
            {electronics && (
              <CategoryCard category={electronics} className="rounded-lg" />
            )}
            {accessories && (
              <CategoryCard category={accessories} className="rounded-lg" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 h-[180px]">
            {sports && (
              <CategoryCard category={sports} className="rounded-lg" />
            )}
            {beauty && (
              <CategoryCard category={beauty} className="rounded-lg" />
            )}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
