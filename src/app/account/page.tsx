import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, orders, wishlistItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ShoppingBag, Heart, MapPin } from "lucide-react";
import { Header } from "@/components/shared/header";
import { FooterCustomer } from "@/components/shared/footer-customer";
import { BenefitsBar } from "@/components/home/benefits-bar";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHero } from "@/components/account/account-hero";
import { StatTile } from "@/components/shared/dashboard-ui";
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
    db.select({ id: orders.id }).from(orders).where(eq(orders.userId, parseInt(user.id))),
    db.select({ id: wishlistItems.id }).from(wishlistItems).where(eq(wishlistItems.userId, parseInt(user.id))),
  ]);
  const orderCount = orderRows.length;
  const wishlistCount = wishlistRows.length;
  const addressSet = Boolean(savedAddress.shippingLine1);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36 pb-16 lg:pb-20">
        {/* Breadcrumb */}
        <AccountHero user={user} crumb="Account" />

        <section data-section="account-stats" className="section-account-stats grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <StatTile icon={ShoppingBag} label="Orders Placed" value={orderCount} accent="terracotta" />
          <StatTile icon={Heart} label="Wishlist" value={wishlistCount} accent="ochre" />
          <StatTile icon={MapPin} label="Saved Address" value={addressSet ? "Saved" : "—"} accent="clay" />
        </section>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar Navigation */}
            <AccountSidebar active="/account" />

            {/* Content Area */}
            <section data-section="account-personal-info" className="section-account-personal-info flex-grow min-w-0">
              <div className="bg-white rounded-xl border border-clay/5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-clay/5 bg-sand/30">
                  <h2 className="text-lg sm:text-xl font-bold text-clay">Personal Information</h2>
                  <p className="text-xs text-clay/50 mt-1">
                    Keep your account details up to date so we can reach you.
                  </p>
                </div>

                <div className="p-4 sm:p-8">
                  <PersonalInfoForm name={user.name ?? ""} email={user.email ?? ""} />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-clay/5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden mt-6">
                <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-clay/5 bg-sand/30">
                  <h2 className="text-lg sm:text-xl font-bold text-clay">Shipping Address</h2>
                  <p className="text-xs text-clay/50 mt-1">
                    Your default address — it auto-fills at checkout so you don&apos;t have to retype it.
                  </p>
                </div>

                <div className="p-4 sm:p-8">
                  <ShippingAddressForm address={savedAddress} />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Benefits strip */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <BenefitsBar />
        </div>
      </main>
      <FooterCustomer />
    </>
  );
}