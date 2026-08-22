"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface AccordionItem {
  label: string;
  content: React.ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-clay/10 border-t border-clay/10">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <AccordionRow
            key={i}
            label={item.label}
            isOpen={isOpen}
            onToggle={() => setOpenIndex(isOpen ? null : i)}
          >
            {item.content}
          </AccordionRow>
        );
      })}
    </div>
  );
}

function AccordionRow({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-clay group-hover:text-terracotta transition-colors">
          {label}
        </span>
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full border border-clay/15 text-clay/60 transition-all duration-300 ${
            isOpen ? "rotate-180 border-terracotta text-terracotta" : ""
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden min-h-0">
          <div className="pb-6 text-sm text-clay/60 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
