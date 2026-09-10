"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface VariantDef {
  name: string;
  options: string[];
}

export function VariantSelector({
  variants,
  onSelect,
}: {
  variants: VariantDef[];
  onSelect?: (selected: Record<string, string>) => void;
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  if (variants.length === 0) return null;

  function handleSelect(name: string, option: string) {
    const next = { ...selected, [name]: option };
    setSelected(next);
    onSelect?.(next);
  }

  return (
    <div className="space-y-4">
      {variants.map((v) => (
        <div key={v.name}>
          <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-clay/40 mb-2.5 font-label">
            {v.name}
            {selected[v.name] && (
              <span className="text-clay/30 font-normal ml-2 normal-case tracking-normal text-[13px]">
                — {selected[v.name]}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {v.options.map((opt) => {
              const isSelected = selected[v.name] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(v.name, opt)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[14px] border transition-all duration-200",
                    isSelected
                      ? "border-terracotta bg-terracotta/5 text-clay font-medium"
                      : "border-clay/10 text-clay hover:border-clay/25"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
