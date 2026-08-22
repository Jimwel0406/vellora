import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, ne, and, desc } from "drizzle-orm";
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

  const user = session.user;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36 pb-16 lg:pb-20">
      <AccountHero
        user={user}
        title="My Orders"
        subtitle="Track, review, and revisit every order you have placed across Vellora."
      />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <AccountSidebar active="/orders" />

        {/* Content Area */}
        <section data-section="orders-content" className="section-orders-content flex-grow min-w-0">
          <div className="bg-white rounded-xl border border-clay/5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            {userOrders.length === 0 ? (
              <>
                <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-clay/5 bg-sand/30">
                  <h2 className="text-lg sm:text-xl font-bold text-clay truncate">
                    Order History
                  </h2>
                </div>
                <div className="flex flex-col items-center justify-center px-6 py-16 sm:py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-sand/60 flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-clay/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="1" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-clay mb-3">No orders yet</h3>
                <p className="text-sm text-clay/60 mb-8 leading-relaxed max-w-sm">
                  When you place an order, you&apos;ll be able to track it right here.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-terracotta hover:bg-clay text-white px-8 sm:px-10 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-terracotta/20 hover:scale-[1.02]"
                >
                  Start Shopping
                </Link>
              </div>
              </>
            ) : (
              <OrderHistoryList orders={userOrders} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}