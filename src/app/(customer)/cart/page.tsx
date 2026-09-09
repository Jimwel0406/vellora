import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { carts, cartItems, products, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
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
      <div className="max-w-[1120px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-28">
        {/* Cart header */}
        <header className="mb-12 sm:mb-16 lg:mb-20">
          <h1 className="font-heading text-[40px] sm:text-[46px] lg:text-[52px] leading-[1.05] text-terracotta tracking-[-0.02em]">
            Your Cart
          </h1>
          <p className="mt-2 sm:mt-3 text-[11px] sm:text-[12px] font-semibold font-label tracking-[0.2em] uppercase text-clay/45">
            {itemCount} item{itemCount !== 1 ? "s" : ""} from {grouped.size} store{grouped.size !== 1 ? "s" : ""}
          </p>
        </header>

        {/* 70/30 editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-12 lg:gap-0 items-start">
          {/* Left — Cart products */}
          <div className="space-y-12 sm:space-y-16">
            {[...grouped.entries()].map(([storeName, storeItems]) => {
              const groupId = storeItems[0].stores?.slug ?? storeName;
              return (
                <CartVendorSection
                  key={groupId}
                  groupId={groupId}
                  initialRowCount={storeItems.length}
                  header={
                    <div className="border-b border-clay/10 pb-3 mb-6">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-clay/40 font-label">Vendor</span>
                        <Link href={`/stores/${storeItems[0].stores?.slug}`} className="text-[18px] sm:text-[20px] font-semibold text-clay hover:text-terracotta transition-colors">
                          {storeName}
                        </Link>
                      </div>
                    </div>
                  }
                >
                  <div className="space-y-8">
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

          {/* Right — Order summary with vertical divider */}
          <div className="lg:pl-10 lg:border-l border-clay/10 lg:sticky lg:top-28">
            <CartSummary
              initialItems={items.map((item) => ({
                id: item.cart_items.id,
                price: item.products?.price ?? 0,
                qty: item.cart_items.quantity,
              }))}
            />
          </div>
        </div>
      </div>
    </CartContents>
  );
}

function EmptyCart() {
  return (
    <section
      data-section="cart-empty"
      className="section-cart-empty max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-28"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-12 lg:gap-16 lg:items-center">
        {/* LEFT — Text column */}
        <div className="lg:pr-8">
          <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-clay/45 font-label">
            Your cart
          </span>

          <h1 className="mt-5 sm:mt-6 font-heading text-[42px] sm:text-[48px] lg:text-[64px] xl:text-[72px] leading-[0.95] text-clay tracking-[-0.03em]">
            Nothing here <span className="text-clay/40">— yet.</span>
          </h1>

          <p className="mt-6 sm:mt-8 text-[16px] leading-[1.7] text-clay/60 max-w-[340px]">
            Your next favorite find is waiting. Discover pieces worth bringing home.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] text-clay hover:text-terracotta transition-colors group"
            >
              Browse products
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-clay/40 hover:text-clay/70 transition-colors"
            >
              Explore stores
            </Link>
          </div>
        </div>

        {/* RIGHT — Editorial image */}
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden bg-[#FAF7EC]">
            <img
              src="/Vellora_lifestyle_product_still.jpeg"
              alt="Editorial still life"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
