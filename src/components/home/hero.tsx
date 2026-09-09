"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE = "/hero-collection.jpg";

export function Hero() {
  return (
    <section data-section="home-hero" className="section-home-hero relative overflow-hidden bg-[#100e0b]">
      {/* Hero media */}
      <img
        src={HERO_IMAGE}
        alt="A considered flat lay of warm home objects and everyday essentials"
        className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
        width={1248}
        height={832}
      />

      {/* Readability scrim, weighted toward the content corner */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/10"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-screen items-center">
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-12 pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-3xl">
            <p className="animate-hero-1 inline-flex items-center gap-3 text-base sm:text-lg font-label font-bold uppercase tracking-[0.3em] text-[#E9DCC5]">
              <span className="h-0.5 w-9 bg-terracotta" aria-hidden="true" />
              Shop more, live better
            </p>

            <h1 className="animate-hero-2 mt-5 font-heading font-semibold leading-[0.98] tracking-tight text-white text-[44px] sm:text-6xl lg:text-7xl xl:text-[96px]">
              Less noise,
              <span className="block text-terracotta">more craft.</span>
            </h1>

            <p className="animate-hero-3 mt-5 sm:mt-6 text-[15px] sm:text-lg text-white/80 leading-relaxed max-w-xl">
              A curated marketplace of independent vendors selling considered
              electronics, home objects, and everyday essentials — no filler,
              just quality.
            </p>

            <div className="animate-hero-4 mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2.5 h-[54px] px-8 rounded-lg bg-terracotta text-white text-sm font-bold uppercase tracking-[0.15em] hover:bg-terracotta/90 transition-colors duration-200"
              >
                Shop now
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/stores"
                className="inline-flex items-center justify-center h-[54px] px-8 rounded-lg border border-white/40 text-white text-sm font-bold uppercase tracking-[0.15em] hover:border-white hover:bg-white/10 transition-colors duration-200"
              >
                See how we pick
              </Link>
            </div>

            {/* Trust strip */}
            <dl className="animate-hero-5 mt-10 sm:mt-12 flex flex-wrap gap-y-6">
              <div className="px-4 sm:px-8 first:pl-0">
                <dt className="font-label text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/50">Returns</dt>
                <dd className="font-heading font-semibold text-base sm:text-lg lg:text-xl text-[#FBF6EC] mt-1.5">Free · 30 days</dd>
              </div>
              <div className="px-4 sm:px-8 border-l border-white/20">
                <dt className="font-label text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/50">Support</dt>
                <dd className="font-heading font-semibold text-base sm:text-lg lg:text-xl text-[#FBF6EC] mt-1.5">24/7</dd>
              </div>
              <div className="px-4 sm:px-8 border-l border-white/20 last:pr-0">
                <dt className="font-label text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/50">Quality</dt>
                <dd className="font-heading font-semibold text-base sm:text-lg lg:text-xl text-[#FBF6EC] mt-1.5">Guaranteed</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
