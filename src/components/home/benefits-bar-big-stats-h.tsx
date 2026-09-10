export function BenefitsBarBigStatsH() {
  return (
    <section data-section="benefits-bar" className="section-benefits-bar lg:self-end">
      <div className="bg-[#2C1E14] rounded-3xl overflow-hidden">
        <div className="relative flex flex-col px-8 sm:px-10 lg:px-11 pt-9 sm:pt-10 lg:pt-11 pb-9 sm:pb-10 lg:pb-11 sm:min-h-[520px] lg:min-h-[560px]">

          {/* ── Eyebrow ── */}
          <span className="relative z-10 text-[10px] sm:text-[11px] lg:text-[12px] font-semibold uppercase tracking-[0.22em] text-terracotta/80 font-label">
            The Vellora Standard
          </span>

          {/* ── Large cream visual field — editorial geometric form ── */}
          <div
            className="absolute top-12 right-0 sm:top-14 sm:right-[-40px] lg:top-16 lg:right-[-20px] w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[340px] lg:h-[340px] rounded-full bg-[#FAF7EF]/[0.06] pointer-events-none"
            aria-hidden="true"
          />

          {/* ── Hero: 10K+ interacting with cream field ── */}
          <div className="relative z-10 mt-8 sm:mt-10 lg:mt-12">
            <span className="block text-[80px] sm:text-[100px] lg:text-[120px] font-heading font-bold leading-[0.85] text-terracotta tracking-[-0.04em]">
              10K+
            </span>
            <div className="mt-3 sm:mt-4">
              <h3 className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.22em] font-label text-[#FAF7EF]/60">
                Curated Products
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#FAF7EF]/75 leading-[1.45] mt-1.5 max-w-[240px]">
                Handpicked from trusted vendors
              </p>
            </div>
          </div>

          {/* ── Brand statement — second strongest element ── */}
          <div className="relative z-10 mt-10 sm:mt-12 lg:mt-14">
            <p className="text-[24px] sm:text-[28px] lg:text-[32px] font-heading font-bold uppercase leading-[1.1] tracking-[-0.02em] text-[#FAF7EF]/90">
              Less searching.
              <br />
              Better finding.
            </p>
          </div>

          {/* ── Supporting proof strip ── */}
          <div className="relative z-10 mt-8 sm:mt-10 lg:mt-12 flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-8 lg:gap-x-10">
            <div>
              <span className="block text-[20px] sm:text-[22px] lg:text-[24px] font-heading font-bold text-terracotta leading-none tracking-[-0.01em]">
                30%
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.20em] font-label text-[#FAF7EF]/60 mt-1 block">
                Savings
              </span>
            </div>
            <div>
              <span className="block text-[20px] sm:text-[22px] lg:text-[24px] font-heading font-bold text-terracotta leading-none tracking-[-0.01em]">
                98%
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.20em] font-label text-[#FAF7EF]/60 mt-1 block">
                Satisfaction
              </span>
            </div>
            <div>
              <span className="block text-[20px] sm:text-[22px] lg:text-[24px] font-heading font-bold text-terracotta leading-none tracking-[-0.01em]">
                2-Day
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.20em] font-label text-[#FAF7EF]/60 mt-1 block">
                Delivery
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
