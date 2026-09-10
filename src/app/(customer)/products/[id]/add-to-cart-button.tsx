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
      {/* Quantity + Add to Cart — horizontal */}
      <div className="flex items-stretch gap-3">
        {/* Quantity selector */}
        <div className="flex items-center h-[56px] w-[120px] shrink-0 rounded-full border border-clay/15 bg-white overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || outOfStock}
            className="self-stretch flex items-center justify-center w-10 text-clay hover:bg-[#FBF6EC] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <span className="self-stretch flex items-center justify-center flex-1 text-[15px] font-semibold select-none tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock || outOfStock}
            className="self-stretch flex items-center justify-center w-10 text-clay hover:bg-[#FBF6EC] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Add to Cart CTA — the strongest interactive element */}
        <button
          onClick={handleAdd}
          disabled={loading || outOfStock}
          className={`flex-1 h-[56px] rounded-full font-bold flex items-center justify-center gap-2.5 transition-all duration-300 text-[15px] tracking-[0.01em] ${
            added
              ? "!bg-emerald-600 hover:!bg-emerald-600 text-white"
              : "bg-terracotta text-white hover:bg-terracotta-deep hover:shadow-[0_6px_24px_rgba(166,99,75,0.35)] active:scale-[0.98]"
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100`}
        >
          {added ? (
            <>
              <Check className="w-[18px] h-[18px]" strokeWidth={2.5} />
              Added to cart
            </>
          ) : loading ? (
            "Adding..."
          ) : outOfStock ? (
            "Out of stock"
          ) : (
            <>
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={2} />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Wishlist — secondary, understated */}
      <button
        onClick={handleWishlist}
        disabled={outOfStock}
        className="w-full h-11 rounded-full border border-clay/10 bg-transparent font-medium text-[13px] flex items-center justify-center gap-2 text-clay transition-all duration-300 hover:border-clay/20 hover:text-clay disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 ${
            wishlisted ? "fill-terracotta text-terracotta" : ""
          }`}
        />
        {wishlisted ? "Wishlisted" : "Add to wishlist"}
      </button>
    </div>
  );
}
