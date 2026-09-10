"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";

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
    <>
      {/* Divider */}
      <div className="h-px bg-clay/8" />

      <div className="pt-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label mb-3">
          Delete Account
        </p>
        <p className="text-[13px] text-clay/50 mb-6 max-w-md leading-relaxed">
          Permanently delete your account, orders, wishlist, and reviews. This cannot be undone.
        </p>

        <div className="flex flex-col items-start gap-2">
          {confirming ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={deleteAccount}
                disabled={pending}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.15em] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {pending ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={pending}
                className="inline-flex items-center gap-2 border border-clay/15 text-clay/60 hover:text-clay px-6 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.15em] transition-colors disabled:opacity-60 cursor-pointer"
              >
                Keep Account
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-2 border border-red-200 text-red-600/80 hover:text-red-600 hover:border-red-300 px-6 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.15em] transition-colors cursor-pointer"
            >
              Delete Account
            </button>
          )}
          {error && <span className="text-[12px] text-red-500">{error}</span>}
        </div>
      </div>
    </>
  );
}
