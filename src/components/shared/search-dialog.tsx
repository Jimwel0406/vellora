"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Store, Package, ArrowRight } from "lucide-react";

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

const RECENT_KEY = "vellora:recent-searches";
const MAX_RECENT = 6;

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const list: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(list)
      ? list.filter((v): v is string => typeof v === "string").slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

function writeRecent(search: string) {
  try {
    const next = [
      search,
      ...readRecent().filter((s) => s.toLowerCase() !== search.toLowerCase()),
    ].slice(0, MAX_RECENT);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
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
  const [recent, setRecent] = useState<string[]>(() => readRecent());
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 50);
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

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    writeRecent(q);
    setRecent(readRecent());
    go(`/products?q=${encodeURIComponent(q)}`);
  };

  const productCount = results?.products.length ?? 0;
  const storeCount = results?.stores.length ?? 0;
  const hasResults = productCount > 0 || storeCount > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="absolute inset-0 bg-clay/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-2xl bg-sand shadow-2xl border border-clay/10 overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-clay/10">
          <Search className="w-5 h-5 text-clay/50 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit(query);
            }}
            placeholder="Search products and stores..."
            className="flex-1 bg-transparent text-base text-clay placeholder:text-clay/40 focus:outline-none"
          />
          {loading ? (
            <Loader2 className="w-4 h-4 text-clay/40 animate-spin shrink-0" />
          ) : (
            <button
              onClick={onClose}
              aria-label="Close search"
              className="w-8 h-8 rounded-full flex items-center justify-center text-clay/50 hover:text-clay hover:bg-clay/5 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {!query.trim() && (
            <div className="px-4 py-6">
              <p className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-clay/50 mb-3">
                Recent searches
              </p>
              {recent.length === 0 ? (
                <p className="px-1 text-sm text-clay/50 text-center py-6">
                  Search for products or stores across Vellora.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {recent.map((term) => (
                    <button
                      key={term}
                      onClick={() => submit(term)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-clay/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-clay/70 hover:border-terracotta/40 hover:text-terracotta transition-colors cursor-pointer"
                    >
                      <Search className="w-3 h-3" aria-hidden />
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {query.trim() && !loading && !hasResults && (
            <p className="px-4 py-10 text-center text-sm text-clay/50">
              No results for &ldquo;{query}&rdquo;.
            </p>
          )}

          {results?.products && productCount > 0 && (
            <div className="py-1">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-clay/50">
                Products
              </p>
              {results.products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => go(`/products/${p.id}`)}
                  className="group/result w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-clay/5 transition-colors cursor-pointer"
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-11 h-11 rounded-lg object-cover bg-clay/5"
                    />
                  ) : (
                    <span className="w-11 h-11 rounded-lg bg-clay/5 flex items-center justify-center">
                      <Package className="w-5 h-5 text-clay/30" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-clay truncate">
                      {p.name}
                    </span>
                    <span className="block text-[11px] text-clay/50 truncate">
                      {p.storeName ?? "Vellora"} · ${(p.price / 100).toFixed(2)}
                    </span>
                  </span>
                  <span className="shrink-0 hidden group-hover/result:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-terracotta">
                    View
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
              <button
                onClick={() => submit(query.trim())}
                className="mt-1 w-full px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-terracotta hover:text-clay transition-colors cursor-pointer"
              >
                View all product results →
              </button>
            </div>
          )}

          {results?.stores && storeCount > 0 && (
            <div className="py-1 border-t border-clay/10">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-clay/50">
                Stores
              </p>
              {results.stores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => go(`/stores/${s.slug}`)}
                  className="group/result w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-clay/5 transition-colors cursor-pointer"
                >
                  {s.logo ? (
                    <img
                      src={s.logo}
                      alt={`${s.name} logo`}
                      className="w-11 h-11 rounded-full object-cover bg-clay/5"
                    />
                  ) : (
                    <span className="w-11 h-11 rounded-full bg-clay/5 flex items-center justify-center">
                      <Store className="w-5 h-5 text-clay/30" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-clay truncate">
                      {s.name}
                    </span>
                    <span className="block text-[11px] text-clay/50 truncate">
                      {s.description ?? "Independent store"}
                    </span>
                  </span>
                  <span className="shrink-0 hidden group-hover/result:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-terracotta">
                    View
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 h-10 flex items-center justify-between border-t border-clay/10 text-[10px] text-clay/40">
          <span>Results for &ldquo;{query || "…"}&rdquo;</span>
          <span className="inline-flex items-center gap-1.5">
            <Link
              href="/products"
              onClick={onClose}
              className="hover:text-terracotta transition-colors"
            >
              Browse all products
            </Link>
            <span className="text-clay/25">·</span>
            <Link
              href="/stores"
              onClick={onClose}
              className="hover:text-terracotta transition-colors"
            >
              All stores
            </Link>
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}