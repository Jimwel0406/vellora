import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { categories } from "./categories";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  images: text("images").array(),
  tags: text("tags").array(),
  stock: integer("stock").notNull().default(0),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
