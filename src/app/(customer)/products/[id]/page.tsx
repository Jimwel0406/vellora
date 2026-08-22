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
import { ProductQa } from "./product-qa";
import { getProductQa } from "@/lib/product-qa";
import { ChevronRight, Check, Star, Truck, ShieldCheck, RotateCcw, Store } from "lucide-react";

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

  const [qaItems, isStoreOwner] = await Promise.all([
    getProductQa(productId),
    Promise.resolve(
      !!session?.user &&
        session.user.role === "vendor" &&
        product.stores?.userId === parseInt(session.user.id)
    ),
  ]);

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

  const galleryImages = (product.products.images?.length ? product.products.images : ["/wishlist-artifact-1.jpg"]);

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
      <div className="max-w-[1400px] mx-auto px-10 pt-[60px] pb-[120px] max-sm:px-5 max-sm:pt-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex text-[14px] text-clay/40 mb-16 max-sm:mb-6">
          <ol className="inline-flex items-center gap-2">
            <li>
              <Link href="/products" className="hover:text-clay transition-colors">
                Products
              </Link>
            </li>
            <li className="text-clay/20">›</li>
            {product.stores && (
              <>
                <li>
                  <Link
                    href={`/stores/${product.stores.slug}`}
                    className="hover:text-clay transition-colors"
                  >
                    {product.stores.name}
                  </Link>
                </li>
                <li className="text-clay/20">›</li>
              </>
            )}
            <li aria-current="page" className="text-clay font-medium truncate max-w-[240px]">
              {product.products.name}
            </li>
          </ol>
        </nav>

        {/* Product Hero */}
        <section id="product-hero" data-section="product-hero" className="section-product-hero grid grid-cols-1 lg:grid-cols-[58%_42%] gap-[72px] max-sm:gap-8 lg:items-start">
          {/* Left: Gallery */}
          <div className="w-full lg:sticky lg:top-8">
            <ImageGallery images={galleryImages} name={product.products.name} />
          </div>

          {/* Right: Information */}
          <div className="w-full lg:sticky lg:top-8">
            <div className="space-y-6">
              {/* Brand */}
              <Link
                href={`/stores/${product.stores?.slug}`}
                className="text-[13px] font-semibold uppercase tracking-[0.08em] text-terracotta hover:underline"
              >
                {product.stores?.name || "Vellora"}
              </Link>

              {/* Title */}
              <h1 className="max-w-[520px] text-[32px] sm:text-[40px] lg:text-[56px] font-bold leading-[1.05] text-[#1A1A1A] font-serif italic">
                {product.products.name}
              </h1>

              {/* Price */}
              <div className="pt-1">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-clay/50 mb-2">
                  Price
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="flex items-baseline gap-1.5 text-terracotta">
                    <span className="text-[20px] font-semibold text-clay/40 align-baseline">
                      $
                    </span>
                    <span className="text-[36px] sm:text-[40px] font-bold leading-none tracking-tight text-terracotta">
                      {(product.products.price / 100).toFixed(2)}
                    </span>
                    <span className="text-[13px] font-medium text-clay/50">
                      USD
                    </span>
                  </p>
                  {stockSignal}
                </div>
              </div>

              {/* Short description */}
              {blurb && (
                <p className="max-w-[520px] text-[18px] leading-[1.8] text-[#555555]">
                  {blurb}
                </p>
              )}

              {/* Tags */}
              {product.products.tags && product.products.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.products.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full border border-clay/20 text-[11px] font-medium uppercase tracking-wider text-clay/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Feature highlights */}
              {features.length > 0 && (
                <div data-section="product-features" className="section-product-features">
                  <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-clay/50 mb-3">
                    Key Features
                  </h2>
                  <dl className="space-y-3">
                    {features.slice(0, 4).map((point, i) => (
                      <div key={i} className="flex items-center gap-3 text-[15px] text-[#555555]">
                        <dt className="sr-only">Feature {i + 1}</dt>
                        <dd className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-terracotta shrink-0" strokeWidth={2} />
                          {point}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Purchase actions */}
              <div className="pt-2">
                {isOwner ? (
                  <VendorProductPanel
                    productId={product.products.id}
                    storeSlug={product.stores?.slug}
                  />
                ) : isSeller ? (
                  <div className="rounded-[16px] border border-clay/15 bg-sand/60 p-5">
                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5" strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="text-[15px] font-bold text-[#1A1A1A] leading-snug">
                          Seller accounts can&apos;t purchase
                        </p>
                        <p className="text-[13px] text-clay/60 leading-snug mt-1">
                          Your account is set up to sell on Vellora. Switch to a
                          buyer account to shop.
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
                  <p className="text-[13px] text-clay/50 mt-4 text-center">
                    <Link href="/login" className="underline underline-offset-4 hover:text-terracotta">
                      Sign in
                    </Link>{" "}
                    to save items and track orders.
                  </p>
                )}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-4 rounded-[16px] border border-clay/10 bg-sand/50 p-4">
                  <span className="w-11 h-11 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#1A1A1A] leading-tight">Free Shipping</p>
                    <p className="text-[11px] text-clay/50 leading-snug mt-0.5">Free on orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-[16px] border border-clay/10 bg-sand/50 p-4">
                  <span className="w-11 h-11 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#1A1A1A] leading-tight">Secure Checkout</p>
                    <p className="text-[11px] text-clay/50 leading-snug mt-0.5">Your payment is always protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-[16px] border border-clay/10 bg-sand/50 p-4">
                  <span className="w-11 h-11 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                    <RotateCcw className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#1A1A1A] leading-tight">Easy Returns</p>
                    <p className="text-[11px] text-clay/50 leading-snug mt-0.5">30-day returns accepted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section data-section="product-reviews" className="section-product-reviews mt-[120px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-terracotta">
                Reviews
              </span>
              <h2 className="font-serif italic text-3xl sm:text-4xl text-[#1A1A1A] mt-6">
                What our community thinks
              </h2>
            </div>
            {avgRating && (
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5 text-ochre">
                  {Array.from({ length: Math.round(Number(avgRating)) }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-ochre" />
                  ))}
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A] leading-none">{avgRating}</p>
                  <p className="text-[13px] text-clay/50 mt-1">
                    Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Compose */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-clay/10 rounded-[20px] p-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-clay mb-6">
                  Share Your Experience
                </h3>
                {session?.user ? (
                  hasPurchased ? (
                    <ReviewForm productId={product.products.id} />
                  ) : (
                    <p className="text-sm text-clay/60 leading-relaxed">
                      Leave an impression after you&apos;ve purchased — reviews
                      are reserved for verified buyers.
                    </p>
                  )
                ) : (
                  <p className="text-sm text-clay/60 leading-relaxed">
                    <Link href="/login" className="underline underline-offset-4 hover:text-terracotta">
                      Sign in
                    </Link>{" "}
                    to leave the first impression of this piece.
                  </p>
                )}
              </div>
            </div>

            {/* Reviews list */}
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
        </section>

        <ProductQa
          items={qaItems}
          productId={product.products.id}
          isLoggedIn={!!session?.user}
          isStoreOwner={isStoreOwner}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section data-section="related-products" className="section-related-products mt-[120px]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-terracotta">
                  You may also like
                </span>
                <h2 className="font-serif italic text-3xl sm:text-4xl text-[#1A1A1A] mt-6">
                  From {product.stores?.name || "the same maker"}
                </h2>
              </div>
              <Link
                href={`/stores/${product.stores?.slug}`}
                className="hidden sm:flex items-center gap-2 text-[13px] font-semibold text-clay hover:text-terracotta transition-colors"
              >
                View store
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto lg:overflow-visible scrollbar-hide snap-x snap-mandatory lg:snap-none lg:grid lg:grid-cols-4 pb-2 lg:pb-0 -mx-5 px-5 sm:-mx-0 sm:px-0 max-sm:scroll-pl-5 max-sm:scroll-pr-5">
              {relatedProducts.map((p) => (
                <div key={p.id} className="w-[72%] min-w-[240px] shrink-0 snap-start sm:w-[300px] lg:w-auto">
                  <RelatedProductCard product={p} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12 lg:hidden">
              <Link
                href={`/stores/${product.stores?.slug}`}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-clay hover:text-terracotta transition-colors"
              >
                View store
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        <RecentlyViewedSection />
      </div>

      <StickyAddToCart
        productId={product.products.id}
        stock={product.products.stock}
        isOwner={isOwner}
        isSeller={isSeller}
      />

      <RecentlyViewedTracker productId={product.products.id} />
    </>
  );
}
