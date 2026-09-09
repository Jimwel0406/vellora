"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Tag } from "lucide-react";

const PROMO = {
  eyebrow: "Limited Time",
  headline: "Welcome Offer",
  subtext:
    "New to Vellora? Enjoy 15% off your first order across all curated collections.",
  code: "WELCOME15",
  productImage: "/promo-bg.jpg",
  productAlt: "Leather wallet — 15% off your first order at Vellora",
};

const DISMISS_KEY = "vellora-promo-dismissed";
const DISMISS_TIME_KEY = "vellora-promo-dismissed-at";
const HIDE_FLOATING_KEY = "vellora-floating-hidden";
const RE_SHOW_MS = 5 * 60 * 1000; // re-show after 5 minutes

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [floatingDismissed, setFloatingDismissed] = useState(false);
  const shownRef = useRef(false);

  // Mount state
  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(HIDE_FLOATING_KEY)) {
        setFloatingDismissed(true);
      }
    } catch {}
  }, []);

  // Initial show after delay
  useEffect(() => {
    if (!mounted || shownRef.current) return;

    const timer = setTimeout(() => {
      if (shouldShow()) {
        setOpen(true);
        shownRef.current = true;
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [mounted]);

  // Exit intent — mouse leaves viewport from top
  useEffect(() => {
    if (!mounted) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0 && !open && shouldShow()) {
        setOpen(true);
        shownRef.current = true;
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [mounted, open]);

  // Re-show timer — checks every 30s if enough time has passed
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      if (shownRef.current || open || floatingDismissed) return;

      try {
        const dismissedAt = localStorage.getItem(DISMISS_TIME_KEY);
        if (dismissedAt) {
          const elapsed = Date.now() - Number(dismissedAt);
          if (elapsed >= RE_SHOW_MS) {
            setOpen(true);
            shownRef.current = true;
            setShowFloating(false);
          }
        }
      } catch {
        // ignore
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [mounted, open, floatingDismissed]);

  function shouldShow(): boolean {
    try {
      const dismissedAt = localStorage.getItem(DISMISS_TIME_KEY);
      if (!dismissedAt) return true;
      const elapsed = Date.now() - Number(dismissedAt);
      return elapsed >= RE_SHOW_MS;
    } catch {
      return true;
    }
  }

  const dismiss = useCallback(() => {
    setOpen(false);
    shownRef.current = false;
    setShowFloating(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
      localStorage.setItem(DISMISS_TIME_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  }, []);

  const reopen = useCallback(() => {
    setOpen(true);
    setShowFloating(false);
  }, []);

  const hideFloating = useCallback(() => {
    setFloatingDismissed(true);
    setShowFloating(false);
    try {
      localStorage.setItem(HIDE_FLOATING_KEY, "1");
    } catch {}
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* ── Floating trigger button ── */}
      {showFloating && !floatingDismissed && !open && (
        <button
          onClick={reopen}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 h-12 pl-4 pr-3 rounded-full bg-terracotta text-white shadow-[0_8px_32px_rgba(166,99,75,0.45)] hover:bg-terracotta-deep hover:shadow-[0_8px_40px_rgba(166,99,75,0.6)] hover:scale-105 transition-all duration-200 cursor-pointer group"
          aria-label="View welcome offer"
        >
          <Tag className="w-5 h-5" />
          <span className="font-label text-xs font-bold uppercase tracking-[0.1em]">
            15% Off
          </span>
          {/* Small X to dismiss the floating button */}
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              hideFloating();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                hideFloating();
              }
            }}
            className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white/60 hover:bg-white/25 hover:text-white transition-colors cursor-pointer"
            aria-label="Hide offer"
          >
            <X className="w-3 h-3" />
          </span>
        </button>
      )}

      {/* ── Popup dialog ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            role="dialog"
            aria-label="Welcome offer"
            className="relative w-full max-w-[640px] overflow-hidden rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Full bleed image background */}
            <div className="relative min-h-[520px] sm:min-h-[560px] flex flex-col justify-end">
              {PROMO.productImage ? (
                <img
                  src={PROMO.productImage}
                  alt={PROMO.productAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                  width="800"
                  height="600"
                />
              ) : (
                <div className="absolute inset-0 bg-clay" />
              )}

              {/* Gradient scrim — weighted to bottom for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-clay via-clay/75 to-clay/10" />

              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Ghost numeral — editorial decorative element */}
              <span
                className="absolute top-6 left-7 font-heading font-bold text-[140px] sm:text-[180px] leading-none text-transparent select-none pointer-events-none"
                style={{
                  WebkitTextStroke: "2px rgba(255,255,255,0.06)",
                }}
                aria-hidden="true"
              >
                15%
              </span>

              {/* Content overlaid at bottom */}
              <div className="relative z-[2] p-8 sm:p-10">
                {/* Eyebrow — accent rule + text, no dot */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-[2.5px] bg-terracotta rounded-full" />
                  <span className="font-label text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">
                    {PROMO.eyebrow}
                  </span>
                </div>

                <h2 className="font-heading text-[42px] sm:text-[48px] text-white leading-[1.05]">
                  {PROMO.headline}
                </h2>

                <p className="mt-3 text-[15px] sm:text-base text-white/50 leading-relaxed max-w-[380px]">
                  {PROMO.subtext}
                </p>

                {/* Code pill + CTA row */}
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg border border-white/10 bg-white/5">
                    <span className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Use Code
                    </span>
                    <span className="font-label text-[14px] font-bold tracking-[0.2em] text-white">
                      {PROMO.code}
                    </span>
                  </div>
                  <a
                    href="/products"
                    className="inline-flex items-center justify-center px-7 py-3 bg-terracotta text-white font-label text-sm font-bold uppercase tracking-[0.14em] rounded-lg hover:bg-terracotta-deep transition-colors min-h-[44px]"
                  >
                    Shop Now
                  </a>
                </div>

                {/* Dismiss */}
                <button
                  onClick={dismiss}
                  className="block mt-4 text-[11px] text-white/25 hover:text-white/50 transition-colors bg-transparent border-none cursor-pointer font-inherit"
                >
                  No thanks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
