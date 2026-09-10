"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Expand } from "lucide-react";

export function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [lightbox, setLightbox] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    closeBtnRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const src = images[0];
  if (!src) return null;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }

  function handleMouseEnter() {
    setIsZooming(true);
  }

  function handleMouseLeave() {
    setIsZooming(false);
    setZoomPosition({ x: 50, y: 50 });
  }

  return (
    <>
      <div
        ref={imageRef}
        className="relative w-full aspect-square overflow-hidden rounded-[8px] bg-[#FAF7EC] cursor-zoom-in group"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setLightbox(true)}
      >
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover select-none transition-transform duration-[600ms] ease-out"
          style={
            isZooming
              ? {
                  transform: "scale(1.25)",
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : undefined
          }
          draggable={false}
        />

        {/* Expand hint — subtle, bottom-right */}
        <div
          className={`absolute bottom-4 right-4 transition-all duration-300 ${
            isZooming ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-clay group-hover:text-clay group-hover:bg-white transition-all duration-300">
            <Expand className="w-4 h-4" strokeWidth={1.75} />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${name} — enlarged view`}
            className="fixed inset-0 z-[100] bg-clay/95 backdrop-blur-sm flex items-center justify-center p-6 sm:p-10"
            onClick={() => setLightbox(false)}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close enlarged view"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={src}
              alt={name}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[90vh] object-contain select-none rounded-[8px]"
              draggable={false}
            />
          </div>,
          document.body
        )}
    </>
  );
}
