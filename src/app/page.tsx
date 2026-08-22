import { db } from "@/db";
import { products, stores, categories, reviews } from "@/db/schema";
import { eq, inArray, count, sql } from "drizzle-orm";
import { Header } from "@/components/shared/header";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { PromotionalBanner } from "@/components/home/promotional-banner";
import { Hero } from "@/components/home/hero";
import { Testimonials } from "@/components/home/testimonials";
import { BenefitsBar } from "@/components/home/benefits-bar";
import { FooterEcommerce } from "@/components/home/footer-ecommerce";
import { SectionHeading } from "@/components/home/section-heading";
import { ProductCarousel } from "@/components/home/product-carousel";
import { CategoryNavigation } from "@/components/home/category-navigation";
import { Reveal } from "@/components/home/reveal";
import { WhyVellora } from "@/components/home/why-vellora";

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

  const bestSellerRows = withImage.filter((row) =>
    row.products.tags?.some((t) => t === "Best Seller" || t === "Popular")
  );

  const bestSellerIds = new Set(bestSellerRows.map((row) => row.products.id));

  const newArrivalRows = withImage
    .filter((row) => {
      if (bestSellerIds.has(row.products.id)) return false;
      return row.products.tags?.some((t) => t === "New" || t === "Featured");
    })
    .sort((a, b) => new Date(b.products.createdAt).getTime() - new Date(a.products.createdAt).getTime())
    .slice(0, 4);

  const featuredIds = [
    ...bestSellerRows.slice(0, 4).map((row) => row.products.id),
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

  const bestSellers = bestSellerRows.slice(0, 4).map(withRating);
  const newArrivals = newArrivalRows.map(withRating);

  return (
    <>
      <Header />
      <main className="bg-[#F1EDE1]">
        <Hero />
        <PromotionalBanner />

        <Reveal>
          <section data-section="best-sellers" className="section-best-sellers max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-10 sm:pt-14 lg:pt-16">
            <SectionHeading eyebrow="Top Picks For You" title="Best Sellers" />
            <div className="mt-8 lg:mt-10">
              <ProductCarousel products={bestSellers} />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <WhyVellora
            productCount={productCount}
            storeCount={storeCount}
            categoryCount={allCategories.length}
          />
        </Reveal>

        <Reveal>
          <section data-section="new-arrivals" className="section-new-arrivals max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <SectionHeading eyebrow="Check Out What's New" title="New Arrivals" />
            <div className="mt-8 lg:mt-10">
              <ProductCarousel products={newArrivals} />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section data-section="shop-by-category" className="section-shop-by-category max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 lg:pt-20 pb-20 lg:pb-24">
            <CategoryNavigation categories={allCategories} />
          </section>
        </Reveal>

        <Reveal>
          <section data-section="newsletter" className="section-newsletter relative py-14 lg:py-16 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img alt="Background" className="w-full h-full object-cover" src="/newsletter-bg.jpg" />
            </div>
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
            <div className="relative z-10 max-w-2xl mx-auto px-8 text-center text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] mb-6 block font-label">
                The Journal
              </span>
              <h2 className="text-4xl sm:text-5xl font-black mb-6 uppercase tracking-tighter">
                Stay in the loop
              </h2>
              <p className="text-sm font-medium mb-10 opacity-80 leading-relaxed tracking-wide">
                New vendors, curated products, and exclusive updates &mdash; straight to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </section>
        </Reveal>
      </main>
      <Testimonials />
      <BenefitsBar />
      <FooterEcommerce />
    </>
  );
}