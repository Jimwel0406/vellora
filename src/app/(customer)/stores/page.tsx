import { db } from "@/db";
import { stores, products, categories, reviews } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { StoreDirectory } from "./store-directory";
import type { StoreItem } from "./store-types";

const STORE_TYPES: Record<string, string> = {
  TechHub: "Brand",
  StyleNest: "Independent",
  HomeCraft: "Independent",
  FitGear: "Brand",
  GreenLeaf: "Independent",
  BookNook: "Independent",
};

const STORE_LOCATIONS: Record<string, string> = {
  TechHub: "International",
  StyleNest: "National",
  HomeCraft: "Local",
  FitGear: "National",
  GreenLeaf: "International",
  BookNook: "Local",
};

const NEW_STORE_CUTOFF = new Date(
  Date.now() - 1000 * 60 * 60 * 24 * 120
).getTime();

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const [allStores, storeStats, storeCovers] = await Promise.all([
    db.select().from(stores).where(eq(stores.active, true)),
    db
      .select({
        storeId: products.storeId,
        productCount: count(products.id),
        avgRating: sql<number>`avg(${reviews.rating})::float`,
        reviewCount: sql<number>`count(${reviews.id})`,
      })
      .from(products)
      .leftJoin(reviews, eq(reviews.productId, products.id))
      .groupBy(products.storeId),
    // First product (lowest id) with an image — matches the store page hero
    db
      .selectDistinctOn([products.storeId], {
        storeId: products.storeId,
        coverImage: sql<string | null>`${products.images}[1]`,
      })
      .from(products)
      .where(sql`${products.images}[1] is not null`)
      .orderBy(products.storeId, products.id),
  ]);

  const statsMap = new Map(storeStats.map((s) => [s.storeId, s]));
  const coverMap = new Map(storeCovers.map((s) => [s.storeId, s.coverImage]));

  const storeCategories = await db
    .select({
      storeId: products.storeId,
      name: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id));

  const categoryMap = new Map<number, string[]>();
  storeCategories.forEach((row) => {
    if (!row.name) return;
    const list = categoryMap.get(row.storeId) ?? [];
    if (!list.includes(row.name)) list.push(row.name);
    categoryMap.set(row.storeId, list);
  });

  const items: StoreItem[] = allStores
    .filter((store) => (statsMap.get(store.id)?.productCount ?? 0) > 0)
    .map((store) => {
      const stats = statsMap.get(store.id);
      const featured =
        (stats?.avgRating ?? 0) >= 4.5 || (stats?.reviewCount ?? 0) >= 25;
      return {
        store: {
          id: store.id,
          name: store.name,
          slug: store.slug,
          description: store.description,
          logo: store.logo,
          createdAt: store.createdAt,
        },
        productCount: stats?.productCount ?? 0,
        rating: stats?.avgRating ?? null,
        reviewCount: stats?.reviewCount ?? 0,
        coverImage: coverMap.get(store.id) ?? null,
        categories: categoryMap.get(store.id) ?? [],
        storeType: STORE_TYPES[store.name] ?? "Independent",
        location: STORE_LOCATIONS[store.name] ?? "National",
        featured,
        isNew:
          new Date(store.createdAt).getTime() > NEW_STORE_CUTOFF,
      };
    });

  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <StoreDirectory items={items} />
    </div>
  );
}