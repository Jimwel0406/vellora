import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { carts, cartItems, products, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { ShieldCheck, Store, Lock } from "lucide-react";
import { StripeCheckoutButton } from "./stripe-redirect";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = parseInt(session.user.id);

  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .then((r) => r[0]);

  if (!cart) redirect("/cart");

  const items = await db
    .select()
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(eq(cartItems.cartId, cart.id));

  if (items.length === 0) redirect("/cart");

  const total = items.reduce(
    (sum, item) =>
      sum + (item.products?.price ?? 0) * item.cart_items.quantity,
    0
  );

  const vendorGroups = items.reduce<Record<string, typeof items>>(
    (acc, item) => {
      const storeName = item.stores?.name ?? "Unknown";
      if (!acc[storeName]) acc[storeName] = [];
      acc[storeName].push(item);
      return acc;
    },
    {}
  );

  return (
    <div
      data-section="checkout-review"
      className="section-checkout-review max-w-2xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-20"
    >
      <div className="text-center mb-10">
        <p className="text-[10px] font-bold uppercase font-label tracking-[0.3em] text-terracotta inline-flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure Checkout
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl text-clay tracking-tight mt-3">
          Checkout
        </h1>
        <p className="text-sm text-clay/60 mt-3 max-w-md mx-auto">
          Review your order, then pay securely with Stripe. You&apos;ll enter
          your shipping address and card details on Stripe&apos;s payment page.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {Object.entries(vendorGroups).map(([storeName, vendorItems]) => {
          const subtotal = vendorItems.reduce(
            (sum, item) =>
              sum + (item.products?.price ?? 0) * item.cart_items.quantity,
            0
          );
          return (
            <div
              key={storeName}
              className="bg-white rounded-2xl border border-clay/10 overflow-hidden"
            >
              <div className="px-5 sm:px-6 py-4 border-b border-clay/5 flex items-center gap-2">
                <Store className="w-4 h-4 text-terracotta" />
                <h3 className="font-bold text-clay">{storeName}</h3>
              </div>
              <div className="px-5 sm:px-6 py-4">
                {vendorItems.map((item) => (
                  <div
                    key={item.cart_items.id}
                    className="flex justify-between text-sm text-clay/70 py-1.5"
                  >
                    <span>
                      {item.products?.name}{" "}
                      <span className="text-clay/40">
                        x{item.cart_items.quantity}
                      </span>
                    </span>
                    <span className="font-semibold text-clay">
                      $
                      {(
                        ((item.products?.price ?? 0) * item.cart_items.quantity) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t mt-3 pt-3 flex justify-between text-sm">
                  <span className="text-clay">Store subtotal</span>
                  <span className="font-semibold text-clay">
                    ${(subtotal / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-clay/10 p-5 sm:p-8">
        <div className="flex justify-between items-end mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-clay">
            Total due
          </span>
          <span className="text-4xl font-black text-clay leading-none tracking-tight">
            ${(total / 100).toFixed(2)}
          </span>
        </div>
        <StripeCheckoutButton label={`Pay $${(total / 100).toFixed(2)} with Stripe`} />
        <p className="mt-4 text-xs text-clay flex items-center gap-1.5 justify-center">
          <Lock className="w-3 h-3" />
          Powered by Stripe. Your payment details are handled securely by Stripe.
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/cart"
            className="text-[11px] font-semibold uppercase tracking-wider text-clay hover:text-clay transition-colors border-b border-transparent hover:border-clay pb-0.5"
          >
            Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}