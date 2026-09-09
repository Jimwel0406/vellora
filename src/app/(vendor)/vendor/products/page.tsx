import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { stores, products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Plus, Pencil } from "lucide-react";
import { DeleteProductButton } from "./delete-product-button";
import {
  VendorPageHeader,
  Card,
  primaryBtn,
  tableHeadClass,
} from "../_components/vendor-ui";

export default async function VendorProductsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "vendor")
    redirect("/login");

  const userId = parseInt(session.user.id);

  const store = await db
    .select()
    .from(stores)
    .where(eq(stores.userId, userId))
    .then((r) => r[0]);

  if (!store) redirect("/vendor/setup");

  const vendorProducts = await db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.storeId, store.id));

  const lowStockCount = vendorProducts.filter(
    ({ products: p }) => p.stock > 0 && p.stock <= 5
  ).length;

  const outOfStockCount = vendorProducts.filter(
    ({ products: p }) => p.stock === 0
  ).length;

  return (
    <div data-section="vendor-products" className="section-vendor-products max-w-6xl">
      <VendorPageHeader
        eyebrow="Catalog"
        title="My Products"
        subtitle={
          vendorProducts.length > 0
            ? `${vendorProducts.length} product${vendorProducts.length !== 1 ? "s" : ""}${
                lowStockCount > 0 || outOfStockCount > 0
                  ? ` · ${
                      outOfStockCount > 0
                        ? `${outOfStockCount} out of stock`
                        : `${lowStockCount} low on stock`
                    }`
                  : ""
              }`
            : undefined
        }
        action={
          <Link href="/vendor/products/new" className={primaryBtn}>
            <Plus className="w-4 h-4" />
            Add product
          </Link>
        }
      />

      {vendorProducts.length === 0 ? (
        <Card className="p-8 text-center text-sm text-clay/50">
          No products yet.{" "}
          <Link
            href="/vendor/products/new"
            className="underline underline-offset-4 text-terracotta hover:text-clay"
          >
            Add your first product
          </Link>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-clay/[0.03]">
              <tr>
                <th className={tableHeadClass}>Product</th>
                <th className={tableHeadClass}>Price</th>
                <th className={tableHeadClass}>Stock</th>
                <th className={tableHeadClass}>Category</th>
                <th className={tableHeadClass + " text-right"}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendorProducts.map(
                ({ products: product, categories: category }) => (
                  <tr key={product.id} className="border-t border-clay/5">
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-clay/[0.03] border border-clay/10 flex items-center justify-center overflow-hidden shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" width="600" height="600" loading="lazy" />
                          ) : (
                            <span className="text-xs text-clay/40">No img</span>
                          )}
                        </div>
                        <span className="truncate font-medium text-clay">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-clay font-semibold">
                      ${(product.price / 100).toFixed(2)}
                    </td>
                    <td className="p-4 text-sm">
                      {product.stock === 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                          Out of stock
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                          Low · {product.stock}
                        </span>
                      ) : (
                        <span className="text-clay/60">{product.stock}</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-clay/60">
                      {category?.name || "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/vendor/products/${product.id}/edit`}
                          className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg border border-clay/15 text-clay/70 text-[10px] font-bold uppercase tracking-wider hover:border-clay/40 hover:text-clay transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          </div>
        </Card>
      )}
    </div>
  );
}