"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ShopProduct } from "./shop-types";
import { formatPrice, Stars } from "./shop-types";

interface DiscoverSectionProps {
  topSelling: ShopProduct[];
  trending: ShopProduct[];
  recentlyAdded: ShopProduct[];
  topRated: ShopProduct[];
}

function ProductRowItem({ product }: { product: ShopProduct }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex items-center gap-4 bg-white rounded-xl p-3 border border-clay/6 hover:border-clay/15 transition-all duration-300"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-[#F9F7F3]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-clay/20 text-xs">
            No image
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-heading font-medium text-clay leading-snug line-clamp-2">
          {product.name}
        </h4>
        <div className="mt-1.5">
          <Stars rating={product.rating} />
        </div>
        <p className="mt-1.5 text-sm font-bold text-clay font-label">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

function DiscoverRail({
  title,
  eyebrow,
  products,
  sort,
}: {
  title: string;
  eyebrow: string;
  products: ShopProduct[];
  sort: string;
}) {
  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] font-bold uppercase font-label tracking-[0.2em] text-terracotta/70">
            {eyebrow}
          </p>
          <h3 className="font-heading text-xl sm:text-2xl text-clay tracking-tight mt-1">
            {title}
          </h3>
        </div>
        <Link
          href={`/products?sort=${sort}`}
          className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-clay hover:text-terracotta transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      <div className="space-y-2.5">
        {products.map((product) => (
          <ProductRowItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export function DiscoverSwitcher(props: DiscoverSectionProps) {
  const rails = [
    {
      title: "Top Selling",
      eyebrow: "Best Sellers",
      products: props.topSelling,
      sort: "best-selling",
    },
    {
      title: "Trending",
      eyebrow: "What's Hot",
      products: props.trending,
      sort: "popular",
    },
    {
      title: "New Arrivals",
      eyebrow: "Just In",
      products: props.recentlyAdded,
      sort: "newest",
    },
    {
      title: "Top Rated",
      eyebrow: "Favorites",
      products: props.topRated,
      sort: "top-rated",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-10">
      {rails.map((rail) => (
        <DiscoverRail key={rail.title} {...rail} />
      ))}
    </div>
  );
}
