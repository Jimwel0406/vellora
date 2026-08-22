import { redirect } from "next/navigation";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { EditProductForm } from "./product-form";

export default async function EditProductPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "vendor") redirect("/login");

  const store = await db
    .select()
    .from(stores)
    .where(eq(stores.userId, parseInt(session.user.id)))
    .then((r) => r[0]);

  if (!store) redirect("/vendor/setup");

  return <EditProductForm />;
}