"use client";

import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const PRIMARY = {
  quote:
    "Amazing quality, fast delivery and excellent customer service. Vellora is my go-to store for everything!",
  author: "Jessica M.",
  role: "Repeat Customer",
  location: "Portland, OR",
};

const SUPPORTING = [
  {
    quote:
      "Bought a gift from one store and extras from another — everything arrived in one box. Genius multi-vendor checkout.",
    author: "Marcus T.",
    role: "Gift Buyer",
  },
  {
    quote:
      "Beautifully packaged, exactly as pictured, and shipped quicker than expected. Will definitely shop here again.",
    author: "Priya S.",
    role: "Home Decor Lover",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className="w-4 h-4 text-rating fill-rating" />
      ))}
    </div>
  );
}

export function TestimonialsVariationB() {
  return (
    <section data-section="testimonials" className="section-testimonials h-full">
      <div className="bg-[#FAF7EF] border border-clay/8 rounded-3xl h-full overflow-hidden relative">
        {/* Subtle warm accent blob */}
        <span
          className="absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full bg-terracotta/[0.03] pointer-events-none"
          aria-hidden="true"
        />

        <div className="p-6 sm:p-8 lg:p-12 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <p className="text-lg font-bold uppercase font-label tracking-[0.3em] text-terracotta">
                Customer Love
              </p>
              <h3 className="font-heading text-4xl lg:text-5xl text-clay tracking-tight leading-tight mt-3">
                What People Say
              </h3>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-clay text-sand text-xs font-bold uppercase tracking-[0.15em] hover:bg-terracotta transition-colors group"
            >
              All Reviews
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Editorial layout */}
          <div className="flex-1 flex flex-col gap-8 lg:gap-0">
            {/* Primary testimonial — the hero */}
            <div className="relative lg:pr-[45%]">
              {/* Oversized typographic quotation mark */}
              <span
                className="block text-[120px] sm:text-[160px] lg:text-[200px] font-serif leading-none text-terracotta/[0.08] select-none -mb-10 sm:-mb-14 lg:-mb-20"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <blockquote className="relative">
                <p className="font-heading text-2xl sm:text-3xl lg:text-[2rem] text-clay leading-snug tracking-tight font-medium">
                  {PRIMARY.quote}
                </p>
              </blockquote>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-terracotta/[0.08] flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-terracotta">
                      {PRIMARY.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-clay">{PRIMARY.author}</p>
                    <p className="text-xs font-semibold text-clay/60 font-label uppercase tracking-wider">
                      {PRIMARY.role}
                    </p>
                  </div>
                </div>
                <span className="hidden sm:block w-px h-5 bg-clay/10" aria-hidden="true" />
                <Stars />
              </div>

              {/* Editorial rule below primary */}
              <div className="mt-8 sm:mt-10 border-t border-clay/8" />
            </div>

            {/* Supporting testimonials — asymmetric editorial layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-12 lg:pt-8">
              {/* Left supporting — offset inward */}
              <div className="lg:pl-4">
                <div className="border-l-2 border-terracotta/20 pl-5 sm:pl-6">
                  <p className="text-base sm:text-lg text-clay/75 leading-relaxed font-medium italic">
                    &ldquo;{SUPPORTING[0].quote}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-clay/[0.06] flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-clay">
                        {SUPPORTING[0].author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-clay">{SUPPORTING[0].author}</p>
                      <p className="text-[11px] font-semibold text-clay font-label uppercase tracking-wider">
                        {SUPPORTING[0].role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right supporting — pushed right, top-aligned */}
              <div className="sm:mt-6 lg:mt-0 lg:pr-4">
                <div className="border-l-2 border-clay/10 pl-5 sm:pl-6">
                  <p className="text-base sm:text-lg text-clay/75 leading-relaxed font-medium italic">
                    &ldquo;{SUPPORTING[1].quote}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-clay/[0.06] flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-clay">
                        {SUPPORTING[1].author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-clay">{SUPPORTING[1].author}</p>
                      <p className="text-[11px] font-semibold text-clay font-label uppercase tracking-wider">
                        {SUPPORTING[1].role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile CTA */}
          <Link
            href="/products"
            className="sm:hidden mt-8 inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-clay text-sand text-xs font-bold uppercase tracking-[0.15em] hover:bg-terracotta transition-colors group w-fit"
          >
            All Reviews
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
