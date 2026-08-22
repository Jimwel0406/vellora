import { Gift } from "lucide-react";

const PROMO = {
  eyebrow: "Exclusive Offer",
  headline: "Get 15% Off",
  subtext: "On your next order",
  code: "WELCOME15",
};

export function PromotionalBanner() {
  return (
    <section data-section="promo-banner" className="section-promo-banner max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
      <div className="relative overflow-hidden rounded-2xl bg-clay text-sand px-6 sm:px-10 lg:px-12 py-6 lg:py-8 flex flex-col sm:flex-row items-center gap-5 lg:gap-8">
        <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-terracotta/40 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-24 w-56 h-56 rounded-full bg-ochre/20 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 sm:gap-5 relative">
          <span className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-terracotta flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          </span>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase font-label tracking-[0.25em] text-ochre">
              {PROMO.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none mt-1">
              {PROMO.headline}
            </h2>
            <p className="text-xs sm:text-sm text-sand/70 mt-1">{PROMO.subtext}</p>
          </div>
        </div>

        <div className="relative sm:ml-auto flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5">
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase font-label tracking-[0.2em] text-sand/60">
              Use Code
            </p>
            <p className="text-base sm:text-lg font-black tracking-[0.25em]">{PROMO.code}</p>
          </div>
        </div>
      </div>
    </section>
  );
}