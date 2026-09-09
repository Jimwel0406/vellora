"use client";

import { Package, ShieldCheck, BadgeCheck } from "lucide-react";

function getFeatures(productCount: number) {
  return [
    {
      icon: Package,
      stat: `${productCount.toLocaleString()}+`,
      label: "Curated products",
      text: "Hand-picked across every category, updated weekly.",
    },
    {
      icon: ShieldCheck,
      stat: "100%",
      label: "Verified sellers",
      text: "Each store is vetted before it can list on Vellora.",
    },
    {
      icon: BadgeCheck,
      stat: "0",
      label: "Hidden markups",
      text: "Stores keep the value they build — fair pricing always.",
    },
  ];
}

/* Variation A — Hero stats: giant numbers as the focal point */
export function FeatureStats({ productCount }: { productCount: number }) {
  const features = getFeatures(productCount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {features.map(({ icon: Icon, stat, label, text }) => (
        <div
          key={label}
          className="group text-center p-6 bg-white border border-clay/6 rounded-[18px] hover:border-terracotta/25 hover:shadow-[0_8px_24px_-12px_rgba(61,43,31,0.12)] transition-all duration-300"
        >
          <Icon className="w-7 h-7 text-terracotta/50 mx-auto group-hover:text-terracotta transition-colors duration-300" strokeWidth={2} />
          <p className="mt-4 font-heading text-[48px] sm:text-[56px] font-bold text-clay leading-none tracking-tight">
            {stat}
          </p>
          <p className="mt-2 text-base font-bold uppercase font-label tracking-[0.15em] text-terracotta">
            {label}
          </p>
          <p className="mt-3 text-base text-clay-mute leading-relaxed">
            {text}
          </p>
        </div>
      ))}
    </div>
  );
}

/* Variation B — Connected steps: vertical timeline with dots */
export function FeatureSteps({ productCount }: { productCount: number }) {
  const features = getFeatures(productCount);

  return (
    <div className="relative flex flex-col">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-6 bottom-6 w-px bg-clay/10" aria-hidden="true" />

      {features.map(({ icon: Icon, stat, label, text }, idx) => (
        <div
          key={label}
          className="group relative flex items-start gap-5 py-5"
        >
          {/* Dot */}
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-clay/10 group-hover:border-terracotta/40 transition-colors duration-300">
            <Icon className="w-4 h-4 text-terracotta" strokeWidth={1.75} />
          </span>

          <div className="flex-1 pt-1">
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-2xl font-bold text-clay">
                {stat}
              </span>
              <span className="text-sm font-semibold text-clay">
                {label}
              </span>
            </div>
            <p className="text-sm text-clay-mute mt-1 leading-relaxed">
              {text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Variation C — Horizontal pills: stacked badges with icon + stat */
export function FeaturePills({ productCount }: { productCount: number }) {
  const features = getFeatures(productCount);

  return (
    <div className="flex flex-col gap-3">
      {features.map(({ icon: Icon, stat, label, text }) => (
        <div
          key={label}
          className="group flex items-center gap-5 p-4 pr-6 bg-white border border-clay/6 rounded-full hover:border-terracotta/25 hover:shadow-[0_6px_20px_-10px_rgba(61,43,31,0.1)] transition-all duration-300"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta text-white group-hover:bg-terracotta-deep transition-colors duration-300">
            <Icon className="w-5 h-5" strokeWidth={1.75} />
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-lg font-bold text-clay">
                {stat}
              </span>
              <span className="text-sm font-semibold text-clay">
                {label}
              </span>
            </div>
            <p className="text-xs text-clay-mute mt-0.5 truncate">
              {text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
