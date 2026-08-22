import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";

export async function GET() {
  const allCategories = await db.select().from(categories);
  return NextResponse.json(allCategories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slugify(name)))
      .then((r) => r[0]);

    if (existing) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const [category] = await db
      .insert(categories)
      .values({ name, slug: slugify(name) })
      .returning();

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, name } = await req.json();
    const categoryId = Number(id);
    if (!Number.isInteger(categoryId) || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const trimmed = name.trim();
    const newSlug = slugify(trimmed);

    const duplicate = await db
      .select()
      .from(categories)
      .where(and(eq(categories.slug, newSlug), ne(categories.id, categoryId)))
      .then((r) => r[0]);
    if (duplicate) {
      return NextResponse.json({ error: "A category with that name already exists" }, { status: 400 });
    }

    const [updated] = await db
      .update(categories)
      .set({ name: trimmed, slug: newSlug })
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    const categoryId = Number(id);
    if (!Number.isInteger(categoryId)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await db.delete(categories).where(eq(categories.id, categoryId));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Couldn't delete this category — it may be in use by products." },
      { status: 400 }
    );
  }
}
