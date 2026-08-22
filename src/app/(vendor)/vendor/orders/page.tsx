import { redirect } from "next/navigation";
import { db } from "@/db";
import { stores, subOrders, orders, orderItems, products } from "@/db/schema";
import { eq, desc, inArray, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { VendorPageHeader, StatusBadge, Card } from "../_components/vendor-ui";

export default async function VendorOrdersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "vendor")
    redirect("/login");

  const userId = parseInt(session.user.id);

  const store = await db
    .select()
    .from(stores)
    .where(eq(stores.userId, userId))
    .then((r) => r[0]);

  if (!store) redirect("/vendor/setup");

  const vendorSubOrders = await db
    .select()
    .from(subOrders)
    .leftJoin(orders, eq(subOrders.orderId, orders.id))
    .where(eq(subOrders.storeId, store.id))
    .orderBy(desc(subOrders.id));

  const orderIds = [...new Set(vendorSubOrders.map((s) => s.sub_orders.orderId))];

  const itemRows = orderIds.length
    ? await db
        .select({ item: orderItems, product: products })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(
          and(
            inArray(orderItems.orderId, orderIds),
            eq(products.storeId, store.id)
          )
        )
    : [];

  const itemsByOrder = itemRows.reduce<Record<number, typeof itemRows>>(
    (acc, row) => {
      (acc[row.item.orderId] ||= []).push(row);
      return acc;
    },
    {}
  );

  return (
    <div data-section="vendor-orders" className="section-vendor-orders max-w-6xl">
      <VendorPageHeader
        eyebrow="Fulfillment"
        title="Incoming Orders"
        subtitle={
          vendorSubOrders.length > 0
            ? `${vendorSubOrders.length} order${vendorSubOrders.length !== 1 ? "s" : ""}`
            : undefined
        }
      />

      {vendorSubOrders.length === 0 ? (
        <Card className="p-8 text-center text-sm text-clay/50">
          No orders yet.
        </Card>
      ) : (
        <div className="space-y-4">
          {vendorSubOrders.map(({ sub_orders: sub, orders: order }) => {
            const items = itemsByOrder[sub.orderId] ?? [];
            return (
            <Card key={sub.id} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-clay">
                  Order #{order?.id} <span className="text-clay/40 font-normal">· SubOrder #{sub.id}</span>
                </p>
                <StatusBadge status={sub.status} />
              </div>

              {items.length > 0 && (
                <ul className="divide-y divide-clay/5 mb-4">
                  {items.map(({ item }) => (
                    <li key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-clay truncate">
                          {item.productName}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-clay/50 truncate">{item.variant}</p>
                        )}
                      </div>
                      <p className="text-xs text-clay/60 whitespace-nowrap">
                        {item.quantity} × ${(item.price / 100).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="text-sm space-y-1.5 text-clay/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-clay">${(sub.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission</span>
                  <span className="text-clay">-${(sub.commission / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-clay border-t border-clay/10 pt-2 mt-2">
                  <span>Your payout</span>
                  <span>${(sub.vendorPayout / 100).toFixed(2)}</span>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}