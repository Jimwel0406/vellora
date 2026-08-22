import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { stores } from "./stores";
import { products } from "./products";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  totalAmount: integer("total_amount").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  stripePaymentId: varchar("stripe_payment_id", { length: 255 }),
  promoCode: varchar("promo_code", { length: 50 }),
  discountAmount: integer("discount_amount").notNull().default(0),
  shippingName: varchar("shipping_name", { length: 255 }),
  shippingLine1: varchar("shipping_line1", { length: 255 }),
  shippingLine2: varchar("shipping_line2", { length: 255 }),
  shippingCity: varchar("shipping_city", { length: 255 }),
  shippingState: varchar("shipping_state", { length: 255 }),
  shippingPostalCode: varchar("shipping_postal_code", { length: 20 }),
  shippingCountry: varchar("shipping_country", { length: 255 }),
  shippingPhone: varchar("shipping_phone", { length: 30 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subOrders = pgTable("sub_orders", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  subtotal: integer("subtotal").notNull(),
  commission: integer("commission").notNull(),
  vendorPayout: integer("vendor_payout").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  trackingNumber: varchar("tracking_number", { length: 255 }),
  shippedAt: timestamp("shipped_at"),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productImage: varchar("product_image", { length: 1000 }),
  variant: varchar("variant", { length: 255 }),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});
