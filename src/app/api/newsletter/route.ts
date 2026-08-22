import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { sendEmail, newsletterSubscribeEmailHtml } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await db
      .insert(newsletterSubscribers)
      .values({ email: normalized })
      .onConflictDoNothing();

    await sendEmail({
      to: normalized,
      subject: "You're subscribed to Vellora",
      html: newsletterSubscribeEmailHtml(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
  return NextResponse.json({
    count: rows.length,
    subscribers: rows.map((r) => ({ email: r.email, createdAt: r.createdAt })),
  });
}