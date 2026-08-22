import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { products } from "./products";

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  variant: varchar("variant", { length: 255 }),
});
