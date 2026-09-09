import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function WhyVellora({
  productCount,
  storeCount,
  categoryCount,
}: {
  productCount: number;
  storeCount: number;
  categoryCount: number;
}) {
  return (
    <section
      data-section="why-vellora"
      className="section-why-vellora max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-16 lg:pt-24 pb-24 lg:pb-32"
    >
      {/* Editorial layout: text + image asymmetric */}
      <div className="flex flex-col lg:grid lg:grid-cols-[0.38fr_0.62fr] gap-10 lg:gap-16 items-start">

        {/* ── Left: Editorial text composition ── */}
        <div className="flex flex-col">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-[2.5px] bg-terracotta rounded-full" />
            <span className="text-2xl font-bold uppercase tracking-[0.3em] text-terracotta font-label">
              Why Vellora
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-heading text-[40px] sm:text-[48px] lg:text-[56px] text-clay leading-[1.05] tracking-tight">
            Curated quality,
            <br />
            chosen for you
          </h2>

          {/* Editorial rule */}
          <div className="mt-8 lg:mt-10 h-px bg-clay/10" />

          {/* Oversized stat — the visual anchor */}
          <div className="mt-8 lg:mt-10 flex items-baseline gap-4">
            <span className="font-heading text-[72px] sm:text-[88px] lg:text-[100px] font-bold text-clay leading-none tracking-tight">
              {categoryCount}+
            </span>
            <span className="font-label text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-clay/50 max-w-[120px] leading-snug">
              categories to explore
            </span>
          </div>

          {/* Trust details — editorial, not cards */}
          <div className="mt-8 lg:mt-10 flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
              <div>
                <p className="font-heading text-lg font-semibold text-clay">
                  {productCount.toLocaleString()}+ products
                </p>
                <p className="text-sm text-clay/50 mt-0.5 leading-relaxed">
                  Hand-picked across every category, updated weekly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
              <div>
                <p className="font-heading text-lg font-semibold text-clay">
                  {storeCount} verified sellers
                </p>
                <p className="text-sm text-clay/50 mt-0.5 leading-relaxed">
                  Each store is vetted before it can list on Vellora.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
              <div>
                <p className="font-heading text-lg font-semibold text-clay">
                  Zero hidden markups
                </p>
                <p className="text-sm text-clay/50 mt-0.5 leading-relaxed">
                  Stores keep the value they build — fair pricing always.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/stores"
            className="group mt-10 inline-flex items-center gap-2 bg-clay hover:bg-terracotta text-white text-sm font-semibold font-heading uppercase tracking-wider px-7 py-4 rounded-xl transition-colors duration-200 w-fit min-h-[48px]"
          >
            Meet our stores
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── Right: Dominant editorial image ── */}
        <div className="relative lg:-mt-8">
          {/* Image — immersive, breaks into header space on desktop */}
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
            <img
              src="/why-curated.jpg"
              alt="Diverse customers enjoying quality curated products chosen for them"
              className="w-full h-[320px] sm:h-[400px] lg:h-[520px] object-cover"
            />
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>

          {/* Floating editorial detail — overlaps image bottom */}
          <div className="hidden lg:flex absolute -bottom-6 left-8 items-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 shadow-[0_2px_12px_rgba(61,43,31,0.08)]">
            <span className="font-heading text-2xl font-bold text-clay">4.8</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase font-label tracking-[0.12em] text-clay/60">
                Average rating
              </span>
              <span className="text-xs text-clay/50">
                across all stores
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
