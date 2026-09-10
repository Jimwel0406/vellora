"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check } from "lucide-react";

export function StickyAddToCart({
  productId,
  stock,
  productName,
  productPrice,
  productImage,
  isOwner = false,
  isSeller = false,
}: {
  productId: number;
  stock: number;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  isOwner?: boolean;
  isSeller?: boolean;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("product-hero");
    heroRef.current = el;
    function onScroll() {
      if (!heroRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      setVisible(heroBottom < 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleAdd() {
    setLoading(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setLoading(false);
    if (res.status === 401) {
      router.push(`/login?callbackUrl=/products/${productId}`);
      return;
    }
    if (res.ok) {
      setAdded(true);
      window.dispatchEvent(new CustomEvent("cart-updated"));
      setTimeout(() => {
        setAdded(false);
        router.refresh();
      }, 2000);
    }
  }

  if (isOwner || isSeller || stock <= 0) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-clay/10 lg:hidden transition-transform duration-400 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {productImage && (
          <img
            src={productImage}
            alt={productName || "Product"}
            className="w-11 h-11 rounded-[8px] object-cover shrink-0 border border-clay/5"
          />
        )}
        <div className="flex-1 min-w-0">
          {productName && (
            <p className="text-[13px] font-semibold text-clay truncate leading-tight">
              {productName}
            </p>
          )}
          {productPrice != null && (
            <p className="text-[12px] text-clay tabular-nums">
              ${(productPrice / 100).toFixed(2)}
            </p>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={loading}
          className={`h-11 px-5 rounded-full font-semibold text-[13px] flex items-center justify-center gap-2 transition-all duration-300 shrink-0 ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-terracotta text-white hover:bg-terracotta-deep"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" strokeWidth={2.5} />
              Added
            </>
          ) : loading ? (
            "Adding..."
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" strokeWidth={2} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
