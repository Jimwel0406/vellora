"use client";

import { useState, useTransition } from "react";

export function StoreStatusToggle({
  storeId,
  storeName,
  active,
}: {
  storeId: number;
  storeName: string;
  active: boolean;
}) {
  const [isActive, setIsActive] = useState(active);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !isActive;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/stores/${storeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not update store status.");
        return;
      }
      setIsActive(next);
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={isActive}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors disabled:opacity-60 ${
          isActive
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-red-100 text-red-700 hover:bg-red-200"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isActive ? "bg-green-600" : "bg-red-500"
          }`}
          aria-hidden
        />
        {isActive ? "Active" : "Disabled"}
      </button>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className="text-[11px] font-semibold text-clay underline underline-offset-2 hover:text-clay transition-colors disabled:opacity-50"
      >
        {pending ? "Updating…" : isActive ? "Disable" : "Enable"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
      <span className="sr-only">
        Toggle store {storeName} {isActive ? "off" : "on"}
      </span>
    </div>
  );
}