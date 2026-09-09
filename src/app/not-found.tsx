import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — Vellora",
};

export default function NotFound() {
  return (
    <div className="relative h-screen bg-sand overflow-hidden flex flex-col justify-center px-6 sm:px-10 lg:px-16">
      {/* Editorial eyebrow */}
      <div className="relative z-10">
        <span className="text-[10px] sm:text-[11px] lg:text-[12px] font-semibold uppercase tracking-[0.22em] text-terracotta font-label">
          VELLORA / 404
        </span>
        <div className="mt-3 w-24 border-t border-terracotta/20" />
      </div>

      {/* Huge 404 — editorial typographic element */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -left-4 sm:right-auto sm:static sm:translate-y-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="block text-[120px] sm:text-[200px] lg:text-[260px] font-heading font-bold leading-[0.85] text-terracotta/[0.10] tracking-[-0.04em]">
          404
        </span>
      </div>

      {/* Primary message */}
      <div className="relative z-10 mt-6 sm:mt-8 lg:mt-10">
        <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] font-heading font-bold leading-[0.92] text-clay tracking-[-0.03em]">
          THAT PAGE
          <br />
          WANDERED OFF.
        </h1>
      </div>

      {/* Supporting copy */}
      <div className="relative z-10 mt-5 sm:mt-6">
        <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-clay/55 leading-[1.55] max-w-[340px]">
          Looks like this link took you somewhere unexpected.
        </p>
      </div>

      {/* CTAs */}
      <div className="relative z-10 mt-8 sm:mt-10 flex flex-col items-center sm:items-center sm:flex-row gap-4 sm:gap-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-terracotta text-sand text-[11px] font-bold uppercase tracking-[0.10em] hover:bg-rust-dark transition-colors shrink-0"
        >
          BACK HOME &rarr;
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 w-fit text-[12px] font-bold uppercase tracking-[0.10em] text-clay border-b border-clay/20 pb-0.5 hover:border-clay/50 transition-colors"
        >
          SHOP COLLECTION &rarr;
        </Link>
      </div>

      {/* Editorial circular arc — bottom right */}
      <div className="absolute bottom-0 right-0 pointer-events-none" aria-hidden="true">
        <svg
          className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] lg:w-[320px] lg:h-[320px]"
          viewBox="0 0 320 320"
          fill="none"
          style={{ transform: "translate(25%, 25%)" }}
        >
          <circle
            cx="160"
            cy="160"
            r="150"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-terracotta/[0.08]"
          />
          <circle
            cx="160"
            cy="160"
            r="120"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-terracotta/[0.10]"
          />
          <circle
            cx="160"
            cy="160"
            r="90"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeDasharray="180 380"
            className="text-terracotta/[0.15]"
          />
          <defs>
            <path id="arc404" d="M 160 160 m -130, 0 a 130,130 0 1,1 260,0" />
          </defs>
          <text
            className="fill-terracotta/[0.10] font-label"
            fontSize="8"
            letterSpacing="0.25em"
            fontWeight="600"
          >
            <textPath href="#arc404" startOffset="55%">
              VELLORA / STANDARD
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
