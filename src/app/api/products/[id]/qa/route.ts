import { NextResponse } from "next/server";
import { db } from "@/db";
import { productQuestions, productAnswers, questionUpvotes, products, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = parseInt((await params).id);
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body?.action as string | undefined;

  if (action === "ask") {
    const question = typeof body?.question === "string" ? body.question.trim() : "";
    if (!question || question.length < 10 || question.length > 500) {
      return NextResponse.json(
        { error: "Question must be between 10 and 500 characters." },
        { status: 400 }
      );
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then((r) => r[0]);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const [questionRow] = await db
      .insert(productQuestions)
      .values({
        productId,
        userId: parseInt(session.user.id),
        question,
      })
      .returning();

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, product.storeId))
      .then((r) => r[0]);

    if (store) {
      await createNotification({
        userId: store.userId,
        type: "question",
        title: "New product question",
        message: `${session.user.name || "A customer"} asked a question about "${product.name}".`,
        link: `/vendor/products`,
      });
    }

    return NextResponse.json(questionRow, { status: 201 });
  }

  if (action === "answer") {
    const questionId = typeof body?.questionId === "string" ? parseInt(body.questionId) : NaN;
    const answer = typeof body?.answer === "string" ? body.answer.trim() : "";
    if (Number.isNaN(questionId)) {
      return NextResponse.json({ error: "Invalid question" }, { status: 400 });
    }
    if (!answer || answer.length < 2 || answer.length > 500) {
      return NextResponse.json(
        { error: "Answer must be between 2 and 500 characters." },
        { status: 400 }
      );
    }

    const question = await db
      .select()
      .from(productQuestions)
      .where(eq(productQuestions.id, questionId))
      .then((r) => r[0]);

    if (!question || question.productId !== productId) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then((r) => r[0]);

    const store = product
      ? await db
          .select()
          .from(stores)
          .where(eq(stores.id, product.storeId))
          .then((r) => r[0])
      : undefined;

    // Only the shop owner/staff (vendor of this store) can answer.
    const requesterId = parseInt(session.user.id);
    const isStoreOwner = !!store && store.userId === requesterId;
    if (!isStoreOwner) {
      return NextResponse.json(
        { error: "Only the shop owner can answer questions." },
        { status: 403 }
      );
    }

    const [answerRow] = await db
      .insert(productAnswers)
      .values({
        questionId,
        userId: requesterId,
        answer,
      })
      .returning();

    await createNotification({
      userId: question.userId,
      type: "question",
      title: "Your question was answered",
      message: `Your question about "${product?.name ?? "a product"}" was answered.`,
      link: `/products/${productId}`,
    });

    return NextResponse.json(answerRow, { status: 201 });
  }

  if (action === "upvote") {
    const questionId = typeof body?.questionId === "string" ? parseInt(body.questionId) : NaN;
    if (Number.isNaN(questionId)) {
      return NextResponse.json({ error: "Invalid question" }, { status: 400 });
    }

    const question = await db
      .select()
      .from(productQuestions)
      .where(eq(productQuestions.id, questionId))
      .then((r) => r[0]);

    if (!question || question.productId !== productId) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const userId = parseInt(session.user.id);

    const existing = await db
      .select()
      .from(questionUpvotes)
      .where(
        and(
          eq(questionUpvotes.questionId, questionId),
          eq(questionUpvotes.userId, userId)
        )
      )
      .then((r) => r[0]);

    if (existing) {
      return NextResponse.json(
        { error: "You already upvoted this question." },
        { status: 409 }
      );
    }

    await db.insert(questionUpvotes).values({ questionId, userId });

    return NextResponse.json({ upvoted: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}