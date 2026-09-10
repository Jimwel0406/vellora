import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, orders, wishlistItems } from "@/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { Header } from "@/components/shared/header";
import { FooterEcommerce } from "@/components/home/footer-ecommerce";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHero } from "@/components/account/account-hero";
import { PersonalInfoForm } from "./personal-info-form";
import { ShippingAddressForm } from "./shipping-address-form";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user;

  const addressRow = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(user.id)))
    .then((r) => r[0]);

  const savedAddress = {
    shippingName: addressRow?.shippingName || user.name || "",
    shippingLine1: addressRow?.shippingLine1 || "",
    shippingLine2: addressRow?.shippingLine2 || "",
    shippingCity: addressRow?.shippingCity || "",
    shippingState: addressRow?.shippingState || "",
    shippingPostalCode: addressRow?.shippingPostalCode || "",
    shippingCountry: addressRow?.shippingCountry || "",
    shippingPhone: addressRow?.shippingPhone || "",
  };

  const [orderRows, wishlistRows] = await Promise.all([
    db.select({ id: orders.id }).from(orders).where(
      and(eq(orders.userId, parseInt(user.id)), ne(orders.status, "pending"), ne(orders.status, "cancelled"))
    ),
    db.select({ id: wishlistItems.id }).from(wishlistItems).where(eq(wishlistItems.userId, parseInt(user.id))),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAF7EF]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36 pb-16 lg:pb-20">
          <AccountHero user={user} crumb="Account" />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Navigation */}
            <AccountSidebar
              active="/account"
              orderCount={orderRows.length}
              wishlistCount={wishlistRows.length}
            />

            {/* Content */}
            <section data-section="account-content" className="section-account-content flex-grow min-w-0">
              {/* Personal Information */}
              <div className="mb-12">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label mb-3">
                  Personal Information
                </p>
                <p className="text-[13px] text-clay/50 mb-8 max-w-md leading-relaxed">
                  Keep your account details up to date so we can reach you.
                </p>
                <PersonalInfoForm name={user.name ?? ""} email={user.email ?? ""} />
              </div>

              {/* Shipping Address */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label mb-3">
                  Shipping Address
                </p>
                <p className="text-[13px] text-clay/50 mb-8 max-w-md leading-relaxed">
                  Your default address — it auto-fills at checkout so you don&apos;t have to retype it.
                </p>
                <ShippingAddressForm address={savedAddress} />
              </div>
            </section>
          </div>
        </div>
      </main>
      <FooterEcommerce />
    </>
  );
}
