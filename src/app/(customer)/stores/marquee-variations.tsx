"use client";

import { useState } from "react";
import { Store } from "lucide-react";

const CATEGORIES = ["Fashion", "Electronics", "Home Goods", "Accessories", "Skincare", "Stationery", "Streetwear", "Sports & Outdoors"];

// ─── M1: Bold dark bar (current) ────────────────────────────────────────────

function MarqueeM1() {
  return (
    <div className="bg-clay py-5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 px-5">
            {CATEGORIES.map((cat) => (
              <span key={`${i}-${cat}`} className="flex items-center gap-10 text-[12px] font-bold uppercase tracking-[0.3em] text-sand/80">
                {cat}
                <span className="w-2 h-2 rounded-full bg-terracotta" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── M2: Minimal border top/bottom with big text ────────────────────────────

export function MarqueeM2() {
  return (
    <div className="relative py-8 overflow-hidden bg-gradient-to-r from-clay via-terracotta to-clay">
      <div className="absolute inset-0 bg-[url('/shop-hero-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay" />
      <div className="relative flex whitespace-nowrap animate-marquee">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-16 px-8">
            {CATEGORIES.map((cat) => (
              <span key={`${i}-${cat}`} className="flex items-center gap-16 font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white/90 tracking-tight uppercase drop-shadow-lg">
                {cat}
                <span className="w-3 h-3 rounded-full bg-ochre shadow-[0_0_12px_rgba(212,168,75,0.6)]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── M3: Terracotta accent bar ──────────────────────────────────────────────

function MarqueeM3() {
  return (
    <div className="bg-terracotta py-5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 px-5">
            {CATEGORIES.map((cat) => (
              <span key={`${i}-${cat}`} className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.3em] text-white/90">
                {cat}
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── M4: Sand background, subtle ────────────────────────────────────────────

function MarqueeM4() {
  return (
    <div className="bg-sand/60 py-5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 px-5">
            {CATEGORIES.map((cat) => (
              <span key={`${i}-${cat}`} className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.25em] text-clay/65">
                {cat}
                <span className="w-4 h-px bg-clay/20" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── M5: Double row — two lines scrolling opposite directions ────────────────

function MarqueeM5() {
  return (
    <div className="py-6 overflow-hidden space-y-3">
      {/* Row 1 — left to right */}
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 px-5">
            {CATEGORIES.map((cat) => (
              <span key={`${i}-${cat}`} className="text-[11px] font-bold uppercase tracking-[0.25em] text-clay/20">
                {cat}
              </span>
            ))}
          </div>
        ))}
      </div>
      {/* Row 2 — right to left */}
      <div className="flex whitespace-nowrap animate-marquee-reverse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 px-5">
            {CATEGORIES.map((cat) => (
              <span key={`${i}-${cat}`} className="text-[11px] font-bold uppercase tracking-[0.25em] text-clay/35">
                {cat}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── M6: Icon + text — with store icon between items ────────────────────────

function MarqueeM6() {
  return (
    <div className="border-y border-clay/10 py-5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-5">
            {CATEGORIES.map((cat) => (
              <span key={`${i}-${cat}`} className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.25em] text-clay/70">
                <Store className="w-3.5 h-3.5 text-terracotta/50" />
                {cat}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const MARQUEES = [
  { id: "M1", label: "Bold Dark", component: MarqueeM1 },
  { id: "M2", label: "Bold Big Text", component: MarqueeM2 },
  { id: "M3", label: "Terracotta", component: MarqueeM3 },
  { id: "M4", label: "Sand Subtle", component: MarqueeM4 },
  { id: "M5", label: "Double Row", component: MarqueeM5 },
  { id: "M6", label: "With Icons", component: MarqueeM6 },
];

export function MarqueeSwitcher() {
  const [active, setActive] = useState("M1");
  const ActiveMarquee = MARQUEES.find((m) => m.id === active)?.component ?? MarqueeM1;

  return (
    <div>
      {/* Switcher — visible in dev */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-4 pb-2 flex flex-wrap gap-2">
        {MARQUEES.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer border ${
              active === m.id
                ? "bg-clay text-sand border-clay"
                : "bg-white text-clay/70 border-clay/15 hover:border-clay/40"
            }`}
          >
            {m.id}: {m.label}
          </button>
        ))}
      </div>
      <ActiveMarquee />
    </div>
  );
}
