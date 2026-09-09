"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "vellora:recently-viewed";
const MAX_ITEMS = 8;

export function RecentlyViewedTracker({ productId }: { productId: number }) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const ids: number[] = raw ? JSON.parse(raw) : [];
      const next = [
        productId,
        ...ids.filter((id) => id !== productId),
      ].slice(0, MAX_ITEMS);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
  }, [productId]);

  return null;
}

interface RecentProduct {
  id: number;
  name: string;
  price: number;
  images: string[] | null;
}

export function RecentlyViewedSection() {
  const [products, setProducts] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const ids: number[] = raw ? JSON.parse(raw) : [];
        const unique = [...new Set(ids)].slice(0, MAX_ITEMS);
        if (unique.length === 0) return;

        const fetched = await Promise.all(
          unique.map(async (id) => {
            const res = await fetch(`/api/products?id=${id}`);
            if (!res.ok) return null;
            const p = await res.json();
            return {
              id: p.id,
              name: p.name,
              price: p.price,
              images: p.images ?? null,
            };
          })
        );
        if (!cancelled) {
          setProducts(fetched.filter((p): p is RecentProduct => p !== null));
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section
      data-section="recently-viewed"
      className="section-recently-viewed border-t border-clay/15 py-10 sm:py-12"
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-clay/45 font-label">
        Recently viewed
      </span>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible mt-6 pb-4 lg:pb-0 px-5 lg:px-0">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group block w-[48%] min-w-[150px] shrink-0 snap-start sm:w-[180px] lg:w-auto"
          >
            <div className="aspect-[4/5] rounded-[10px] overflow-hidden bg-[#FAF7EC] mb-2">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-clay/30 text-xs italic">
                  No image
                </div>
              )}
            </div>
            <p className="text-[12px] font-medium text-clay/70 group-hover:text-clay transition-colors truncate">
              {product.name}
            </p>
            <p className="text-[11px] text-clay/50 mt-0.5">
              ${(product.price / 100).toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
