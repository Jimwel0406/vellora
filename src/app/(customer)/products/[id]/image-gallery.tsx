"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

export function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const count = images.length;
  const hasMultiple = count > 1;

  const next = useCallback(() => setSelected((s) => (s + 1) % count), [count]);
  const prev = useCallback(() => setSelected((s) => (s - 1 + count) % count), [count]);

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

  // Lightbox focus + keyboard handling
  useEffect(() => {
    if (!lightbox) return;
    closeBtnRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, next, prev]);

  if (count === 0) return null;

  return (
    <>
      <div
        className={`grid grid-cols-1 gap-3 lg:gap-4 ${
          hasMultiple ? "lg:grid-cols-[84px_minmax(0,1fr)]" : ""
        }`}
      >
        {/* Thumbnail rail */}
        {hasMultiple && (
          <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide lg:self-start">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === selected}
                className={`shrink-0 w-[76px] lg:w-full aspect-[4/5] rounded-[14px] overflow-hidden border-2 transition-all duration-300 ${
                  i === selected
                    ? "border-terracotta opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={src}
                  alt={`${name} thumbnail ${i + 1}`}
                  className={`w-full h-full object-cover select-none transition-transform duration-300 ${
                    hoverIndex === i && i !== selected ? "scale-105" : ""
                  }`}
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div
          className="order-1 lg:order-2 relative w-full aspect-[4/5] overflow-hidden rounded-[24px] bg-white border border-clay/5"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[selected]}
            alt={`${name} ${selected + 1}`}
            className="w-full h-full object-cover select-none"
            draggable={false}
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-clay hover:bg-white hover:text-terracotta transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-clay hover:bg-white hover:text-terracotta transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="View larger image"
            className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-clay hover:bg-white hover:text-terracotta transition-colors cursor-pointer"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lightbox — rendered into <body> so it stacks above the sticky page content */}
      {lightbox &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${name} — enlarged view`}
            className="fixed inset-0 z-[100] bg-clay/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close enlarged view"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Next image"
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <img
              src={images[selected]}
              alt={`${name} ${selected + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[90vh] object-contain select-none rounded-[12px]"
              draggable={false}
            />

            {hasMultiple && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm tracking-wide">
                {selected + 1} / {count}
              </p>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
