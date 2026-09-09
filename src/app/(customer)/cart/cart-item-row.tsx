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
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 group">
      {/* Image — 25%, large and dominant */}
      <Link href={`/products/${productId}`} className="shrink-0">
        <div className="relative w-full sm:w-[200px] sm:h-[240px] aspect-[4/5] overflow-hidden bg-[#FAF7EC] rounded-[6px]">
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
            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-clay rounded-[4px]">
              Low stock
            </div>
          )}
        </div>
      </Link>

      {/* Product info + controls */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
        {/* Top — Product name + variant */}
        <div>
          <Link href={`/products/${productId}`}>
            <h4 className="text-[20px] sm:text-[22px] lg:text-[24px] font-semibold text-clay leading-snug hover:text-terracotta transition-colors">
              {productName}
            </h4>
          </Link>
          {variant && (
            <p className="text-[13px] text-clay/50 mt-1">{variant}</p>
          )}
        </div>

        {/* Bottom — Price, quantity, subtotal, remove */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-5 sm:mt-6">
          {/* Unit price */}
          <p className="text-[15px] font-semibold text-clay tabular-nums">
            ${(unitPrice / 100).toFixed(2)}
          </p>

          {/* Quantity controls */}
          <div className="flex items-center border border-clay/15 rounded-[6px] bg-white overflow-hidden">
            <button
              onClick={() => updateQuantity(localQty - 1)}
              disabled={localQty <= 1}
              className="w-9 h-9 flex items-center justify-center hover:bg-[#FBF6EC] transition-colors disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 text-clay/60" />
            </button>
            <span className="w-10 text-center text-[14px] font-semibold tabular-nums select-none text-clay">
              {localQty}
            </span>
            <button
              onClick={() => updateQuantity(localQty + 1)}
              disabled={localQty >= stock}
              className="w-9 h-9 flex items-center justify-center hover:bg-[#FBF6EC] transition-colors disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 text-clay/60" />
            </button>
          </div>

          {/* Subtotal */}
          <p className="text-[16px] font-bold text-clay tabular-nums">
            ${((unitPrice * localQty) / 100).toFixed(2)}
          </p>

          {/* Remove */}
          <button
            onClick={removeItem}
            className="text-clay/30 hover:text-terracotta transition-colors p-1.5"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
