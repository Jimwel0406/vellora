import { Header } from "@/components/shared/header";
import { AdminSidebar } from "@/components/shared/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 bg-sand p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">{children}</main>
      </div>
    </>
  );
}
