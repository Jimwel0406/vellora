"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ShoppingCart, Check, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="rounded-xl border border-dashed border-[#E5E8E5] bg-white py-14 text-center">
        <Package className="w-8 h-8 text-[#6B716D] mx-auto mb-3" />
        <p className="text-sm text-[#6B716D]">This store has no products yet.</p>
      </div>
    );
  }

  return (
    <section data-section="store-products" className="section-store-products">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#17201C]">
          Products{" "}
          <span className="text-sm font-semibold text-[#6B716D]">
            ({products.length})
          </span>
        </h2>
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#6B716D]" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="text-sm bg-transparent border-none outline-none cursor-pointer text-[#6B716D] hover:text-[#17201C] font-medium"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {sorted.map((product) => (
          <div key={product.id} className="group block">
            <Card className="overflow-hidden border border-[#E5E8E5] rounded-xl shadow-sm hover:shadow-[0_18px_40px_-28px_rgba(23,32,28,0.35)] hover:-translate-y-0.5 transition-all duration-300 h-full bg-white">
              <Link href={`/products/${product.id}`} aria-label={product.name}>
                <div className="aspect-square relative overflow-hidden bg-[#F2F1EC]">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6B716D] text-xs">
                      No image
                    </div>
                  )}
                </div>
              </Link>
              <CardContent className="p-3 sm:p-4 flex flex-col">
                <Link href={`/products/${product.id}`} className="group/title">
                  <h3 className="font-semibold text-sm text-[#17201C] line-clamp-2 leading-snug group-hover/title:text-[#3E8F68] transition-colors">{product.name}</h3>
                </Link>
                <p className="font-bold text-base sm:text-lg text-[#17201C] mt-2">
                  ${(product.price / 100).toFixed(2)}
                </p>
                <button
                  onClick={(e) => handleQuickAdd(product.id, e)}
                  disabled={addingId === product.id}
                  aria-label="Add to cart"
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold transition-all duration-200 active:scale-[0.97] ${
                    addingId === product.id
                      ? "bg-[#3E8F68] text-white"
                      : "bg-[#17201C] text-white hover:bg-[#3E8F68]"
                  }`}
                >
                  {addingId === product.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}