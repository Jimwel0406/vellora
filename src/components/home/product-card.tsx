import Link from "next/link";
import { Star } from "lucide-react";

export interface HomeProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  rating?: number | null;
  reviewCount?: number | null;
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ProductCard({ product }: { product: HomeProduct }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white border border-clay/10 rounded-xl overflow-hidden hover:border-terracotta/40 hover:shadow-[0_12px_28px_-16px_rgba(61,43,31,0.25)] transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-sand/40">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-clay/30 text-xs italic">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3.5 sm:p-4 lg:p-5">
        <h3 className="text-sm font-semibold text-clay leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.rating != null && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i <= Math.round(product.rating!)
                      ? "text-terracotta fill-terracotta"
                      : "text-clay/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-clay/60">
              {product.rating!.toFixed(1)}
              {product.reviewCount != null && ` (${product.reviewCount})`}
            </span>
          </div>
        )}

        <p className="mt-2 text-base font-bold text-clay">{formatPrice(product.price)}</p>

        <span className="mt-3 w-full inline-flex items-center justify-center py-2.5 rounded-lg bg-clay text-sand text-[10px] font-bold uppercase font-label tracking-[0.2em] group-hover:bg-terracotta transition-colors duration-300">
          Shop Now
        </span>
      </div>
    </Link>
  );
}