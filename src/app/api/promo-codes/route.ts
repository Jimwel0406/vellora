import { NextResponse } from "next/server";
import { db } from "@/db";
import { promoCodes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { normalizePromoCode } from "@/lib/promo";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.select().from(promoCodes).orderBy(desc(promoCodes.id));
  return NextResponse.json({ promoCodes: rows });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const code = normalizePromoCode(typeof body.code === "string" ? body.code : "");
    const discountType = body.discountType === "fixed" ? "fixed" : "percent";
    const discountValue = Math.floor(Number(body.discountValue));
    const minOrderAmount = body.minOrderAmount != null && body.minOrderAmount !== "" ? Math.floor(Number(body.minOrderAmount)) : null;
    const maxUses = body.maxUses != null && body.maxUses !== "" ? Math.floor(Number(body.maxUses)) : null;
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

    if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });
    if (!Number.isFinite(discountValue) || discountValue <= 0)
      return NextResponse.json({ error: "Discount value must be a positive number" }, { status: 400 });
    if (discountType === "percent" && (discountValue > 100))
      return NextResponse.json({ error: "Percent discount must be 100 or less" }, { status: 400 });
    if (minOrderAmount != null && (!Number.isFinite(minOrderAmount) || minOrderAmount < 0))
      return NextResponse.json({ error: "Invalid minimum order amount" }, { status: 400 });
    if (maxUses != null && (!Number.isFinite(maxUses) || maxUses < 1))
      return NextResponse.json({ error: "Invalid max uses" }, { status: 400 });
    if (expiresAt && Number.isNaN(expiresAt.getTime()))
      return NextResponse.json({ error: "Invalid expiry date" }, { status: 400 });

    const existing = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.code, code))
      .then((r) => r[0]);
    if (existing) return NextResponse.json({ error: "That code already exists" }, { status: 409 });

    const [created] = await db
      .insert(promoCodes)
      .values({
        code,
        discountType,
        discountValue,
        minOrderAmount,
        maxUses,
        expiresAt,
        active: body.active !== false,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await db.update(promoCodes).set({ active: body.active === true }).where(eq(promoCodes.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await db.delete(promoCodes).where(eq(promoCodes.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}