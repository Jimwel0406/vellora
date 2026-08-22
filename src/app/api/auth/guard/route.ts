import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ valid: false }, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const exists = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .then((r) => r.length > 0);

  return NextResponse.json({ valid: exists }, {
    headers: { "Cache-Control": "no-store" },
  });
}
