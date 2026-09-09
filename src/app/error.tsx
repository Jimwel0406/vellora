"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand px-6">
      <div className="text-center max-w-md">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-terracotta font-label">
          Something went wrong
        </p>
        <h1 className="mt-4 text-3xl font-heading font-bold text-clay">
          Unexpected Error
        </h1>
        <p className="mt-3 text-sm text-clay/60 leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-flex items-center justify-center h-12 px-8 rounded-lg bg-terracotta text-sand text-xs font-bold uppercase tracking-[0.15em] hover:bg-rust-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
