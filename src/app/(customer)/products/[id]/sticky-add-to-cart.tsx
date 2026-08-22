"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check } from "lucide-react";

export function StickyAddToCart({
  productId,
  stock,
  isOwner = false,
  isSeller = false,
}: {
  productId: number;
  stock: number;
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
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-clay/10 lg:hidden transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <button
        onClick={handleAdd}
        disabled={loading}
        className={`w-full h-14 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
          added ? "bg-emerald-600 text-white" : "bg-terracotta text-white hover:brightness-110"
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            Added to cart
          </>
        ) : loading ? (
          "Adding..."
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
