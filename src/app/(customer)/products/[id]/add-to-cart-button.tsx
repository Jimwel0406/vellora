"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Check, Heart } from "lucide-react";

export function AddToCartButton({
  productId,
  stock,
  initialWishlisted = false,
  variantLabel = "",
}: {
  productId: number;
  stock: number;
  initialWishlisted?: boolean;
  variantLabel?: string;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(initialWishlisted);

  async function handleAdd() {
    setLoading(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity, variant: variantLabel }),
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
        setLoading(false);
        setAdded(false);
        router.refresh();
      }, 2000);
    } else {
      setLoading(false);
    }
  }

  async function handleWishlist() {
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (res.status === 401) {
      router.push(`/login?callbackUrl=/products/${productId}`);
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setWishlisted(data.action === "added");
    }
  }

  const outOfStock = stock <= 0;

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center h-[52px] w-full sm:w-[200px] rounded-full border border-clay/15 bg-white overflow-hidden">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || outOfStock}
          className="self-stretch flex items-center justify-center w-14 text-clay hover:bg-sand/40 transition-colors disabled:opacity-40 disabled:hover:bg-sand/40 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <Minus className="w-[18px] h-[18px]" />
        </button>
        <span className="self-stretch flex items-center justify-center flex-1 text-sm font-semibold select-none">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
          disabled={quantity >= stock || outOfStock}
          className="self-stretch flex items-center justify-center w-14 text-clay hover:bg-sand/40 transition-colors disabled:opacity-40 disabled:hover:bg-sand/40 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Primary CTA */}
      <button
        onClick={handleAdd}
        disabled={loading || outOfStock}
        className={`w-full h-14 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 ${
          added ? "!bg-emerald-600 hover:!bg-emerald-600" : "bg-terracotta text-white"
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            Added to cart
          </>
        ) : loading ? (
          "Adding..."
        ) : outOfStock ? (
          "Out of stock"
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>

      {/* Secondary CTA */}
      <button
        onClick={handleWishlist}
        disabled={outOfStock}
        className="w-full h-14 rounded-full border border-clay/15 bg-transparent font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-terracotta hover:text-terracotta disabled:opacity-60 disabled:hover:translate-y-0"
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300 ${
            wishlisted ? "fill-terracotta text-terracotta scale-110" : ""
          }`}
        />
        {wishlisted ? "Wishlisted" : "Wishlist"}
      </button>
    </div>
  );
}
