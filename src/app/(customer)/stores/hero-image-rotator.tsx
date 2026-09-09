"use client";

import { useState, useEffect } from "react";

const IMAGES = [
  { src: "/store-hero-1.jpg", alt: "Fashion flat lay collection" },
  { src: "/store-hero-2.jpg", alt: "Aviator polarized sunglasses" },
  { src: "/store-hero-3.jpg", alt: "Meridian leather watch" },
];

// All values must be explicit pixels — no "auto" — so CSS transitions work
const SLOTS = [
  { top: 0, left: 308, width: 340, height: 420, z: 30 },    // main (right) — highest
  { top: 212, left: 32, width: 200, height: 260, z: 10 },   // bottom-left — lowest
  { top: 64, left: 48, width: 120, height: 120, z: 20 },    // top-left (small) — middle
];

export function HeroImageRotator() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycle((c) => c + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function getSlot(imgIndex: number) {
    return (cycle + imgIndex) % 3;
  }

  return (
    <div className="relative hidden lg:block h-[520px]">
      <div className="absolute left-0 top-8 bottom-8 w-px bg-clay/10" />

      {IMAGES.map((img, i) => {
        const slot = getSlot(i);
        const pos = SLOTS[slot];
        return (
          <div
            key={i}
            className="absolute overflow-hidden"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              height: pos.height,
              zIndex: pos.z,
              borderRadius: 4,
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow:
                slot === 0
                  ? "0 20px 60px -20px rgba(23,32,28,0.15)"
                  : slot === 1
                    ? "0 16px 40px -16px rgba(23,32,28,0.12)"
                    : "0 8px 24px -8px rgba(23,32,28,0.1)",
              border: slot === 1 ? "4px solid #FAF7EF" : "none",
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}

      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-clay/15 pointer-events-none" />
      <div className="absolute bottom-0 left-8 w-4 h-4 border-b border-l border-clay/15 pointer-events-none" />
    </div>
  );
}
