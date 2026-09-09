"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, AlertCircle, Plus } from "lucide-react";
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
  const [promoOpen, setPromoOpen] = useState(false);

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
    <div className="space-y-8">
      {/* Order Summary label */}
      <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-clay/50 font-label">
        Order Summary
      </h3>

      {/* Promo code — collapsed by default */}
      <div>
        {!promoOpen && !appliedCode ? (
          <button
            type="button"
            onClick={() => setPromoOpen(true)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-clay/50 hover:text-clay transition-colors"
          >
            <Plus className="w-3 h-3" />
            Have a promo code?
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                aria-label="Promo code"
                disabled={!!appliedCode}
                className="flex-1 h-10 px-3 rounded-[6px] border border-clay/15 bg-white text-[13px] text-clay placeholder:text-clay/40 focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
              />
              {appliedCode ? (
                <button
                  type="button"
                  onClick={() => { setAppliedCode(null); setPromoOpen(false); }}
                  className="h-10 px-3 rounded-[6px] border border-clay/15 text-[11px] font-bold uppercase tracking-wider text-clay/60 hover:text-clay hover:border-clay/30 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={checking || !code.trim()}
                  className="h-10 px-4 rounded-[6px] bg-clay text-white text-[11px] font-bold uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {checking ? "Checking..." : "Apply"}
                </button>
              )}
            </div>
            {promoError && (
              <p className="flex items-center gap-1.5 text-[12px] text-red-600">
                <AlertCircle className="w-3 h-3" aria-hidden /> {promoError}
              </p>
            )}
            {appliedCode && (
              <p className="flex items-center gap-1.5 text-[12px] text-emerald-600">
                <Check className="w-3 h-3" aria-hidden /> {appliedCode.code} applied — you save ${(appliedCode.discountAmount / 100).toFixed(2)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Line items */}
      <div className="space-y-3 text-[14px] text-clay/60">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-clay tabular-nums">${(subtotal / 100).toFixed(2)}</span>
        </div>
        {appliedCode && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span className="font-semibold tabular-nums">-${(appliedCode.discountAmount / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Free</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-clay/10" />

      {/* Total */}
      <div className="flex justify-between items-end">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay/50 font-label">Total Balance</span>
        <span className="text-[32px] sm:text-[36px] font-bold text-clay leading-none tracking-[-0.02em] tabular-nums">
          ${(total / 100).toFixed(2)}
        </span>
      </div>

      {/* Checkout CTA */}
      <StripeCheckoutButton label="Proceed to checkout" promoCode={appliedCode?.code} />

      {/* Continue browsing */}
      <div className="text-center pt-1">
        <Link
          href="/products"
          className="text-[12px] font-semibold uppercase tracking-[0.12em] text-clay/45 hover:text-clay transition-colors"
        >
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
