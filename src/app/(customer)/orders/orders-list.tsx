"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface OrderRow {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
}

type SortKey = "newest" | "oldest" | "amount-desc" | "amount-asc";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "amount-desc", label: "Highest total" },
  { value: "amount-asc", label: "Lowest total" },
];

export function OrderHistoryList({ orders }: { orders: OrderRow[] }) {
  const [sort, setSort] = useState<SortKey>("newest");

  const sorted = useMemo(() => {
    const copy = [...orders];
    switch (sort) {
      case "oldest":
        return copy.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "amount-desc":
        return copy.sort((a, b) => b.totalAmount - a.totalAmount);
      case "amount-asc":
        return copy.sort((a, b) => a.totalAmount - b.totalAmount);
      default:
        return copy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [orders, sort]);

  return (
    <>
      <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-clay/5 bg-sand/30">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-clay truncate">
            Order History
          </h2>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] font-semibold text-clay/40">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort orders"
              className="text-[11px] font-bold uppercase tracking-wider text-clay/70 bg-sand/60 border border-clay/10 rounded-full px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 space-y-3 sm:space-y-4">
        {sorted.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block group bg-sand/30 rounded-xl border border-clay/5 p-4 sm:p-5 hover:border-terracotta/30 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <p className="font-bold text-sm text-clay truncate group-hover:text-terracotta transition-colors">
                  Order #{order.id}
                </p>
                <p className="text-[11px] text-clay/50">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    statusColors[order.status] ||
                    "bg-clay/5 text-clay/50"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-clay">
                  ${(order.totalAmount / 100).toFixed(2)}
                </p>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-terracotta group-hover:underline">
                  View details
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}