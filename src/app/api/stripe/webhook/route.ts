import { NextResponse } from "next/server";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import {
  completeOrder,
  shippingFromStripeSession,
} from "@/lib/complete-order";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!STRIPE_WEBHOOK_SECRET || !signature) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = Number(session.metadata?.order_id);
    if (Number.isInteger(orderId) && orderId > 0) {
      const paymentIntentId =
        typeof session.payment_intent === "string" ? session.payment_intent : null;
      await completeOrder(
        orderId,
        shippingFromStripeSession(session.collected_information),
        { paymentIntentId }
      );
    }
  }

  return NextResponse.json({ received: true });
}