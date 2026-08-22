"use client";

export function ScrollToTop({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`transition-colors flex items-center gap-3 group ${className}`}
    >
      Back to Top
      <span className="group-hover:-translate-y-1 transition-transform">&uarr;</span>
    </button>
  );
}
