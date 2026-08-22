import { NextResponse } from "next/server";
import { db } from "@/db";
import { payouts, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payoutId } = await req.json();

    const [updated] = await db
      .update(payouts)
      .set({ status: "paid", paidAt: new Date() })
      .where(eq(payouts.id, payoutId))
      .returning();

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, updated.storeId))
      .then((r) => r[0]);

    if (store) {
      await createNotification({
        userId: store.userId,
        type: "payout",
        title: "Payout sent",
        message: `Your payout of $${(updated.amount / 100).toFixed(2)} has been paid.`,
        link: "/vendor/payouts",
      });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
