import { NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail, resetPasswordEmailHtml } from "@/lib/email";

const BASE_URL = process.env.AUTH_URL ?? "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, normalized))
      .then((r) => r[0]);

    // Always return success to avoid leaking whether an account exists.
    if (user) {
      const rawToken = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.insert(passwordResetTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt,
      });

      const resetUrl = `${BASE_URL}/reset-password?token=${rawToken}`;
      await sendEmail({
        to: user.email,
        subject: "Reset your Vellora password",
        html: resetPasswordEmailHtml(resetUrl),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}