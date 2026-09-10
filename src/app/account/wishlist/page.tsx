import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { wishlistItems, products, stores, orders } from "@/db/schema";
import { eq, ne, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Header } from "@/components/shared/header";
import { FooterEcommerce } from "@/components/home/footer-ecommerce";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHero } from "@/components/account/account-hero";
import { WishlistRemoveButton, WishlistAddToCartButton } from "./wishlist-actions";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = parseInt(session.user.id);

  const items = await db
    .select()
    .from(wishlistItems)
    .leftJoin(products, eq(wishlistItems.productId, products.id))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.createdAt));

  const orderRows = await db
    .select({ id: orders.id })
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        ne(orders.status, "pending"),
        ne(orders.status, "cancelled")
      )
    );

  const user = session.user;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAF7EF]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36 pb-16 lg:pb-20">
          <AccountHero
            user={user}
            title="Wishlist"
            subtitle="Items you have saved from your favorite stores, ready to add to your collection."
          />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <AccountSidebar active="/account/wishlist" orderCount={orderRows.length} wishlistCount={items.length} />

            <section data-section="wishlist-content" className="section-wishlist-content flex-grow min-w-0">
              {items.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center text-center py-16 sm:py-24">
                  <div className="relative mb-8">
                    <svg
                      className="w-10 h-10 text-clay/15"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label mb-3">
                    Saved Items
                  </p>
                  <p className="text-[14px] text-clay/50 leading-relaxed max-w-xs mb-8">
                    Your wishlist is waiting to be filled. Discover pieces you love and save them here.
                  </p>
                  <Link
                    href="/products"
                    className="text-[11px] font-bold uppercase tracking-[0.15em] text-terracotta hover:text-clay transition-colors"
                  >
                    Explore Products &rarr;
                  </Link>
                </div>
              ) : (
                /* Filled state */
                <>
                  {/* Section header */}
                  <div className="flex items-baseline justify-between gap-4 mb-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label">
                      Saved Items
                      <span className="ml-2 text-clay/25">
                        {String(items.length).padStart(2, "0")}
                      </span>
                    </p>
                  </div>

                  {/* Product grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    {items.map(({ wishlist_items, products: product, stores: store }) => (
                      <div key={wishlist_items.id} className="group">
                        {/* Product image */}
                        <Link href={`/products/${product?.id}`} className="block relative">
                          <div className="aspect-[4/5] bg-clay/[0.03] relative overflow-hidden mb-3">
                            {product?.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                                width="600"
                                height="750"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-clay/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1" />
                                </svg>
                              </div>
                            )}
                          </div>
                          {/* Remove button — over image, top right */}
                          <div className="absolute top-2 right-2 z-10">
                            <WishlistRemoveButton itemId={wishlist_items.id} />
                          </div>
                        </Link>

                        {/* Product info */}
                        <div>
                          {store && (
                            <p className="text-[10px] font-bold text-terracotta/50 uppercase tracking-[0.15em] mb-1">
                              {store.name}
                            </p>
                          )}
                          <Link href={`/products/${product?.id}`}>
                            <h3 className="text-[13px] font-semibold text-clay truncate group-hover:text-terracotta transition-colors mb-1">
                              {product?.name}
                            </h3>
                          </Link>
                          <p className="text-[14px] font-heading font-bold text-clay mb-3">
                            ${product ? (product.price / 100).toFixed(2) : "—"}
                          </p>
                          <WishlistAddToCartButton productId={product?.id ?? 0} disabled={!product} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
      <FooterEcommerce />
    </>
  );
}
