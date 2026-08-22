import { redirect } from "next/navigation";
import { db } from "@/db";
import { stores, payouts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Wallet } from "lucide-react";
import {
  VendorPageHeader,
  VendorStatCard,
  Card,
  tableHeadClass,
} from "../_components/vendor-ui";

export default async function VendorPayoutsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "vendor")
    redirect("/login");

  const userId = parseInt(session.user.id);

  const store = await db
    .select()
    .from(stores)
    .where(eq(stores.userId, userId))
    .then((r) => r[0]);

  if (!store) redirect("/vendor/setup");

  const vendorPayouts = await db
    .select()
    .from(payouts)
    .where(eq(payouts.storeId, store.id))
    .orderBy(desc(payouts.createdAt));

  const completedPayouts = vendorPayouts.filter((p) => p.status === "paid");
  const totalPaid = completedPayouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div data-section="vendor-payouts" className="section-vendor-payouts max-w-6xl">
      <VendorPageHeader eyebrow="Earnings" title="Payouts" />

      <div className="mb-8 max-w-sm">
        <VendorStatCard
          icon={Wallet}
          label="Total Paid"
          value={`$${(totalPaid / 100).toFixed(2)}`}
          accent="emerald"
        />
      </div>

      {completedPayouts.length === 0 ? (
        <Card className="p-8 text-center text-sm text-clay/50">
          No completed payouts yet.
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-clay/[0.03]">
                <tr>
                  <th className={tableHeadClass}>Date</th>
                  <th className={tableHeadClass}>Amount</th>
                  <th className={tableHeadClass}>Commission</th>
                </tr>
              </thead>
              <tbody>
                {completedPayouts.map((payout) => (
                  <tr key={payout.id} className="border-t border-clay/5">
                    <td className="p-4 text-sm text-clay">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-clay font-semibold">
                      ${(payout.amount / 100).toFixed(2)}
                    </td>
                    <td className="p-4 text-sm text-clay/60">
                      ${(payout.commissionDeducted / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}