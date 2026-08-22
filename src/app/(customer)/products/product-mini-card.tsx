"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check, ArrowDown } from "lucide-react";
import type { ShopProduct } from "./shop-types";
import { formatPrice, productBadge, Stars } from "./shop-types";

export function ProductMiniCard({ product }: { product: ShopProduct }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const badge = productBadge(product.tags);

  async function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (res.status === 401) {
        router.push(`/login?callbackUrl=/products`);
        return;
      }
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("cart-updated"));
        setTimeout(() => setAdding(false), 1200);
      } else {
        setAdding(false);
      }
    } catch {
      setAdding(false);
    }
  }

  return (
    <div className="group relative bg-white border border-clay/10 rounded-xl overflow-hidden hover:border-terracotta/40 hover:shadow-[0_12px_28px_-16px_rgba(61,43,31,0.22)] transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-sand/40">
        <Link href={`/products/${product.id}`} aria-label={product.name} className="block w-full h-full">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-clay/30 text-xs italic">
              No image
            </div>
          )}
        </Link>
        {badge && (
          <span
            className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-[0.15em] ${
              badge === "Sale"
                ? "bg-terracotta text-white"
                : badge === "New"
                  ? "bg-ochre text-white"
                  : "bg-clay text-sand"
            }`}
          >
            {badge}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 border border-clay/15 text-[8px] font-bold uppercase tracking-[0.15em] text-clay/60">
            Sold out
          </span>
        )}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={product.stock <= 0 || adding}
          className={`absolute bottom-2.5 right-2.5 hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-300 cursor-pointer active:scale-95 ${
            adding
              ? "bg-emerald-600 text-white opacity-100 translate-y-0"
              : product.stock <= 0
                ? "bg-clay/10 text-clay/30 cursor-not-allowed"
                : "bg-clay text-sand hover:bg-terracotta"
          } ${!adding && "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}`}
          aria-label="Add to cart"
        >
          {adding ? (
            <Check className="w-4 h-4" />
          ) : (
            <span className="flex flex-col items-center -space-y-0.5" aria-hidden>
              <ArrowDown className="w-3 h-3" strokeWidth={2.5} />
              <ShoppingBag className="w-[18px] h-[18px]" />
            </span>
          )}
        </button>
      </div>

      <Link href={`/products/${product.id}`} className="block p-3 sm:p-3.5">
        <h3 className="text-[13px] sm:text-sm font-semibold text-clay leading-snug line-clamp-2 min-h-[2.25rem]">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-2">
          <Stars rating={product.rating} />
          {product.ratingCount > 0 && (
            <span className="text-[11px] text-clay/40">({product.ratingCount})</span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-[15px] font-bold text-clay">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </div>
  );
}