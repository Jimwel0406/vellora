"use client";

import { useRouter } from "next/navigation";
import { primaryButton } from "@/components/shared/dashboard-ui";

export function MarkPaidButton({ payoutId }: { payoutId: number }) {
  const router = useRouter();

  async function handleMarkPaid() {
    if (!confirm("Mark this payout as paid?")) return;

    await fetch("/api/payouts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payoutId }),
    });
    router.refresh();
  }

  return (
    <button type="button" onClick={handleMarkPaid} className={`${primaryButton} h-9 px-4 text-[10px]`}>
      Mark paid
    </button>
  );
}
