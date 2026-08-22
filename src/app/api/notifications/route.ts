import { NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc, inArray, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  const unreadCount = rows.filter((n) => !n.isRead).length;

  return NextResponse.json({ notifications: rows, unreadCount });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = parseInt(session.user.id);
    const body = await req.json().catch(() => ({}));
    const ids = Array.isArray(body?.ids)
      ? body.ids.map(Number).filter((n: number) => Number.isInteger(n))
      : null;

    if (ids && ids.length > 0) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(eq(notifications.userId, userId), inArray(notifications.id, ids))
        );
    } else {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}