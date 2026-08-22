"use client";

import { useEffect, useState } from "react";

async function startCheckout(promoCode?: string): Promise<string> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promoCode: promoCode ?? "" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    const err = new Error(data.error || "Checkout failed. Please try again.") as Error & {
      code?: string;
    };
    err.code = data.code;
    throw err;
  }
  return data.url as string;
}

export function StripeCheckoutButton({
  label,
  promoCode,
  className = "block w-full bg-terracotta text-white text-center py-5 text-[11px] font-bold uppercase font-label tracking-[0.2em] hover:bg-clay transition-all active:scale-[0.98]",
}: {
  label: string;
  promoCode?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onShow = () => setLoading(false);
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  async function handleClick() {
    setLoading(true);
    try {
      const url = await startCheckout(promoCode);
      sessionStorage.setItem("vellora_checkout_return", "1");
      window.location.href = url;
    } catch (e) {
      const code = (e as Error & { code?: string }).code;
      if (code === "EMPTY_CART") {
        window.location.replace("/cart");
        return;
      }
      alert((e as Error).message);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? "Redirecting to secure payment…" : label}
    </button>
  );
}