import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

const SHIPPING_FIELDS = [
  "shippingName",
  "shippingLine1",
  "shippingLine2",
  "shippingCity",
  "shippingState",
  "shippingPostalCode",
  "shippingCountry",
  "shippingPhone",
] as const;

const SHIPPING_MAX: Record<(typeof SHIPPING_FIELDS)[number], number> = {
  shippingName: 255,
  shippingLine1: 255,
  shippingLine2: 255,
  shippingCity: 255,
  shippingState: 255,
  shippingPostalCode: 20,
  shippingCountry: 255,
  shippingPhone: 30,
};

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { name, email } = body;

    const updates: Partial<typeof users.$inferInsert> = {};

    if (typeof name === "string" && name.trim()) {
      updates.name = name.trim().slice(0, 255);
    }

    if (typeof email === "string" && email.trim()) {
      const normalized = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, normalized))
        .then((r) => r[0]);
      if (existing && existing.id !== userId) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
      updates.email = normalized;
    }

    for (const field of SHIPPING_FIELDS) {
      const value = body[field];
      updates[field] =
        typeof value === "string" && value.trim()
          ? value.trim().slice(0, SHIPPING_MAX[field])
          : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    await db.update(users).set(updates).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}