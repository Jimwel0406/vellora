import { redirect } from "next/navigation";
import { db } from "@/db";
import { orders, orderItems, wishlistItems } from "@/db/schema";
import { eq, ne, and, desc, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { cancelPendingOrders } from "@/lib/complete-order";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHero } from "@/components/account/account-hero";
import { OrderHistoryList } from "./orders-list";

const STALE_PENDING_CUTOFF = new Date(Date.now() - 2 * 60 * 60 * 1000);

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = parseInt(session.user.id);

  await cancelPendingOrders(userId, { olderThan: STALE_PENDING_CUTOFF });

  const userOrders = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        ne(orders.status, "pending"),
        ne(orders.status, "cancelled")
      )
    )
    .orderBy(desc(orders.createdAt));

  const orderIds = userOrders.map((o) => o.id);

  const allItems =
    orderIds.length > 0
      ? await db
          .select()
          .from(orderItems)
          .where(inArray(orderItems.orderId, orderIds))
      : [];

  const itemsByOrder = new Map<number, typeof allItems>();
  for (const item of allItems) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  const wishlistRows = await db
    .select({ id: wishlistItems.id })
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, userId));

  const user = session.user;

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36 pb-16 lg:pb-20">
      <AccountHero
        user={user}
        title="My Orders"
        subtitle="Track, review, and revisit every order you have placed across Vellora."
      />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        <AccountSidebar active="/orders" orderCount={userOrders.length} wishlistCount={wishlistRows.length} />

        <section data-section="orders-content" className="section-orders-content flex-grow min-w-0">
          <OrderHistoryList orders={userOrders} itemsByOrder={itemsByOrder} />
        </section>
      </div>
    </div>
  );
}
