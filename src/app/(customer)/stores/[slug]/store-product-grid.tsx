"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ShoppingCart, Check, Package } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[] | null;
}

export function StoreProductGrid({ products, storeSlug }: { products: Product[]; storeSlug?: string }) {
  const router = useRouter();
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc" | "name">("newest");
  const [addingId, setAddingId] = useState<number | null>(null);

  async function handleQuickAdd(productId: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("cart-updated"));
        setTimeout(() => setAddingId(null), 1200);
      } else if (res.status === 401) {
        setAddingId(null);
        router.push(`/login?callbackUrl=/stores/${storeSlug || ""}`);
      } else {
        setAddingId(null);
      }
    } catch {
      setAddingId(null);
    }
  }

  const sorted = useMemo(() => {
    const arr = [...products];
    switch (sort) {
      case "price-asc": return arr.sort((a, b) => a.price - b.price);
      case "price-desc": return arr.sort((a, b) => b.price - a.price);
      case "name": return arr.sort((a, b) => a.name.localeCompare(b.name));
      default: return arr;
    }
  }, [products, sort]);

  if (products.length === 0) {
  return (
    <section data-section="store-products" className="section-store-products mt-12 lg:mt-14">
      <div className="border-t-2 border-clay/8 pt-10 lg:pt-12">
          <div className="border border-dashed border-clay/10 py-16 text-center">
            <Package className="w-8 h-8 text-clay/30 mx-auto mb-3" />
            <p className="text-sm text-clay/50">This store has no products yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
      <section id="store-products" data-section="store-products" className="section-store-products mt-12 lg:mt-14 scroll-mt-32">
        <div className="border-t-2 border-clay/8 pt-10 lg:pt-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8 lg:mb-12">
          <div>
            <span className="block font-label text-xs font-bold uppercase tracking-[0.25em] text-clay/40 mb-3">
              Browse
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl text-clay tracking-tight">
              Products{" "}
              <span className="text-base sm:text-lg font-normal text-clay/40">
                ({String(products.length).padStart(2, "0")})
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-clay/40" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="text-[11px] bg-transparent border-none outline-none cursor-pointer text-clay/60 hover:text-clay font-bold uppercase tracking-[0.1em] font-label"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-5 lg:gap-y-10">
          {sorted.map((product) => (
            <div key={product.id} className="group block">
              {/* Image */}
              <Link href={`/products/${product.id}`} aria-label={product.name}>
                <div className="aspect-[3/4] relative overflow-hidden bg-sand/40 mb-3">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-clay/30 text-xs">
                      No image
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <Link href={`/products/${product.id}`} className="group/title block">
                <h3 className="font-semibold text-sm text-clay leading-snug group-hover/title:text-terracotta transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="font-bold text-lg text-clay leading-none">
                  ${(product.price / 100).toFixed(2)}
                </p>
                <button
                  onClick={(e) => handleQuickAdd(product.id, e)}
                  disabled={addingId === product.id}
                  aria-label="Add to cart"
                  className={`shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-200 active:scale-[0.97] ${
                    addingId === product.id
                      ? "bg-terracotta text-white"
                      : "bg-clay/8 text-clay hover:bg-terracotta hover:text-white"
                  }`}
                >
                  {addingId === product.id ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <ShoppingCart className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
