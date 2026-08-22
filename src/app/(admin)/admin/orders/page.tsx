import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { PageHeader, Panel, StatusPill, tableHead } from "@/components/shared/dashboard-ui";
import { RefundButton } from "./refund-button";

const STATUS_FILTERS = ["all", "pending", "processing", "completed", "cancelled", "refunded", "failed"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  const { status } = await searchParams;
  const filter: StatusFilter = STATUS_FILTERS.includes(status as StatusFilter) ? (status as StatusFilter) : "all";

  const base = db.select().from(orders).leftJoin(users, eq(orders.userId, users.id));
  const rows =
    filter === "all"
      ? await base.orderBy(desc(orders.createdAt))
      : await base.where(eq(orders.status, filter)).orderBy(desc(orders.createdAt));

  return (
    <div data-section="admin-orders" className="section-admin-orders">
      <PageHeader
        eyebrow="Management"
        title="Orders"
        description={`${rows.length} order${rows.length === 1 ? "" : "s"}${filter !== "all" ? ` · filtered: ${filter}` : ""}`}
      />

      {/* Status filter */}
      <nav aria-label="Order status filter" className="flex flex-wrap gap-2 mb-4">
        {STATUS_FILTERS.map((f) => {
          const active = f === filter;
          return (
            <Link
              key={f}
              href={f === "all" ? "/admin/orders" : `/admin/orders?status=${f}`}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                active
                  ? "bg-terracotta text-white"
                  : "bg-white border border-clay/10 text-clay/60 hover:text-clay hover:border-clay/30"
              }`}
            >
              {f}
            </Link>
          );
        })}
      </nav>

      {rows.length === 0 ? (
        <p className="text-sm text-clay/50">No orders match this filter.</p>
      ) : (
        <Panel bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-clay/10">
                  <th className={tableHead}>Order</th>
                  <th className={tableHead}>Customer</th>
                  <th className={tableHead}>Total</th>
                  <th className={tableHead}>Discount</th>
                  <th className={tableHead}>Status</th>
                  <th className={tableHead}>Date</th>
                  <th className={`${tableHead} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ orders: order, users: user }) => (
                  <tr key={order.id} className="border-t border-clay/5 hover:bg-clay/[0.02] transition-colors">
                    <td className="p-4 text-sm font-semibold text-clay">#{order.id}</td>
                    <td className="p-4 text-sm">
                      <p className="font-medium text-clay">{user?.name ?? "—"}</p>
                      <p className="text-xs text-clay/50">{user?.email ?? ""}</p>
                    </td>
                    <td className="p-4 text-sm text-clay tabular-nums">{money(order.totalAmount)}</td>
                    <td className="p-4 text-sm text-clay/60 tabular-nums">
                      {order.discountAmount > 0 ? `−${money(order.discountAmount)}` : "—"}
                    </td>
                    <td className="p-4"><StatusPill status={order.status} /></td>
                    <td className="p-4 text-sm text-clay/50">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {order.status !== "refunded" ? <RefundButton orderId={order.id} /> : <span className="block text-right text-xs text-clay/40">Refunded</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}