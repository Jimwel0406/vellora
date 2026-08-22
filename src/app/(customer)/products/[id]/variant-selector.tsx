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
          <p className="text-xs font-semibold uppercase tracking-widest text-clay/70 mb-3">
            {v.name}
            {selected[v.name] && (
              <span className="text-clay/40 font-normal ml-2 normal-case tracking-normal">
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
                    "px-3.5 py-2 rounded-lg text-sm border transition-all",
                    isSelected
                      ? "border-terracotta bg-terracotta/5 text-clay font-medium"
                      : "border-clay/10 text-clay/50 hover:border-clay/30"
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