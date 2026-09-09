import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { carts, cartItems, products, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { ShoppingBag, Store } from "lucide-react";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";
import { CartContents } from "./cart-contents";
import { CartVendorSection } from "./cart-vendor-section";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = parseInt(session.user.id);

  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .then((r) => r[0]);

  if (!cart) return <EmptyCart />;

  const items = await db
    .select()
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(eq(cartItems.cartId, cart.id));

  if (items.length === 0) return <EmptyCart />;

  const itemCount = items.reduce((sum, item) => sum + item.cart_items.quantity, 0);

  const grouped = new Map<string, typeof items>();
  for (const item of items) {
    const name = item.stores?.name ?? "Unknown";
    if (!grouped.has(name)) grouped.set(name, []);
    grouped.get(name)!.push(item);
  }

  return (
    <CartContents initialRowCount={items.length} empty={<EmptyCart />}>
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-8 space-y-16">
          <header className="space-y-2">
            <h2 className="font-heading text-5xl lg:text-[56px] leading-[1.1] text-terracotta">
              Your Cart
            </h2>
            <p className="text-xs lg:text-sm font-medium font-label tracking-[0.2em] uppercase text-clay/50">
              {itemCount} item{itemCount !== 1 ? "s" : ""} from {grouped.size} store{grouped.size !== 1 ? "s" : ""}
            </p>
          </header>

          {[...grouped.entries()].map(([storeName, storeItems]) => {
            const groupId = storeItems[0].stores?.slug ?? storeName;
            return (
              <CartVendorSection
                key={groupId}
                groupId={groupId}
                initialRowCount={storeItems.length}
                header={
                  <div className="flex items-center gap-4 border-b border-clay/10 pb-3">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-clay/40">VENDOR</span>
                    <Link href={`/stores/${storeItems[0].stores?.slug}`} className="text-xl lg:text-2xl font-bold text-clay hover:text-terracotta transition-colors">
                      {storeName}
                    </Link>
                  </div>
                }
              >
                <div className="space-y-6">
                  {storeItems.map((item) => (
                    <CartItemRow
                      key={item.cart_items.id}
                      itemId={item.cart_items.id}
                      productId={item.products?.id ?? 0}
                      productName={item.products?.name ?? ""}
                      productImage={item.products?.images?.[0]}
                      groupId={groupId}
                      storeName={item.stores?.name ?? ""}
                      storeSlug={item.stores?.slug}
                      price={item.products?.price ?? 0}
                      quantity={item.cart_items.quantity}
                      stock={item.products?.stock ?? 0}
                      variant={item.cart_items.variant}
                    />
                  ))}
                </div>
              </CartVendorSection>
            );
          })}
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-28">
          <CartSummary
            initialItems={items.map((item) => ({
              id: item.cart_items.id,
              price: item.products?.price ?? 0,
              qty: item.cart_items.quantity,
            }))}
          />
        </aside>
      </div>
      </div>
    </CartContents>
  );
}

function EmptyCart() {
  return (
    <section
      data-section="cart-empty"
      className="section-cart-empty border border-clay/15 rounded-2xl bg-white/60 mx-4 sm:mx-8 lg:mx-12 my-12 lg:my-20 py-24 lg:py-32 text-center"
    >
      <span className="mx-auto w-16 h-16 rounded-full bg-sand border border-clay/10 flex items-center justify-center">
        <ShoppingBag className="w-7 h-7 text-terracotta" />
      </span>
      <h1 className="mt-6 font-heading text-4xl lg:text-5xl text-clay leading-tight">
        Your cart is empty
      </h1>
      <p className="mt-3 text-sm text-clay/60 max-w-sm mx-auto leading-relaxed">
        Looks like you haven&apos;t added anything yet. Browse our stores to find something you love.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/products"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-clay text-sand text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-terracotta transition-colors duration-200"
        >
          Browse products
        </Link>
        <Link
          href="/stores"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full border border-clay/25 text-clay text-[10px] font-bold uppercase tracking-[0.2em] hover:border-clay/40 hover:bg-clay/5 transition-colors duration-200"
        >
          <Store className="w-4 h-4" />
          Explore stores
        </Link>
      </div>
    </section>
  );
}
