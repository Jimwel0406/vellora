import { NextResponse } from "next/server";
import { validatePromo, normalizePromoCode } from "@/lib/promo";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") ?? "";
  const subtotal = Number(url.searchParams.get("subtotal"));

  if (!code.trim() || !Number.isFinite(subtotal) || subtotal < 0) {
    return NextResponse.json({ valid: false, error: "Invalid request" }, { status: 400 });
  }

  const result = await validatePromo(code, subtotal);
  if (!result.ok) {
    return NextResponse.json({ valid: false, error: result.error });
  }

  return NextResponse.json({
    valid: true,
    code: normalizePromoCode(code),
    discountAmount: result.discountAmount,
    discountType: result.promoCode.discountType,
  });
}