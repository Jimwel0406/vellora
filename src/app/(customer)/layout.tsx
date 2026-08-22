import { Header } from "@/components/shared/header";
import { FooterCustomer } from "@/components/shared/footer-customer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-sand">{children}</main>
      <FooterCustomer />
    </>
  );
}
