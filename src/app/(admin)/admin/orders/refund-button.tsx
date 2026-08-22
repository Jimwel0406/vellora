"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { outlineButton } from "@/components/shared/dashboard-ui";

export function RefundButton({ orderId }: { orderId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleRefund() {
    if (!confirm(`Refund order #${orderId}?`)) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Refund failed");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={handleRefund}
        disabled={busy}
        className={`${outlineButton} h-9 px-4 text-[10px]`}
      >
        {busy ? "Refunding…" : "Refund"}
      </button>
      {error && <span className="text-[11px] text-red-600">{error}</span>}
    </div>
  );
}