import Link from "next/link";
import { ArrowRight, Compass, Cpu, Shirt, Home, Sparkles, Dumbbell, BookOpen, Boxes } from "lucide-react";
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


export function ShopByCategories({ categories }: { categories: string[] }) {
  return (
    <section data-section="shop-by-categories" className="section-shop-by-categories py-28 lg:py-36">
      <SectionHeader
        eyebrow={
          <>
            <Compass className="w-4 h-4" />
            Explore
          </>
        }
        title="Shop by Categories"
      />
      <div className="mt-12 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-5 w-max sm:w-full sm:grid sm:grid-cols-6 sm:gap-6">
          {categories.map((name) => {
            const Icon = CATEGORY_ICONS[name] ?? Home;
            return (
              <Link
                key={name}
                href={`/products?category=${encodeURIComponent(name)}`}
                className="group flex flex-col items-center gap-4 shrink-0"
              >
                <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-clay/10 flex items-center justify-center text-clay/60 group-hover:text-terracotta group-hover:border-terracotta/40 group-hover:shadow-[0_8px_24px_-8px_rgba(166,99,75,0.2)] transition-all duration-300">
                  <Icon className="w-8 h-8 sm:w-9 sm:h-9" strokeWidth={1.5} />
                </span>
                <span className="text-sm sm:text-base font-semibold text-clay/80 group-hover:text-terracotta transition-colors whitespace-nowrap">
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
      <div className="mb-5">
        <Link
          href="/products"
          className="group inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-clay/15 text-[10px] font-bold uppercase tracking-[0.18em] text-clay hover:text-sand hover:bg-clay hover:border-clay transition-all duration-200 whitespace-nowrap"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta inline-flex items-center gap-2">
            {icon ?? <Boxes className="w-4 h-4" />}
            {eyebrow}
          </p>
          <h3 className="font-heading text-2xl sm:text-3xl text-clay tracking-tight mt-2">
            {title}
          </h3>
        </div>
      </div>
      <div className="space-y-4">
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
      className="group flex items-center gap-4 bg-white border border-clay/10 rounded-2xl p-4 hover:border-terracotta/40 hover:shadow-[0_16px_36px_-16px_rgba(61,43,31,0.22)] transition-all duration-300"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-sand/40">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
            width="600"
            height="600"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-clay/45 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm sm:text-[15px] font-semibold text-clay leading-snug line-clamp-2">
          {product.name}
        </h4>
        <div className="mt-2">
          <Stars rating={product.rating} />
        </div>
        <p className="mt-2 text-base sm:text-lg font-bold text-clay font-label">
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
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta inline-flex items-center gap-2">
        {eyebrow}
      </p>
      <div className="flex items-center justify-center gap-5 mt-4">
        <span className="h-px w-12 sm:w-24 bg-clay/20" />
        <h2 className="font-heading text-4xl sm:text-5xl text-clay tracking-tight">{title}</h2>
        <span className="h-px w-12 sm:w-24 bg-clay/20" />
      </div>
    </div>
  );
}
