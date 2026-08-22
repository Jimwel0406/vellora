export const PRODUCT_TAGS = [
  "Best Seller",
  "New",
  "Featured",
  "Popular",
  "Premium",
  "Classic",
  "Handmade",
  "Eco",
  "Zero Waste",
  "Natural",
  "Home",
  "Office",
  "Fitness",
  "Athletic",
  "Outdoor",
  "Kitchen",
  "Beauty",
  "Stationery",
  "Gift",
  "Essentials",
  "Wireless",
  "Tech",
  "Gaming",
  "Kids",
] as const;

export type ProductTag = (typeof PRODUCT_TAGS)[number];

export function isProductTag(value: string): value is ProductTag {
  return (PRODUCT_TAGS as readonly string[]).includes(value);
}

export const DEFAULT_STOCK = 999999;