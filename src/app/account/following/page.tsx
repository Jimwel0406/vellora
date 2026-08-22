import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { stores, storeFollows } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Store, ArrowRight } from "lucide-react";
import { Header } from "@/components/shared/header";
import { FooterCustomer } from "@/components/shared/footer-customer";
import { BenefitsBar } from "@/components/home/benefits-bar";
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36 pb-16 lg:pb-20">
          <AccountHero
            user={session.user}
            title="Following"
            crumb="Following"
            subtitle="Stores you follow — jump back to their storefronts anytime."
          />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <AccountSidebar active="/account/following" />

            <section data-section="following-content" className="section-following-content flex-grow min-w-0">
              <div className="bg-white rounded-xl border border-clay/5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                {followedStores.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-16 sm:py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-sand/60 flex items-center justify-center mb-5">
                      <Store className="w-8 h-8 text-clay/20" aria-hidden />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-clay mb-3">No stores followed yet</h3>
                    <p className="text-sm text-clay/60 mb-8 leading-relaxed max-w-sm">
                      When you follow a store, it appears here so you can jump back to it anytime.
                    </p>
                    <Link
                      href="/stores"
                      className="inline-block bg-terracotta hover:bg-clay text-white px-8 sm:px-10 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-terracotta/20 hover:scale-[1.02]"
                    >
                      Browse stores
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-clay/5">
                    {followedStores.map(({ store }) => (
                      <li key={store.id}>
                        <Link
                          href={`/stores/${store.slug}`}
                          className="flex items-center justify-between gap-4 px-4 sm:px-8 py-5 hover:bg-sand/30 transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-clay truncate">{store.name}</p>
                            <p className="text-xs text-clay/50 mt-0.5 truncate">
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

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <BenefitsBar />
        </div>
      </main>
      <FooterCustomer />
    </>
  );
}