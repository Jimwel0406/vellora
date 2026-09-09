import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { orders, subOrders, stores, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHero } from "@/components/account/account-hero";
import { ArrowLeft, Truck } from "lucide-react";
import { CancelOrderButton } from "./cancel-order-button";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) notFound();

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .then((r) => r[0]);

  if (!order || order.userId !== parseInt(session.user.id)) notFound();

  const subs = await db
    .select()
    .from(subOrders)
    .leftJoin(stores, eq(subOrders.storeId, stores.id))
    .where(eq(subOrders.orderId, orderId));

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const user = session.user;

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
    shipped: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36 pb-16 lg:pb-20">
      <AccountHero
        user={user}
        title="Order Details"
        subtitle={`Review the breakdown, vendors, and shipping information for order #${order.id}.`}
      />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <AccountSidebar active="/orders" />

        {/* Content Area */}
        <section data-section="order-detail-content" className="section-order-detail-content flex-grow min-w-0">
          <div className="bg-white rounded-xl border border-clay/5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-clay/5 bg-sand/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-terracotta hover:text-clay transition-colors shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                  Back
                </Link>
                <h2 className="text-lg sm:text-xl font-bold text-clay truncate">Order #{order.id}</h2>
              </div>
              <div className="flex items-center gap-3">
                {order.status === "pending" && (
                  <CancelOrderButton orderId={order.id} />
                )}
                <Badge
                  className={`${statusColors[order.status] || "bg-clay/5 text-clay/50"} capitalize`}
                >
                  {order.status}
                </Badge>
              </div>
            </div>

            <div className="p-4 sm:p-8">
              <p className="text-[11px] text-clay/50 mb-6">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="space-y-4">
                {items.length > 0 && (
                  <div className="bg-sand/30 rounded-xl border border-clay/5 p-4 sm:p-5">
                    <h3 className="font-bold text-sm text-clay mb-4">Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <Link
                          key={item.id}
                          href={`/products/${item.productId}`}
                          className="flex items-center gap-4 group"
                        >
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-14 h-14 rounded-lg object-cover bg-clay/5 shrink-0"
                              width="56"
                              height="56"
                              loading="lazy"
                            />
                          ) : (
                            <span className="w-14 h-14 rounded-lg bg-clay/5 flex items-center justify-center text-[10px] text-clay/30 shrink-0">
                              No image
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-clay truncate group-hover:text-terracotta transition-colors">
                              {item.productName}
                            </p>
                            {item.variant && (
                              <p className="text-xs text-clay/50 truncate">{item.variant}</p>
                            )}
                            <p className="text-xs text-clay/50">
                              ${(item.price / 100).toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-clay shrink-0">
                            ${((item.price * item.quantity) / 100).toFixed(2)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {subs.map(({ sub_orders: sub, stores: store }) => (
                  <div
                    key={sub.id}
                    className="bg-sand/30 rounded-xl border border-clay/5 p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between mb-3 gap-4">
                      <h3 className="font-bold text-sm text-clay truncate">{store?.name}</h3>
                      <Badge variant="secondary" className="capitalize shrink-0">
                        {sub.status}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-clay/50">Subtotal</span>
                        <span className="font-semibold text-clay">${(sub.subtotal / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-clay/50">
                        <span>Platform commission</span>
                        <span>-${(sub.commission / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-clay/5 pt-1.5 mt-1.5">
                        <span className="text-clay">Vendor payout</span>
                        <span className="text-clay">${(sub.vendorPayout / 100).toFixed(2)}</span>
                      </div>
                      {sub.status === "shipped" && (
                        <div className="border-t border-clay/5 pt-2 mt-2 text-xs text-clay/50 space-y-1">
                          <div className="flex justify-between">
                            <span className="inline-flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5" strokeWidth={1.5} />
                              Shipped
                            </span>
                            <span>
                              {sub.shippedAt
                                ? new Date(sub.shippedAt).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                          {sub.trackingNumber && (
                            <div className="flex justify-between">
                              <span>Tracking</span>
                              <span className="font-medium text-clay">{sub.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {order.shippingLine1 && (
                <div className="mt-6 bg-sand/30 rounded-xl border border-clay/5 p-4 sm:p-5">
                  <h3 className="font-bold text-sm text-clay mb-2">Shipping address</h3>
                  <p className="text-sm text-clay/60 leading-relaxed">
                    {order.shippingName}
                    <br />
                    {order.shippingLine1}
                    {order.shippingLine2 ? (
                      <>
                        <br />
                        {order.shippingLine2}
                      </>
                    ) : null}
                    <br />
                    {order.shippingCity}, {order.shippingState}{" "}
                    {order.shippingPostalCode}
                    <br />
                    {order.shippingCountry}
                    {order.shippingPhone ? (
                      <>
                        <br />
                        {order.shippingPhone}
                      </>
                    ) : null}
                  </p>
                </div>
              )}

              <div className="border-t border-clay/5 mt-6 pt-6 flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-widest text-clay/50">Total paid</span>
                <span className="text-2xl font-bold text-clay">${(order.totalAmount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}