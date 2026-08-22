import { ProductCard, type HomeProduct } from "./product-card";

export function ProductGrid({ products }: { products: HomeProduct[] }) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}