"use client";

import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";

const HERO_IMAGE = "/hero-curation.jpg";

export function Hero() {
  return (
    <section data-section="home-hero" className="section-home-hero bg-[#FAF7EF] border-b border-clay/5">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-12 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: content */}
          <div className="max-w-xl">
            <p className="animate-hero-1 text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-clay/70 flex items-center gap-2.5">
              <span className="grid place-items-center w-7 h-7 rounded-full border border-clay/25">
                <Leaf className="w-3.5 h-3.5 text-terracotta" />
              </span>
              Shop more, live better
            </p>

            <h1 className="animate-hero-2 mt-4 sm:mt-5 font-serif font-bold text-[40px] sm:text-5xl lg:text-6xl xl:text-[64px] leading-[1.02] text-clay tracking-tight">
              Your Favorite
              <br />
              Products,
              <br />
              Delivered to You.
            </h1>

            <p className="animate-hero-3 mt-5 sm:mt-6 text-[15px] sm:text-base text-clay/65 leading-relaxed max-w-md">
              Discover top-quality products, special offers and everything you
              need in one place.
            </p>

            <div className="animate-hero-4 mt-7 sm:mt-8">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2.5 h-[52px] px-7 rounded-lg bg-clay text-white text-sm font-bold uppercase tracking-[0.15em] hover:bg-terracotta transition-colors duration-200"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right: media */}
          <div className="animate-hero-5 relative">
            <div className="relative w-full lg:-ml-10 aspect-[4/3.2] sm:aspect-[16/11] lg:aspect-auto lg:h-[560px] overflow-hidden [border-radius:46%_0_0_46%/92%_0_0_92%]">
              <img
                src={HERO_IMAGE}
                alt="Curated products delivered to you"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}