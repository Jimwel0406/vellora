export interface StoreItem {
  store: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    createdAt: Date;
  };
  productCount: number;
  rating: number | null;
  reviewCount: number;
  coverImage: string | null;
  categories: string[];
  storeType: string;
  location: string;
  featured: boolean;
  isNew: boolean;
}

export function formatRating(rating: number | null) {
  return rating == null ? "New" : rating.toFixed(1);
}