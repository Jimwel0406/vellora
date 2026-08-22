import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { wishlistItems, products, stores } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Header } from "@/components/shared/header";
import { FooterCustomer } from "@/components/shared/footer-customer";
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

  const user = session.user;

  return (
    <>
      <Header />
      <main className="min-h-screen pb-16 bg-sand">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36">
          <AccountHero
            user={user}
            title="Wishlist"
            subtitle="Items you have saved from your favorite stores, ready to add to your collection."
          />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <AccountSidebar active="/account/wishlist" />

            {/* Content Area */}
            <section data-section="wishlist-content" className="section-wishlist-content flex-grow min-w-0">
              <div className="bg-white rounded-xl border border-clay/5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] min-h-[400px] sm:min-h-[500px] flex flex-col">
                <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-clay/5 bg-sand/30">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg sm:text-xl font-bold text-clay truncate">Saved Items</h2>
                    {items.length > 0 && (
                      <span className="text-[11px] font-semibold text-clay/40 shrink-0">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </span>
                    )}
                  </div>
                </div>

                {items.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center px-6 sm:p-12 py-12 text-center">
                    <div className="relative mb-8 sm:mb-10 group">
                      <div className="absolute -inset-8 sm:-inset-12 bg-terracotta/10 rounded-full blur-3xl group-hover:bg-terracotta/20 transition-colors duration-700" />
                      <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center bg-white rounded-2xl border border-clay/5 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <svg className="w-14 h-14 sm:w-20 sm:h-20 text-clay/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="1" />
                        </svg>
                        <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-lg border-2 border-white rotate-12 group-hover:rotate-6 transition-transform duration-500">
                          <img
                            alt=""
                            className="w-full h-full object-cover"
                            src="/wishlist-artifact-2.jpg"
                          />
                        </div>
                        <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white -rotate-12 group-hover:-rotate-6 transition-transform duration-500">
                          <img
                            alt=""
                            className="w-full h-full object-cover"
                            src="/wishlist-artifact-1.jpg"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="max-w-md relative z-10">
                      <h3 className="text-lg sm:text-xl font-bold text-clay mb-3">Your wishlist is waiting to be filled</h3>
                      <p className="text-sm text-clay/60 mb-8 leading-relaxed">
                        Discover pieces you love and save them here. Start browsing our curated collections from independent vendors.
                      </p>
                      <Link
                        href="/products"
                        className="inline-block bg-terracotta hover:bg-clay text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-terracotta/20 hover:scale-[1.02]"
                      >
                        Explore Products
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                      {items.map(({ wishlist_items, products: product, stores: store }) => (
<div
  key={wishlist_items.id}
  className="group relative bg-sand/30 rounded-xl border border-clay/5 overflow-hidden transition-all hover:shadow-lg hover:border-clay/10"
>
  <Link href={`/products/${product?.id}`} className="block">
    <div className="aspect-[4/5] bg-clay/[0.02] relative overflow-hidden">
      {product?.images?.[0] ? (
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-10 h-10 text-clay/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1" />
          </svg>
        </div>
      )}
    </div>
  </Link>
  <div className="absolute top-2 right-2 z-10">
    <WishlistRemoveButton itemId={wishlist_items.id} />
  </div>
                          <div className="p-4">
                            {store && (
                              <p className="text-[10px] font-semibold text-terracotta/60 uppercase tracking-widest mb-1">
                                {store.name}
                              </p>
                            )}
                            <Link href={`/products/${product?.id}`}>
                              <h3 className="font-bold text-sm text-clay mb-1 truncate group-hover:text-terracotta transition-colors">
                                {product?.name}
                              </h3>
                            </Link>
                            <p className="text-sm font-bold text-clay mb-3">
                              ${product ? (product.price / 100).toFixed(2) : "—"}
                            </p>
                            <WishlistAddToCartButton productId={product?.id ?? 0} disabled={!product} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <FooterCustomer />
    </>
  );
}
