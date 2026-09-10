import { redirect } from "next/navigation";
import { db } from "@/db";
import { payouts, stores } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { PageHeader, Panel, StatusPill, tableHead } from "@/components/shared/dashboard-ui";
import { MarkPaidButton } from "./mark-paid-button";

export default async function AdminPayoutsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin")
    redirect("/login");

  const allPayouts = await db
    .select()
    .from(payouts)
    .leftJoin(stores, eq(payouts.storeId, stores.id))
    .orderBy(desc(payouts.createdAt));

  return (
    <div data-section="admin-payouts" className="section-admin-payouts">
      <PageHeader
        eyebrow="Management"
        title="Vendor Payouts"
        description="Review earnings withheld from sales and release them to vendors."
      />

      {allPayouts.length === 0 ? (
        <p className="text-sm text-clay">No payouts yet.</p>
      ) : (
        <Panel bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-clay/10">
                  <th className={tableHead}>Store</th>
                  <th className={tableHead}>Amount</th>
                  <th className={tableHead}>Commission</th>
                  <th className={tableHead}>Date</th>
                  <th className={tableHead}>Status</th>
                  <th className={`${tableHead} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {allPayouts.map(({ payouts: payout, stores: store }) => (
                  <tr key={payout.id} className="border-t border-clay/5 hover:bg-clay/[0.02] transition-colors">
                    <td className="p-4 text-sm font-medium text-clay">{store?.name}</td>
                    <td className="p-4 text-sm text-clay/70">${(payout.amount / 100).toFixed(2)}</td>
                    <td className="p-4 text-sm text-clay/70">
                      ${(payout.commissionDeducted / 100).toFixed(2)}
                    </td>
                    <td className="p-4 text-sm text-clay">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <StatusPill status={payout.status} />
                    </td>
                    <td className="p-4 text-right">
                      {payout.status === "pending" && <MarkPaidButton payoutId={payout.id} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
