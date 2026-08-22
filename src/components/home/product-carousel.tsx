"use client";

import { ProductCard, type HomeProduct } from "./product-card";

export function ProductCarousel({ products }: { products: HomeProduct[] }) {
  if (products.length === 0) return null;

  return (
    <>
      {/* Mobile / tablet: horizontal snap carousel */}
      <div className="lg:hidden overflow-x-auto snap-x snap-mandatory flex gap-3 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[42vw] min-w-[150px] max-w-[220px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
