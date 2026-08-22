import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { sendEmail, newsletterBroadcastEmailHtml, escapeHtml } from "@/lib/email";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!subject) return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    const subscribers = await db.select().from(newsletterSubscribers);
    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers yet" }, { status: 400 });
    }

    // Escape the message before it's wrapped in HTML so subscriber content can't inject markup.
    const messageHtml = `<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`;
    const html = newsletterBroadcastEmailHtml(subject, messageHtml);

    let sent = 0;
    for (const sub of subscribers) {
      const result = await sendEmail({ to: sub.email, subject, html });
      if (result.sent) sent++;
    }

    return NextResponse.json({ success: true, sent, total: subscribers.length });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}