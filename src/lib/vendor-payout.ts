export interface VendorSplit {
  subtotal: number;
  commission: number;
  vendorPayout: number;
}

export const DEFAULT_COMMISSION_RATE = 0.1;

export function clampCommissionRate(rate: number): number {
  if (Number.isNaN(rate)) return DEFAULT_COMMISSION_RATE;
  return Math.min(Math.max(rate, 0), 0.5);
}

export function splitVendorPayout(
  subtotalCents: number,
  rate: number
): VendorSplit {
  const commission = Math.round(subtotalCents * clampCommissionRate(rate));
  return {
    subtotal: subtotalCents,
    commission,
    vendorPayout: subtotalCents - commission,
  };
}