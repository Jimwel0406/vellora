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
      <div className="aspect-[4/5] rounded-[8px] overflow-hidden bg-[#FAF7EC] relative mb-3">
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
      <p className="text-[15px] font-semibold text-clay group-hover:text-terracotta transition-colors truncate">
        {product.name}
      </p>
      <p className="text-[14px] text-clay/60 mt-0.5">
        ${(product.price / 100).toFixed(2)}
      </p>
    </Link>
  );
}
