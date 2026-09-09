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
      // ignore storage failures (private mode, quota)
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
        // ignore read/fetch failures
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section
      data-section="recently-viewed"
      className="section-recently-viewed mt-[120px]"
    >
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-terracotta">
            Continue browsing
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#1A1A1A] mt-6">
            Recently viewed
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group block">
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
        ))}
      </div>
    </section>
  );
}