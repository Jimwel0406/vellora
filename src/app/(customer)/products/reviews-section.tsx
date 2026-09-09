"use client";

const REVIEWS = [
  {
    name: "Sarah M.",
    location: "New York",
    text: "The quality exceeded my expectations. Everything arrived beautifully packaged and faster than expected.",
  },
  {
    name: "James L.",
    location: "Los Angeles",
    text: "Finally a marketplace that curates actually good products. No more scrolling through junk.",
  },
  {
    name: "Emily R.",
    location: "Chicago",
    text: "I've ordered three times now and each experience has been flawless. The sellers here truly care.",
  },
  {
    name: "Michael T.",
    location: "Austin",
    text: "Fast shipping, great prices, and the product quality is unmatched. Will definitely order again.",
  },
  {
    name: "Jessica K.",
    location: "Seattle",
    text: "Love supporting small businesses through this platform. Every purchase feels meaningful.",
  },
  {
    name: "David H.",
    location: "Denver",
    text: "The attention to detail in every product is remarkable. You can tell these are curated with care.",
  },
];

const PRIMARY = REVIEWS[0];
const SUPPORTING = REVIEWS.slice(1, 4);

export function ReviewsSection() {
  return (
    <section
      data-section="products-reviews"
      className="section-products-reviews"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 pb-10 lg:pt-16 lg:pb-20">
        {/* Editorial layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-[0.38fr_0.62fr] gap-10 lg:gap-20">
          {/* Left: Heading + primary testimonial */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2.5px] bg-terracotta rounded-full" />
              <span className="text-2xl font-bold uppercase tracking-[0.3em] text-terracotta font-label">
                Voices
              </span>
            </div>

            <h2 className="font-heading text-[40px] sm:text-[48px] lg:text-[56px] text-clay leading-[1.05] tracking-tight">
              What People
              <br />
              Say
            </h2>

            {/* Oversized quotation mark */}
            <span
              className="block text-[100px] sm:text-[120px] lg:text-[140px] font-black leading-none text-terracotta/[0.07] select-none -mb-6 sm:-mb-8 lg:-mb-10 mt-4"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            {/* Primary quote */}
            <blockquote>
              <p className="font-heading text-xl sm:text-2xl lg:text-[1.65rem] text-clay leading-snug tracking-tight font-medium">
                {PRIMARY.text}
              </p>
            </blockquote>

            <div className="mt-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-terracotta/[0.08] flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-terracotta">
                  {PRIMARY.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-base font-semibold text-clay">
                  {PRIMARY.name}
                </p>
                <p className="text-xs font-semibold text-clay/50 font-label uppercase tracking-wider">
                  {PRIMARY.location}
                </p>
              </div>
            </div>

            {/* Editorial rule */}
            <div className="mt-8 lg:mt-10 h-px bg-clay/8" />
          </div>

          {/* Right: Supporting testimonials */}
          <div className="flex flex-col gap-0">
            {SUPPORTING.map((review, i) => (
              <div key={i} className="border-t border-clay/8 py-6 sm:py-7">
                <div className="flex items-start gap-4">
                  <span className="font-label text-xs font-semibold uppercase tracking-[0.15em] text-clay/50 mt-1 shrink-0 w-6">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p className="text-base sm:text-lg text-clay/70 leading-relaxed font-medium italic">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <div className="mt-4 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-clay/[0.06] flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-clay">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-clay">
                          {review.name}
                        </p>
                        <p className="text-[11px] font-semibold text-clay/60 font-label uppercase tracking-wider">
                          {review.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-clay/8" />
          </div>
        </div>
      </div>
    </section>
  );
}
