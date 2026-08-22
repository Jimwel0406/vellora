import { Apple, Citrus, Cherry, Grape } from "lucide-react";

const OFFER = {
  headline: "Get $3 Cashback! Min Order of $30",
  code: "CASH3",
};

export function PromoOfferBanner() {
  return (
    <section data-section="promo-offer-banner" className="section-promo-offer-banner max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-8 pb-8 lg:pb-14">
      <div className="relative block overflow-hidden rounded-2xl bg-[#0E8A76] text-white px-6 sm:px-12 lg:px-16 py-7 sm:py-8">
        {/* Decorative fruit — partially cropped at the edges */}
        <span className="absolute -left-6 -top-8 opacity-90">
          <Apple className="w-20 h-20 sm:w-24 sm:h-24 text-white/20" strokeWidth={1.2} />
        </span>
        <span className="absolute -right-4 -bottom-10 opacity-90">
          <Citrus className="w-24 h-24 sm:w-28 sm:h-28 text-white/20" strokeWidth={1.2} />
        </span>
        <span className="absolute left-1/2 -top-9 -translate-x-1/2 opacity-60">
          <Cherry className="w-16 h-16 text-white/15" strokeWidth={1.2} />
        </span>
        <span className="absolute -left-8 bottom-0 opacity-70">
          <Grape className="w-16 h-16 sm:w-20 sm:h-20 text-white/20" strokeWidth={1.2} />
        </span>

        {/* Center content */}
        <div className="relative text-center">
          <p className="text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight leading-tight">
            {OFFER.headline}
          </p>
          <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-white/75 tracking-wide">
            Use Code:{" "}
            <span className="font-bold text-white tracking-[0.2em] uppercase">
              {OFFER.code}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}