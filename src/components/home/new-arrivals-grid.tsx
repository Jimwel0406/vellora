"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import type { HomeProduct } from "./product-card";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

// ─── Product Item ────────────────────────────────────────────────────────────

function ProductItem({
  product,
  index,
  total,
}: {
  product: HomeProduct;
  index: number;
  total: number;
}) {
  const price = formatPrice(product.price);
  const paddedIndex = String(index + 1).padStart(2, "0");
  const paddedTotal = String(total).padStart(2, "0");

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col h-full"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden w-full h-[260px] sm:h-[320px] lg:h-[380px]"
        style={{ borderRadius: "6px" }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-clay/40 text-sm italic bg-sand/60">
            No image
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="pt-3 sm:pt-4 flex flex-col gap-1">
        <span className="font-label text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-clay/50">
          {paddedIndex} / {paddedTotal}
        </span>
        <h3 className="font-heading text-[15px] sm:text-[16px] font-semibold text-clay leading-snug line-clamp-1 group-hover:text-terracotta transition-colors duration-300">
          {product.name}
        </h3>
        <span className="font-label text-[13px] sm:text-[14px] font-medium text-clay/70">
          {price}
        </span>
        {product.rating != null && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i <= Math.round(product.rating!)
                      ? "text-rating"
                      : "text-clay/15"
                  }`}
                  style={
                    i <= Math.round(product.rating!)
                      ? { fill: "#F5C518" }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const CARD_GAP = 16;

export function NewArrivalsGrid({ products }: { products: HomeProduct[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  const updateScrollState = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollTo({
      left: el.scrollLeft + (dir === "left" ? -amount : amount),
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollLeftRef.current = railRef.current?.scrollLeft ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const walk = e.pageX - startX.current;
    if (railRef.current) {
      railRef.current.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [updateScrollState]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateScrollState]);

  if (products.length === 0) return null;

  return (
    <div className="flex items-start sm:gap-5 sm:px-2">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className={`hidden sm:flex shrink-0 items-center justify-center w-11 h-11 rounded-full bg-white border border-clay/10 text-clay shadow-[0_2px_8px_rgba(61,43,31,0.1)] hover:border-terracotta/40 hover:text-terracotta mt-[160px] lg:mt-[190px] transition-all duration-300 ${
          canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll products left"
      >
        <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
      </button>

      {/* Scrollable rail */}
      <div
        ref={railRef}
        className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        role="region"
        aria-label="New arrivals product list"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scroll("right");
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            scroll("left");
          }
        }}
      >
        <div
          className="flex snap-x snap-mandatory gap-5 pl-5 sm:pl-0"
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="flex-none snap-center w-[calc(100vw-48px)] sm:w-[340px]"
            >
              <ProductItem
                product={product}
                index={i}
                total={products.length}
              />
            </div>
          ))}
          {/* Spacer so last card can snap without hitting the edge */}
          <div className="flex-none w-5 sm:hidden" aria-hidden="true" />
        </div>
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className={`hidden sm:flex shrink-0 items-center justify-center w-11 h-11 rounded-full bg-white border border-clay/10 text-clay shadow-[0_2px_8px_rgba(61,43,31,0.1)] hover:border-terracotta/40 hover:text-terracotta mt-[160px] lg:mt-[190px] transition-all duration-300 ${
          canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll products right"
      >
        <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
