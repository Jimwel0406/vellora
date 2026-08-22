"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Amazing quality, fast delivery and excellent customer service. Vellora is my go-to store for everything!",
    author: "Jessica M.",
  },
  {
    quote:
      "Bought a gift from one store and extras from another — everything arrived in one box. Genius multi-vendor checkout.",
    author: "Marcus T.",
  },
  {
    quote:
      "Beautifully packaged, exactly as pictured, and shipped quicker than expected. Will definitely shop here again.",
    author: "Priya S.",
  },
  {
    quote:
      "The curation is spot on. I found unique pieces here I couldn't find anywhere else on the web.",
    author: "Daniel R.",
  },
  {
    quote:
      "Support answered my questions the same day. Shopping small but with big-store reliability.",
    author: "Amelia K.",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function go(delta: number) {
    setActive((prev) => (prev + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      go(delta < 0 ? 1 : -1);
    }
    touchStartX.current = null;
  }

  const current = TESTIMONIALS[active];

  return (
    <section data-section="testimonials" className="section-testimonials max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-16">
      <div className="max-w-[720px] mx-auto">
        <div className="bg-[#FAF7EF] border border-clay/10 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[5fr_8fr_5fr]">
          {/* LEFT: intro panel */}
          <div className="p-6 lg:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-clay/10">
            <p className="text-[10px] font-bold uppercase font-label tracking-[0.3em] text-terracotta">
              Customer Love
            </p>
            <h3 className="font-serif italic text-2xl lg:text-[28px] text-clay tracking-tight leading-tight mt-3">
              Trusted by
              <br />
              Thousands
            </h3>
            <p className="text-sm text-clay/60 leading-relaxed mt-3">
              We&apos;re proud to deliver quality products and great service loved by our customers.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex items-center justify-center h-9 px-5 rounded-md bg-clay text-sand text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-terracotta transition-colors w-fit"
            >
              Read More Reviews
            </Link>
          </div>

          {/* CENTER: active testimonial */}
          <div
            className="relative p-6 lg:p-8 flex flex-col justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Quote className="w-8 h-8 text-terracotta/30" />
            <div className="flex items-center gap-0.5 mt-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 text-ochre fill-ochre" />
              ))}
            </div>
            <p className="mt-4 text-[15px] lg:text-base text-[#17201C]/80 leading-relaxed font-medium">
              &ldquo;{current.quote}&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold text-clay">&mdash; {current.author}</p>

            {/* controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous review"
                  onClick={() => go(-1)}
                  className="w-8 h-8 rounded-full border border-clay/15 text-clay/60 hover:text-terracotta hover:border-terracotta/40 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next review"
                  onClick={() => go(1)}
                  className="w-8 h-8 rounded-full border border-clay/15 text-clay/60 hover:text-terracotta hover:border-terracotta/40 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to review ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === active ? "w-5 bg-clay" : "w-1.5 bg-clay/20 hover:bg-clay/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: customer image */}
          <div className="hidden md:block relative min-h-[280px]">
            <img
              src="/cart-unboxing.jpg"
              alt="Happy customer"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}