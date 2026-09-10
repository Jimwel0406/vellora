import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { stores, products, subOrders, payouts, orders, users } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Plus, ArrowRight, Package, ShoppingBag, Wallet, TrendingUp } from "lucide-react";
import {
  PageHeader,
  StatTile,
  Panel,
  StatusPill,
  primaryButton as primaryBtn,
  outlineButton as outlineBtn,
} from "@/components/shared/dashboard-ui";
import { AreaChart } from "@/components/charts/area-chart";
import { lastMonths, bucketByMonth, pctChange } from "@/lib/dashboard";

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default async function VendorOverviewPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "vendor") redirect("/login");

  const userId = parseInt(session.user.id);

  const store = await db
    .select()
    .from(stores)
    .where(eq(stores.userId, userId))
    .then((r) => r[0]);

  if (!store) redirect("/vendor/setup");

  const [storeProducts, storeSubOrders, storePayouts] = await Promise.all([
    db.select().from(products).where(eq(products.storeId, store.id)),
    db.select().from(subOrders).where(eq(subOrders.storeId, store.id)).orderBy(desc(subOrders.id)),
    db.select().from(payouts).where(eq(payouts.storeId, store.id)),
  ]);

  const productCount = storeProducts.length;
  const totalEarnings = storeSubOrders.reduce((sum, s) => sum + s.vendorPayout, 0);

  const totalPaid = storePayouts
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const months = lastMonths(6);
  const productSeries = bucketByMonth(storeProducts, months);

  const allOrderIds = storeSubOrders.map((s) => s.orderId);
  const relatedOrders = allOrderIds.length
    ? await db
        .select({ id: orders.id, createdAt: orders.createdAt })
        .from(orders)
        .where(inArray(orders.id, allOrderIds))
    : [];
  const createdAtById = new Map(relatedOrders.map((o) => [o.id, o.createdAt]));

  const enrichedSubs = storeSubOrders.map((s) => ({
    createdAt: createdAtById.get(s.orderId) ?? new Date(),
    vendorPayout: s.vendorPayout,
  }));
  const earningsSeries = bucketByMonth(enrichedSubs, months, (s) => s.vendorPayout);

  const recentSubOrders = storeSubOrders.slice(0, 5);
  const recentOrderIds = recentSubOrders.map((s) => s.orderId);
  const orderRows = recentOrderIds.length
    ? await db
        .select()
        .from(orders)
        .leftJoin(users, eq(orders.userId, users.id))
        .where(inArray(orders.id, recentOrderIds))
    : [];
  const orderById = new Map(orderRows.map((r) => [r.orders.id, r]));
  const recentOrders = recentSubOrders.map((sub) => ({ sub, order: orderById.get(sub.orderId) }));

  return (
    <div data-section="vendor-overview" className="section-vendor-overview max-w-6xl">
      <PageHeader
        eyebrow="Dashboard"
        title="Overview"
        description={`Welcome back, ${store.name}. Here's how your store is performing.`}
        action={
          <Link href="/vendor/products/new" className={primaryBtn}>
            <Plus className="w-4 h-4" aria-hidden />
            New product
          </Link>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatTile icon={Package} label="Products" value={productCount} accent="terracotta" spark={productSeries} trend={{ value: pctChange(productSeries), label: "vs last mo" }} />
        <StatTile icon={TrendingUp} label="Total Earnings" value={money(totalEarnings)} accent="emerald" spark={earningsSeries} trend={{ value: pctChange(earningsSeries), label: "vs last mo" }} />
        <StatTile icon={Wallet} label="Total Paid" value={money(totalPaid)} accent="clay" />
      </div>

      {/* Earnings chart */}
      <section data-section="vendor-earnings" className="section-vendor-earnings mt-4">
        <Panel
          title="Earnings"
          description="Vendor payout accrued, last 6 months"
          action={<span className="text-xs font-semibold text-clay tabular-nums">{money(earningsSeries.reduce((a, b) => a + b, 0))}</span>}
        >
          <AreaChart
            data={earningsSeries}
            labels={months.map((m) => m.label)}
            label="Earnings per month"
            formatValue={(n) => money(n)}
          />
        </Panel>
      </section>

      {/* Quick actions */}
      <section data-section="vendor-quick-actions" className="section-vendor-quick-actions mt-8">
        <h2 className="text-sm font-bold text-clay mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/vendor/products/new" className={outlineBtn + " h-20 flex-col"}>
            <Plus className="w-5 h-5" aria-hidden />
            Add Product
          </Link>
          <Link href="/vendor/orders" className={outlineBtn + " h-20 flex-col"}>
            <ShoppingBag className="w-5 h-5" aria-hidden />
            View Orders
          </Link>
          <Link href="/vendor/products" className={outlineBtn + " h-20 flex-col"}>
            <Package className="w-5 h-5" aria-hidden />
            Manage Products
          </Link>
          <Link href="/vendor/payouts" className={outlineBtn + " h-20 flex-col"}>
            <Wallet className="w-5 h-5" aria-hidden />
            Payouts
          </Link>
        </div>
      </section>

      {/* Recent orders */}
      <section data-section="vendor-recent-orders" className="section-vendor-recent-orders mt-8">
        <Panel
          title="Recent Orders"
          description="The 5 most recent orders for your store"
          bodyClassName="p-0"
          action={
            <Link href="/vendor/orders" className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-clay hover:text-terracotta transition-colors">
              View all <ArrowRight className="w-3 h-3" aria-hidden />
            </Link>
          }
        >
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-clay">
              No orders yet. Once customers purchase your products, they&apos;ll appear here.
            </div>
          ) : (
            <ul className="divide-y divide-clay/5">
              {recentOrders.map(({ sub, order }) => (
                <li key={sub.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-clay">Order #{sub.orderId}</p>
                    <p className="text-xs text-clay mt-0.5">
                      {order?.users?.name || "Customer"} &middot; {money(sub.subtotal)}
                    </p>
                  </div>
                  <StatusPill status={sub.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>
    </div>
  );
}
