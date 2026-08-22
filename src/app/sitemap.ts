import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products, stores } from "@/db/schema";

const BASE_URL = process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "daily" },
  { path: "/stores", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.4, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allProducts, allStores] = await Promise.all([
    db.select({ id: products.id, name: products.name }).from(products),
    db.select({ slug: stores.slug }).from(stores),
  ]);

  const productUrls: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${BASE_URL}/products/${product.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const storeUrls: MetadataRoute.Sitemap = allStores.map((store) => ({
    url: `${BASE_URL}/stores/${store.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const staticUrls: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency,
    priority,
  }));

  return [...staticUrls, ...storeUrls, ...productUrls];
}