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
      className="section-why-vellora max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28"
    >
      <div className="flex flex-col lg:grid lg:grid-cols-[0.36fr_0.64fr] gap-10 lg:gap-16 items-start">

        {/* ── Left: Editorial text composition ── */}
        <div className="flex flex-col">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <span className="w-8 h-[2px] bg-terracotta rounded-full" />
            <span className="text-[11px] sm:text-[12px] lg:text-[13px] font-semibold uppercase tracking-[0.25em] text-terracotta font-label">
              Why Vellora
            </span>
          </div>

          {/* Heading — editorial display */}
          <h2 className="text-[36px] sm:text-[44px] lg:text-[52px] font-heading font-semibold leading-[1.0] tracking-[-0.02em] text-clay">
            Curated quality.
            <br />
            Chosen for you.
          </h2>

          {/* 5+ statistic — editorial anchor */}
          <div className="mt-10 lg:mt-12 flex items-baseline gap-4">
            <span className="text-[68px] sm:text-[80px] lg:text-[90px] font-heading font-bold text-clay leading-[0.9] tracking-[-0.03em]">
              {categoryCount}+
            </span>
            <span className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.22em] font-label text-clay leading-snug max-w-[100px]">
              Categories
              <br />
              to explore
            </span>
          </div>

          {/* Trust details — numbered editorial list */}
          <div className="mt-8 lg:mt-10 flex flex-col gap-5">
            <div>
              <p className="text-[15px] sm:text-[16px] font-semibold text-clay">
                {productCount.toLocaleString()}+ products
              </p>
              <p className="text-[13px] sm:text-[14px] text-clay/65 mt-0.5 leading-relaxed">
                Hand-picked across every category, updated weekly.
              </p>
            </div>
            <div>
              <p className="text-[15px] sm:text-[16px] font-semibold text-clay">
                {storeCount} verified sellers
              </p>
              <p className="text-[13px] sm:text-[14px] text-clay/65 mt-0.5 leading-relaxed">
                Each store is vetted before it can list on Vellora.
              </p>
            </div>
            <div>
              <p className="text-[15px] sm:text-[16px] font-semibold text-clay">
                Zero hidden markups
              </p>
              <p className="text-[13px] sm:text-[14px] text-clay/65 mt-0.5 leading-relaxed">
                Stores keep the value they build — fair pricing always.
              </p>
            </div>
          </div>

          {/* CTA — compact, restrained */}
          <Link
            href="/stores"
            className="group mt-10 lg:mt-12 inline-flex items-center gap-2 bg-clay hover:bg-terracotta text-sand text-[12px] font-bold uppercase tracking-[0.12em] px-5 py-3 rounded-lg transition-colors duration-200 w-fit min-h-[44px]"
          >
            Meet our stores
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ── Right: Dominant editorial image ── */}
        <div className="relative lg:-mt-8">
          <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[28px]">
            <img
              src="/why-curated.jpg"
              alt="Diverse customers enjoying quality curated products chosen for them"
              className="w-full h-[320px] sm:h-[400px] lg:h-[540px] object-cover"
              loading="lazy"
              width="1080"
              height="540"
            />
          </div>

          {/* Rating badge — editorial caption style, lower-left overlap */}
          <div className="hidden lg:flex absolute -bottom-5 left-8 items-center gap-3 bg-white rounded-md px-4 py-2.5 shadow-[0_1px_6px_rgba(61,43,31,0.06)]">
            <span className="text-[20px] font-heading font-bold text-clay leading-none">4.8</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase font-label tracking-[0.15em] text-clay">
                Average Rating
              </span>
              <span className="text-[10px] text-clay/70">
                across all stores
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
