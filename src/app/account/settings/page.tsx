import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/shared/header";
import { FooterCustomer } from "@/components/shared/footer-customer";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHero } from "@/components/account/account-hero";
import { SettingsForm } from "./settings-form";
import { DeleteAccountButton } from "../delete-account-button";

export default async function AccountSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user;

  return (
    <>
      <Header />
      <main className="min-h-screen pb-16 bg-sand">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36">
          <AccountHero
            user={user}
            title="Password Manager"
            subtitle="Update your profile details or secure your account with a new password."
          />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <AccountSidebar active="/account/settings" />

            {/* Content Area */}
            <section data-section="settings-content" className="section-settings-content flex-grow min-w-0">
              <div className="bg-white rounded-xl border border-clay/5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] min-h-[400px] sm:min-h-[500px] flex flex-col">
                <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-clay/5 bg-sand/30">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg sm:text-xl font-bold text-clay truncate">Account Settings</h2>
                  </div>
                </div>
                <div className="p-4 sm:p-8 flex-grow">
                  <SettingsForm
                    name={session.user.name ?? ""}
                    email={session.user.email ?? ""}
                  />
                  <DeleteAccountButton />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <FooterCustomer />
    </>
  );
}