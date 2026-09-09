import { db } from "@/db";
import { products, stores, categories, reviews } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { FilterSwitcher } from "./filter-switcher";
import { ShopByCategoriesSwitcher } from "./categories-variations";
import { ShopHeroB } from "./shop-hero-variations";
import { ProductsHeaderSwitcher } from "./product-header-switcher";
import { DiscoverSwitcher } from "./discover-variations";
import { ReviewsSection } from "./reviews-section";
import type { ShopProduct } from "./shop-types";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q, category, sort } = await searchParams;
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
    reviewStats.map((r) => [
      r.productId,
      { rating: r.avgRating, count: r.totalReviews },
    ])
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

  // Apply sort
  if (sort === "best-selling") {
    productItems.sort((a, b) => {
      const aBest = a.tags?.some((t) =>
        ["Best Seller", "Popular"].includes(t)
      )
        ? 1
        : 0;
      const bBest = b.tags?.some((t) =>
        ["Best Seller", "Popular"].includes(t)
      )
        ? 1
        : 0;
      return bBest - aBest || b.ratingCount - a.ratingCount;
    });
  } else if (sort === "newest") {
    productItems.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  } else if (sort === "price-low") {
    productItems.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    productItems.sort((a, b) => b.price - a.price);
  } else if (sort === "top-rated") {
    productItems.sort(
      (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
    );
  }

  const allCategories = [
    ...new Set(
      allProducts.map((p) => p.categoryName).filter(Boolean)
    ),
  ].sort() as string[];

  const allVendors = [
    ...new Set(allProducts.map((p) => p.storeName).filter(Boolean)),
  ].sort() as string[];

  const topSelling = productItems
    .filter((p) =>
      p.tags?.some((t) => ["Best Seller", "Popular"].includes(t))
    )
    .slice(0, 2);

  const trending = [...productItems]
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, 2);

  const recentlyAdded = [...productItems]
    .sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
    .slice(0, 2);

  const topRated = [...productItems]
    .filter((p) => p.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 2);

  return (
    <div className="bg-[#F1EDE1]">
      {/* Section 01 — Collection Hero */}
      <ProductsHeaderSwitcher query={query} />

      {/* Section 02 — Real Sellers cinematic feature */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <ShopHeroB />
      </section>

      {/* Section 03 — Product Browse Area */}
      <section
        data-section="products-shop-area"
        className="section-products-shop-area max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 lg:pt-10"
      >
        <FilterSwitcher
          products={productItems}
          allCategories={allCategories}
          allVendors={allVendors}
          query={query}
          initialCategory={category}
          initialSort={
            sort === "best-selling"
              ? "popular"
              : sort === "price-low"
                ? "price-asc"
                : sort === "price-high"
                  ? "price-desc"
                  : sort === "top-rated"
                    ? "rating"
                    : sort === "newest"
                      ? "newest"
                      : undefined
          }
        />
      </section>

      {/* Section 04 — Shop by Categories */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 lg:pt-20 pb-10 lg:pb-16">
        <ShopByCategoriesSwitcher categories={allCategories} />
      </section>

      {/* Section 05 — Customer Voices */}
      <ReviewsSection />

      {/* Section 06 — Product Discovery Rails */}
      <section
        data-section="products-discover"
        className="section-products-discover bg-white/40"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14">
          <div className="flex items-center gap-3 mb-8 lg:mb-12">
            <span className="w-8 h-[2.5px] bg-terracotta rounded-full" />
            <span className="font-label text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-terracotta">
              Discover
            </span>
          </div>
          <DiscoverSwitcher
            topSelling={topSelling}
            trending={trending}
            recentlyAdded={recentlyAdded}
            topRated={topRated}
          />
        </div>
      </section>
    </div>
  );
}
