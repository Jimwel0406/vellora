import Link from "next/link";
import { HeartHandshake, Package, ShieldCheck, ArrowRight, BadgeCheck } from "lucide-react";

export function WhyVellora({
  productCount,
  storeCount,
  categoryCount,
}: {
  productCount: number;
  storeCount: number;
  categoryCount: number;
}) {
  return (
    <section
      data-section="why-vellora"
      className="section-why-vellora max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 lg:pt-24 pb-24 lg:pb-32"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        {/* Media */}
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <img
              src="/why-weave.jpg"
              alt="Artisan hands weaving cream and terracotta yarn on a wooden loom"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-clay text-white rounded-2xl px-6 py-5 shadow-xl hidden sm:block">
            <p className="text-2xl font-bold font-heading">{storeCount}+</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mt-0.5">
              Independent makers
            </p>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2 max-w-xl">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.3em] text-terracotta">
            <HeartHandshake className="w-4 h-4" />
            Why Vellora
          </span>
          <h2 className="mt-5 font-serif italic text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] leading-[1.08]">
            Slow commerce, real craftsmanship
          </h2>
          <p className="mt-5 text-[15px] sm:text-base text-clay/65 leading-relaxed max-w-md">
            Every product on Vellora comes from a vetted independent maker. No
            mass-market slabs &mdash; just pieces made with care, chosen for
            how they age.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              {
                icon: Package,
                title: `${productCount}+ curated products`,
                text: "Hand-picked across every category, updated weekly.",
              },
              {
                icon: ShieldCheck,
                title: "Verified sellers only",
                text: "Each store is vetted before it can list on Vellora.",
              },
              {
                icon: BadgeCheck,
                title: "Fair pricing",
                text: "Markets take the min — makers keep the value they build.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand border border-clay/10">
                  <Icon className="w-5 h-5 text-terracotta" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-[15px] font-bold text-[#1A1A1A]">{title}</p>
                  <p className="text-[13px] text-clay/55 mt-0.5 leading-relaxed">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-4 flex-wrap">
            <Link
              href="/stores"
              className="group inline-flex items-center gap-2 bg-clay hover:bg-terracotta text-white text-[11px] font-bold uppercase tracking-[0.15em] px-6 py-3.5 rounded-lg transition-colors duration-200"
            >
              Meet our makers
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <span className="text-[12px] text-clay/50 font-semibold">
              {categoryCount} categories to explore
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}