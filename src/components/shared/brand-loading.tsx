"use client";

import { LogoMark } from "@/components/shared/logo-mark";

export function BrandLoading() {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#FAF7EF]">
      <style>{`
        @keyframes vellora-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes vellora-line {
          0% { width: 0; }
          50% { width: 100%; }
          100% { width: 0; }
        }
        @keyframes vellora-spacing {
          0%, 100% { letter-spacing: 0.22em; }
          50% { letter-spacing: 0.35em; }
        }
        @media (prefers-reduced-motion: reduce) {
          .v-mark, .v-line, .v-text {
            animation: none !important;
          }
          .v-mark { opacity: 1 !important; }
          .v-line { width: 40px !important; }
          .v-text { letter-spacing: 0.22em !important; }
        }
      `}</style>

      <div className="flex flex-col items-center gap-5">
        {/* V mark */}
        <div className="v-mark" style={{ animation: "vellora-fade 2.4s ease-in-out infinite" }}>
          <LogoMark className="w-10 h-10 text-clay" />
        </div>

        {/* VELLORA */}
        <h1
          className="text-[18px] font-black tracking-[0.22em] uppercase text-clay font-heading"
          style={{ animation: "vellora-spacing 2.4s ease-in-out infinite" }}
        >
          Vellora
        </h1>

        {/* Editorial line */}
        <div className="w-10 h-px bg-clay/15 overflow-hidden">
          <div
            className="v-line h-full bg-terracotta/60"
            style={{ animation: "vellora-line 2.4s ease-in-out infinite" }}
          />
        </div>

        {/* Loading text */}
        <span
          className="v-text text-[10px] font-bold uppercase tracking-[0.22em] text-clay/30 font-label"
          style={{ animation: "vellora-spacing 2.4s ease-in-out infinite" }}
        >
          Loading
        </span>
      </div>
    </div>
  );
}
