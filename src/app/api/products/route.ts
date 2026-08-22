import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { DEFAULT_STOCK, isProductTag } from "@/lib/product-options";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .then((r) => r[0]);

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  }

  const allProducts = await db.select().from(products);
  return NextResponse.json(allProducts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "vendor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, price, stock, images, tags, categoryId } = await req.json();
    const userId = parseInt(session.user.id);

    if (!name?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Product name and description are required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Add at least one product image." },
        { status: 400 }
      );
    }

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.userId, userId))
      .then((r) => r[0]);

    if (!store) {
      return NextResponse.json(
        { error: "No store found. Create a store first." },
        { status: 400 }
      );
    }

    const parsedStock = Number.isFinite(stock) ? parseInt(stock) : NaN;

    const [product] = await db
      .insert(products)
      .values({
        name,
        description,
        price: Math.round(parseFloat(price) * 100),
        stock: Number.isNaN(parsedStock) ? DEFAULT_STOCK : parsedStock,
        storeId: store.id,
        images: images || [],
        tags: Array.isArray(tags) ? tags.filter(isProductTag) : [],
        categoryId: Number.isInteger(categoryId) ? categoryId : null,
      })
      .returning();

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "vendor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, name, description, price, images, tags, categoryId } = await req.json();
    const userId = parseInt(session.user.id);

    if (!name?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Product name and description are required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Add at least one product image." },
        { status: 400 }
      );
    }

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.userId, userId))
      .then((r) => r[0]);

    if (!store) {
      return NextResponse.json({ error: "No store found" }, { status: 400 });
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then((r) => r[0]);

    if (!product || product.storeId !== store.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(products)
      .set({
        name,
        description,
        price: Math.round(parseFloat(price) * 100),
        images: images || [],
        tags: Array.isArray(tags) ? tags.filter(isProductTag) : [],
        categoryId: Number.isInteger(categoryId) ? categoryId : null,
      })
      .where(eq(products.id, productId))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "vendor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    const userId = parseInt(session.user.id);

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.userId, userId))
      .then((r) => r[0]);

    if (!store) {
      return NextResponse.json({ error: "No store found" }, { status: 400 });
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then((r) => r[0]);

    if (!product || product.storeId !== store.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
