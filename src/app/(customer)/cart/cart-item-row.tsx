"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";

export function CartItemRow({
  itemId,
  productId,
  productName,
  productImage,
  groupId,
  price: unitPrice,
  quantity: initialQty,
  stock,
  variant,
}: {
  itemId: number;
  productId: number;
  productName: string;
  productImage?: string | null;
  groupId: string;
  storeName: string;
  storeSlug?: string | null;
  price: number;
  quantity: number;
  stock: number;
  variant?: string | null;
}) {
  const [localQty, setLocalQty] = useState(initialQty);
  const [removed, setRemoved] = useState(false);
  const router = useRouter();

  async function updateQuantity(newQty: number) {
    if (newQty < 1) return;
    setLocalQty(newQty);
    window.dispatchEvent(
      new CustomEvent("cart-qty-change", {
        detail: { itemId, qty: newQty, price: unitPrice },
      })
    );
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity: newQty }),
    });
    window.dispatchEvent(new CustomEvent("cart-updated"));
    router.refresh();
  }

  async function removeItem() {
    setRemoved(true);
    window.dispatchEvent(
      new CustomEvent("cart-qty-change", {
        detail: { itemId, qty: 0, price: unitPrice, removed: true },
      })
    );
    window.dispatchEvent(
      new CustomEvent("cart-item-removed", { detail: { group: groupId } })
    );
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    window.dispatchEvent(new CustomEvent("cart-updated"));
    router.refresh();
  }

  if (removed) return null;

  return (
    <div className="flex flex-col md:flex-row gap-6 group">
      <Link href={`/products/${productId}`} className="shrink-0">
        <div className="relative w-full md:w-56 h-56 md:h-72 overflow-hidden bg-clay/[0.03] rounded-xl">
          {productImage ? (
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-clay/20 text-xs">No image</div>
          )}
          {stock > 0 && stock <= 5 && (
            <div className="absolute top-4 left-4 bg-white/60 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-clay rounded-full">
              Low stock
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 flex flex-col py-1">
        <div className="space-y-1.5">
          <Link href={`/products/${productId}`}>
            <h4 className="text-xl lg:text-2xl font-bold text-clay leading-tight hover:underline underline-offset-4 decoration-1">
              {productName}
            </h4>
          </Link>
          {variant && (
            <p className="text-xs text-clay/50">{variant}</p>
          )}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-clay/40">Unit Price</p>
            <p className="text-xl font-bold text-clay">${(unitPrice / 100).toFixed(2)}</p>
          </div>

          <div className="flex items-center border border-clay/10 rounded-lg bg-white">
            <button
              onClick={() => updateQuantity(localQty - 1)}
              disabled={localQty <= 1}
              className="w-10 h-10 flex items-center justify-center hover:bg-clay/[0.03] transition-colors disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-clay/60" />
            </button>
            <span className="w-12 text-center text-sm font-bold tabular-nums select-none text-clay">
              {localQty}
            </span>
            <button
              onClick={() => updateQuantity(localQty + 1)}
              disabled={localQty >= stock}
              className="w-10 h-10 flex items-center justify-center hover:bg-clay/[0.03] transition-colors disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-clay/60" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-clay/40">Subtotal</p>
            <p className="text-xl font-bold text-terracotta">${((unitPrice * localQty) / 100).toFixed(2)}</p>
          </div>

          <button
            onClick={removeItem}
            className="text-clay/50 hover:text-terracotta transition-colors p-2 self-center hover:bg-clay/[0.04] rounded-lg"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
