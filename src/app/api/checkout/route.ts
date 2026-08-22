import { NextResponse } from "next/server";
import { db } from "@/db";
import { carts, cartItems, orders, subOrders, payouts, products, orderItems, settings, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { stripe, APP_URL } from "@/lib/stripe";
import { cancelPendingOrders } from "@/lib/complete-order";
import { validatePromo, incrementPromoUse } from "@/lib/promo";
import { clampCommissionRate, splitVendorPayout, DEFAULT_COMMISSION_RATE } from "@/lib/vendor-payout";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "customer") {
    return NextResponse.json(
      { error: "Seller accounts can't purchase products.", code: "SELLER_CANNOT_BUY" },
      { status: 403 }
    );
  }

  try {
    const userId = parseInt(session.user.id);
    const body = await request.json().catch(() => ({}));
    const promoInput = typeof body.promoCode === "string" ? body.promoCode : "";

    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .then((r) => r[0]);

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 400 });
    }

    const items = await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(stores, eq(products.storeId, stores.id))
      .where(eq(cartItems.cartId, cart.id));

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty", code: "EMPTY_CART" },
        { status: 400 }
      );
    }

    const ownProduct = items.find(
      (item) => item.stores?.userId === userId
    );
    if (ownProduct?.products) {
      return NextResponse.json(
        {
          error: `"${ownProduct.products.name}" is your own product. Remove it from your cart before checking out.`,
          code: "OWN_PRODUCT",
        },
        { status: 400 }
      );
    }

    const overStock = items.find(
      (item) =>
        item.products &&
        item.cart_items.quantity > item.products.stock
    );
    if (overStock?.products) {
      return NextResponse.json(
        {
          error: `"${overStock.products.name}" only has ${overStock.products.stock} in stock. Adjust the quantity in your cart and try again.`,
        },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (sum, item) =>
        sum + (item.products?.price ?? 0) * item.cart_items.quantity,
      0
    );

    let promoApplied: {
      id: number;
      code: string;
      discountType: string;
      discountValue: number;
      discountAmount: number;
    } | null = null;
    if (promoInput.trim()) {
      const promo = await validatePromo(promoInput, totalAmount);
      if (!promo.ok) {
        return NextResponse.json({ error: promo.error, code: "INVALID_PROMO" }, { status: 400 });
      }
      promoApplied = {
        id: promo.promoCode.id,
        code: promo.promoCode.code,
        discountType: promo.promoCode.discountType,
        discountValue: promo.promoCode.discountValue,
        discountAmount: promo.discountAmount,
      };
    }

    const rateSetting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "commission_rate_pct"))
      .then((r) => r[0]);

    const commissionRate = clampCommissionRate(
      rateSetting ? parseFloat(rateSetting.value) / 100 : DEFAULT_COMMISSION_RATE
    );

    await cancelPendingOrders(userId);

    const [order] = await db
      .insert(orders)
      .values({
        userId,
        totalAmount,
        status: "pending",
        promoCode: promoApplied?.code ?? null,
        discountAmount: promoApplied?.discountAmount ?? 0,
      })
      .returning();

    if (order) {
      await db.insert(orderItems).values(
        items.map((item) => ({
          orderId: order.id,
          productId: item.products?.id ?? 0,
          productName: item.products?.name ?? "Product",
          productImage: item.products?.images?.[0] ?? null,
          variant: item.cart_items.variant ?? null,
          quantity: item.cart_items.quantity,
          price: item.products?.price ?? 0,
        }))
      );
    }

    const vendorMap = new Map<
      number,
      { subtotal: number; items: typeof items }
    >();

    for (const item of items) {
      const storeId = item.products?.storeId;
      if (!storeId) continue;

      if (!vendorMap.has(storeId)) {
        vendorMap.set(storeId, { subtotal: 0, items: [] });
      }
      const vendor = vendorMap.get(storeId)!;
      vendor.items.push(item);
      vendor.subtotal +=
        (item.products?.price ?? 0) * item.cart_items.quantity;
    }

    for (const [storeId, data] of vendorMap) {
      const { commission, vendorPayout } = splitVendorPayout(data.subtotal, commissionRate);

      await db.insert(subOrders).values({
        orderId: order.id,
        storeId,
        subtotal: data.subtotal,
        commission,
        vendorPayout,
        status: "pending",
      });

      await db.insert(payouts).values({
        storeId,
        amount: vendorPayout,
        commissionDeducted: commission,
        status: "pending",
      });
    }

    const lineItems = items
      .map((item) => {
        if (!item.products) return null;
        const validImages = (item.products.images ?? []).filter(
          (img) => /^https?:\/\//.test(img)
        );
        return {
          quantity: item.cart_items.quantity,
          price_data: {
            currency: "usd",
            unit_amount: item.products.price,
            product_data: {
              name: item.products.name,
              ...(validImages.length > 0 ? { images: validImages } : {}),
            },
          },
        };
      })
      .filter(Boolean) as {
      quantity: number;
      price_data: {
        currency: string;
        unit_amount: number;
        product_data: { name: string; images?: string[] };
      };
    }[];

    let discounts: { coupon: string }[] = [];
    if (promoApplied) {
      const coupon = await stripe.coupons.create(
        promoApplied.discountType === "percent"
          ? { percent_off: promoApplied.discountValue, duration: "once" }
          : { amount_off: promoApplied.discountAmount, currency: "usd", duration: "once" }
      );
      discounts = [{ coupon: coupon.id }];
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email ?? undefined,
      payment_method_types: ["card"],
      line_items: lineItems,
      discounts,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "PH"],
      },
      metadata: { order_id: String(order.id) },
      success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/checkout/cancel`,
    });

    if (promoApplied) {
      await incrementPromoUse(promoApplied.id);
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}