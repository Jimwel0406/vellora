export function BenefitsBarBigStatsH() {
  return (
    <section data-section="benefits-bar" className="section-benefits-bar h-full">
      <div className="bg-[#2C1E14] rounded-3xl h-full overflow-hidden">
        <div className="relative h-full flex flex-col">

          {/* Top label — inset from edges */}
          <div className="px-8 sm:px-10 lg:px-11 pt-9 sm:pt-10 lg:pt-11">
            <span className="text-[10px] sm:text-[11px] lg:text-[12px] font-semibold uppercase tracking-[0.22em] text-terracotta/80 font-label">
              The Vellora Standard
            </span>
          </div>

          {/* Hero stat — 10K+ dominant */}
          <div className="px-8 sm:px-10 lg:px-11 mt-8 sm:mt-9 lg:mt-10">
            <span className="block text-[64px] sm:text-[72px] lg:text-[88px] font-heading font-bold leading-[0.88] text-terracotta tracking-[-0.03em]">
              10K+
            </span>
            <h3 className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.22em] font-label text-[#FAF7EF]/60 mt-3">
              Products
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#FAF7EF]/45 leading-[1.45] mt-1.5 max-w-[260px]">
              Handpicked from trusted vendors
            </p>
          </div>

          {/* Editorial divider */}
          <div className="mx-8 sm:mx-10 lg:mx-11 border-t border-[#FAF7EF]/10 mt-8 sm:mt-9 lg:mt-10" />

          {/* Two-column supporting metrics */}
          <div className="px-8 sm:px-10 lg:px-11 grid grid-cols-2 gap-x-8 gap-y-6 mt-7 sm:mt-8">
            {/* 30% */}
            <div>
              <span className="block text-[40px] sm:text-[44px] lg:text-[48px] font-heading font-bold leading-none text-terracotta tracking-[-0.02em]">
                30%
              </span>
              <h3 className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.22em] font-label text-[#FAF7EF]/60 mt-2">
                Avg. Savings
              </h3>
              <p className="text-[12px] sm:text-[13px] text-[#FAF7EF]/40 leading-[1.45] mt-1">
                Better than retail, always
              </p>
            </div>

            {/* 98% */}
            <div>
              <span className="block text-[40px] sm:text-[44px] lg:text-[48px] font-heading font-bold leading-none text-terracotta tracking-[-0.02em]">
                98%
              </span>
              <h3 className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.22em] font-label text-[#FAF7EF]/60 mt-2">
                Satisfaction
              </h3>
              <p className="text-[12px] sm:text-[13px] text-[#FAF7EF]/40 leading-[1.45] mt-1">
                Rated us 4 stars or higher
              </p>
            </div>
          </div>

          {/* Delivery promise — closing statement */}
          <div className="px-8 sm:px-10 lg:px-11 mt-8 sm:mt-10 lg:mt-12 pb-9 sm:pb-10 lg:pb-11 relative z-10">
            <span className="block text-[44px] sm:text-[48px] lg:text-[54px] font-heading font-bold leading-none text-terracotta tracking-[-0.02em]">
              2-Day
            </span>
            <h3 className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.22em] font-label text-[#FAF7EF]/60 mt-2">
              Delivery
            </h3>
            <p className="text-[12px] sm:text-[13px] text-[#FAF7EF]/40 leading-[1.45] mt-1">
              Fast &amp; free on qualifying orders
            </p>
          </div>

          {/* Editorial circular motif — bottom right, partially cropped */}
          <div className="absolute bottom-0 right-0 pointer-events-none" aria-hidden="true">
            <svg
              className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px]"
              viewBox="0 0 280 280"
              fill="none"
              style={{ transform: "translate(28%, 28%)" }}
            >
              {/* Outer ring — thinnest, faintest */}
              <circle
                cx="140"
                cy="140"
                r="130"
                stroke="currentColor"
                strokeWidth="0.75"
                className="text-terracotta/[0.08]"
              />
              {/* Middle ring */}
              <circle
                cx="140"
                cy="140"
                r="108"
                stroke="currentColor"
                strokeWidth="0.75"
                className="text-terracotta/[0.10]"
              />
              {/* Primary arc — slightly thicker */}
              <circle
                cx="140"
                cy="140"
                r="86"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeDasharray="180 350"
                className="text-terracotta/[0.20]"
                style={{ animation: "spin 40s linear infinite" }}
              />
              {/* Short accent arc */}
              <path
                d="M140 54 A86 86 0 0 1 226 140"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-terracotta/[0.18]"
              />
              {/* Small geometric marker — crosshair tick */}
              <line x1="140" y1="48" x2="140" y2="58" stroke="currentColor" strokeWidth="1" className="text-terracotta/[0.22]" />
              <line x1="220" y1="140" x2="230" y2="140" stroke="currentColor" strokeWidth="1" className="text-terracotta/[0.22]" />

              {/* Curved wordmark along outer arc */}
              <defs>
                <path id="arcText" d="M 140 140 m -120, 0 a 120,120 0 1,1 240,0" />
              </defs>
              <text
                className="fill-terracotta/[0.12] font-label"
                fontSize="8"
                letterSpacing="0.25em"
                fontWeight="600"
              >
                <textPath href="#arcText" startOffset="55%">
                  VELLORA / STANDARD
                </textPath>
              </text>
            </svg>
          </div>

        </div>
      </div>

      {/* Slow rotation keyframe */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
