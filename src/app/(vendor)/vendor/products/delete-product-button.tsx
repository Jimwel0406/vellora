"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function DeleteProductButton({ productId }: { productId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    setError("");

    const res = await fetch(`/api/products`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg border border-clay/15 text-clay/60 text-[10px] font-bold uppercase tracking-wider hover:text-red-700 hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
        {loading ? "Deleting..." : "Delete"}
      </button>
      {error && <p className="text-[10px] text-red-700">{error}</p>}
    </div>
  );
}