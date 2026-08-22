export interface ShopProduct {
  id: number;
  name: string;
  price: number;
  image: string | null;
  categoryName: string | null;
  storeName: string;
  tags: string[] | null;
  stock: number;
  rating: number | null;
  ratingCount: number;
  createdAt: Date;
}

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function productBadge(tags: string[] | null): string | null {
  if (!tags?.length) return null;
  if (tags.includes("Best Seller")) return "Best Seller";
  if (tags.includes("New")) return "New";
  if (tags.includes("Featured")) return "Featured";
  if (tags.includes("Popular")) return "Popular";
  if (tags.includes("Sale")) return "Sale";
  return null;
}

export function Stars({ rating }: { rating: number | null }) {
  if (rating == null) return null;
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={`w-3.5 h-3.5 ${i <= rounded ? "fill-ochre" : "fill-clay/15"}`}
          >
            <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-clay/50">{rating.toFixed(1)}</span>
    </div>
  );
}