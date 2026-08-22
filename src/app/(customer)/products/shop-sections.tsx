import Link from "next/link";
import { ArrowRight, BadgeCheck, Compass, Cpu, Shirt, Home, Sparkles, Dumbbell, BookOpen, Boxes } from "lucide-react";
import type { ShopProduct } from "./shop-types";
import { formatPrice, Stars } from "./shop-types";

const CATEGORY_ICONS: Record<string, typeof Cpu> = {
  Electronics: Cpu,
  "Fashion & Apparel": Shirt,
  "Home & Living": Home,
  "Health & Beauty": Sparkles,
  "Sports & Outdoors": Dumbbell,
  "Books & Stationery": BookOpen,
};

export function ShopHeroBanner() {
  return (
    <section data-section="shop-hero-banner" className="section-shop-hero-banner relative overflow-hidden rounded-2xl bg-clay text-sand mb-8">
      <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-terracotta/30 blur-3xl pointer-events-none" />
      <div className="grid grid-cols-1 sm:grid-cols-[55%_45%] items-center min-h-[280px] lg:min-h-[260px]">
        <div className="relative z-10 p-7 sm:p-10">
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-ochre inline-flex items-center gap-2">
            <BadgeCheck className="w-3.5 h-3.5" />
            Pure Quality
          </p>
          <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-sand tracking-tight leading-[1.05] mt-3">
            Better Living.
          </h2>
          <p className="text-xs sm:text-sm text-sand/70 leading-relaxed mt-3 max-w-[340px]">
            Discover premium products, exclusive offers, and everyday essentials.
          </p>
          <Link
            href="/products"
            className="group mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-sand text-clay text-xs font-bold uppercase tracking-[0.15em] hover:bg-ochre transition-colors duration-200"
          >
            Shop Now
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="hidden sm:block relative h-full min-h-[220px] lg:min-h-[260px]">
          <img
            src="/hero-collection.jpg"
            alt="Curated products"
            className="absolute inset-0 w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      </div>
    </section>
  );
}

export function ShopByCategories({ categories }: { categories: string[] }) {
  return (
    <section data-section="shop-by-categories" className="section-shop-by-categories py-24 lg:py-32">
      <SectionHeader
        eyebrow={
          <>
            <Compass className="w-3.5 h-3.5" />
            Explore
          </>
        }
        title="Shop by Categories"
      />
      <div className="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 w-max sm:w-full sm:grid sm:grid-cols-6 sm:gap-5">
          {categories.map((name) => {
            const Icon = CATEGORY_ICONS[name] ?? Home;
            return (
              <Link
                key={name}
                href={`/products?category=${encodeURIComponent(name)}`}
                className="group flex flex-col items-center gap-3 shrink-0"
              >
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border border-clay/10 flex items-center justify-center text-clay/60 group-hover:text-terracotta group-hover:border-terracotta/40 transition-colors duration-300">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-clay/80 group-hover:text-terracotta transition-colors whitespace-nowrap">
                  {name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductRow({
  name,
  eyebrow,
  title,
  products,
  icon,
}: {
  name: string;
  eyebrow: string;
  title: string;
  products: ShopProduct[];
  icon?: React.ReactNode;
}) {
  return (
    <section data-section={name} className={`section-${name}`}>
      <div className="mb-4">
        <Link
          href="/products"
          className="group inline-flex items-center gap-1 h-7 px-2.5 rounded-full border border-clay/15 text-[9px] font-bold uppercase tracking-[0.18em] text-clay/50 hover:text-sand hover:bg-clay hover:border-clay transition-all duration-200 whitespace-nowrap"
        >
          View all
          <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta inline-flex items-center gap-2">
            {icon ?? <Boxes className="w-3.5 h-3.5" />}
            {eyebrow}
          </p>
          <h3 className="font-serif italic text-xl sm:text-2xl text-clay tracking-tight mt-1.5">
            {title}
          </h3>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {products.map((product) => (
          <ProductRowItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductRowItem({ product }: { product: ShopProduct }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex items-center gap-3.5 bg-white border border-clay/10 rounded-xl p-3 hover:border-terracotta/40 hover:shadow-[0_12px_28px_-16px_rgba(61,43,31,0.22)] transition-all duration-300"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-sand/40">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-clay/30 text-[10px] italic">
            No image
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h4 className="text-[13px] sm:text-sm font-semibold text-clay leading-snug line-clamp-2">
          {product.name}
        </h4>
        <div className="mt-1.5">
          <Stars rating={product.rating} />
        </div>
        <p className="mt-1.5 text-sm sm:text-[15px] font-bold text-clay">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: React.ReactNode;
  title: string;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta inline-flex items-center gap-2">
        {eyebrow}
      </p>
      <div className="flex items-center justify-center gap-4 mt-3">
        <span className="h-px w-10 sm:w-20 bg-clay/20" />
        <h2 className="font-serif italic text-3xl sm:text-4xl text-clay tracking-tight">{title}</h2>
        <span className="h-px w-10 sm:w-20 bg-clay/20" />
      </div>
    </div>
  );
}