import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, stores } from "@/db/schema";
import { eq, ilike, or, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "6", 10) || 6, 12);

  if (!q) {
    return NextResponse.json({ products: [], stores: [] });
  }

  const [productRows, storeRows] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        image: sql<string | null>`${products.images}[1]`,
        storeName: stores.name,
      })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.id))
      .where(
        or(
          ilike(products.name, `%${q}%`),
          ilike(sql<string>`coalesce(${products.description}, '')`, `%${q}%`)
        )
      )
      .limit(limit),
    db
      .select({
        id: stores.id,
        name: stores.name,
        slug: stores.slug,
        logo: stores.logo,
        description: stores.description,
        productCount: sql<number>`(select count(*) from products where products.store_id = ${stores.id})`,
      })
      .from(stores)
      .where(or(ilike(stores.name, `%${q}%`), ilike(sql<string>`coalesce(${stores.description}, '')`, `%${q}%`)))
      .limit(limit),
  ]);

  const visibleStores = storeRows.filter((s) => (s.productCount ?? 0) > 0);

  return NextResponse.json({
    products: productRows,
    stores: visibleStores,
  });
}