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
import { CategoryVariationA } from "@/components/home/category-variations";
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

        <BestSellers products={bestSellers} />

        <Reveal>
          <WhyVellora
            productCount={productCount}
            storeCount={storeCount}
            categoryCount={allCategories.length}
          />
        </Reveal>

        <Reveal>
          <section data-section="new-arrivals" className="section-new-arrivals max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 lg:pt-24">
            {/* Editorial header */}
            <div className="text-center mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-0 lg:gap-4 mb-4">
                <span className="relative w-12 h-[2px] bg-terracotta -right-4 lg:right-auto" />
                <p className="text-xl font-bold uppercase font-label tracking-[0.3em] text-terracotta">
                  Check Out What&apos;s New
                </p>
                <span className="relative w-12 h-[2px] bg-terracotta -left-4 lg:left-auto" />
              </div>
              <h2 className="-mt-2 font-heading text-4xl sm:text-5xl lg:text-6xl text-clay tracking-tight leading-none">
                New Arrivals
              </h2>
              <div className="mt-6 mx-auto w-24 h-1.5 bg-gradient-to-r from-transparent via-terracotta to-transparent rounded-full" />
            </div>

            <NewArrivalsGrid products={newArrivals} />
          </section>
        </Reveal>

        <Reveal>
          <section data-section="shop-by-category" className="section-shop-by-category max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 lg:pt-20 pb-10 lg:pb-14">
            <CategoryVariationA categories={allCategories} />
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