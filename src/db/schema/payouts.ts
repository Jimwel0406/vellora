import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  commissionDeducted: integer("commission_deducted").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
