"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const POSTER_IMAGE = "/hero-collection.jpg";
const VIDEO_SRC = "/hero-video.mp4";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoStarted = useRef(false);

  const startVideo = useCallback(() => {
    if (videoStarted.current) return;
    videoStarted.current = true;

    const video = videoRef.current;
    if (!video) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Lazy-load by setting src
    video.load();

    const onCanPlay = () => {
      setVideoReady(true);
      video.play().then(() => {
        setVideoPlaying(true);
      }).catch(() => {
        // Autoplay blocked — keep poster visible
      });
    };

    video.addEventListener("canplay", onCanPlay, { once: true });
  }, []);

  // Wait for browser idle, then start loading video
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scheduleIdle = (cb: () => void) => {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(cb, { timeout: 3000 });
      } else {
        setTimeout(cb, 1500);
      }
    };

    const idleHandle = scheduleIdle(startVideo);
    return () => {
      if ("cancelIdleCallback" in window && typeof idleHandle === "number") {
        (window as any).cancelIdleCallback(idleHandle);
      }
    };
  }, [startVideo]);

  return (
    <section
      data-section="home-hero"
      className="section-home-hero relative overflow-hidden bg-[#100e0b]"
    >
      {/* ── Layer 1: Poster image (always visible, permanent fallback) ── */}
      <img
        src={POSTER_IMAGE}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
        width={1248}
        height={832}
        aria-hidden="true"
      />

      {/* ── Layer 2: Lazy-loaded video (crossfades in over poster) ── */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover object-[center_40%] transition-opacity duration-1000 ease-in-out ${
          videoPlaying ? "opacity-100" : "opacity-0"
        }`}
        muted
        loop
        playsInline
        autoPlay
        aria-hidden="true"
        preload="none"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* ── Layer 3: Readability overlay — strong left, transparent right ── */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to right, rgba(16,14,11,0.75) 0%, rgba(16,14,11,0.6) 35%, rgba(16,14,11,0.25) 65%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* Bottom scrim for trust strip readability */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(16,14,11,0.7) 0%, transparent 40%)",
        }}
        aria-hidden="true"
      />

      {/* ── Layer 4: HTML content ── */}
      <div className="relative z-10 flex min-h-screen sm:h-screen items-center">
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-12 pt-28 sm:pt-32 lg:pt-40 pb-12 sm:pb-20 lg:pb-24">
          <div className="max-w-3xl">
            <p className="animate-hero-1 inline-flex items-center gap-3 text-base sm:text-lg font-label font-bold uppercase tracking-[0.3em] text-[#E9DCC5]">
              <span className="h-0.5 w-9 bg-terracotta" aria-hidden="true" />
              Shop more, live better
            </p>

            <h1 className="animate-hero-2 mt-5 font-heading font-semibold leading-[0.98] tracking-tight text-white text-[44px] sm:text-6xl lg:text-7xl xl:text-[96px]">
              Less noise,
              <span className="block text-terracotta">more craft.</span>
            </h1>

            <p className="animate-hero-3 mt-5 sm:mt-6 text-[15px] sm:text-lg text-white/80 leading-relaxed max-w-xl">
              A curated marketplace of independent vendors selling considered
              electronics, home objects, and everyday essentials — no filler,
              just quality.
            </p>

            <div className="animate-hero-4 mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2.5 h-[54px] px-8 rounded-lg bg-terracotta text-white text-sm font-bold uppercase tracking-[0.15em] hover:bg-terracotta/90 transition-colors duration-200"
              >
                Shop now
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/stores"
                className="inline-flex items-center justify-center h-[54px] px-8 rounded-lg border border-white/40 text-white text-sm font-bold uppercase tracking-[0.15em] hover:border-white hover:bg-white/10 transition-colors duration-200"
              >
                See how we pick
              </Link>
            </div>

            {/* Trust strip */}
            <dl className="animate-hero-5 mt-10 sm:mt-12 flex flex-col sm:flex-row sm:flex-wrap gap-6 sm:gap-y-6">
              <div className="sm:px-8 sm:first:pl-0">
                <dt className="font-label text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/50">
                  Returns
                </dt>
                <dd className="font-heading font-semibold text-base sm:text-lg lg:text-xl text-[#FBF6EC] mt-1.5">
                  Free · 30 days
                </dd>
              </div>
              <div className="sm:px-8 sm:border-l sm:border-white/20">
                <dt className="font-label text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/50">
                  Support
                </dt>
                <dd className="font-heading font-semibold text-base sm:text-lg lg:text-xl text-[#FBF6EC] mt-1.5">
                  24/7
                </dd>
              </div>
              <div className="sm:px-8 sm:border-l sm:border-white/20 sm:last:pr-0">
                <dt className="font-label text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/50">
                  Quality
                </dt>
                <dd className="font-heading font-semibold text-base sm:text-lg lg:text-xl text-[#FBF6EC] mt-1.5">
                  Guaranteed
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
