"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Store, Package } from "lucide-react";

interface SearchResult {
  products: {
    id: number;
    name: string;
    price: number;
    image: string | null;
    storeName: string | null;
  }[];
  stores: {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
  }[];
}

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setAnimating(false);
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (timer.current) clearTimeout(timer.current);
    const q = value.trim();
    if (!q) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults({ products: [], stores: [] });
      } finally {
        setLoading(false);
      }
    }, 250);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!visible) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    go(`/products?q=${encodeURIComponent(q)}`);
  };

  const productCount = results?.products.length ?? 0;
  const storeCount = results?.stores.length ?? 0;
  const hasResults = productCount > 0 || storeCount > 0;
  const hasQuery = query.trim().length > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-clay/30 backdrop-blur-[2px] transition-opacity duration-200 ${
          animating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel wrapper */}
      <div
        className={`relative mx-auto w-full transition-all duration-200 ease-out ${
          animating
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2"
        }`}
      >
        {/* Desktop panel */}
        <div className="hidden lg:block max-w-[680px] mx-auto mt-[72px]">
          <div className="bg-[#FAF7EF] border border-clay/8 rounded-lg shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Input row */}
            <div className="flex items-center gap-4 px-6 h-[60px] border-b border-clay/8">
              <Search className="w-5 h-5 text-clay/50 shrink-0" strokeWidth={2} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit(query);
                }}
                placeholder="Search products and stores..."
                className="flex-1 bg-transparent text-[15px] font-medium text-clay placeholder:text-clay/35 focus:outline-none font-sans tracking-[-0.01em]"
              />
              {loading ? (
                <Loader2 className="w-4 h-4 text-clay/30 animate-spin shrink-0" />
              ) : (
                <button
                  onClick={onClose}
                  aria-label="Close search"
                  className="w-8 h-8 flex items-center justify-center text-clay/40 hover:text-clay transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4.5 h-4.5" strokeWidth={1.5} />
                </button>
              )}
            </div>

            {/* Content area */}
            <div className="max-h-[52vh] overflow-y-auto">
              {/* Empty state — no query */}
              {!hasQuery && (
                <div className="px-6 py-10 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay/30 font-label mb-2">
                    Start your search
                  </p>
                  <p className="text-[13px] text-clay/40">
                    Find products and stores across Vellora.
                  </p>
                </div>
              )}

              {/* Empty state — query with no results */}
              {hasQuery && !loading && !hasResults && (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm text-clay/50">
                    No results for &ldquo;{query}&rdquo;.
                  </p>
                </div>
              )}

              {/* Results — products */}
              {results?.products && productCount > 0 && (
                <div>
                  <p className="px-6 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label">
                    Products
                  </p>
                  {results.products.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => go(`/products/${p.id}`)}
                      className="group/result w-full flex items-center gap-3.5 px-6 py-2.5 text-left hover:bg-clay/[0.03] transition-colors cursor-pointer"
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded object-cover bg-clay/5 shrink-0"
                          width="40"
                          height="40"
                          loading="lazy"
                        />
                      ) : (
                        <span className="w-10 h-10 rounded bg-clay/5 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-clay/25" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold text-clay truncate leading-tight">
                          {p.name}
                        </span>
                        <span className="block text-[11px] text-clay/45 mt-0.5">
                          {p.storeName ?? "Vellora"} · ${(p.price / 100).toFixed(2)}
                        </span>
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => submit(query.trim())}
                    className="w-full px-6 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-terracotta hover:text-clay transition-colors cursor-pointer"
                  >
                    View all results →
                  </button>
                </div>
              )}

              {/* Results — stores */}
              {results?.stores && storeCount > 0 && (
                <div className={productCount > 0 ? "border-t border-clay/6" : ""}>
                  <p className="px-6 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label">
                    Stores
                  </p>
                  {results.stores.slice(0, 3).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => go(`/stores/${s.slug}`)}
                      className="group/result w-full flex items-center gap-3.5 px-6 py-2.5 text-left hover:bg-clay/[0.03] transition-colors cursor-pointer"
                    >
                      {s.logo ? (
                        <img
                          src={s.logo}
                          alt={`${s.name} logo`}
                          className="w-10 h-10 rounded-full object-cover bg-clay/5 shrink-0"
                          width="40"
                          height="40"
                          loading="lazy"
                        />
                      ) : (
                        <span className="w-10 h-10 rounded-full bg-clay/5 flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4 text-clay/25" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold text-clay truncate leading-tight">
                          {s.name}
                        </span>
                        <span className="block text-[11px] text-clay/45 mt-0.5">
                          {s.description ?? "Independent store"}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 h-11 flex items-center border-t border-clay/8">
              <div className="flex items-center gap-5">
                <Link
                  href="/products"
                  onClick={onClose}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-clay/35 hover:text-terracotta transition-colors"
                >
                  Browse all products
                </Link>
                <Link
                  href="/stores"
                  onClick={onClose}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-clay/35 hover:text-terracotta transition-colors"
                >
                  Browse all stores
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile panel */}
        <div className="lg:hidden bg-[#FAF7EF] min-h-screen">
          <div className="flex items-center gap-3 px-5 h-14 border-b border-clay/8">
            <Search className="w-5 h-5 text-clay/50 shrink-0" strokeWidth={2} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(query);
              }}
              placeholder="Search products and stores..."
              className="flex-1 bg-transparent text-base font-medium text-clay placeholder:text-clay/35 focus:outline-none"
            />
            {loading ? (
              <Loader2 className="w-4 h-4 text-clay/30 animate-spin shrink-0" />
            ) : (
              <button
                onClick={onClose}
                aria-label="Close search"
                className="w-8 h-8 flex items-center justify-center text-clay/40 hover:text-clay transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div className="max-h-[calc(100vh-56px)] overflow-y-auto">
            {/* Empty state — no query */}
            {!hasQuery && (
              <div className="px-5 py-12 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay/30 font-label mb-2">
                  Start your search
                </p>
                <p className="text-[13px] text-clay/40">
                  Find products and stores across Vellora.
                </p>
                <div className="mt-8 pt-6 border-t border-clay/6">
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/products"
                      onClick={onClose}
                      className="text-[10px] font-bold uppercase tracking-[0.15em] text-clay/35 hover:text-terracotta transition-colors"
                    >
                      Browse all products →
                    </Link>
                    <Link
                      href="/stores"
                      onClick={onClose}
                      className="text-[10px] font-bold uppercase tracking-[0.15em] text-clay/35 hover:text-terracotta transition-colors"
                    >
                      Browse all stores →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state — query with no results */}
            {hasQuery && !loading && !hasResults && (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-clay/50">
                  No results for &ldquo;{query}&rdquo;.
                </p>
              </div>
            )}

            {/* Results — products */}
            {results?.products && productCount > 0 && (
              <div>
                <p className="px-5 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label">
                  Products
                </p>
                {results.products.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => go(`/products/${p.id}`)}
                    className="w-full flex items-center gap-3.5 px-5 py-3 text-left hover:bg-clay/[0.03] transition-colors cursor-pointer"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-11 h-11 rounded object-cover bg-clay/5 shrink-0"
                        width="44"
                        height="44"
                        loading="lazy"
                      />
                    ) : (
                      <span className="w-11 h-11 rounded bg-clay/5 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-clay/25" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-clay truncate leading-tight">
                        {p.name}
                      </span>
                      <span className="block text-[12px] text-clay/45 mt-0.5">
                        {p.storeName ?? "Vellora"} · ${(p.price / 100).toFixed(2)}
                      </span>
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => submit(query.trim())}
                  className="w-full px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-terracotta hover:text-clay transition-colors cursor-pointer"
                >
                  View all results →
                </button>
              </div>
            )}

            {/* Results — stores */}
            {results?.stores && storeCount > 0 && (
              <div className={productCount > 0 ? "border-t border-clay/6" : ""}>
                <p className="px-5 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label">
                  Stores
                </p>
                {results.stores.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => go(`/stores/${s.slug}`)}
                    className="w-full flex items-center gap-3.5 px-5 py-3 text-left hover:bg-clay/[0.03] transition-colors cursor-pointer"
                  >
                    {s.logo ? (
                      <img
                        src={s.logo}
                        alt={`${s.name} logo`}
                        className="w-11 h-11 rounded-full object-cover bg-clay/5 shrink-0"
                        width="44"
                        height="44"
                        loading="lazy"
                      />
                    ) : (
                      <span className="w-11 h-11 rounded-full bg-clay/5 flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5 text-clay/25" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-clay truncate leading-tight">
                        {s.name}
                      </span>
                      <span className="block text-[12px] text-clay/45 mt-0.5">
                        {s.description ?? "Independent store"}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Footer — mobile */}
            {hasQuery && (
              <div className="px-5 py-5 border-t border-clay/6">
                <div className="flex items-center gap-5">
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="text-[10px] font-bold uppercase tracking-[0.15em] text-clay/35 hover:text-terracotta transition-colors"
                  >
                    Browse all products
                  </Link>
                  <Link
                    href="/stores"
                    onClick={onClose}
                    className="text-[10px] font-bold uppercase tracking-[0.15em] text-clay/35 hover:text-terracotta transition-colors"
                  >
                    Browse all stores
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
