import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { sendEmail, contactEmailHtml } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000),
});

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@vellora.com";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const { name, email, subject, message } = parsed.data;

    await db.insert(contactMessages).values({ name, email, subject, message });

    await sendEmail({
      to: SUPPORT_EMAIL,
      subject: `[Vellora] ${subject}`,
      html: contactEmailHtml({ name, email, message }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] failed:", (error as Error).message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
