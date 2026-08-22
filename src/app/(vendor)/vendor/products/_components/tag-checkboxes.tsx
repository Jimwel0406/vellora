"use client";

import { PRODUCT_TAGS } from "@/lib/product-options";

export function ProductTagCheckboxes({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  function toggle(tag: string) {
    onChange(
      selected.includes(tag)
        ? selected.filter((t) => t !== tag)
        : [...selected, tag]
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {PRODUCT_TAGS.map((tag) => {
        const checked = selected.includes(tag);
        return (
          <label
            key={tag}
            className={`inline-flex items-center rounded-full border px-3.5 py-2 text-[12px] font-medium cursor-pointer select-none transition-colors ${
              checked
                ? "border-terracotta bg-terracotta/10 text-terracotta"
                : "border-clay/20 text-clay/60 hover:border-clay/40 hover:text-clay"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(tag)}
              className="sr-only"
            />
            {tag}
          </label>
        );
      })}
    </div>
  );
}