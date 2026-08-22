import { Header } from "@/components/shared/header";
import { VendorSidebar } from "@/components/shared/vendor-sidebar";
import { DisabledStoreBanner } from "./disabled-store-banner";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex">
        <VendorSidebar />
        <main className="flex-1 p-6 pb-24 md:pb-6">
          <DisabledStoreBanner />
          {children}
        </main>
      </div>
    </>
  );
}
