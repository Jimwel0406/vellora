import type Stripe from "stripe";
import { db } from "@/db";
import {
  orders,
  orderItems,
  subOrders,
  stores,
  carts,
  cartItems,
  products,
  users,
} from "@/db/schema";
import { eq, and, ne, lt, inArray, sql } from "drizzle-orm";
import { createNotification } from "@/lib/notifications";
import { sendEmail, orderConfirmationEmailHtml, newVendorOrderEmailHtml } from "@/lib/email";

const BASE_URL = process.env.AUTH_URL ?? "http://localhost:3000";

export async function cancelPendingOrders(
  userId: number,
  opts: { olderThan?: Date; excludeOrderId?: number } = {}
) {
  const conditions = [
    eq(orders.userId, userId),
    eq(orders.status, "pending"),
  ];
  if (opts.olderThan) conditions.push(lt(orders.createdAt, opts.olderThan));
  if (opts.excludeOrderId) conditions.push(ne(orders.id, opts.excludeOrderId));

  const cancelled = await db
    .update(orders)
    .set({ status: "cancelled" })
    .where(and(...conditions))
    .returning();

  if (cancelled.length > 0) {
    await db
      .update(subOrders)
      .set({ status: "cancelled" })
      .where(
        inArray(
          subOrders.orderId,
          cancelled.map((o) => o.id)
        )
      );
  }

  return cancelled;
}

export interface OrderShipping {
  name?: string | null;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
}

export function shippingFromStripeSession(
  collected: Stripe.Checkout.Session["collected_information"] | null | undefined
): OrderShipping | undefined {
  const shipping = collected?.shipping_details;
  if (!shipping) return undefined;
  return {
    name: shipping.name ?? null,
    line1: shipping.address?.line1 ?? null,
    line2: shipping.address?.line2 ?? null,
    city: shipping.address?.city ?? null,
    state: shipping.address?.state ?? null,
    postalCode: shipping.address?.postal_code ?? null,
    country: shipping.address?.country ?? null,
    phone: null,
  };
}

export async function completeOrder(
  orderId: number,
  shipping?: OrderShipping,
  extra?: { paymentIntentId?: string | null }
): Promise<"completed" | "already-completed" | "not-found"> {
  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .then((r) => r[0]);

  if (!order) return "not-found";

  if (order.status === "completed") return "already-completed";

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  for (const item of items) {
    await db
      .update(products)
      .set({
        stock: sql`${products.stock} - ${item.quantity}`,
      })
      .where(eq(products.id, item.productId));
  }

  await db
    .update(orders)
    .set({
      status: "completed",
      ...(extra?.paymentIntentId ? { stripePaymentId: extra.paymentIntentId } : {}),
      ...(shipping
        ? {
            shippingName: shipping.name ?? null,
            shippingLine1: shipping.line1 ?? null,
            shippingLine2: shipping.line2 ?? null,
            shippingCity: shipping.city ?? null,
            shippingState: shipping.state ?? null,
            shippingPostalCode: shipping.postalCode ?? null,
            shippingCountry: shipping.country ?? null,
            shippingPhone: shipping.phone ?? null,
          }
        : {}),
    })
    .where(eq(orders.id, order.id));

  await db
    .update(subOrders)
    .set({ status: "completed" })
    .where(eq(subOrders.orderId, order.id));

  await cancelPendingOrders(order.userId, { excludeOrderId: order.id });

  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, order.userId))
    .then((r) => r[0]);

  if (cart) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
    await db.delete(carts).where(eq(carts.id, cart.id));
  }

  const storeSubs = await db
    .select()
    .from(subOrders)
    .where(eq(subOrders.orderId, order.id));

  const storeIds = [...new Set(storeSubs.map((s) => s.storeId))];

  const customer = await db
    .select()
    .from(users)
    .where(eq(users.id, order.userId))
    .then((r) => r[0]);

  if (customer) {
    await sendEmail({
      to: customer.email,
      subject: `Order #${order.id} confirmed`,
      html: orderConfirmationEmailHtml({
        orderId: order.id,
        totalCents: order.totalAmount,
        discountCents: order.discountAmount,
        lines: items.map((it) => ({ name: it.productName, qty: it.quantity, price: it.price })),
      }),
    });
  }

  if (storeIds.length > 0) {
    const storeRows = await db
      .select()
      .from(stores)
      .where(inArray(stores.id, storeIds));
    for (const store of storeRows) {
      await createNotification({
        userId: store.userId,
        type: "order",
        title: "New order received",
        message: `You have a new order #${order.id}.`,
        link: "/vendor/orders",
      });
    }

    const ownerIds = storeRows.map((s) => s.userId);
    const owners = await db.select().from(users).where(inArray(users.id, ownerIds));
    for (const store of storeRows) {
      const owner = owners.find((o) => o.id === store.userId);
      if (!owner) continue;
      const sub = storeSubs.find((s) => s.storeId === store.id);
      await sendEmail({
        to: owner.email,
        subject: `New order #${order.id} for ${store.name}`,
        html: newVendorOrderEmailHtml({
          orderId: order.id,
          storeName: store.name,
          subtotalCents: sub?.subtotal ?? 0,
          baseUrl: BASE_URL,
        }),
      });
    }
  }

  return "completed";
}