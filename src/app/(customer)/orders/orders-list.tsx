"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface OrderItem {
  id: number;
  orderId: number;
  productName: string;
  quantity: number;
}

export interface OrderRow {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
}

type SortKey = "newest" | "oldest" | "amount-desc" | "amount-asc";

const statusLabel: Record<string, string> = {
  pending: "Processing",
  completed: "Delivered",
  cancelled: "Cancelled",
  shipped: "Shipped",
};

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "amount-desc", label: "Highest total" },
  { value: "amount-asc", label: "Lowest total" },
];

function itemSummary(items: OrderItem[]): string {
  if (items.length === 0) return "";
  const first = items[0].productName;
  const remaining = items.length - 1;
  if (remaining === 0) return first;
  return `${first} + ${remaining} ${remaining === 1 ? "item" : "items"}`;
}

export function OrderHistoryList({
  orders,
  itemsByOrder,
}: {
  orders: OrderRow[];
  itemsByOrder: Map<number, OrderItem[]>;
}) {
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

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-16 sm:py-24">
        <svg
          className="w-10 h-10 text-clay/20 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            strokeWidth="1"
          />
        </svg>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label mb-3">
          No orders yet
        </p>
        <p className="text-[14px] text-clay/50 leading-relaxed max-w-xs mb-8">
          When you place your first order, you&apos;ll be able to track it and revisit it here.
        </p>
        <Link
          href="/products"
          className="text-[11px] font-bold uppercase tracking-[0.15em] text-terracotta hover:text-clay transition-colors"
        >
          Start Shopping &rarr;
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header row */}
      <div className="flex items-baseline justify-between gap-4 mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label">
          Order History
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[12px] text-clay/40">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort orders"
            className="text-[11px] font-bold uppercase tracking-[0.12em] text-clay/50 bg-transparent border-b border-clay/15 pb-0.5 cursor-pointer focus:outline-none focus:border-terracotta/40 font-label"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Order list */}
      <div>
        {sorted.map((order, i) => {
          const items = itemsByOrder.get(order.id) ?? [];
          const summary = itemSummary(items);
          return (
            <div key={order.id}>
              {i > 0 && <div className="h-px bg-clay/8" />}
              <Link
                href={`/orders/${order.id}`}
                className="group block py-5 sm:py-6"
              >
                {/* Desktop layout */}
                <div className="hidden sm:grid sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8">
                  {/* Left: order info */}
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-[14px] font-semibold text-clay group-hover:text-terracotta transition-colors">
                        Order #{order.id}
                      </span>
                      <span className="text-[12px] text-clay/35">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {summary && (
                      <p className="text-[13px] text-clay/50 truncate max-w-md">
                        {summary}
                      </p>
                    )}
                  </div>

                  {/* Right: status, total, link */}
                  <div className="text-right shrink-0">
                    <div className="flex items-baseline justify-end gap-4 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-clay/40 font-label">
                        {statusLabel[order.status] ?? order.status}
                      </span>
                      <span className="text-[15px] font-heading font-bold text-clay">
                        ${(order.totalAmount / 100).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta/70 group-hover:text-terracotta transition-colors">
                      View Order &rarr;
                    </span>
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="sm:hidden">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[14px] font-semibold text-clay group-hover:text-terracotta transition-colors">
                      Order #{order.id}
                    </span>
                    <span className="text-[15px] font-heading font-bold text-clay">
                      ${(order.totalAmount / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-clay/40 mb-2">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-clay/20">·</span>
                    <span className="font-label uppercase tracking-[0.1em] text-[10px] font-bold">
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </div>
                  {summary && (
                    <p className="text-[13px] text-clay/50 truncate mb-2">
                      {summary}
                    </p>
                  )}
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta/70 group-hover:text-terracotta transition-colors">
                    View Order &rarr;
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
