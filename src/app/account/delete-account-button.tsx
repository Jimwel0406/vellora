"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { Trash2 } from "lucide-react";

export function DeleteAccountButton() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function deleteAccount() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not delete account.");
        return;
      }
      await signOut({ callbackUrl: "/" });
    });
  }

  return (
    <div className="mt-10 border-t border-clay/10 pt-6">
      <h3 className="text-sm font-bold text-clay mb-1">Delete account</h3>
      <p className="text-xs text-clay/50 mb-4 max-w-md">
        Permanently delete your account, orders, wishlist, and reviews. This
        cannot be undone.
      </p>
      <div className="flex flex-col items-start gap-1.5">
        {confirming ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={deleteAccount}
              disabled={pending}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {pending ? "Deleting…" : "Confirm delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-clay/15 text-clay/70 text-[10px] font-bold uppercase tracking-wider hover:text-clay transition-colors disabled:opacity-60"
            >
              Keep account
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete account
          </button>
        )}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </div>
  );
}
