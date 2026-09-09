import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Eye, ShieldCheck, Truck, Heart, Store, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Vellora",
  description: "Discover the story behind Vellora — a curated multi-vendor marketplace connecting shoppers with independent sellers across every category.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero — Cinematic full-bleed */}
      <section data-section="about-hero" className="section-about-hero relative min-h-[90vh] flex items-end pb-16 lg:pb-24">
        <div className="absolute inset-0">
          <img
            src="/about-hero.jpg"
            alt="Vellora marketplace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-clay/90 via-clay/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase font-label tracking-[0.3em] text-ochre mb-6">
              Est. 2024 — Portland, OR
            </p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl lg:text-[110px] leading-[0.9] text-white tracking-tight">
              We believe in
              <span className="block text-ochre">better shopping</span>
            </h1>
            <p className="mt-8 text-lg lg:text-xl text-white/60 leading-relaxed max-w-xl">
              A curated marketplace where independent sellers and thoughtful shoppers come together. Discovery made effortless. Commerce made human.
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 h-12 sm:h-14 px-7 sm:px-9 bg-white text-clay text-[11px] font-bold uppercase font-label tracking-[0.15em] rounded-full hover:bg-ochre hover:text-clay transition-all duration-300"
            >
              Explore the Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 h-12 sm:h-14 px-7 sm:px-9 border border-white/30 text-white text-[11px] font-bold uppercase font-label tracking-[0.15em] rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Open Your Store
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats — Horizontal band */}
      <section data-section="about-stats" className="section-about-stats py-16 lg:py-20 bg-clay">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {[
              { number: "500+", label: "Independent Sellers" },
              { number: "50k+", label: "Happy Customers" },
              { number: "10k+", label: "Unique Products" },
              { number: "99%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white">{stat.number}</p>
                <p className="mt-2 text-[10px] font-bold uppercase font-label tracking-[0.2em] text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Vellora — Editorial split */}
      <section data-section="about-why" className="section-about-why py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <h2 className="font-heading text-4xl lg:text-6xl text-clay leading-[1.05] tracking-tight">
                Shopping should feel{" "}
                <span className="text-terracotta">personal</span>
              </h2>
              <div className="mt-8 flex items-center gap-4">
                <span className="w-12 h-px bg-terracotta" />
                <p className="text-[11px] font-bold uppercase font-label tracking-[0.2em] text-terracotta">
                  Why We Exist
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 border-l-2 border-t-2 border-terracotta/20 rounded-tl-2xl hidden lg:block" />
                <img
                  alt="Vellora workshop"
                  className="w-full h-auto rounded-2xl shadow-[0_30px_80px_-20px_rgba(61,43,31,0.2)]"
                  src="/about-humantouch.jpg"
                />
              </div>

              <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-base lg:text-lg text-clay/70 leading-relaxed">
                    We built Vellora to solve a real problem: multi-vendor shopping was fragmented, confusing, and impersonal. We bring everything together — dozens of independent stores, one seamless checkout, complete transparency about who you&apos;re buying from.
                  </p>
                </div>
                <div>
                  <p className="text-base lg:text-lg text-clay/70 leading-relaxed">
                    For sellers, we provide beautiful storefronts and the tools to grow. For shoppers, we deliver a curated experience where every product has a story and every purchase supports a real business.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/stores"
                  className="group inline-flex items-center gap-3 h-13 px-8 bg-clay text-sand text-xs font-bold uppercase font-label tracking-[0.15em] rounded-full hover:bg-terracotta transition-colors duration-300"
                >
                  Browse All Stores
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values — Immersive dark section */}
      <section data-section="about-values" className="section-about-values py-20 lg:py-32 bg-[#1A1410] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-terracotta/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ochre/5 rounded-full blur-[100px]" />

        {/* Arch line — bottom centered, half visible */}
        <svg className="hidden sm:block absolute bottom-0 sm:bottom-0 lg:bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] sm:w-[1400px] sm:h-[400px] lg:w-[2400px] lg:h-[600px] sm:text-ochre/[0.10] lg:text-ochre/[0.12]" viewBox="0 0 1200 300" fill="currentColor" stroke="none" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 50%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 50%)" }}>
          <path d="M0,300 L0,30 C100,25 250,15 400,5 C500,0 550,0 600,0 C650,0 700,0 800,5 C950,15 1100,25 1200,30 L1200,300 Z" />
        </svg>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ochre/10 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-16 lg:mb-24">
            <div className="lg:col-span-5">
              <h2 className="font-heading text-4xl lg:text-6xl text-white leading-[1.05] tracking-tight">
                What{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">guides</span>
                  <svg className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+24px)] h-[calc(100%+16px)] text-ochre/40" viewBox="0 0 120 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M60 3C85 2 110 8 115 22C120 36 95 47 60 47C25 47 0 36 5 22C10 8 35 2 60 3Z" />
                  </svg>
                </span>{" "}
                <span className="text-ochre">every decision</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex items-end">
              <div>
                <svg className="w-32 h-8 text-ochre/50 mb-5" viewBox="0 0 120 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M5,20 C20,8 35,25 55,15 C75,5 90,22 115,10" />
                  <path d="M15,26 C35,14 60,28 100,18" opacity="0.5" />
                  <circle cx="115" cy="10" r="2" fill="currentColor" opacity="0.4" />
                </svg>
                <p className="text-lg text-white/50 leading-relaxed max-w-xl">
                  Our values aren&apos;t just words on a page. They shape every feature we build, every seller we onboard, and every interaction we design.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            {[
              {
                icon: Eye,
                number: "01",
                title: "Curated, Not Crowded",
                description: "Every store is handpicked. We prioritize quality over quantity so you can shop with confidence.",
              },
              {
                icon: ShieldCheck,
                number: "02",
                title: "Radical Transparency",
                description: "Know exactly who you're buying from. Every seller has a profile, reviews, and direct communication.",
              },
              {
                icon: Truck,
                number: "03",
                title: "Conscious Delivery",
                description: "Carbon-neutral shipping and 100% plastic-free, recyclable packaging for every order.",
              },
              {
                icon: Heart,
                number: "04",
                title: "Community First",
                description: "A portion of every sale supports local initiatives and the independent businesses powering our platform.",
              },
              {
                icon: Store,
                number: "05",
                title: "Seller Empowerment",
                description: "Beautiful storefronts, analytics, and tools designed to help small businesses thrive online.",
              },
              {
                icon: Leaf,
                number: "06",
                title: "Sustainable by Design",
                description: "We partner with eco-conscious sellers and continuously reduce our environmental footprint.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="group relative flex items-start gap-6 p-6 lg:p-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.06] hover:border-ochre/20 transition-all duration-500"
              >
                <div className="flex-shrink-0">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ochre/10 text-ochre group-hover:bg-ochre/20 transition-colors duration-500">
                    <value.icon className="w-7 h-7" strokeWidth={1.5} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase font-label tracking-[0.2em] text-ochre/60">
                      {value.number}
                    </span>
                    <h3 className="text-base font-semibold text-white">{value.title}</h3>
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy — Full-width quote */}
      <section data-section="about-philosophy" className="section-about-philosophy py-20 lg:py-32 relative">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 border-r-2 border-b-2 border-terracotta/20 rounded-br-2xl hidden lg:block" />
                <img
                  alt="Vellora philosophy"
                  className="w-full h-auto rounded-2xl shadow-[0_30px_80px_-20px_rgba(61,43,31,0.2)]"
                  src="/about-workshop.jpg"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mb-8 flex items-center gap-3">
                <span className="w-12 h-[3px] bg-terracotta rounded-full" />
              </div>
              <h2 className="font-heading text-4xl lg:text-5xl text-clay leading-[1.1] tracking-tight mb-8">
                Less noise, <span className="text-terracotta">more craft</span>
              </h2>
              <p className="text-base lg:text-lg text-clay/60 leading-relaxed mb-6">
                We believe the best marketplaces don&apos;t just sell products — they curate experiences. Every detail matters, from the sellers we onboard to the packaging that arrives at your door.
              </p>
              <p className="text-base lg:text-lg text-clay/60 leading-relaxed mb-10">
                Vellora is for people who care about what they bring into their lives. People who read the label, check the maker, and appreciate the difference between mass-produced and thoughtfully crafted.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-3 h-13 px-8 bg-terracotta text-white text-xs font-bold uppercase font-label tracking-[0.15em] rounded-full hover:bg-terracotta-deep transition-colors duration-300"
                >
                  Shop the Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-3 h-13 px-8 border border-clay/20 text-clay text-xs font-bold uppercase font-label tracking-[0.15em] rounded-full hover:bg-clay/5 transition-colors duration-300"
                >
                  Open Your Store
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Bold closing */}
      <section data-section="about-cta" className="section-about-cta py-20 lg:py-32 bg-[#FAF7EF] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-terracotta/5 rounded-full blur-[150px]" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 text-center relative z-10">
          <p className="text-[11px] font-bold uppercase font-label tracking-[0.3em] text-terracotta mb-6">
            Join the Movement
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-clay leading-[1.05] tracking-tight mb-8">
            Discover something <span className="block sm:inline text-terracotta">you didn&apos;t know you needed</span>
          </h2>
          <p className="text-lg text-clay/50 max-w-xl mx-auto mb-12">
            Whether you&apos;re shopping for yourself or building a business, Vellora is where quality meets community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-3 h-14 px-10 bg-clay text-sand text-xs font-bold uppercase font-label tracking-[0.15em] rounded-full hover:bg-terracotta transition-colors duration-300"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-3 h-14 px-10 border border-clay/20 text-clay text-xs font-bold uppercase font-label tracking-[0.15em] rounded-full hover:bg-clay/5 transition-colors duration-300"
            >
              Start Selling
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
