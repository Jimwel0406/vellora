import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeatureStats } from "./why-vellora-features";

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
      className="section-why-vellora max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 lg:pt-24 pb-24 lg:pb-32"
    >
      {/* Header */}
      <div className="mb-8 lg:mb-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2.5px] bg-terracotta rounded-full" />
            <span className="text-2xl font-bold uppercase tracking-[0.3em] text-terracotta font-label">
              Why Vellora
            </span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-[56px] text-clay leading-[1.05]">
            Curated quality,
            <br />
            chosen for you
          </h2>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-clay/10" />

      {/* Content: Features + Image */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 mt-8 lg:mt-12 items-start">
        <div className="flex flex-col gap-5">
          <FeatureStats productCount={productCount} />

          <div className="flex items-center gap-4 flex-wrap mt-4">
            <Link
              href="/stores"
              className="group inline-flex items-center gap-2 bg-clay hover:bg-terracotta text-white text-sm font-semibold font-heading uppercase tracking-wider px-7 py-4 rounded-xl transition-colors duration-200 min-h-[48px]"
            >
              Meet our stores
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <span className="text-lg text-clay-mute font-semibold">
              {categoryCount} categories to explore
            </span>
          </div>
        </div>

        <div className="hidden lg:block relative rounded-2xl overflow-hidden">
          <img
            src="/why-curated.jpg"
            alt="Diverse customers enjoying quality curated products chosen for them"
            className="w-full h-[400px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
