import { db } from "@/db";
import {
  productQuestions,
  productAnswers,
  questionUpvotes,
  users,
} from "@/db/schema";
import { eq, inArray, desc, sql } from "drizzle-orm";

export interface QaItem {
  id: number;
  question: string;
  createdAt: Date;
  userName: string;
  upvotes: number;
  answers: {
    id: number;
    answer: string;
    createdAt: Date;
    userName: string;
  }[];
}

export async function getProductQa(productId: number): Promise<QaItem[]> {
  const questionRows = await db
    .select()
    .from(productQuestions)
    .where(eq(productQuestions.productId, productId))
    .orderBy(desc(productQuestions.createdAt));

  if (questionRows.length === 0) return [];

  const questionIds = questionRows.map((q) => q.id);

  const [upvoteRows, answerRows] = await Promise.all([
    db
      .select({
        questionId: questionUpvotes.questionId,
        count: sql<number>`count(*)::int`,
      })
      .from(questionUpvotes)
      .where(inArray(questionUpvotes.questionId, questionIds))
      .groupBy(questionUpvotes.questionId),
    db
      .select({
        id: productAnswers.id,
        questionId: productAnswers.questionId,
        answer: productAnswers.answer,
        createdAt: productAnswers.createdAt,
        userId: productAnswers.userId,
      })
      .from(productAnswers)
      .where(inArray(productAnswers.questionId, questionIds))
      .orderBy(desc(productAnswers.createdAt)),
  ]);

  const userIds = new Set<number>([
    ...questionRows.map((q) => q.userId),
    ...answerRows.map((a) => a.userId),
  ]);

  const nameRows =
    userIds.size > 0
      ? await db
          .select({ id: users.id, name: users.name })
          .from(users)
          .where(inArray(users.id, [...userIds]))
      : [];

  const nameById = new Map(nameRows.map((u) => [u.id, u.name ?? "Anonymous"]));
  const upvoteMap = new Map(upvoteRows.map((u) => [u.questionId, u.count]));

  return questionRows.map((q) => ({
    id: q.id,
    question: q.question,
    createdAt: q.createdAt,
    userName: nameById.get(q.userId) ?? "Anonymous",
    upvotes: upvoteMap.get(q.id) ?? 0,
    answers: answerRows
      .filter((a) => a.questionId === q.id)
      .map((a) => ({
        id: a.id,
        answer: a.answer,
        createdAt: a.createdAt,
        userName: nameById.get(a.userId) ?? "Anonymous",
      })),
  }));
}