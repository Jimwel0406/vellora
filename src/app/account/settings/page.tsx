import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders, wishlistItems } from "@/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { Header } from "@/components/shared/header";
import { FooterEcommerce } from "@/components/home/footer-ecommerce";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHero } from "@/components/account/account-hero";
import { SettingsForm } from "./settings-form";
import { DeleteAccountButton } from "../delete-account-button";

export default async function AccountSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user;
  const userId = parseInt(user.id);

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
            user={user}
            title="Password Manager"
            subtitle="Update your profile details or secure your account with a new password."
          />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <AccountSidebar active="/account/settings" orderCount={orderRows.length} wishlistCount={wishlistRows.length} />

            <section data-section="settings-content" className="section-settings-content flex-grow min-w-0">
              <SettingsForm
                name={session.user.name ?? ""}
                email={session.user.email ?? ""}
              />
              <DeleteAccountButton />
            </section>
          </div>
        </div>
      </main>
      <FooterEcommerce />
    </>
  );
}
