import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { orders, subOrders, stores, orderItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import {
  completeOrder,
  shippingFromStripeSession,
} from "@/lib/complete-order";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { session_id, order_id } = await searchParams;
  const userId = parseInt(session.user.id);

  let orderId = order_id ? parseInt(order_id) : undefined;

  if (session_id && !orderId) {
    try {
      const checkout = await stripe.checkout.sessions.retrieve(session_id);
      const metadataId = Number(checkout.metadata?.order_id);
      if (Number.isInteger(metadataId) && metadataId > 0) {
        if (checkout.payment_status === "paid") {
          await completeOrder(
            metadataId,
            shippingFromStripeSession(checkout.collected_information)
          );
        }
        orderId = metadataId;
      }
    } catch {
      /* fall through */
    }
  }

  const order = orderId
    ? await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
        .then((r) => r[0])
    : undefined;

  if (!order) {
    redirect("/orders");
  }

  const subOrderDetails = await db
    .select()
    .from(subOrders)
    .leftJoin(stores, eq(subOrders.storeId, stores.id))
    .where(eq(subOrders.orderId, order.id));

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold">Payment successful!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your order. Here&apos;s how your payment was split.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Order #{order.id}</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="secondary">{order.status}</Badge>
          </div>

          <div className="border-t pt-4 space-y-4">
            {items.length > 0 && (
              <div className="space-y-3 pb-2 border-b border-border">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 rounded-lg object-cover bg-muted shrink-0"
                      />
                    ) : (
                      <span className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground shrink-0">
                        No image
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{item.productName}</p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground truncate">{item.variant}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        ${(item.price / 100).toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {subOrderDetails.map(({ sub_orders, stores }) => (
              <div
                key={sub_orders.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{stores?.name || "Unknown store"}</p>
                  <p className="text-sm text-muted-foreground">
                    Subtotal: ${(sub_orders.subtotal / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Commission: ${(sub_orders.commission / 100).toFixed(2)}
                  </p>
                </div>
                <p className="font-bold text-right">
                  ${(sub_orders.vendorPayout / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex items-center justify-between">
            <p className="font-semibold">Total paid</p>
            <p className="text-2xl font-bold">
              ${(order.totalAmount / 100).toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
        <Button asChild>
          <Link href={`/orders/${order.id}`}>View order details</Link>
        </Button>
      </div>
    </div>
  );
}
