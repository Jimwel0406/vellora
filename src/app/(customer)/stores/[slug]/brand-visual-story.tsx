"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Store } from "lucide-react";

interface BrandVisualStoryProps {
  primarySrc: string | null;
  secondarySrc: string | null;
  storeName: string;
  description: string | null;
}

function sampleRegionBrightness(
  img: HTMLImageElement,
  region: { x: number; y: number; w: number; h: number }
): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0.5;
  const size = 32;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(
    img,
    region.x * img.naturalWidth,
    region.y * img.naturalHeight,
    region.w * img.naturalWidth,
    region.h * img.naturalHeight,
    0, 0, size, size
  );
  const data = ctx.getImageData(0, 0, size, size).data;
  let total = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    total += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
  }
  return total / pixels;
}

export function BrandVisualStory({
  primarySrc,
  secondarySrc,
  storeName,
  description,
}: BrandVisualStoryProps) {
  const primaryImgRef = useRef<HTMLImageElement>(null);
  const [scrimOpacity, setScrimOpacity] = useState(0.6);
  const [loaded, setLoaded] = useState(false);

  const analyzeAndSetScrim = useCallback(() => {
    const img = primaryImgRef.current;
    if (!img || !img.complete || !img.naturalWidth) return;

    const textBrightness = sampleRegionBrightness(img, { x: 0, y: 0.45, w: 0.45, h: 0.55 });

    let scrim: number;
    if (textBrightness > 0.7) scrim = 0.75 + (textBrightness - 0.7) * 0.5;
    else if (textBrightness > 0.45) scrim = 0.5 + (textBrightness - 0.45) * 0.8;
    else if (textBrightness > 0.2) scrim = 0.3 + (textBrightness - 0.2) * 0.8;
    else scrim = 0.18;

    scrim = Math.max(0.18, Math.min(0.8, scrim));
    setScrimOpacity(scrim);
    setLoaded(true);
  }, []);

  useEffect(() => {
    const img = primaryImgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth) analyzeAndSetScrim();
    else img.onload = analyzeAndSetScrim;
  }, [primarySrc, analyzeAndSetScrim]);

  return (
    <section
      data-section="store-visual-story"
      className="section-store-visual-story mb-10 lg:mb-12"
    >
      <div className="relative">
        {/* Primary image with integrated scrim — overflow-hidden clips everything */}
        <div className="relative overflow-hidden bg-sand/40 aspect-[16/9] lg:aspect-[16/8] lg:h-[480px]">
          {primarySrc ? (
            <img
              ref={primaryImgRef}
              src={primarySrc}
              alt={`${storeName} brand visual`}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="w-20 h-20 text-clay/10" />
            </div>
          )}

          {/* Scrim — desktop only, inside overflow-hidden */}
          <div
            className="absolute inset-0 pointer-events-none hidden lg:block"
            style={{
              opacity: loaded ? 1 : 0.6,
              background: `
                radial-gradient(ellipse 80% 90% at 10% 90%, rgba(29,21,15,${scrimOpacity}) 0%, rgba(29,21,15,${scrimOpacity * 0.5}) 40%, transparent 70%),
                linear-gradient(to top, rgba(29,21,15,${scrimOpacity * 0.4}) 0%, transparent 40%)
              `,
            }}
          />

          {/* Desktop text — over the scrim, inside overflow-hidden */}
          <div className="hidden lg:block absolute bottom-0 left-0 p-10 max-w-md">
            <span className="block font-label text-xs font-bold uppercase tracking-[0.25em] text-sand/60 mb-3">
              Brand Story
            </span>
            <p className="font-heading text-xl sm:text-2xl text-sand leading-[1.3] tracking-[-0.01em]">
              Designed for everyday rituals.
            </p>
            <p className="mt-3 text-sm font-medium text-sand/80 leading-relaxed max-w-sm">
              {description || "Thoughtfully curated products from independent makers who care about quality and craft."}
            </p>
          </div>
        </div>

        {/* Secondary image — desktop only */}
        <div className="hidden lg:block absolute -bottom-5 right-8 w-[26%] overflow-hidden">
          <div className="aspect-[3/4] bg-sand/30">
            {secondarySrc ? (
              <img
                src={secondarySrc}
                alt={`${storeName} product detail`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store className="w-10 h-10 text-clay/10" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile text — below image on solid background */}
        <div className="lg:hidden mt-5 px-1">
          <span className="block font-label text-xs font-bold uppercase tracking-[0.25em] text-clay/50 mb-2">
            Brand Story
          </span>
          <p className="font-heading text-xl sm:text-2xl text-clay leading-[1.3] tracking-[-0.01em]">
            Designed for everyday rituals.
          </p>
          <p className="mt-2.5 text-sm font-medium text-clay/70 leading-relaxed max-w-sm">
            {description || "Thoughtfully curated products from independent makers who care about quality and craft."}
          </p>
        </div>
      </div>
    </section>
  );
}
