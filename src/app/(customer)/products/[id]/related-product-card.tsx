"use client";

import Link from "next/link";

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  images: string[] | null;
}

export function RelatedProductCard({
  product,
}: {
  product: RelatedProduct;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block"
    >
      <div className="aspect-square rounded-[20px] overflow-hidden bg-white border border-clay/5 relative mb-4 transition-shadow duration-300 group-hover:shadow-[0_20px_40px_-20px_rgba(61,43,31,0.2)]">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-clay/30 text-xs italic">
            No image
          </div>
        )}
      </div>
      <p className="text-sm font-semibold text-clay group-hover:text-terracotta transition-colors truncate">
        {product.name}
      </p>
      <p className="text-sm text-clay/50 mt-1">
        ${(product.price / 100).toFixed(2)}
      </p>
    </Link>
  );
}
