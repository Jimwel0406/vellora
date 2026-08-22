import Link from "next/link";
import {
  Cpu,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface CategoryNavItem {
  id: number;
  name: string;
  slug: string;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: Cpu,
  fashion: Shirt,
  "home-living": Home,
  "health-beauty": Sparkles,
  sports: Dumbbell,
  books: BookOpen,
};

export function CategoryNavigation({
  categories,
}: {
  categories: CategoryNavItem[];
}) {
  if (categories.length === 0) return null;

  return (
    <div>
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase font-label tracking-[0.3em] text-terracotta">
          Shop by Category
        </p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="h-px w-8 sm:w-16 bg-clay/20" />
          <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-clay tracking-tight leading-none">
            Categories
          </h2>
          <span className="h-px w-8 sm:w-16 bg-clay/20" />
        </div>
      </div>

      <div className="mt-10 lg:mt-12 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-5 w-max sm:w-full sm:grid sm:grid-cols-6 sm:gap-6">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug] ?? Home;
            return (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group flex flex-col items-center gap-3 shrink-0"
              >
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border border-clay/10 flex items-center justify-center text-clay/60 group-hover:text-terracotta group-hover:border-terracotta/40 transition-colors duration-300">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-clay/80 group-hover:text-terracotta transition-colors whitespace-nowrap">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}