import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, carts, cartItems, products, stores } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";

const nocache = { "Cache-Control": "no-store, no-cache, must-revalidate" };

async function getOwnedCartItem(userId: number, itemId: number) {
  return db
    .select({ id: cartItems.id, productId: cartItems.productId })
    .from(cartItems)
    .innerJoin(carts, eq(cartItems.cartId, carts.id))
    .where(and(eq(cartItems.id, itemId), eq(carts.userId, userId)))
    .then((r) => r[0]);
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ items: [] }, { headers: nocache });
  }

  try {
    const userId = parseInt(session.user.id);
    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .then((r) => r[0]);

    if (!cart) {
      return NextResponse.json({ items: [] }, { headers: nocache });
    }

    const items = await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart.id));

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

  if (session.user.role !== "customer") {
    return NextResponse.json(
      { error: "Seller accounts can't add items to a cart.", code: "SELLER_CANNOT_BUY" },
      { status: 403 }
    );
  }

  try {
    const { productId, quantity, variant } = await req.json();
    const userId = parseInt(session.user.id);

    // Verify user exists in Supabase before any operation
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .then((r) => r.length > 0);

    if (!userExists) {
      return NextResponse.json(
        { error: "Account not found. Please sign out and register again.", code: "USER_NOT_FOUND" },
        { status: 401 }
      );
    }

    let cart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .then((r) => r[0]);

    if (!cart) {
      const [newCart] = await db
        .insert(carts)
        .values({ userId })
        .returning();
      cart = newCart;
    }

    const variantValue = typeof variant === "string" ? variant.trim() : null;

    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cart.id),
          eq(cartItems.productId, productId),
          variantValue
            ? eq(cartItems.variant, variantValue)
            : isNull(cartItems.variant)
        )
      )
      .then((r) => r[0]);

    const product = await db
      .select()
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.id))
      .where(eq(products.id, productId))
      .then((r) => r[0]);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stores?.userId === userId) {
      return NextResponse.json(
        { error: "You can't add your own product to the cart.", code: "OWN_PRODUCT" },
        { status: 400 }
      );
    }

    const newQuantity = (existingItem?.quantity ?? 0) + (quantity || 1);
    if (newQuantity > product.products.stock) {
      return NextResponse.json(
        { error: `Only ${product.products.stock} in stock` },
        { status: 400 }
      );
    }

    if (existingItem) {
      await db
        .update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        cartId: cart.id,
        productId,
        quantity: newQuantity,
        variant: variantValue,
      });
    }

    return NextResponse.json({ message: "Added to cart" });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
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

    const owned = await getOwnedCartItem(userId, itemId);
    if (!owned) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    return NextResponse.json({ message: "Removed from cart" });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { itemId, quantity } = await req.json();
    const userId = parseInt(session.user.id);

    const owned = await getOwnedCartItem(userId, itemId);
    if (!owned) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (quantity < 1) {
      await db.delete(cartItems).where(eq(cartItems.id, itemId));
    } else {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, owned.productId))
        .then((r) => r[0]);

      const max = product?.stock ?? 0;
      const capped = Math.min(quantity, max);
      await db
        .update(cartItems)
        .set({ quantity: capped })
        .where(eq(cartItems.id, itemId));
    }
    return NextResponse.json({ message: "Updated" });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
