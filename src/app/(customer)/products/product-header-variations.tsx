import { Store, Sparkles, Truck, ArrowDown } from "lucide-react";

// ─── Variation B2: Dash line (current) ───────────────────────────────────────

export function ProductsHeaderB2({ query }: { query: string }) {
  return (
    <section data-section="products-header" className="section-products-header max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-20 sm:pt-24 lg:pt-32">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
          The Collection
        </p>
        <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl text-clay tracking-tight leading-[1.05] mt-3">
          {query ? (
            <>Results for &ldquo;{query}&rdquo;</>
          ) : (
            <>All Products</>
          )}
        </h1>
        <div className="mt-8 flex items-center gap-5">
          <span className="w-16 border-t-2 border-dashed border-clay/25" />
          <p className="text-lg lg:text-xl text-clay/70 leading-relaxed font-medium">
            Browse quality products from independent sellers, all in one place.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Variation B4: Pill + description in card ────────────────────────────────

export function ProductsHeaderB4({ query }: { query: string }) {
  return (
    <section data-section="products-header" className="section-products-header max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-20 sm:pt-24 lg:pt-32">
      <div className="max-w-[700px]">
        <div className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-terracotta/10 border border-terracotta/20 mb-6">
          <Store className="w-4 h-4 text-terracotta" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-terracotta">The Collection</span>
        </div>
        <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl text-clay tracking-tight leading-[1.05]">
          {query ? (
            <>Results for &ldquo;{query}&rdquo;</>
          ) : (
            <>All Products</>
          )}
        </h1>
        <div className="mt-8 p-5 rounded-2xl bg-white/60 border border-clay/10 max-w-[520px]">
          <p className="text-base lg:text-lg text-clay/70 leading-relaxed">
            Browse quality products from independent sellers, all in one place.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Variation B5: Scroll hint ───────────────────────────────────────────────

export function ProductsHeaderB5({ query }: { query: string }) {
  return (
    <section data-section="products-header" className="section-products-header max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-20 sm:pt-24 lg:pt-32">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
          The Collection
        </p>
        <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl text-clay tracking-tight leading-[1.05] mt-3">
          {query ? (
            <>Results for &ldquo;{query}&rdquo;</>
          ) : (
            <>All Products</>
          )}
        </h1>
        <p className="mt-8 text-lg lg:text-xl text-clay/70 leading-relaxed font-medium max-w-[600px]">
          Browse quality products from independent sellers, all in one place.
        </p>
        <div className="mt-10 flex items-center gap-3 text-clay/55">
          <ArrowDown className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

// ─── Variation B6: Bold + stat ───────────────────────────────────────────────

export function ProductsHeaderB6({ query }: { query: string }) {
  return (
    <section data-section="products-header" className="section-products-header max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-20 sm:pt-24 lg:pt-32">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
            The Collection
          </p>
          <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl text-clay tracking-tight leading-[1.05] mt-3">
            {query ? (
              <>Results for &ldquo;{query}&rdquo;</>
            ) : (
              <>All Products</>
            )}
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-clay/70 leading-relaxed font-medium max-w-[520px]">
            Browse quality products from independent sellers, all in one place.
          </p>
        </div>
        <div className="flex items-center gap-6 pb-2">
          <div className="text-center">
            <p className="text-3xl font-heading font-bold text-clay">50+</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay/65 mt-1">Products</p>
          </div>
          <span className="h-10 w-px bg-clay/15" />
          <div className="text-center">
            <p className="text-3xl font-heading font-bold text-clay">12</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay/65 mt-1">Vendors</p>
          </div>
        </div>
      </div>
    </section>
  );
}
