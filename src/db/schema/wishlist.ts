import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { products } from "./products";

export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
