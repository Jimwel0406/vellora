import { pgTable, serial, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logo: varchar("logo", { length: 500 }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeAccountId: varchar("stripe_account_id", { length: 255 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
