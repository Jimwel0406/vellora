import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { users, stores, products, orders, payouts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { PageHeader, StatTile, Panel, StatusPill } from "@/components/shared/dashboard-ui";
import { AreaChart } from "@/components/charts/area-chart";
import { DonutChart, type DonutSegment } from "@/components/charts/donut-chart";
import { lastMonths, bucketByMonth, pctChange } from "@/lib/dashboard";
import {
  Building2,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Tags,
  ArrowRight,
} from "lucide-react";

const managementLinks = [
  { href: "/admin/vendors", label: "Vendors", icon: Store, desc: "Manage stores" },
  { href: "/admin/categories", label: "Categories", icon: Tags, desc: "Organize products" },
  { href: "/admin/commission", label: "Commission", icon: DollarSign, desc: "Set rates" },
  { href: "/admin/payouts", label: "Payouts", icon: ShoppingBag, desc: "Process payments" },
];

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  const [allUsers, allStores, allProducts, allOrders, allPayouts] = await Promise.all([
    db.select().from(users),
    db.select().from(stores),
    db.select().from(products),
    db.select({ id: orders.id, status: orders.status, totalAmount: orders.totalAmount, createdAt: orders.createdAt }).from(orders),
    db.select().from(payouts),
  ]);

  const months = lastMonths(6);

  const usersSeries = bucketByMonth(allUsers, months);
  const storesSeries = bucketByMonth(allStores, months);
  const productsSeries = bucketByMonth(allProducts, months);
  const ordersSeries = bucketByMonth(allOrders, months);
  const revenueSeries = bucketByMonth(allOrders, months, (o) => o.totalAmount);

  const totalCommission = allPayouts.reduce((sum, p) => sum + p.commissionDeducted, 0);
  const pendingPayouts = allPayouts.filter((p) => p.status === "pending");
  const pendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  const statusTally = allOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const segments: DonutSegment[] = [
    { label: "Completed", value: statusTally.completed ?? 0, color: "var(--color-success)" },
    { label: "Pending", value: statusTally.pending ?? 0, color: "var(--color-warning)" },
    { label: "Processing", value: statusTally.processing ?? 0, color: "var(--color-info)" },
    { label: "Cancelled", value: (statusTally.cancelled ?? 0) + (statusTally.refunded ?? 0) + (statusTally.failed ?? 0), color: "var(--color-danger)" },
  ];

  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div data-section="admin-overview" className="section-admin-overview">
      <PageHeader
        eyebrow="Platform"
        title="Overview"
        description="Marketplace health at a glance — revenue, orders, and vendor activity over the last 6 months."
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatTile icon={Building2} label="Users" value={allUsers.length} accent="clay" spark={usersSeries} trend={{ value: pctChange(usersSeries), label: "vs last mo" }} />
        <StatTile icon={Store} label="Stores" value={allStores.length} accent="terracotta" spark={storesSeries} trend={{ value: pctChange(storesSeries), label: "vs last mo" }} />
        <StatTile icon={Package} label="Products" value={allProducts.length} accent="ochre" spark={productsSeries} trend={{ value: pctChange(productsSeries), label: "vs last mo" }} />
        <StatTile icon={ShoppingBag} label="Orders" value={allOrders.length} accent="emerald" spark={ordersSeries} trend={{ value: pctChange(ordersSeries), label: "vs last mo" }} />
      </div>

      {/* Charts */}
      <section data-section="admin-analytics" className="section-admin-analytics mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel
          title="Revenue"
          description="Gross merchandise value, last 6 months"
          className="lg:col-span-2"
          action={<span className="text-xs font-semibold text-clay tabular-nums">{money(revenueSeries.reduce((a, b) => a + b, 0))}</span>}
        >
          <AreaChart
            data={revenueSeries}
            labels={months.map((m) => m.label)}
            label="Revenue per month"
            formatValue={(n) => money(n)}
          />
        </Panel>

        <Panel title="Orders by status" description={`${allOrders.length} total`}>
          <DonutChart
            segments={segments}
            centerValue={String(allOrders.length)}
            centerLabel="orders"
            label="Orders by status"
          />
        </Panel>
      </section>

      {/* Quick management */}
      <section data-section="admin-management" className="section-admin-management mt-8">
        <h2 className="text-sm font-bold text-clay mb-3">Management</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {managementLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-clay/10 bg-white p-4 shadow-[0_1px_2px_rgba(61,43,31,0.04)] hover:border-terracotta/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-terracotta/10 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-terracotta" aria-hidden />
                </div>
                <p className="font-semibold text-sm text-clay">{item.label}</p>
                <p className="text-xs text-clay mt-0.5">{item.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent orders + commission side note */}
      <section data-section="admin-recent-orders" className="section-admin-recent-orders mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel
          title="Recent Orders"
          description="The 5 most recent orders"
          className="lg:col-span-2"
          bodyClassName="p-0"
          action={
            <Link href="/admin/payouts" className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-clay hover:text-terracotta transition-colors">
              View all <ArrowRight className="w-3 h-3" aria-hidden />
            </Link>
          }
        >
          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-clay">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-clay/5">
              {recentOrders.map((order) => (
                <li key={order.id} className="py-3.5 px-5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-clay">Order #{order.id}</p>
                    <p className="text-xs text-clay mt-0.5">
                      {money(order.totalAmount)} &middot; {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusPill status={order.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Commission earned" description="Lifetime platform fees">
          <p className="text-3xl font-bold text-clay tabular-nums">{money(totalCommission)}</p>
          <p className="text-xs text-clay mt-1">
            {pendingPayouts.length} payout{pendingPayouts.length === 1 ? "" : "s"} pending &middot; {money(pendingAmount)} owed
          </p>
        </Panel>
      </section>
    </div>
  );
}
