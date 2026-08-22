import { db } from "@/db";
import { products, stores, categories, reviews } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Boxes, Package, Heart, Flame, Clock, Star } from "lucide-react";
import { ShopArea } from "./shop-area";
import {
  ShopHeroBanner,
  ShopByCategories,
  ProductRow,
} from "./shop-sections";
import { PromoOfferBanner } from "./promo-offer-banner";
import type { ShopProduct } from "./shop-types";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const query = q?.trim() || "";

  const [allProducts, reviewStats] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        image: sql<string | null>`${products.images}[1]`,
        tags: products.tags,
        stock: products.stock,
        createdAt: products.createdAt,
        storeName: stores.name,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(stores.active, true)),
    db
      .select({
        productId: reviews.productId,
        avgRating: sql<number>`avg(${reviews.rating})::float`,
        totalReviews: sql<number>`count(${reviews.id})`,
      })
      .from(reviews)
      .groupBy(reviews.productId),
  ]);

  const ratingMap = new Map(
    reviewStats.map((r) => [r.productId, { rating: r.avgRating, count: r.totalReviews }])
  );

  const productItems: ShopProduct[] = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    tags: p.tags,
    stock: p.stock,
    createdAt: p.createdAt,
    storeName: p.storeName ?? "Unknown",
    categoryName: p.categoryName,
    rating: ratingMap.get(p.id)?.rating ?? null,
    ratingCount: ratingMap.get(p.id)?.count ?? 0,
  }));

  const allCategories = [
    ...new Set(allProducts.map((p) => p.categoryName).filter(Boolean)),
  ].sort() as string[];

  const allVendors = [
    ...new Set(allProducts.map((p) => p.storeName).filter(Boolean)),
  ].sort() as string[];

  const topSelling = productItems
    .filter((p) => p.tags?.some((t) => ["Best Seller", "Popular"].includes(t)))
    .slice(0, 2);

  const trending = [...productItems]
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, 2);

  const recentlyAdded = [...productItems]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 2);

  const topRated = [...productItems]
    .filter((p) => p.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 2);

  return (
    <div className="bg-[#F1EDE1]">
      <section data-section="products-header" className="section-products-header max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-16 sm:pt-20 lg:pt-28">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta mb-6 inline-flex items-center gap-2">
            <Boxes className="w-3.5 h-3.5" />
            The Collection
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 sm:w-20 bg-clay/20" />
            <h1 className="font-serif italic text-5xl sm:text-6xl lg:text-7xl text-clay tracking-tight leading-[1.05] flex items-center gap-3">
              {query ? (
                <>Results for &ldquo;{query}&rdquo;</>
              ) : (
                <>All Products</>
              )}
              <Package className="w-6 h-6 lg:w-7 lg:h-7 text-terracotta" />
            </h1>
            <span className="h-px w-10 sm:w-20 bg-clay/20" />
          </div>
          <p className="mt-6 max-w-[640px] mx-auto text-[15px] lg:text-base text-clay/60 leading-relaxed">
            Browse quality products from independent sellers, all in one place.
          </p>
        </div>
      </section>

      <section data-section="products-shop-area" className="section-products-shop-area max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-12 sm:pt-16 lg:pt-20">
        <ShopHeroBanner />
        <ShopArea
          key={`${query}|${category ?? ""}`}
          products={productItems}
          allCategories={allCategories}
          allVendors={allVendors}
          query={query}
          initialCategory={category}
        />
      </section>

      <section data-section="products-categories" className="section-products-categories max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pb-8 lg:pt-24 lg:pb-36">
        <ShopByCategories categories={allCategories} />
      </section>

      <section data-section="products-discover" className="section-products-discover max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-10">
          <ProductRow
            name="top-selling"
            eyebrow="Customer Favorites"
            title="Top Selling"
            products={topSelling}
            icon={<Heart className="w-3.5 h-3.5" />}
          />
          <ProductRow
            name="trending-products"
            eyebrow="What&rsquo;s Hot"
            title="Trending Products"
            products={trending}
            icon={<Flame className="w-3.5 h-3.5" />}
          />
          <ProductRow
            name="recently-added"
            eyebrow="Just In"
            title="Recently Added"
            products={recentlyAdded}
            icon={<Clock className="w-3.5 h-3.5" />}
          />
          <ProductRow
            name="top-rated"
            eyebrow="Highly Rated"
            title="Top Rated"
            products={topRated}
            icon={<Star className="w-3.5 h-3.5" />}
          />
        </div>
      </section>

      <PromoOfferBanner />
    </div>
  );
}