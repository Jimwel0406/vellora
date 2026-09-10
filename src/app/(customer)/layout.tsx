import { Header } from "@/components/shared/header";
import { FooterEcommerce } from "@/components/home/footer-ecommerce";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#FAF7EF]">{children}</main>
      <FooterEcommerce />
    </>
  );
}
