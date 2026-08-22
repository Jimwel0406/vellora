"use client";

import { useState } from "react";
import { VariantSelector } from "./variant-selector";
import { AddToCartButton } from "./add-to-cart-button";

export interface VariantDef {
  name: string;
  options: string[];
}

export function PurchasePanel({
  productId,
  stock,
  initialWishlisted = false,
  variants = [],
}: {
  productId: number;
  stock: number;
  initialWishlisted?: boolean;
  variants?: VariantDef[];
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const hasVariants = variants.length > 0;

  const variantLabel = hasVariants
    ? Object.entries(selected)
        .filter(([, value]) => value)
        .map(([name, value]) => `${name}: ${value}`)
        .join(", ")
    : "";

  return (
    <div className="space-y-5">
      {hasVariants && (
        <VariantSelector variants={variants} onSelect={setSelected} />
      )}
      <AddToCartButton
        productId={productId}
        stock={stock}
        initialWishlisted={initialWishlisted}
        variantLabel={variantLabel}
      />
    </div>
  );
}