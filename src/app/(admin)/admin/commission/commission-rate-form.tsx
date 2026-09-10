"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { fieldInput, fieldLabel, primaryButton } from "@/components/shared/dashboard-ui";

export function CommissionRateForm({ initialRate }: { initialRate: number }) {
  const router = useRouter();
  const [rate, setRate] = useState(String(initialRate));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commissionRatePct: parseFloat(rate) }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      return;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="rate" className={fieldLabel}>
          Commission rate (%)
        </label>
        <div className="flex items-center gap-2">
          <input
            id="rate"
            type="number"
            min="0"
            max="50"
            step="0.5"
            required
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className={`${fieldInput} max-w-[160px]`}
          />
          <span className="text-sm text-clay">%</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="flex items-center gap-2 text-sm text-emerald-600">
          <Check className="w-4 h-4" />
          Rate saved — applied to new orders.
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className={primaryButton}
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save rate"
        )}
      </button>
    </form>
  );
}