import { NextResponse } from "next/server";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { slugify, nameError } from "@/lib/store-name";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  const store = await db
    .select()
    .from(stores)
    .where(eq(stores.userId, userId))
    .then((r) => r[0]);

  return NextResponse.json(store);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "vendor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();
    const userId = parseInt(session.user.id);

    const invalidName = nameError(name);
    if (invalidName) {
      return NextResponse.json({ error: invalidName }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanDescription =
      typeof description === "string" && description.trim()
        ? description.trim()
        : null;

    const existing = await db
      .select()
      .from(stores)
      .where(eq(stores.userId, userId))
      .then((r) => r[0]);

    if (existing) {
      const [updated] = await db
        .update(stores)
        .set({ name: cleanName, description: cleanDescription })
        .where(eq(stores.userId, userId))
        .returning();

      return NextResponse.json(updated);
    }

    const slugValue = slugify(cleanName);
    if (!slugValue) {
      return NextResponse.json(
        { error: "Store name must produce a valid URL." },
        { status: 400 }
      );
    }

    const slugTaken = await db
      .select({ id: stores.id })
      .from(stores)
      .where(eq(stores.slug, slugValue))
      .then((r) => r[0]);

    if (slugTaken) {
      return NextResponse.json(
        {
          error:
            "A store with that URL already exists. Try a different store name.",
        },
        { status: 409 }
      );
    }

    const [created] = await db
      .insert(stores)
      .values({
        name: cleanName,
        description: cleanDescription,
        slug: slugValue,
        userId,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
