import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail, welcomeEmailHtml } from "@/lib/email";

const BASE_URL = process.env.AUTH_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Only Gmail addresses are accepted" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((r) => r[0]);

    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const safeRole =
      role === "vendor" || role === "customer" ? role : "customer";

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: safeRole,
    });

    await sendEmail({
      to: email,
      subject: "Welcome to Vellora",
      html: welcomeEmailHtml(name, BASE_URL),
    });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
