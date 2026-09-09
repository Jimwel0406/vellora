import { db } from "@/db";
import { products, stores, categories, reviews } from "@/db/schema";
import { eq, inArray, count, sql } from "drizzle-orm";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { NewsletterMinimal } from "@/components/home/newsletter-variations";
import { PromoPopup } from "@/components/home/promo-popup";
import { Hero } from "@/components/home/hero";
import { TestimonialsVariationB } from "@/components/home/testimonials-variation-b";
import { BenefitsBarBigStatsH } from "@/components/home/benefits-bar-big-stats-h";
import { FooterEcommerce } from "@/components/home/footer-ecommerce";
import { BestSellers } from "@/components/home/best-sellers-variations";
import { SectionHeading } from "@/components/home/section-heading";
import { ProductCarousel } from "@/components/home/product-carousel";
import { Reveal } from "@/components/home/reveal";
import { WhyVellora } from "@/components/home/why-vellora";
import { NewArrivalsGrid } from "@/components/home/new-arrivals-grid";
import { FaqSection } from "@/components/home/faq-section";

export default async function HomePage() {
  const allProducts = await db
    .select()
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(eq(stores.active, true));

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.id);

  const [storeCount, productCount] = await Promise.all([
    db
      .select({ v: count(sql`distinct ${products.storeId}`) })
      .from(products)
      .innerJoin(stores, eq(products.storeId, stores.id))
      .where(eq(stores.active, true))
      .then((r) => r[0]?.v ?? 0),
    db
      .select({ v: count(products.id) })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.id))
      .where(eq(stores.active, true))
      .then((r) => r[0]?.v ?? 0),
  ]);

  const toCard = ({ products: p }: (typeof allProducts)[number]) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images?.[0] ?? "",
  });

  const withImage = allProducts.filter((row) => row.products.images?.length);

  const bestSellerTagged = withImage.filter((row) =>
    row.products.tags?.some((t) => t === "Best Seller" || t === "Popular")
  );

  const bestSellerRows =
    bestSellerTagged.length >= 5
      ? bestSellerTagged.slice(0, 5)
      : [
          ...bestSellerTagged,
          ...withImage
            .filter((row) => !bestSellerTagged.some((t) => t.products.id === row.products.id))
            .slice(0, 5 - bestSellerTagged.length),
        ].slice(0, 5);

  const bestSellerIds = new Set(bestSellerRows.map((row) => row.products.id));

  const byNewest = (a: (typeof withImage)[number], b: (typeof withImage)[number]) =>
    new Date(b.products.createdAt).getTime() - new Date(a.products.createdAt).getTime();

  const taggedNew = withImage
    .filter((row) => {
      if (bestSellerIds.has(row.products.id)) return false;
      return row.products.tags?.some((t) => t === "New" || t === "Featured");
    })
    .sort(byNewest);

  const newArrivalRows =
    taggedNew.length >= 8
      ? taggedNew.slice(0, 8)
      : [
          ...taggedNew,
          ...withImage
            .filter((row) => !bestSellerIds.has(row.products.id))
            .filter((row) => !taggedNew.some((t) => t.products.id === row.products.id))
            .sort(byNewest)
            .slice(0, 8 - taggedNew.length),
        ].slice(0, 8);

  const featuredIds = [
    ...bestSellerRows.slice(0, 5).map((row) => row.products.id),
    ...newArrivalRows.map((row) => row.products.id),
  ];

  const featuredReviews = featuredIds.length
    ? await db
        .select()
        .from(reviews)
        .where(inArray(reviews.productId, featuredIds))
    : [];

  const ratingMap = new Map<number, { rating: number; count: number }>();
  for (const review of featuredReviews) {
    const entry = ratingMap.get(review.productId) ?? { rating: 0, count: 0 };
    entry.rating += review.rating;
    entry.count += 1;
    ratingMap.set(review.productId, entry);
  }

  const withRating = (row: (typeof allProducts)[number]) => {
    const entry = ratingMap.get(row.products.id);
    return {
      ...toCard(row),
      rating: entry ? entry.rating / entry.count : null,
      reviewCount: entry?.count ?? null,
    };
  };

  const bestSellers = bestSellerRows.slice(0, 5).map(withRating);
  const newArrivals = newArrivalRows.map(withRating);

  return (
    <>
      <Header />
      <main className="bg-[#F1EDE1]">
        <Hero />

        <PromoPopup />

        <BestSellers categories={allCategories} />

        <Reveal>
          <WhyVellora
            productCount={productCount}
            storeCount={storeCount}
            categoryCount={allCategories.length}
          />
        </Reveal>

        <Reveal>
          <section data-section="new-arrivals" className="section-new-arrivals pt-2 sm:pt-8 lg:pt-10 pb-20 sm:pb-28 lg:pb-32">
            {/* Editorial header */}
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 mb-20 sm:mb-24 lg:mb-28">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
                <div className="flex flex-col">
                  <span className="font-label text-2xl font-bold uppercase tracking-[0.3em] text-terracotta mb-3 sm:mb-4">
                    Check Out What&apos;s New
                  </span>
                  <h2 className="font-heading text-[52px] sm:text-[68px] lg:text-[88px] font-semibold text-clay tracking-[-0.02em] leading-[0.92]">
                    New Arrivals
                  </h2>
                </div>
                <div className="flex flex-col gap-4 lg:items-end lg:text-right lg:min-w-[280px]">
                  <p className="text-base sm:text-lg text-clay/60 font-medium max-w-[320px] lg:max-w-none leading-relaxed">
                    Thoughtfully curated pieces from our latest collection — discover what&apos;s new.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 font-label text-sm sm:text-base font-semibold uppercase tracking-[0.14em] text-clay hover:text-terracotta transition-colors duration-300 group/link"
                  >
                    View All
                    <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Product rail — arrows inside content grid, rail extends beyond */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-between max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 pointer-events-none z-10">
                {/* Arrow placeholders — actual buttons are rendered by NewArrivalsGrid */}
              </div>
              <NewArrivalsGrid products={newArrivals} />
            </div>
          </section>
        </Reveal>


      </main>
      <div className="bg-sand">
        <div className="w-[95%] mx-auto py-12 lg:py-16">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Blurred background images */}
            <img
              src="/hero-lifestyle.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-[1.2] blur-2xl opacity-30"
              aria-hidden="true"
            />
            <img
              src="/hero-curation.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-[1.3] blur-3xl opacity-20"
              aria-hidden="true"
            />
            {/* Tint overlay */}
            <div className="absolute inset-0 bg-sand/60" aria-hidden="true" />

            {/* Content grid */}
            <div className="relative grid grid-cols-1 lg:grid-cols-[4fr_2fr] gap-6 lg:gap-8 items-stretch p-4 sm:p-6 lg:p-8">
              <TestimonialsVariationB />
              <BenefitsBarBigStatsH />
            </div>
          </div>
        </div>
      </div>
      <NewsletterMinimal />
      <FaqSection />
      <FooterEcommerce />
    </>
  );
}