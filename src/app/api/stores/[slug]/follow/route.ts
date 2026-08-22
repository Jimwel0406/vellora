import { NextResponse } from "next/server";
import { db } from "@/db";
import { stores, storeFollows } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ following: false });
  }

  const { slug } = await params;
  const store = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.slug, slug))
    .then((r) => r[0]);

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const follow = await db
    .select()
    .from(storeFollows)
    .where(
      and(
        eq(storeFollows.storeId, store.id),
        eq(storeFollows.userId, parseInt(session.user.id))
      )
    )
    .then((r) => r[0]);

  return NextResponse.json({ following: !!follow });
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const store = await db
    .select()
    .from(stores)
    .where(eq(stores.slug, slug))
    .then((r) => r[0]);

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const userId = parseInt(session.user.id);
  const existing = await db
    .select()
    .from(storeFollows)
    .where(
      and(
        eq(storeFollows.storeId, store.id),
        eq(storeFollows.userId, userId)
      )
    )
    .then((r) => r[0]);

  if (existing) {
    await db
      .delete(storeFollows)
      .where(eq(storeFollows.id, existing.id));
    return NextResponse.json({ following: false });
  }

  await db.insert(storeFollows).values({
    storeId: store.id,
    userId,
  });

  if (store.userId !== userId) {
    await createNotification({
      userId: store.userId,
      type: "follow",
      title: "New store follower",
      message: `${session.user.name || "Someone"} started following ${store.name}.`,
      link: "/vendor",
    });
  }

  return NextResponse.json({ following: true });
}
