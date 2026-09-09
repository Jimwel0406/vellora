"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowDownUp } from "lucide-react";

// Variation C: Icon Button Dropdown
export function SortToggleC({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-10 px-4 rounded-lg border border-clay/15 bg-white text-clay/70 cursor-pointer hover:border-clay/30 hover:text-clay transition-all"
      >
        <ArrowDownUp className="w-4 h-4" />
        <span className="text-[11px] font-bold uppercase tracking-[0.1em]">{selected?.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white border border-clay/10 shadow-[0_16px_40px_-12px_rgba(61,43,31,0.18)] py-1 z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer ${
                opt.value === value
                  ? "text-terracotta bg-terracotta/5"
                  : "text-clay/70 hover:text-clay hover:bg-clay/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
