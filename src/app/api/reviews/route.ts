import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, products, stores, orders, orderItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, rating, comment } = await request.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then((r) => r[0]);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const purchased = await db
      .select({ id: orders.id })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orders.userId, Number(session.user.id)),
          eq(orders.status, "completed"),
          eq(orderItems.productId, productId)
        )
      )
      .limit(1)
      .then((r) => r[0]);

    if (!purchased) {
      return NextResponse.json(
        { error: "Only customers who purchased this product can leave a review." },
        { status: 403 }
      );
    }

    const existing = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.userId, Number(session.user.id)),
          eq(reviews.productId, productId)
        )
      )
      .then((r) => r[0]);

    if (existing) {
      return NextResponse.json(
        { error: "You already reviewed this product." },
        { status: 409 }
      );
    }

    const [review] = await db
      .insert(reviews)
      .values({
        productId,
        userId: Number(session.user.id),
        rating,
        comment: comment || null,
      })
      .returning();

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, product.storeId))
      .then((r) => r[0]);

    if (store) {
      await createNotification({
        userId: store.userId,
        type: "review",
        title: "New product review",
        message: `${session.user.name || "A customer"} rated "${product.name}" ${rating} star${rating > 1 ? "s" : ""}.`,
        link: "/vendor/products",
      });
    }

    return NextResponse.json(review);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
