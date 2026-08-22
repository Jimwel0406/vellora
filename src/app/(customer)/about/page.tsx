import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Vellora",
  description: "Discover the story behind Vellora — a curated multi-vendor marketplace that connects shoppers with independent sellers and brands across every category.",
};

const images = {
  hero: "/about-hero.jpg",
  flatlay: "/about-flatlay.jpg",
  workshop: "/about-workshop.jpg",
  loom: "/about-loom.jpg",
  humanTouch: "/about-humantouch.jpg",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section data-section="about-hero" className="section-about-hero pt-24 lg:pt-40 pb-16 lg:pb-24">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h1 className="font-serif text-5xl md:text-7xl lg:text-[120px] leading-[0.9] text-clay tracking-tighter mb-6 lg:mb-8">
                The Art of <br /> <span className="italic font-normal">Discovery</span>.
              </h1>
            </div>
            <div className="lg:col-span-4 mb-6 lg:mb-8">
              <p className="text-sm md:text-base text-clay/60 max-w-xs leading-relaxed italic">
                &ldquo;A marketplace is only as good as the community it serves. We exist to connect people with products they didn&apos;t know they needed.&rdquo;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-7 h-[300px] lg:h-[600px] overflow-hidden rounded-xl">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={images.hero}
                alt=""
              />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between gap-6 lg:gap-0">
              <div className="bg-sand/70 p-6 lg:p-8 rounded-xl">
                <p className="text-sm lg:text-base text-clay/70 leading-relaxed mb-4">
                  Vellora is a curated multi-vendor marketplace that connects shoppers with independent sellers and brands across every category. We believe in empowering small businesses and fostering a community where discovery meets convenience.
                </p>
                <div className="flex items-center gap-2 text-clay text-[10px] font-bold uppercase font-label tracking-[0.2em]">
                  <span className="w-8 h-px bg-clay/40" />
                  <span>Est. 2024</span>
                </div>
              </div>
              <div className="h-[200px] lg:h-[280px] overflow-hidden rounded-xl">
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  src={images.flatlay}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Human Touch */}
      <section data-section="about-why-vellora" className="section-about-why-vellora py-16 lg:py-24 bg-white/50">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl lg:text-4xl text-clay mb-4 italic">Why Vellora</h2>
              <p className="text-sm lg:text-base text-clay/60 mb-8 leading-relaxed">
                We built Vellora to make multi-vendor shopping effortless. Browse products from dozens of independent stores, check out once, and track everything in one place. For sellers, we offer a beautiful storefront with the tools you need to grow.
              </p>
              <Link
                href="/stores"
                className="inline-flex items-center gap-2 bg-clay text-white px-6 py-3 text-[10px] font-bold uppercase font-label tracking-[0.2em] rounded-full hover:bg-terracotta transition-all group"
              >
                Browse Stores
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2" />
                </svg>
              </Link>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="relative">
                <div className="absolute -top-4 lg:-top-8 -left-4 lg:-left-8 w-16 lg:w-24 h-16 lg:h-24 border-l-2 border-t-2 border-clay/10" />
                <img
                  alt=""
                  className="w-full h-auto rounded-xl"
                  src={images.humanTouch}
                />
                <div className="absolute -bottom-4 -right-4 bg-white px-4 py-3 rounded-lg">
                  <p className="text-[10px] font-bold uppercase font-label tracking-[0.2em] text-clay">Quality Assured</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section data-section="about-philosophy" className="section-about-philosophy py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-baseline mb-12 lg:mb-16">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-clay">Our Philosophy</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 - Large */}
            <div className="lg:col-span-2 group">
              <div className="relative h-[300px] lg:h-[420px] overflow-hidden rounded-xl bg-terracotta/10">
                <div className="absolute inset-0 bg-gradient-to-t from-clay/60 to-transparent z-10" />
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                  src={images.workshop}
                  alt=""
                />
                <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 z-20 text-white max-w-md">
                  <h3 className="font-serif text-xl lg:text-2xl mb-2">Curated, Not Crowded</h3>
                  <p className="text-sm opacity-90">Every store on Vellora is vetted for quality. We prioritise substance over quantity so you can shop with confidence.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div>
              <div className="h-full border border-clay/10 p-6 lg:p-8 flex flex-col justify-between rounded-xl hover:bg-sand/50 transition-colors duration-500">
                <svg className="w-10 h-10 text-clay mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                </svg>
                <div>
                  <h4 className="font-serif text-lg lg:text-xl text-clay mb-2">Radical Transparency</h4>
                  <p className="text-sm text-clay/60">Know exactly who you&apos;re buying from. Every store on our platform has a profile, reviews, and direct communication with customers.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div>
              <div className="h-full bg-sand/70 p-6 lg:p-8 flex flex-col justify-center items-center text-center rounded-xl">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-2 border-clay/20 flex items-center justify-center mb-4 lg:mb-6">
                  <svg className="w-7 h-7 lg:w-8 lg:h-8 text-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="1.5" />
                    <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" strokeWidth="1.5" />
                    <path d="M13 11h4a2 2 0 012 2v3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h4 className="text-[10px] font-bold uppercase font-label tracking-[0.2em] text-clay mb-2">Conscious Delivery</h4>
                <p className="text-sm text-clay/60">Carbon-neutral shipping and 100% plastic-free, recyclable packaging for every order.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <div className="h-[200px] lg:h-[250px] overflow-hidden rounded-xl">
                  <img
                    className="w-full h-full object-cover"
                    src={images.loom}
                    alt=""
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-serif text-lg lg:text-xl text-clay mb-2">Community First</h4>
                  <p className="text-sm text-clay/60">A portion of every sale goes into the Vellora Community Fund, supporting local initiatives and the independent businesses that power our platform.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-section="about-cta" className="section-about-cta pb-16 lg:pb-24">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12 text-center">
          <div className="inline-block px-4 py-1 border border-clay/20 rounded-full text-clay text-[10px] font-bold uppercase font-label tracking-[0.2em] mb-8">
            Join the Movement
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl text-clay leading-tight mb-8">
            Discover something <br /> <span className="italic">you didn&apos;t know you needed</span>.
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="bg-clay text-white px-10 py-4 text-[10px] font-bold uppercase font-label tracking-[0.2em] rounded-full hover:bg-terracotta transition-all"
            >
              Shop the Collection
            </Link>
            <Link
              href="/register"
              className="px-10 py-4 border border-clay/30 text-clay text-[10px] font-bold uppercase font-label tracking-[0.2em] rounded-full hover:bg-clay/5 transition-all"
            >
              Open Your Store
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
