"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Tag, Check, AlertCircle } from "lucide-react";
import { StripeCheckoutButton } from "@/app/(customer)/checkout/stripe-redirect";

interface LineItem {
  id: number;
  price: number;
  qty: number;
}

interface QtyChangeDetail {
  itemId: number;
  qty: number;
  price: number;
  removed?: boolean;
}

export function CartSummary({ initialItems }: { initialItems: LineItem[] }) {
  const [lines, setLines] = useState<Map<number, LineItem>>(
    () => new Map(initialItems.map((i) => [i.id, { ...i }]))
  );
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<{ code: string; discountAmount: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    function handleQty(e: Event) {
      const detail = (e as CustomEvent<QtyChangeDetail>).detail;
      if (!detail) return;
      setLines((prev) => {
        const next = new Map(prev);
        if (detail.removed) {
          next.delete(detail.itemId);
        } else {
          next.set(detail.itemId, {
            id: detail.itemId,
            qty: detail.qty,
            price: detail.price,
          });
        }
        return next;
      });
      if (appliedCode) setAppliedCode(null);
    }
    window.addEventListener("cart-qty-change", handleQty);
    return () => window.removeEventListener("cart-qty-change", handleQty);
  }, [appliedCode]);

  const subtotal = useMemo(
    () => [...lines.values()].reduce((sum, l) => sum + l.price * l.qty, 0),
    [lines]
  );

  async function handleApply() {
    const trimmed = code.trim();
    if (!trimmed) return;
    setChecking(true);
    setPromoError("");
    try {
      const res = await fetch(`/api/promo-codes/validate?code=${encodeURIComponent(trimmed)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (data.valid) {
        setAppliedCode({ code: data.code, discountAmount: data.discountAmount });
        setCode("");
      } else {
        setAppliedCode(null);
        setPromoError(data.error || "That code isn't valid.");
      }
    } catch {
      setPromoError("Couldn't check that code right now.");
    } finally {
      setChecking(false);
    }
  }

  const total = subtotal - (appliedCode?.discountAmount ?? 0);

  return (
    <div className="bg-clay/[0.02] border border-clay/5 rounded-xl p-8 space-y-8">
      <div className="border-b border-clay/10 pb-5">
        <h3 className="text-lg font-bold text-clay tracking-tight">Order Summary</h3>
      </div>

      {/* Promo code */}
      <div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-clay/30" aria-hidden />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Promo code"
              aria-label="Promo code"
              disabled={!!appliedCode}
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-clay/20 bg-white text-sm text-clay placeholder:text-clay/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-shadow disabled:opacity-60"
            />
          </div>
          {appliedCode ? (
            <button
              type="button"
              onClick={() => setAppliedCode(null)}
              className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-lg border border-clay/15 bg-white text-[11px] font-bold uppercase tracking-wider text-clay/60 hover:text-clay hover:border-clay/30 transition-colors cursor-pointer"
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              disabled={checking || !code.trim()}
              className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-lg bg-terracotta text-white text-[11px] font-bold uppercase tracking-wider hover:bg-clay transition-colors disabled:opacity-50 cursor-pointer"
            >
              {checking ? "Checking…" : "Apply"}
            </button>
          )}
        </div>
        {promoError && (
          <p className="flex items-center gap-1.5 text-xs text-red-600 mt-2">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden /> {promoError}
          </p>
        )}
        {appliedCode && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2">
            <Check className="w-3.5 h-3.5" aria-hidden /> {appliedCode.code} applied — you save $
            {(appliedCode.discountAmount / 100).toFixed(2)}
          </p>
        )}
      </div>

      <div className="space-y-5 text-sm text-clay/70">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-bold text-clay">${(subtotal / 100).toFixed(2)}</span>
        </div>
        {appliedCode && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span className="font-semibold">−${(appliedCode.discountAmount / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-start">
          <span>Shipping</span>
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Free</span>
            <p className="text-[10px] text-clay/40 mt-0.5">Standard delivery</p>
          </div>
        </div>
      </div>

      <div className="border-t border-clay/10 pt-6">
        <div className="flex justify-between items-end mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-clay/50">Total Balance</span>
          <span className="text-4xl lg:text-[40px] font-black text-clay leading-none tracking-tight">
            ${(total / 100).toFixed(2)}
          </span>
        </div>
        <StripeCheckoutButton label="Proceed to checkout" promoCode={appliedCode?.code} />
      </div>

      <div className="flex flex-col items-center gap-4 pt-2">
        <Link
          href="/products"
          className="text-[11px] font-semibold uppercase tracking-wider text-clay/50 hover:text-clay transition-colors border-b border-transparent hover:border-clay pb-0.5"
        >
          Continue Browsing
        </Link>
      </div>
    </div>
  );
}