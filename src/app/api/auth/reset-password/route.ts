import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (typeof token !== "string" || typeof password !== "string" || !token.trim()) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");

    const record = await db
      .select()
      .from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.tokenHash, tokenHash), isNull(passwordResetTokens.usedAt)))
      .then((r) => r[0]);

    if (!record) {
      return NextResponse.json({ error: "This reset link is invalid or has already been used." }, { status: 400 });
    }
    if (new Date(record.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "This reset link has expired." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await db.update(users).set({ password: hashed }).where(eq(users.id, record.userId));
    await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, record.id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}