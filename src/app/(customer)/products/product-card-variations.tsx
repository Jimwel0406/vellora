"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check, Plus, ShoppingCart } from "lucide-react";
import type { ShopProduct } from "./shop-types";
import { formatPrice, productBadge, Stars } from "./shop-types";

interface ProductCardProps {
  product: ShopProduct;
  onQuickAdd?: (productId: number) => Promise<void>;
}

// ─── Card A: Clean minimal ───────────────────────────────────────────────────

export function ProductCardA({ product }: ProductCardProps) {
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
      if (res.status === 401) { router.push(`/login?callbackUrl=/products`); return; }
      if (res.ok) { window.dispatchEvent(new CustomEvent("cart-updated")); setTimeout(() => setAdding(false), 1200); }
      else { setAdding(false); }
    } catch { setAdding(false); }
  }

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-clay/8 hover:border-clay/20 hover:shadow-[0_20px_50px_-20px_rgba(61,43,31,0.18)] transition-all duration-400">
      <div className="relative aspect-square overflow-hidden bg-[#F9F7F3]">
        <Link href={`/products/${product.id}`} aria-label={product.name} className="block w-full h-full">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out" width="600" height="600" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-clay/20 text-sm">No image</div>
          )}
        </Link>

        {badge && (
          <span className={"absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] " +
            (badge === "Sale" ? "bg-terracotta text-white" : badge === "New" ? "bg-ochre text-white" : "bg-clay text-sand")}>
            {badge}
          </span>
        )}

        {product.stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <span className="px-4 py-2 rounded-full bg-clay/10 text-xs font-bold uppercase tracking-[0.15em] text-clay/75">Sold Out</span>
          </span>
        )}

        <button type="button" onClick={handleQuickAdd} disabled={product.stock <= 0 || adding}
          className={"absolute bottom-3 right-3 hidden md:inline-flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 cursor-pointer active:scale-95 " +
            (adding ? "bg-emerald-600 text-white opacity-100 translate-y-0" :
              product.stock <= 0 ? "bg-clay/10 text-clay/55 cursor-not-allowed" :
              "bg-white text-clay shadow-md hover:bg-terracotta hover:text-white") +
            (!adding && " opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0")}
          aria-label="Add to cart">
          {adding ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-[18px] h-[18px]" />}
        </button>
      </div>

      <Link href={`/products/${product.id}`} className="block p-4">
        <h3 className="text-[15px] font-semibold text-clay leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <Stars rating={product.rating} />
        </div>
        <p className="mt-2.5 text-lg font-bold text-clay font-label">{formatPrice(product.price)}</p>
      </Link>
    </div>
  );
}

// ─── Card B: Image top heavy, info compact ───────────────────────────────────

export function ProductCardB({ product, buttonStyle = "A" }: ProductCardProps & { buttonStyle?: string }) {
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
      if (res.status === 401) { router.push(`/login?callbackUrl=/products`); return; }
      if (res.ok) { window.dispatchEvent(new CustomEvent("cart-updated")); setTimeout(() => setAdding(false), 1200); }
      else { setAdding(false); }
    } catch { setAdding(false); }
  }

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-clay/8 hover:shadow-[0_24px_60px_-24px_rgba(61,43,31,0.2)] transition-all duration-400">
      <div className="relative aspect-[4/5] bg-[#F9F7F3]">
        <Link href={`/products/${product.id}`} aria-label={product.name} className="block w-full h-full overflow-hidden rounded-t-3xl">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out" width="600" height="600" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-clay/20 text-sm">No image</div>
          )}
        </Link>

        {badge && (
          <span className={"absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] z-10 " +
            (badge === "Sale" ? "bg-terracotta text-white" : badge === "New" ? "bg-ochre text-white" : "bg-white/90 backdrop-blur-sm text-clay")}>
            {badge}
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <span className="px-4 py-2 rounded-full bg-clay/10 text-xs font-bold uppercase tracking-[0.15em] text-clay/75">Sold Out</span>
          </div>
        )}

        {/* Button D: Slide up bar */}
        {buttonStyle === "D" && (
          <div className="absolute bottom-0 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="h-10 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
            <button type="button" onClick={handleQuickAdd} disabled={product.stock <= 0 || adding}
              className={"w-full flex items-center justify-center gap-2 h-12 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer " +
                (adding ? "bg-emerald-600 text-white" :
                  product.stock <= 0 ? "bg-clay/10 text-clay/55 cursor-not-allowed" :
                  "bg-clay text-sand hover:bg-terracotta")}>
              {adding ? <Check className="w-4 h-4" /> : <><ShoppingBag className="w-4 h-4" />Add to Cart</>}
            </button>
          </div>
        )}
      </div>

      <Link href={`/products/${product.id}`} className="block px-4 pt-3 pb-4">
        <h3 className="text-[15px] font-heading font-medium text-clay leading-snug line-clamp-2 min-h-[2.75rem]">{product.name}</h3>
        <div className="mt-2 flex items-center gap-1.5">
          <Stars rating={product.rating} />
        </div>
        <p className="mt-2 text-lg font-bold text-clay font-label">{formatPrice(product.price)}</p>
      </Link>
    </div>
  );
}

// ─── Card C: Horizontal layout ───────────────────────────────────────────────

export function ProductCardC({ product }: ProductCardProps) {
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
      if (res.status === 401) { router.push(`/login?callbackUrl=/products`); return; }
      if (res.ok) { window.dispatchEvent(new CustomEvent("cart-updated")); setTimeout(() => setAdding(false), 1200); }
      else { setAdding(false); }
    } catch { setAdding(false); }
  }

  return (
    <Link href={`/products/${product.id}`} className="group flex items-center gap-4 bg-white rounded-2xl border border-clay/8 p-3 hover:border-clay/20 hover:shadow-[0_16px_40px_-16px_rgba(61,43,31,0.15)] transition-all duration-400">
      <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-[#F9F7F3]">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out" width="600" height="600" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-clay/20 text-xs">No image</div>
        )}
        {badge && (
          <span className={"absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.12em] " +
            (badge === "Sale" ? "bg-terracotta text-white" : badge === "New" ? "bg-ochre text-white" : "bg-clay text-sand")}>
            {badge}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 py-1">
        <h3 className="text-[15px] font-semibold text-clay leading-snug line-clamp-2">{product.name}</h3>
        <div className="mt-1.5 flex items-center gap-2">
          <Stars rating={product.rating} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-clay font-label">{formatPrice(product.price)}</p>
          <button type="button" onClick={handleQuickAdd} disabled={product.stock <= 0 || adding}
            className={"hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 cursor-pointer active:scale-95 " +
              (adding ? "bg-emerald-600 text-white" :
                product.stock <= 0 ? "bg-clay/10 text-clay/55 cursor-not-allowed" :
                "bg-clay text-sand hover:bg-terracotta")}>
            {adding ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
}
