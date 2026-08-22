import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, subOrders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const orderId = parseInt(id);
  if (Number.isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .then((r) => r[0]);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status === "refunded") {
    return NextResponse.json({ error: "Order is already refunded" }, { status: 400 });
  }

  try {
    // Refund the real payment when we have a reference; otherwise just record it.
    if (order.stripePaymentId) {
      await stripe.refunds.create({ payment_intent: order.stripePaymentId });
    }

    await db.update(orders).set({ status: "refunded" }).where(eq(orders.id, order.id));
    await db.update(subOrders).set({ status: "refunded" }).where(eq(subOrders.orderId, order.id));

    return NextResponse.json({
      success: true,
      refundedViaStripe: Boolean(order.stripePaymentId),
    });
  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.json({ error: "Refund failed. Check the Stripe reference." }, { status: 500 });
  }
}