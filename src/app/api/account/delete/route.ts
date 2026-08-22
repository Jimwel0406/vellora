import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = parseInt(session.user.id);
    const user = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .then((r) => r[0]);

    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Related rows cascade (cart, orders, stores + products + payouts + follows,
    // reviews, wishlist, notifications, password-reset tokens, Q&A).
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[account-delete] failed:", (error as Error).message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
