"use client";

import { useRef, useState } from "react";

export function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) return null;

  function next() {
    setSelected((s) => (s + 1) % images.length);
  }

  function prev() {
    setSelected((s) => (s - 1 + images.length) % images.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;
    if (Math.abs(delta) > threshold) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  }

  return (
    <div>
      <div
        className="aspect-square w-full overflow-hidden rounded-[20px] bg-white border border-clay/5 relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[selected]}
          alt={`${name} ${selected + 1}`}
          className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
          draggable={false}
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-clay hover:bg-white transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-clay hover:bg-white transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className={`shrink-0 w-20 h-20 rounded-[10px] overflow-hidden border-2 transition-all duration-300 ${
                i === selected
                  ? "border-clay opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                className={`w-full h-full object-cover select-none transition-all duration-300 ${
                  hoverIndex === i && i !== selected ? "scale-105" : ""
                }`}
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}