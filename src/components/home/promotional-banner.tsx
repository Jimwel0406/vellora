// -- Promo Banner --
const PROMO = {
  eyebrow: "Limited Time",
  headline: "Welcome Offer",
  subtext:
    "New to Vellora? Enjoy 15% off your first order across all curated collections.",
  code: "WELCOME15",
  productImage: "/products/200-leather-bifold-wallet-1.jpg",
  productAlt:
    "Leather wallet — 15% off your first order at Vellora",
};

export function PromotionalBanner() {
  return (
    <section
      data-section="promo-banner"
      className="section-promo-banner max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8"
    >
      <div className="relative overflow-hidden rounded-2xl bg-clay text-sand min-h-[280px] lg:min-h-[320px] flex items-center">
        {/* Ghost numeral — decorative, oversized */}
        <div
          className="absolute -right-6 lg:right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
          aria-hidden="true"
        >
          <span
            className="font-heading font-extrabold text-[200px] lg:text-[300px] leading-none text-transparent"
            style={{
              WebkitTextStroke: "1.5px rgba(242,232,207,0.10)",
            }}
          >
            15%
          </span>
        </div>

        {/* Content grid */}
        <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-6 lg:gap-8 py-10 lg:py-12 px-6 sm:px-10 lg:px-14">
          {/* Left — text */}
          <div className="flex flex-col gap-3 max-w-lg">
            {/* Eyebrow slash */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-[3px] bg-terracotta rounded-full" />
              <p className="font-label text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-terracotta">
                {PROMO.eyebrow}
              </p>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[44px] text-sand leading-[1.08] tracking-tight">
              {PROMO.headline}
            </h2>

            <p className="text-sand/55 text-sm sm:text-[15px] max-w-sm leading-relaxed">
              {PROMO.subtext}
            </p>

            {/* Code pill + CTA */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="inline-flex items-center gap-2.5 rounded-lg border border-sand/15 bg-sand/[0.04] px-4 py-2">
                <span className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-sand/40">
                  Use Code
                </span>
                <span className="font-label text-[13px] font-bold tracking-[0.25em] text-sand">
                  {PROMO.code}
                </span>
              </div>
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-terracotta text-white font-label text-[11px] font-bold uppercase tracking-[0.12em] px-6 py-2.5 hover:bg-rust-dark transition-colors min-h-[44px]"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* Right — offset product crop */}
          <div className="hidden sm:block relative">
            <div className="w-[170px] lg:w-[200px] h-[210px] lg:h-[250px] rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
              <img
                src={PROMO.productImage}
                alt={PROMO.productAlt}
                className="w-full h-full object-cover object-center"
                width={200}
                height={250}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
