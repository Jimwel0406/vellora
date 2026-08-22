import { NextResponse } from "next/server";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storeId = parseInt((await params).id);
  if (Number.isNaN(storeId)) {
    return NextResponse.json({ error: "Invalid store id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const active = body?.active;
  if (typeof active !== "boolean") {
    return NextResponse.json(
      { error: "Missing active value" },
      { status: 400 }
    );
  }

  const store = await db
    .select()
    .from(stores)
    .where(eq(stores.id, storeId))
    .then((r) => r[0]);

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  await db.update(stores).set({ active }).where(eq(stores.id, storeId));

  return NextResponse.json({ id: store.id, name: store.name, active });
}