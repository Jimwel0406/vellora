import { Sparkles } from "lucide-react";

const OFFER = {
  headline: "Get $3 Cashback! Min Order of $30",
  code: "CASH3",
};

export function PromoOfferBanner() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pb-10 lg:pb-16">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] text-white px-8 sm:px-12 lg:px-16 py-8 sm:py-10">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        {/* Content */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-medium tracking-tight">
              {OFFER.headline}
            </p>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Use Code</span>
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-sm font-bold tracking-[0.15em] uppercase border border-white/20">
              {OFFER.code}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
