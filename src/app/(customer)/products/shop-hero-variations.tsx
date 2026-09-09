"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Reveal } from "@/components/home/reveal";

export function ShopHeroB() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoStarted = useRef(false);

  const startVideo = useCallback(() => {
    if (videoStarted.current) return;
    videoStarted.current = true;
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    video.load();
    const onCanPlay = () => {
      video.play().then(() => setVideoPlaying(true)).catch(() => {});
    };
    video.addEventListener("canplay", onCanPlay, { once: true });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const scheduleIdle = (cb: () => void) => {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(cb, { timeout: 3000 });
      } else {
        setTimeout(cb, 1200);
      }
    };
    const handle = scheduleIdle(startVideo);
    return () => {
      if ("cancelIdleCallback" in window && typeof handle === "number") {
        (window as any).cancelIdleCallback(handle);
      }
    };
  }, [startVideo]);

  return (
    <Reveal>
      <section className="relative overflow-hidden rounded-2xl mb-10 min-h-[280px] sm:min-h-[320px] lg:min-h-[340px] group">
        {/* Poster fallback */}
        <img
          src="/shop-hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />

        {/* Lazy-loaded video */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            videoPlaying ? "opacity-100" : "opacity-0"
          }`}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-hidden="true"
        >
          <source src="/sellers-video.mp4" type="video/mp4" />
        </video>

        {/* Readability overlay — stronger left, transparent right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(61,43,31,0.88) 0%, rgba(61,43,31,0.7) 40%, rgba(61,43,31,0.3) 70%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full p-8 sm:p-12 lg:p-16 lg:max-w-[700px] min-h-[280px] sm:min-h-[320px] lg:min-h-[340px]">
          <p className="font-label text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-sand/50 mb-4">
            Independent Sellers
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] text-sand tracking-tight leading-[1.05]">
            Shop from
            <br />
            Real Sellers.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-sand/60 leading-relaxed mt-4 max-w-md">
            Quality products from independent sellers you can trust.
          </p>
        </div>
      </section>
    </Reveal>
  );
}
