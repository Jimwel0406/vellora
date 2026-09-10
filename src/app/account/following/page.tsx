import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { stores, storeFollows, orders, wishlistItems } from "@/db/schema";
import { eq, ne, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Store, ArrowRight } from "lucide-react";
import { Header } from "@/components/shared/header";
import { FooterEcommerce } from "@/components/home/footer-ecommerce";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHero } from "@/components/account/account-hero";

export default async function FollowingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = parseInt(session.user.id);

  const followedStores = await db
    .select({ store: stores })
    .from(storeFollows)
    .innerJoin(stores, eq(storeFollows.storeId, stores.id))
    .where(eq(storeFollows.userId, userId))
    .orderBy(desc(storeFollows.createdAt));

  const [orderRows, wishlistRows] = await Promise.all([
    db.select({ id: orders.id }).from(orders).where(
      and(eq(orders.userId, userId), ne(orders.status, "pending"), ne(orders.status, "cancelled"))
    ),
    db.select({ id: wishlistItems.id }).from(wishlistItems).where(eq(wishlistItems.userId, userId)),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAF7EF]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36 pb-16 lg:pb-20">
          <AccountHero
            user={session.user}
            title="Following"
            crumb="Following"
            subtitle="Stores you follow — jump back to their storefronts anytime."
          />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <AccountSidebar active="/account/following" orderCount={orderRows.length} wishlistCount={wishlistRows.length} />

            <section data-section="following-content" className="section-following-content flex-grow min-w-0">
              <div className="bg-white rounded-xl border border-clay/8 overflow-hidden">
                {followedStores.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-16 sm:py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mb-5">
                      <Store className="w-8 h-8 text-clay/30" aria-hidden />
                    </div>
                    <h3 className="text-[18px] font-heading font-semibold text-clay mb-3">No stores followed yet</h3>
                    <p className="text-[14px] text-clay/60 mb-8 leading-relaxed max-w-sm">
                      When you follow a store, it appears here so you can jump back to it anytime.
                    </p>
                    <Link
                      href="/stores"
                      className="inline-block bg-terracotta hover:bg-clay text-white px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-[0.15em] transition-all"
                    >
                      Browse stores
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-clay/8">
                    {followedStores.map(({ store }) => (
                      <li key={store.id}>
                        <Link
                          href={`/stores/${store.slug}`}
                          className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 hover:bg-sand/30 transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-[15px] text-clay truncate">{store.name}</p>
                            <p className="text-[13px] text-clay/60 mt-0.5 truncate">
                              {store.description || `@${store.slug}`}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-terracotta shrink-0">
                            Visit <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <FooterEcommerce />
    </>
  );
}
