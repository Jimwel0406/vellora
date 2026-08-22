import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("customer"),
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
