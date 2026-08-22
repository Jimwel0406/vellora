import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rate = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "commission_rate_pct"))
      .then((r) => r[0]);

    return NextResponse.json({
      commissionRatePct: rate ? parseFloat(rate.value) : 10,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { commissionRatePct } = await req.json();
    const rate = Number(commissionRatePct);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      return NextResponse.json(
        { error: "Commission rate must be between 0 and 50%" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "commission_rate_pct"))
      .then((r) => r[0]);

    if (existing) {
      await db
        .update(settings)
        .set({ value: String(rate), updatedAt: new Date() })
        .where(eq(settings.key, "commission_rate_pct"));
    } else {
      await db.insert(settings).values({
        key: "commission_rate_pct",
        value: String(rate),
      });
    }

    return NextResponse.json({ commissionRatePct: rate });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}