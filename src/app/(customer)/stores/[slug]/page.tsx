import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { stores, products, categories as catTable, storeFollows } from "@/db/schema";
import { eq, ne, and, inArray } from "drizzle-orm";
import { StoreProductGrid } from "./store-product-grid";
import { FollowButton } from "./follow-button";
import { BrandVisualStory } from "./brand-visual-story";
import {
  ChevronRight,
  BadgeCheck,
  ArrowRight,
  Store,
} from "lucide-react";
import { auth } from "@/lib/auth";

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
      <div className="bg-canvas min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 pt-8 pb-12 lg:pb-16">
          <nav className="flex items-center gap-1.5 text-sm text-clay/50 mb-6">
            <Link href="/stores" className="hover:text-clay transition-colors">
              Stores
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-clay/30" />
            <span className="text-clay font-medium">{store.name}</span>
          </nav>
          <section
            data-section="store-unavailable"
            className="border border-clay/10 bg-white px-6 py-16 sm:py-20 text-center"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center bg-sand/60">
              <Store className="h-8 w-8 text-terracotta" aria-hidden />
            </span>
            <h1 className="mt-5 font-heading text-2xl sm:text-3xl font-semibold text-clay">
              {store.name} is unavailable
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-clay/60 leading-relaxed">
              This store is temporarily unavailable. Its products and storefront
              will be back once it&apos;s re-enabled.
            </p>
            <Link
              href="/stores"
              className="mt-8 inline-flex items-center gap-1.5 bg-terracotta px-8 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-terracotta-deep"
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

  const otherStoreIds = otherStores.map((s) => s.id);

  const otherStoreFirstImage: Record<number, string | null> = {};
  if (otherStoreIds.length) {
    const allOtherProducts = await db
      .select({ storeId: products.storeId, image: products.images })
      .from(products)
      .where(inArray(products.storeId, otherStoreIds))
    ;
    for (const id of otherStoreIds) {
      const match = allOtherProducts.find((p) => p.storeId === id && p.image?.[0]);
      otherStoreFirstImage[id] = match?.image?.[0] ?? null;
    }
  }

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

  const memberSince = new Date(store.createdAt).getFullYear();

  const heroImages = storeProducts
    .filter((p) => p.images?.[0])
    .slice(0, 4)
    .map((p) => p.images![0]);

  return (
    <div className="bg-canvas min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 pt-8 pb-12 lg:pb-16">

        {/* ─── Breadcrumb ──────────────────────────────────────────── */}
        <nav className="flex items-center gap-1.5 text-sm text-clay/50 mb-6 lg:mb-8">
          <Link href="/stores" className="hover:text-clay transition-colors">
            Stores
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-clay/30" />
          <span className="text-clay font-medium">{store.name}</span>
        </nav>

        {/* ═══════════════════════════════════════════════════════════
            01 — STORE HERO
            ═══════════════════════════════════════════════════════════ */}
        <section
          data-section="store-hero"
          className="section-store-hero grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10 items-start mb-10 lg:mb-14"
        >
          {/* Left — Editorial copy */}
          <div className="order-2 lg:order-1 lg:pt-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2.5px] bg-terracotta rounded-full" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta font-label">
                Vellora Storefront
              </span>
            </div>

            <h1 className="font-heading text-[44px] sm:text-[56px] lg:text-[68px] text-clay font-semibold leading-[0.92] tracking-[-0.03em]">
              {store.name}
            </h1>

            {store.description && (
              <p className="mt-4 text-base sm:text-lg text-clay/50 leading-relaxed max-w-lg">
                {store.description}
              </p>
            )}

            {/* Metadata line */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-clay">
                {String(storeProducts.length).padStart(2, "0")} Products
              </span>
              <span className="text-clay/20 text-sm">·</span>
              <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-clay">
                {String(uniqueCategories.length).padStart(2, "0")} Category{uniqueCategories.length !== 1 ? "s" : ""}
              </span>
              <span className="text-clay/20 text-sm">·</span>
              <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-clay">
                Est. {memberSince}
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#store-products"
                className="group inline-flex items-center gap-2.5 bg-terracotta hover:bg-terracotta-deep text-white text-[11px] font-bold uppercase tracking-[0.15em] px-7 py-3.5 transition-colors duration-200"
              >
                Shop Store
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <FollowButton
                storeId={store.id}
                slug={slug}
                initialFollowing={isFollowing}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>

          {/* Right — Editorial image composition */}
          <div className="order-1 lg:order-2 relative">
            {/* Large dominant image */}
            <div className="relative overflow-hidden bg-sand/60 aspect-[4/5]">
              {heroImages[0] ? (
                <img
                  src={heroImages[0]}
                  alt={`${store.name} featured product`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Store className="w-16 h-16 text-clay/15" />
                </div>
              )}
            </div>

            {/* Smaller overlapping image — bottom-right, desktop only */}
            <div className="hidden lg:block absolute -bottom-4 right-0 w-[40%] overflow-hidden shadow-[0_8px_30px_-8px_rgba(61,43,31,0.12)]">
              <div className="aspect-[3/4] bg-sand/40">
                {heroImages[1] ? (
                  <img
                    src={heroImages[1]}
                    alt={`${store.name} detail`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store className="w-8 h-8 text-clay/10" />
                  </div>
                )}
              </div>
            </div>

            {/* Verified badge — small floating accent */}
            <div className="absolute top-4 left-4 lg:top-6 lg:-left-2 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 shadow-[0_2px_12px_-2px_rgba(61,43,31,0.1)]">
              <BadgeCheck className="w-3.5 h-3.5 text-terracotta" />
              <span className="text-[11px] font-bold text-clay whitespace-nowrap uppercase tracking-[0.08em]">
                Verified
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            02 — STORE INTRO / BRAND STORY
            ═══════════════════════════════════════════════════════════ */}
        <section
          data-section="store-intro"
          className="section-store-intro mb-10 lg:mb-12"
        >
          <div className="border-t border-clay/10 pt-10 lg:pt-14">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-20">
              {/* Brand statement */}
              <div>
                <span className="block font-label text-xs font-bold uppercase tracking-[0.25em] text-terracotta mb-5">
                  About the Store
                </span>
                {store.description && (
                  <p className="font-heading text-2xl sm:text-3xl lg:text-[34px] text-clay leading-[1.3] tracking-[-0.01em]">
                    {store.description}
                  </p>
                )}
              </div>

              {/* Supporting info + categories */}
              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-sm text-clay/60">
                    <BadgeCheck className="w-4 h-4 text-terracotta shrink-0" />
                    <span>Verified Seller</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-clay/60">
                    <span className="font-bold text-clay">{storeProducts.length}</span>
                    <span>product{storeProducts.length !== 1 ? "s" : ""} listed</span>
                  </div>
                  {uniqueCategories.length > 0 && (
                    <div className="flex items-center gap-2.5 text-sm text-clay/60">
                      <span>{uniqueCategories.join(" · ")}</span>
                    </div>
                  )}
                </div>

                {/* Category navigation */}
                {uniqueCategories.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-clay/8">
                    <span className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-clay/40 mb-3">
                      Explore
                    </span>
                    <div className="flex flex-col gap-2">
                      {uniqueCategories.map((cat) => (
                        <Link
                          key={cat}
                          href={`/products?category=${encodeURIComponent(cat)}`}
                          className="group inline-flex items-center justify-between py-2 border-b border-clay/6 last:border-0 hover:border-clay/15 transition-colors"
                        >
                          <span className="text-sm font-medium text-clay group-hover:text-terracotta transition-colors uppercase tracking-[0.05em]">
                            {cat}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-clay/30 group-hover:text-terracotta group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            03 — BRAND VISUAL STORY
            ═══════════════════════════════════════════════════════════ */}
        <BrandVisualStory
          primarySrc={heroImages[2] || heroImages[0] || null}
          secondarySrc={heroImages[3] || heroImages[1] || null}
          storeName={store.name}
          description={store.description}
        />

        {/* ═══════════════════════════════════════════════════════════
            04 — PRODUCTS
            ═══════════════════════════════════════════════════════════ */}
        <StoreProductGrid products={storeProducts} storeSlug={slug} />

        {/* ═══════════════════════════════════════════════════════════
            05 — OTHER STORES YOU MIGHT LIKE
            ═══════════════════════════════════════════════════════════ */}
        {otherStores.length > 0 && (
          <section
            data-section="store-other-stores"
            className="section-store-other-stores mt-14 lg:mt-16"
          >
            <div className="border-t border-clay/10 pt-8 lg:pt-12">
              <div className="flex items-end justify-between mb-6 lg:mb-8">
                <div>
                  <span className="block font-label text-xs font-bold uppercase tracking-[0.25em] text-clay/40 mb-3">
                    Continue Discovering
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl text-clay tracking-tight">
                    Other Stores
                  </h2>
                </div>
                <Link
                  href="/stores"
                  className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-terracotta hover:text-terracotta-deep transition-colors"
                >
                  View all
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Desktop: 3-col editorial rail */}
              <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
                {otherStores.map((s) => {
                  const coverImg = otherStoreFirstImage[s.id];
                  return (
                    <Link
                      key={s.id}
                      href={`/stores/${s.slug}`}
                      className="group block"
                    >
                      <div className="aspect-[3/2] overflow-hidden bg-sand/40 relative">
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={s.name}
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store className="w-12 h-12 text-clay/10" />
                          </div>
                        )}
                        {/* Logo badge overlay */}
                        <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center overflow-hidden bg-white/90 backdrop-blur text-xs font-bold text-clay shadow-sm">
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
                      <div className="pt-2.5">
                        <h3 className="font-heading text-base font-semibold text-clay group-hover:text-terracotta transition-colors">
                          {s.name}
                        </h3>
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-clay/40 group-hover:text-terracotta transition-colors">
                          Visit Store
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile: horizontal scroll rail */}
              <div className="sm:hidden flex gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5">
                {otherStores.map((s) => {
                  const coverImg = otherStoreFirstImage[s.id];
                  return (
                    <Link
                      key={s.id}
                      href={`/stores/${s.slug}`}
                      className="group block shrink-0 w-[75vw]"
                    >
                      <div className="aspect-[3/2] overflow-hidden bg-sand/40 relative">
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store className="w-10 h-10 text-clay/10" />
                          </div>
                        )}
                        <div className="absolute top-2.5 left-2.5 flex h-7 w-7 items-center justify-center overflow-hidden bg-white/90 backdrop-blur text-[10px] font-bold text-clay shadow-sm">
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
                      <div className="pt-2">
                        <h3 className="font-heading text-sm font-semibold text-clay">
                          {s.name}
                        </h3>
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-clay/40">
                          Visit Store
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile: view all link */}
              <div className="sm:hidden mt-6">
                <Link
                  href="/stores"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-terracotta"
                >
                  View all stores
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
