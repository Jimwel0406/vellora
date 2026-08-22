import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishlistItems, products, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

const nocache = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ items: [] }, { headers: nocache });
  }

  try {
    const userId = parseInt(session.user.id);
    const items = await db
      .select()
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.productId, products.id))
      .leftJoin(stores, eq(products.storeId, stores.id))
      .where(eq(wishlistItems.userId, userId))
      .orderBy(wishlistItems.createdAt);

    return NextResponse.json({ items }, { headers: nocache });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500, headers: nocache });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    const userId = parseInt(session.user.id);

    const existing = await db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, userId),
          eq(wishlistItems.productId, productId)
        )
      )
      .then((r) => r[0]);

    if (existing) {
      await db.delete(wishlistItems).where(eq(wishlistItems.id, existing.id));
      return NextResponse.json({ message: "Removed from wishlist", action: "removed" });
    }

    await db.insert(wishlistItems).values({ userId, productId });
    return NextResponse.json({ message: "Added to wishlist", action: "added" });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { itemId } = await req.json();
    const userId = parseInt(session.user.id);
    const item = await db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.id, itemId),
          eq(wishlistItems.userId, userId)
        )
      )
      .then((r) => r[0]);

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.delete(wishlistItems).where(eq(wishlistItems.id, item.id));
    return NextResponse.json({ message: "Removed from wishlist" });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
