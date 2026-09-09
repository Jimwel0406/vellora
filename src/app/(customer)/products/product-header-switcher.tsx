import { ShoppingBag } from "lucide-react";

function EditorialCircle() {
  return (
    <div className="relative w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[320px] lg:h-[320px] shrink-0">
      {/* Circular image */}
      <div className="w-[68%] aspect-square rounded-full overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <img
          src="/editorial-circle.jpg"
          alt="Curated fashion accessory"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Curved text — true SVG textPath */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 320 320"
        aria-hidden="true"
      >
        <defs>
          <path
            id="productsCirclePath"
            d="M 160,160 m -130,0 a 130,130 0 1,1 260,0 a 130,130 0 1,1 -260,0"
          />
        </defs>
        <text
          className="fill-clay"
          fontSize="12.5"
          fontFamily="var(--font-label)"
          fontWeight="600"
          letterSpacing="4px"
        >
          <textPath href="#productsCirclePath" startOffset="0%">
            CURATED • INDEPENDENT • VELLORA • QUALITY • DISCOVER •
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export function ProductsHeaderSwitcher({
  query,
}: {
  query: string;
}) {
  return (
    <section
      data-section="products-header"
      className="section-products-header mb-0"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-20 lg:pt-28 pb-10 sm:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">
          {/* Left — editorial content */}
          <div className="max-w-[640px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2.5px] bg-terracotta rounded-full" />
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-terracotta font-label">
                {query ? "Search Results" : "Shop the Collection"}
              </p>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-[44px] sm:text-[56px] lg:text-[72px] xl:text-[88px] text-clay font-semibold tracking-[-0.025em] leading-[0.95]">
              {query ? (
                <>
                  Results for
                  <br />
                  &ldquo;{query}&rdquo;
                </>
              ) : (
                <>All Products</>
              )}
            </h1>

            {/* Description */}
            <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-clay/50 leading-relaxed max-w-md">
              Quality products from independent sellers you can trust.
            </p>
          </div>

          {/* Right — editorial circular element */}
          <div className="hidden lg:flex justify-end">
            <EditorialCircle />
          </div>
        </div>
      </div>
    </section>
  );
}
