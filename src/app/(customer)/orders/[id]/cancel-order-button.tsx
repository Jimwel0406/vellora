"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function CancelOrderButton({ orderId }: { orderId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function cancel() {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not cancel order.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      {confirming ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cancel}
            disabled={pending}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {pending ? "Cancelling…" : "Confirm cancel"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={pending}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-clay/15 text-clay/70 text-[10px] font-bold uppercase tracking-wider hover:text-clay transition-colors disabled:opacity-60"
          >
            Keep order
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-clay/15 text-clay/70 text-[10px] font-bold uppercase tracking-wider hover:text-red-600 hover:border-red-300 transition-colors"
        >
          <X className="w-3 h-3" />
          Cancel order
        </button>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}