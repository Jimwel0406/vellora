"use client";

import { Plus, X } from "lucide-react";
import { inputClass } from "../../_components/vendor-ui";

export function FeatureList({
  values,
  onChange,
}: {
  values: string[];
  onChange: (features: string[]) => void;
}) {
  function update(index: number, value: string) {
    const next = [...values];
    next[index] = value;
    onChange(next);
  }

  function remove(index: number) {
    if (values.length <= 1) return;
    onChange(values.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...values, ""]);
  }

  return (
    <div className="space-y-2 mt-2">
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-[11px] font-bold shrink-0">
            {index + 1}
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => update(index, e.target.value)}
            aria-label={`Key feature ${index + 1}`}
            placeholder="e.g. Hand-poured 100% natural soy wax"
            className={inputClass + " mt-0"}
          />
          {values.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Remove feature ${index + 1}`}
              className="w-8 h-8 shrink-0 rounded-full border border-clay/15 text-clay hover:text-terracotta hover:border-terracotta/40 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-terracotta hover:text-clay transition-colors mt-1"
      >
        <Plus className="w-4 h-4" />
        Add feature
      </button>
    </div>
  );
}