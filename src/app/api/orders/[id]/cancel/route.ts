import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, subOrders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderId = parseInt((await params).id);
  if (Number.isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .then((r) => r[0]);

  if (!order || order.userId !== parseInt(session.user.id)) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { error: "Only pending orders can be cancelled." },
      { status: 400 }
    );
  }

  await db.update(orders).set({ status: "cancelled" }).where(eq(orders.id, orderId));
  await db.update(subOrders).set({ status: "cancelled" }).where(eq(subOrders.orderId, orderId));

  return NextResponse.json({ id: orderId, status: "cancelled" });
}