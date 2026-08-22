import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { StoreSetupForm } from "./store-setup-form";

export default async function VendorSetupPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "vendor") redirect("/");

  return <StoreSetupForm />;
}