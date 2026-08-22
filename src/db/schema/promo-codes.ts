import { pgTable, serial, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const promoCodes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  // "percent" = discountValue is a percentage (1-100); "fixed" = discountValue is cents off
  discountType: varchar("discount_type", { length: 20 }).notNull().default("percent"),
  discountValue: integer("discount_value").notNull(),
  minOrderAmount: integer("min_order_amount"),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  active: boolean("active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});