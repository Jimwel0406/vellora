"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check } from "lucide-react";
import type { ShopProduct } from "./shop-types";
import { formatPrice, productBadge, Stars } from "./shop-types";

interface ProductCardProps {
  product: ShopProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const badge = productBadge(product.tags);

  async function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
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
    <div className="group relative">
      {/* Image container — holds both Link and button */}
      <div className="relative aspect-[4/5] bg-[#F9F7F3] overflow-hidden rounded-lg">
        <Link
          href={`/products/${product.id}`}
          aria-label={product.name}
          className="block w-full h-full"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-clay/20 text-sm">
              No image
            </div>
          )}
        </Link>

        {badge && (
          <span
            className={
              "absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded z-10 " +
              (badge === "Sale"
                ? "bg-terracotta text-white"
                : badge === "New"
                  ? "bg-ochre text-white"
                  : "bg-white/90 text-clay/70")
            }
          >
            {badge}
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <span className="px-3 py-1.5 bg-clay/8 text-[11px] font-bold uppercase tracking-[0.12em] text-clay/60 rounded">
              Sold Out
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick add — outside Link, inside overflow container */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={product.stock <= 0 || adding}
          className={
            "absolute bottom-0 left-0 right-0 z-20 w-full flex items-center justify-center gap-2 h-11 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 cursor-pointer opacity-0 group-hover:opacity-100 " +
            (adding
              ? "bg-emerald-600 text-white"
              : product.stock <= 0
                ? "bg-clay/10 text-clay cursor-not-allowed"
                : "bg-white text-clay hover:bg-terracotta hover:text-white")
          }
        >
          {adding ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="mt-3">
        <h3 className="text-[14px] font-heading font-medium text-clay leading-snug line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-[15px] font-bold text-clay font-label">
            {formatPrice(product.price)}
          </p>
          <Stars rating={product.rating} />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSwitcher({
  products,
}: {
  products: ShopProduct[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
