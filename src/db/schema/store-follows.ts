import { pgTable, serial, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { users } from "./users";

export const storeFollows = pgTable("store_follows", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueFollow: unique().on(table.storeId, table.userId),
}));
