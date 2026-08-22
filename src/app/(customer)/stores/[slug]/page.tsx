import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { stores, products, categories as catTable, storeFollows } from "@/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { StoreProductGrid } from "./store-product-grid";
import { FollowButton } from "./follow-button";
import {
  ChevronRight,
  BadgeCheck,
  Package,
  ArrowRight,
  Info,
  Store,
} from "lucide-react";
import { auth } from "@/lib/auth";

const storeAccent: Record<string, { solid: string; soft: string; text: string }> = {
  TechHub: { solid: "#6D5AE6", soft: "#ECE9FB", text: "#5B49C7" },
  StyleNest: { solid: "#E85D8A", soft: "#FCE9EF", text: "#D03B6B" },
  HomeCraft: { solid: "#2FA484", soft: "#E1F4EE", text: "#1F8A6E" },
  FitGear: { solid: "#E88B2A", soft: "#FDF0E0", text: "#D4761C" },
  GreenLeaf: { solid: "#3E9B5C", soft: "#E2F3E7", text: "#2F8047" },
  BookNook: { solid: "#5B5BD6", soft: "#E9E9FA", text: "#4646C0" },
};

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await db
    .select()
    .from(stores)
    .where(eq(stores.slug, slug))
    .then((r) => r[0]);

  if (!store) notFound();

  if (!store.active) {
    return (
      <div className="bg-[#FAF7EF] min-h-screen">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-8 pb-20">
          <nav className="flex items-center gap-1.5 text-sm text-[#6B716D] mb-6">
            <Link href="/stores" className="hover:text-[#17201C] transition-colors">
              Stores
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#17201C] font-medium">{store.name}</span>
          </nav>
          <section
            data-section="store-unavailable"
            className="section-store-unavailable rounded-3xl border border-[#E5E8E5] bg-white px-6 py-16 sm:py-20 text-center"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2E8CF]">
              <Store className="h-8 w-8 text-[#A6634B]" aria-hidden />
            </span>
            <h1 className="mt-5 font-heading text-2xl sm:text-3xl font-bold text-[#17201C]">
              {store.name} is unavailable
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-[#6B716D] leading-relaxed">
              This store is temporarily unavailable. Its products and storefront
              will be back once it&apos;s re-enabled.
            </p>
            <Link
              href="/stores"
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-[#17201C] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3E8F68]"
            >
              Browse other stores
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </section>
        </div>
      </div>
    );
  }

  const [storeProducts, otherStores] = await Promise.all([
    db
      .select()
      .from(products)
      .where(eq(products.storeId, store.id))
      .orderBy(products.id),
    db
      .select()
      .from(stores)
      .where(and(ne(stores.id, store.id), eq(stores.active, true)))
      .limit(3),
  ]);

  const storeCategories = await db
    .select({ name: catTable.name })
    .from(products)
    .innerJoin(catTable, eq(products.categoryId, catTable.id))
    .where(eq(products.storeId, store.id));

  const uniqueCategories = [...new Set(storeCategories.map((c) => c.name))];

  const session = await auth();
  const isLoggedIn = !!session?.user;

  let isFollowing = false;
  if (isLoggedIn) {
    const follow = await db
      .select()
      .from(storeFollows)
      .where(
        and(
          eq(storeFollows.storeId, store.id),
          eq(storeFollows.userId, parseInt(session!.user.id))
        )
      )
      .then((r) => r[0]);
    isFollowing = !!follow;
  }

  const accent = storeAccent[store.name] || { solid: "#3E8F68", soft: "#E2F3E7", text: "#2F8047" };
  const memberSince = new Date(store.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const heroImg = storeProducts.find((p) => p.images?.[0])?.images?.[0];

  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[#6B716D] mb-8">
          <Link href="/stores" className="hover:text-[#17201C] transition-colors">
            Stores
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#17201C] font-medium">{store.name}</span>
        </nav>

        {/* ===== HERO (editorial split — Aura Studios style) ===== */}
        <section
          data-section="store-hero"
          className="section-store-hero grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center mb-14 sm:mb-20"
        >
          {/* Copy block */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2.5">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={`${store.name} logo`}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-[#A6634B]/30"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A6634B]/10 ring-2 ring-[#A6634B]/30">
                  <Store className="h-4 w-4 text-[#A6634B]" />
                </span>
              )}
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#A6634B]">
                Vellora storefront
              </span>
            </div>

            <h1 className="mt-5 font-serif italic text-[44px] sm:text-6xl lg:text-7xl text-[#3D2B1F] leading-[1.02] tracking-tight">
              {store.name}
            </h1>

            {store.description && (
              <p className="mt-5 max-w-lg text-[15px] sm:text-base text-[#3D2B1F]/65 leading-relaxed">
                {store.description}
              </p>
            )}

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#3D2B1F]">
                  {storeProducts.length}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#3D2B1F]/50 mt-1 block">
                  Products
                </span>
              </div>
              <div className="h-10 w-px bg-[#3D2B1F]/15" />
              <div>
                <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#3D2B1F]">
                  {uniqueCategories.length}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#3D2B1F]/50 mt-1 block">
                  Categories
                </span>
              </div>
              <div className="h-10 w-px bg-[#3D2B1F]/15" />
              <div>
                <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#3D2B1F]">
                  {memberSince.split(" ").slice(1).join(" ") || memberSince}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#3D2B1F]/50 mt-1 block">
                  Since
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#store-products"
                className="group inline-flex items-center gap-2 bg-[#3D2B1F] hover:bg-[#A6634B] text-white text-[11px] font-bold uppercase tracking-[0.15em] px-6 py-3.5 rounded-full transition-colors duration-200"
              >
                Shop {store.name}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <FollowButton
                storeId={store.id}
                slug={slug}
                initialFollowing={isFollowing}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>

          {/* Arch image block */}
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-8 bg-[radial-gradient(50%_50%_at_60%_40%,rgba(200,155,95,0.18)_0%,transparent_70%)]" />
            <div className="relative mx-auto w-full max-w-[420px]">
              <div className="overflow-hidden rounded-t-[999px] rounded-b-[36px] bg-[#F2E8CF]">
                {heroImg ? (
                  <img
                    src={heroImg}
                    alt={`${store.name} featured product`}
                    className="w-full aspect-[4/5] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[4/5] flex items-center justify-center">
                    <Store className="w-12 h-12 text-[#A6634B]/60" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-4 py-2 shadow-lg">
                <BadgeCheck className="w-4 h-4 text-[#A6634B]" />
                <span className="text-[11px] font-bold text-[#3D2B1F] whitespace-nowrap">
                  Verified seller
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ABOUT + CATEGORIES ===== */}
        <section
          data-section="store-about"
          className="section-store-about grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-5 mb-14"
        >
          {/* About card */}
          <div className="rounded-2xl border border-[#E5E8E5] bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: accent.soft }}
              >
                <Info className="w-4 h-4" style={{ color: accent.text }} />
              </span>
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#6B716D]">
                About this store
              </h2>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[#17201C]/80">
              {store.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6B716D]">
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4" style={{ color: accent.text }} />
                Verified seller
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4" style={{ color: accent.text }} />
                {storeProducts.length} products listed
              </span>
            </div>
          </div>

          {/* Categories card */}
          <div className="rounded-2xl border border-[#E5E8E5] bg-white p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#6B716D]">
              Browse categories
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {uniqueCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-transform duration-200 hover:scale-[1.04] active:scale-95"
                  style={{ backgroundColor: accent.soft, color: accent.text }}
                >
                  {cat}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <StoreProductGrid products={storeProducts} storeSlug={slug} />

        {/* ===== OTHER STORES ===== */}
        {otherStores.length > 0 && (
          <section
            data-section="store-other-stores"
            className="section-store-other-stores mt-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#17201C] font-heading">
                Other stores you might like
              </h2>
              <Link
                href="/stores"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#3E8F68] hover:text-[#2E7A56] transition-colors"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {otherStores.map((s) => {
                const a = storeAccent[s.name] || { solid: "#3E8F68", soft: "#E2F3E7", text: "#2F8047" };
                return (
                  <Link
                    key={s.id}
                    href={`/stores/${s.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-[#E5E8E5] bg-white transition-all duration-300 hover:border-[#17201C]/20 hover:shadow-[0_24px_50px_-30px_rgba(23,32,28,0.5)] hover:-translate-y-1"
                  >
                    <div
                      className="h-24 relative"
                      style={{ backgroundColor: a.soft }}
                    >
                      <div className="absolute inset-0 opacity-[0.12]">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_20%_20%,#17201C_0,transparent_40%),radial-gradient(circle_at_80%_60%,#17201C_0,transparent_45%)]" />
                      </div>
                      <div
                        className="absolute -bottom-6 left-6 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl text-xl font-bold text-white shadow-lg ring-4 ring-white"
                        style={{ backgroundColor: a.solid }}
                      >
                        {s.logo ? (
                          <img
                            src={s.logo}
                            alt={`${s.name} logo`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          s.name.charAt(0)
                        )}
                      </div>
                    </div>
                    <div className="px-6 pt-10 pb-5">
                      <h3 className="font-bold text-[#17201C] font-heading group-hover:text-[#3E8F68] transition-colors">
                        {s.name}
                      </h3>
                      {s.description && (
                        <p className="mt-1.5 text-xs text-[#6B716D] leading-relaxed line-clamp-2">
                          {s.description}
                        </p>
                      )}
                      <span
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] transition-transform group-hover:translate-x-1"
                        style={{ color: a.text }}
                      >
                        Visit store
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
