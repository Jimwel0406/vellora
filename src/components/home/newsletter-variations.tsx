"use client";

import { useState } from "react";

export function NewsletterMinimal() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  return (
    <section
      data-section="newsletter"
      className="section-newsletter relative overflow-hidden"
    >
      {/* ── Video background ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/newsletter-bg.jpg"
        >
          <source src="/newsletter-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Contrast overlay ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* ── Editorial content ── */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-36">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-[2.5px] bg-terracotta rounded-full" />
            <span className="font-label text-xs font-bold uppercase tracking-[0.3em] text-white/70">
              Stay in the loop
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-heading text-[40px] sm:text-[48px] lg:text-[56px] text-white leading-[1.05] tracking-tight">
            Don&apos;t miss
            <br />
            what&apos;s next.
          </h2>

          {/* Supporting copy */}
          <p className="mt-5 text-base sm:text-lg text-white/60 leading-relaxed max-w-sm">
            New vendors, curated products, and exclusive updates — straight to your inbox.
          </p>

          {/* Editorial rule */}
          <div className="mt-8 lg:mt-10 h-px bg-white/15 max-w-md" />

          {/* Signup form */}
          <form
            className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-0 max-w-md"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.querySelector("input") as HTMLInputElement).value;
              if (!email) return;
              await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
              form.querySelector("input")!.value = "";
              setStatus("success");
            }}
          >
            <input
              className="flex-1 bg-white/10 border border-white/20 px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors rounded-t-lg sm:rounded-t-none sm:rounded-l-lg sm:border-r-0"
              placeholder="Your email"
              type="email"
              required
            />
            <button
              type="submit"
              className="bg-white text-clay px-7 py-3.5 font-label text-xs font-bold uppercase tracking-[0.15em] hover:bg-terracotta hover:text-white transition-colors duration-300 whitespace-nowrap rounded-b-lg sm:rounded-b-none sm:rounded-r-lg min-h-[44px]"
            >
              Subscribe
            </button>
          </form>

          {status === "success" && (
            <p className="mt-4 text-sm font-medium text-white/80">
              You&apos;re subscribed! Check your inbox to confirm.
            </p>
          )}

          <p className="mt-4 text-xs text-white/30">
            Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
