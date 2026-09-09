import Link from "next/link";
import { eq, and, ne, desc } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products, stores } from "@/db/schema";
import { PencilLine, Eye, Package, BadgeCheck } from "lucide-react";

export async function VendorProductPanel({
  productId,
  storeSlug,
}: {
  productId: number;
  storeSlug?: string;
}) {
  const [product, store] = await Promise.all([
    db.select().from(products).where(eq(products.id, productId)).then((r) => r[0]),
    storeSlug
      ? db.select().from(stores).where(eq(stores.slug, storeSlug)).then((r) => r[0])
      : Promise.resolve(null),
  ]);

  const saleRows = await db
    .select()
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(eq(orderItems.productId, productId), ne(orders.status, "cancelled")))
    .orderBy(desc(orders.createdAt));

  const completed = saleRows.filter((r) => r.orders?.status === "completed");
  const unitsSold = completed.reduce((sum, r) => sum + r.order_items.quantity, 0);
  const revenue = completed.reduce(
    (sum, r) => sum + r.order_items.price * r.order_items.quantity,
    0
  );

  const lowStock = product && product.stock <= 5;

  return (
    <div className="space-y-4">
      <div className="border border-terracotta/15 bg-[#FBF6EC] p-5">
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
            <BadgeCheck className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-[15px] font-semibold text-clay leading-snug">
              Vendor preview
            </p>
            <p className="text-[13px] text-clay/50 leading-snug mt-1">
              You&apos;re viewing one of your own products — shoppers see the buy panel instead of this.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white border border-clay/10 p-3 text-center">
            <p className="text-lg font-bold text-clay leading-none">{unitsSold}</p>
            <p className="text-[11px] text-clay/40 mt-1">Units sold</p>
          </div>
          <div className="bg-white border border-clay/10 p-3 text-center">
            <p className="text-lg font-bold text-clay leading-none">
              ${(revenue / 100).toFixed(2)}
            </p>
            <p className="text-[11px] text-clay/40 mt-1">Revenue</p>
          </div>
          <div className="bg-white border border-clay/10 p-3 text-center">
            <p className={`text-lg font-bold leading-none ${lowStock ? "text-terracotta" : "text-clay"}`}>
              {product?.stock ?? 0}
            </p>
            <p className="text-[11px] text-clay/40 mt-1">
              {lowStock ? "Low stock" : "In stock"}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Link
            href={`/vendor/products/${productId}/edit`}
            className="block w-full text-center bg-terracotta text-white py-3 text-[12px] font-bold uppercase font-label tracking-[0.2em] hover:bg-terracotta-deep transition-all flex items-center justify-center gap-2"
          >
            <PencilLine className="w-4 h-4" />
            Edit product
          </Link>
          <div className="grid grid-cols-2 gap-2">
            {store && (
              <Link
                href={`/stores/${store.slug}`}
                className="block text-center border border-clay/15 text-clay py-3 text-[12px] font-semibold uppercase tracking-[0.14em] hover:border-clay/30 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View store
              </Link>
            )}
            <Link
              href="/vendor/products"
              className="block text-center border border-clay/15 text-clay py-3 text-[12px] font-semibold uppercase tracking-[0.14em] hover:border-clay/30 transition-all flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              All products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
