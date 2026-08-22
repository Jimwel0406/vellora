import { db } from "@/db";
import { promoCodes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export type PromoResult =
  | { ok: true; promoCode: typeof promoCodes.$inferSelect; discountAmount: number }
  | { ok: false; error: string };

export function evaluatePromoCode(
  row: typeof promoCodes.$inferSelect,
  subtotalCents: number
): PromoResult {
  if (!row.active) return { ok: false, error: "This promo code has been disabled." };
  if (row.expiresAt && new Date(row.expiresAt).getTime() < Date.now())
    return { ok: false, error: "This promo code has expired." };
  if (row.minOrderAmount && subtotalCents < row.minOrderAmount)
    return {
      ok: false,
      error: `This code requires a minimum order of $${(row.minOrderAmount / 100).toFixed(2)}.`,
    };
  if (row.maxUses != null && row.usedCount >= row.maxUses)
    return { ok: false, error: "This promo code has reached its usage limit." };

  const discountAmount =
    row.discountType === "percent"
      ? Math.round(subtotalCents * (row.discountValue / 100))
      : row.discountValue;

  if (discountAmount >= subtotalCents)
    return { ok: false, error: "This promo discount exceeds your order total." };

  return { ok: true, promoCode: row, discountAmount };
}

export async function validatePromo(code: string, subtotalCents: number): Promise<PromoResult> {
  const row = await db
    .select()
    .from(promoCodes)
    .where(eq(promoCodes.code, normalizePromoCode(code)))
    .then((r) => r[0]);

  if (!row) return { ok: false, error: "That promo code isn't valid." };

  return evaluatePromoCode(row, subtotalCents);
}

export function incrementPromoUse(codeId: number) {
  return db
    .update(promoCodes)
    .set({ usedCount: sql`${promoCodes.usedCount} + 1` })
    .where(eq(promoCodes.id, codeId));
}