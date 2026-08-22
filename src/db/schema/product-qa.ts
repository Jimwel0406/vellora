import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "./users";

export const productQuestions = pgTable("product_questions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productAnswers = pgTable("product_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .notNull()
    .references(() => productQuestions.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questionUpvotes = pgTable("question_upvotes", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .notNull()
    .references(() => productQuestions.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});