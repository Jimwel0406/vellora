"use client";

import { ShopArea } from "./shop-area";
import type { ShopProduct } from "./shop-types";

export function FilterSwitcher({
  products,
  allCategories,
  allVendors,
  query,
  initialCategory,
  initialSort,
}: {
  products: ShopProduct[];
  allCategories: string[];
  allVendors: string[];
  query: string;
  initialCategory?: string;
  initialSort?: string;
}) {
  return (
    <ShopArea
      key={`${query}|${initialCategory ?? ""}|${initialSort ?? ""}`}
      products={products}
      allCategories={allCategories}
      allVendors={allVendors}
      query={query}
      initialCategory={initialCategory}
      initialSort={initialSort}
      searchSortStyle="S3C"
    />
  );
}
