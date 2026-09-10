"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, ShoppingBag } from "lucide-react";

export function WishlistRemoveButton({ itemId }: { itemId: number }) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  async function handleRemove(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setRemoving(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      if (!res.ok) return;
      router.refresh();
    } finally {
      setRemoving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={removing}
      className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm hover:bg-white hover:shadow-md transition-all"
      aria-label="Remove from wishlist"
    >
      {removing ? (
        <Loader2 className="w-3.5 h-3.5 text-red-500 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5 text-red-500/70 hover:text-red-500" />
      )}
    </button>
  );
}

export function WishlistAddToCartButton({
  productId,
  disabled = false,
}: {
  productId: number;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.status === 401) {
        router.push(`/login?callbackUrl=/account/wishlist`);
        return;
      }
      if (!res.ok) return;
      window.dispatchEvent(new Event("cart-updated"));
      router.refresh();
    } finally {
      setAdding(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={adding || disabled}
      className="w-full bg-terracotta hover:bg-clay text-white py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
    >
      {adding ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <ShoppingBag className="w-3.5 h-3.5" />
      )}
      {adding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
