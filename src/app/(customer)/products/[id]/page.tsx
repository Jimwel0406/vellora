import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/db";
import { products, stores, reviews, users, wishlistItems, orders, orderItems } from "@/db/schema";
import { eq, ne, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { ImageGallery } from "./image-gallery";
import { PurchasePanel, type VariantDef } from "./purchase-panel";
import { VendorProductPanel } from "./vendor-product-panel";
import { ReviewForm } from "./review-form";
import { ReviewList } from "./review-list";
import { StickyAddToCart } from "./sticky-add-to-cart";
import { RelatedProductCard } from "./related-product-card";
import { RecentlyViewedTracker, RecentlyViewedSection } from "./recently-viewed";
import { Check, Star, Truck, ShieldCheck, RotateCcw, Store } from "lucide-react";

const BASE_URL =
  process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) return {};

  const product = await db
    .select()
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(eq(products.id, productId))
    .then((r) => r[0]);

  if (!product) return {};

  const blurb = (product.products.description || "").split("|")[0].trim();
  const storeName = product.stores?.name || "Vellora";
  const image = product.products.images?.[0] ?? null;

  return {
    title: product.products.name,
    description: blurb || `Shop ${product.products.name} from ${storeName} on Vellora.`,
    alternates: {
      canonical: `/products/${product.products.id}`,
    },
    openGraph: {
      title: product.products.name,
      description: blurb || `Shop ${product.products.name} from ${storeName} on Vellora.`,
      type: "website",
      url: `${BASE_URL}/products/${product.products.id}`,
      images: image ? [{ url: image }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) notFound();

  const product = await db
    .select()
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(eq(products.id, productId))
    .then((r) => r[0]);

  if (!product) notFound();
  if (!product.stores?.active) notFound();

  const productReviews = await db
    .select()
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));

  const relatedProducts = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.storeId, product.products.storeId),
        ne(products.id, productId)
      )
    )
    .limit(4);

  const session = await auth();

  const isOwner =
    !!session?.user &&
    product.stores?.userId === parseInt(session.user.id);

  const isSeller = session?.user?.role === "vendor";

  const isWishlisted = session?.user
    ? await db
        .select()
        .from(wishlistItems)
        .where(
          and(
            eq(wishlistItems.userId, parseInt(session.user.id)),
            eq(wishlistItems.productId, productId)
          )
        )
        .then((r) => r.length > 0)
    : false;

  const hasPurchased = session?.user
    ? await db
        .select({ id: orders.id })
        .from(orders)
        .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
        .where(
          and(
            eq(orders.userId, parseInt(session.user.id)),
            eq(orders.status, "completed"),
            eq(orderItems.productId, productId)
          )
        )
        .limit(1)
        .then((r) => r.length > 0)
    : false;

  const stock = product.products.stock;
  const stockSignal =
    stock === 0 ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-600">
        Out of stock
      </span>
    ) : stock <= 5 ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
        Only {stock} left
      </span>
    ) : null;

  const description = product.products.description || "";
  const parts = description.split("|");
  const blurb = parts[0];
  const features: string[] = [];
  const variantDefs: VariantDef[] = [];
  for (const p of parts.slice(1)) {
    const trimmed = p.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("v:")) {
      const [, name, options] = trimmed.split(":");
      if (name && options) {
        variantDefs.push({
          name: name.trim(),
          options: options.split(",").map((o) => o.trim()).filter(Boolean),
        });
      }
    } else {
      features.push(trimmed);
    }
  }

  const totalReviews = productReviews.length;
  const avgRating =
    totalReviews > 0
      ? (productReviews.reduce((sum, r) => sum + r.reviews.rating, 0) / totalReviews).toFixed(1)
      : null;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: productReviews.filter((r) => r.reviews.rating === star).length,
  }));

  const galleryImages = (product.products.images?.length ? product.products.images : ["/wishlist-artifact-1.jpg"]);
  const primaryImage = galleryImages[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                name: product.products.name,
                image: (product.products.images || []).map((img) => `${BASE_URL}${img}`),
                description: blurb,
                brand: {
                  "@type": "Brand",
                  name: product.stores?.name || "Vellora",
                },
                sku: String(product.products.id),
                offers: {
                  "@type": "Offer",
                  url: `${BASE_URL}/products/${product.products.id}`,
                  priceCurrency: "USD",
                  price: (product.products.price / 100).toFixed(2),
                  availability: product.products.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                  itemCondition: "https://schema.org/NewCondition",
                },
                ...(avgRating
                  ? {
                      aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: avgRating,
                        reviewCount: totalReviews,
                      },
                    }
                  : {}),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Products",
                    item: `${BASE_URL}/products`,
                  },
                  ...(product.stores
                    ? [
                        {
                          "@type": "ListItem",
                          position: 2,
                          name: product.stores.name,
                          item: `${BASE_URL}/stores/${product.stores.slug}`,
                        },
                      ]
                    : []),
                  {
                    "@type": "ListItem",
                    position: product.stores ? 3 : 2,
                    name: product.products.name,
                    item: `${BASE_URL}/products/${product.products.id}`,
                  },
                ],
              },
              ...(features.length > 0
                ? [
                    {
                      "@type": "FAQPage",
                      mainEntity: features.map((feature) => ({
                        "@type": "Question",
                        name: `Does the ${product.products.name} offer ${feature.toLowerCase()}?`,
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: `Yes — the ${product.products.name} from ${product.stores?.name || "Vellora"} includes ${feature.toLowerCase()}. Shop it now on Vellora.`,
                        },
                      })),
                    },
                  ]
                : []),
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />

      {/* ═══════════════════════════════════════════
          BREADCRUMB
          ═══════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="pt-5 sm:pt-7 pb-4 sm:pb-6">
          <ol className="inline-flex items-center gap-1.5 text-[13px] text-clay/40 flex-wrap">
            <li>
              <Link href="/products" className="hover:text-clay transition-colors">Products</Link>
            </li>
            <li className="text-clay/20">/</li>
            {product.stores && (
              <>
                <li>
                  <Link href={`/stores/${product.stores.slug}`} className="hover:text-clay transition-colors">
                    {product.stores.name}
                  </Link>
                </li>
                <li className="text-clay/20">/</li>
              </>
            )}
            <li aria-current="page" className="text-clay font-medium truncate max-w-[200px] sm:max-w-none">
              {product.products.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* ═══════════════════════════════════════════
          01 — PRODUCT HERO
          ONE editorial composition. Image 55%, info 45%.
          Purchase panel vertically centered against image.
          ═══════════════════════════════════════════ */}
      <section
        id="product-hero"
        data-section="product-hero"
        className="section-product-hero max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-12 sm:pb-16 lg:pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[48%_52%] gap-6 lg:gap-10 xl:gap-14 items-center">
          {/* LEFT — Single dominant product image */}
          <div className="w-full">
            <ImageGallery images={galleryImages} name={product.products.name} />
          </div>

          {/* RIGHT — Purchase panel, vertically centered against image */}
          <div className="w-full">
            <div className="space-y-5 lg:space-y-6 lg:max-w-[400px]">

              {/* Store / Category — eyebrow */}
              <Link
                href={`/stores/${product.stores?.slug}`}
                className="inline-block text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.2em] text-terracotta hover:text-clay transition-colors font-label"
              >
                {product.stores?.name || "Vellora"}
              </Link>

              {/* Product name — THE typographic moment */}
              <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-bold leading-[1.04] text-clay font-heading tracking-[-0.025em]">
                {product.products.name}
              </h1>

              {/* Rating — compact inline */}
              {totalReviews > 0 && avgRating && (
                <div className="flex items-center gap-2">
                  <div className="relative inline-flex">
                    <div className="flex gap-0.5 text-clay/25">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-[15px] h-[15px]" />
                      ))}
                    </div>
                    <div
                      className="absolute inset-0 overflow-hidden flex gap-0.5 text-rating"
                      style={{ width: `${(Number(avgRating) / 5) * 100}%` }}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-[15px] h-[15px] fill-rating shrink-0" />
                      ))}
                    </div>
                  </div>
                  <span className="text-[14px] lg:text-[16px] font-bold text-clay">{avgRating}</span>
                  <span className="text-[13px] lg:text-[14px] text-clay/60">
                    ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              {/* Price — visually important */}
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[17px] font-medium text-clay/55">$</span>
                <span className="text-[40px] sm:text-[44px] lg:text-[48px] font-bold leading-none tracking-[-0.025em] text-terracotta tabular-nums">
                  {(product.products.price / 100).toFixed(2)}
                </span>
                {stockSignal}
              </div>

              {/* Short description */}
              {blurb && (
                <p className="text-[15px] sm:text-[16px] leading-[1.7] text-clay/70">
                  {blurb}
                </p>
              )}

              {/* Divider */}
              <div className="border-t border-clay/15" />

              {/* Purchase actions */}
              <div>
                {isOwner ? (
                  <VendorProductPanel
                    productId={product.products.id}
                    storeSlug={product.stores?.slug}
                  />
                ) : isSeller ? (
                  <div className="border border-clay/10 bg-[#FBF6EC] p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-9 h-9 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                        <Store className="w-[18px] h-[18px]" strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="text-[15px] font-semibold text-clay leading-snug">
                          Seller accounts can&apos;t purchase
                        </p>
                        <p className="text-[13px] text-clay/60 leading-snug mt-1">
                          Switch to a buyer account to shop.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <PurchasePanel
                    productId={product.products.id}
                    stock={product.products.stock}
                    initialWishlisted={isWishlisted}
                    variants={variantDefs}
                  />
                )}
                {!session?.user && (
                  <p className="text-[14px] text-clay/55 mt-3">
                    <Link href="/login" className="underline underline-offset-4 hover:text-terracotta transition-colors">
                      Sign in
                    </Link>{" "}
                    to save items and track orders.
                  </p>
                )}
              </div>

              {/* Trust — single restrained line */}
              <div className="flex items-center text-[12px] sm:text-[13px] lg:text-[14px] text-clay/55">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-terracotta/80" strokeWidth={1.75} />
                  Free shipping over $50
                </span>
                <span className="hidden sm:block w-px h-3 bg-clay/20 mx-4" aria-hidden />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-terracotta/80" strokeWidth={1.75} />
                  Secure checkout
                </span>
                <span className="hidden sm:block w-px h-3 bg-clay/20 mx-4" aria-hidden />
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-terracotta/80" strokeWidth={1.75} />
                  Easy returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          02 — PRODUCT STORY / WHY YOU'LL LOVE IT
          Editorial spread. Large statement + features.
          ═══════════════════════════════════════════ */}
      {(blurb || features.length > 0) && (
        <section
          data-section="product-story"
          className="section-product-story bg-[#FBF6EC]"
        >
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* LEFT — Editorial statement, oversized */}
              <div className="lg:col-span-7">
                <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-terracotta font-label">
                  Why you&apos;ll love it
                </span>
                {blurb && (
                  <h2 className="font-heading text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[54px] leading-[1.08] text-clay mt-5 sm:mt-6 tracking-[-0.025em]">
                    {blurb}
                  </h2>
                )}
                <div className="mt-8 sm:mt-10 w-16 h-px bg-terracotta/40" />
              </div>

              {/* RIGHT — Key features, clean list */}
              {features.length > 0 && (
                <div className="lg:col-span-5 lg:pt-16">
                  <h3 className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-clay/55 font-label mb-6">
                    Key features
                  </h3>
                  <ul className="space-y-4">
                    {features.slice(0, 6).map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-[18px] h-[18px] text-terracotta shrink-0 mt-px" strokeWidth={2} />
                        <span className="text-[15px] sm:text-[16px] text-clay leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          03 — VISUAL BREAK — editorial pause
          ═══════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="py-10 sm:py-14 lg:py-20 flex items-center gap-6">
          <div className="flex-1 h-px bg-clay/15" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-clay/40 font-label shrink-0">
            {totalReviews > 0 ? `${totalReviews} ${totalReviews === 1 ? "review" : "reviews"}` : "Reviews"}
          </span>
          <div className="flex-1 h-px bg-clay/15" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          04 — CUSTOMER VOICES
          Editorial composition. Left score, right quotes.
          ═══════════════════════════════════════════ */}
      <section data-section="product-reviews" className="section-product-reviews">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-20 lg:pb-28">
          {/* Section header */}
          <div className="mb-10 sm:mb-14">
            <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-terracotta font-label">
              Reviews
            </span>
            <h2 className="font-heading text-[32px] sm:text-[40px] lg:text-[44px] text-clay mt-4 tracking-[-0.025em]">
              Customer voices
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left — Score summary */}
            <div className="lg:col-span-4">
              {totalReviews > 0 && avgRating ? (
                <div className="space-y-8">
                  {/* Large score figure */}
                  <div>
                    <p className="text-[72px] sm:text-[80px] font-bold text-clay leading-none tracking-[-0.04em] font-heading">
                      {avgRating}
                    </p>
                    <div className="flex gap-0.5 text-rating mt-3">
                      {Array.from({ length: Math.round(Number(avgRating)) }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-rating" />
                      ))}
                    </div>
                    <p className="text-[13px] text-clay/60 mt-2">
                      Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                    </p>
                  </div>

                  {/* Rating distribution */}
                  <div className="space-y-2.5">
                    {ratingDistribution.map((d) => (
                      <div key={d.star} className="flex items-center gap-3">
                        <span className="text-[12px] text-clay/55 w-3 text-right tabular-nums font-medium">{d.star}</span>
                        <div className="flex-1 h-[5px] rounded-full bg-clay/15 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-ochre transition-[width] duration-500"
                            style={{ width: totalReviews > 0 ? `${(d.count / totalReviews) * 100}%` : "0%" }}
                          />
                        </div>
                        <span className="text-[12px] text-clay/45 w-5 text-right tabular-nums">
                          {d.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-clay/10" />

                  {/* Write a review */}
                  <div>
                    <h3 className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-clay/55 font-label mb-4">
                      Share your experience
                    </h3>
                    {session?.user ? (
                      hasPurchased ? (
                        <ReviewForm productId={product.products.id} />
                      ) : (
                        <p className="text-[14px] text-clay/60 leading-relaxed">
                          Leave a review after you&apos;ve purchased — reviews are reserved for verified buyers.
                        </p>
                      )
                    ) : (
                      <p className="text-[14px] text-clay/60 leading-relaxed">
                        <Link href="/login" className="underline underline-offset-4 hover:text-terracotta transition-colors">
                          Sign in
                        </Link>{" "}
                        to share your experience.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-clay/55 font-label mb-3">
                    No reviews yet
                  </p>
                  <p className="text-[15px] text-clay/60 leading-relaxed">
                    Be the first to share your experience with this product.
                  </p>
                </div>
              )}
            </div>

            {/* Right — Review entries */}
            <div className="lg:col-span-8">
              <ReviewList
                reviews={productReviews.map(({ reviews: review, users: user }) => ({
                  id: review.id,
                  name: user?.name || "Anonymous",
                  rating: review.rating,
                  createdAt: review.createdAt.toISOString(),
                  comment: review.comment,
                }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          05 — FROM STORE — Brand discovery moment
          ═══════════════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <section data-section="related-products" className="section-related-products">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-28">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-terracotta font-label">
                  From {product.stores?.name || "the store"}
                </span>
                <h2 className="font-heading text-[32px] sm:text-[40px] lg:text-[44px] text-clay mt-4 tracking-[-0.025em]">
                  Continue exploring
                </h2>
              </div>
              <Link
                href={`/stores/${product.stores?.slug}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-clay/65 hover:text-terracotta transition-colors"
              >
                View store
                <span className="text-[16px]">→</span>
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible pb-4 lg:pb-0 px-5 lg:px-0">
              {relatedProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="w-[75%] min-w-[260px] shrink-0 snap-start sm:w-[300px] lg:w-auto">
                  <RelatedProductCard product={p} />
                </div>
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link
                href={`/stores/${product.stores?.slug}`}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-clay/65 hover:text-terracotta transition-colors"
              >
                View store
                <span className="text-[16px]">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          07 — RECENTLY VIEWED — quietest utility
          ═══════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <RecentlyViewedSection />
      </div>

      {/* Mobile sticky add-to-cart */}
      <StickyAddToCart
        productId={product.products.id}
        stock={product.products.stock}
        productName={product.products.name}
        productPrice={product.products.price}
        productImage={primaryImage}
        isOwner={isOwner}
        isSeller={isSeller}
      />

      {/* localStorage tracker */}
      <RecentlyViewedTracker productId={product.products.id} />
    </>
  );
}
