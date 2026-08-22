import { redirect } from "next/navigation";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { PageHeader, StatTile, Panel } from "@/components/shared/dashboard-ui";
import { Percent } from "lucide-react";
import { CommissionRateForm } from "./commission-rate-form";

export default async function AdminCommissionPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin")
    redirect("/login");

  const rate = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "commission_rate_pct"))
    .then((r) => r[0]);

  const commissionRatePct = rate ? parseFloat(rate.value) : 10;

  return (
    <div data-section="admin-commission" className="section-admin-commission">
      <PageHeader
        eyebrow="Management"
        title="Commission Settings"
        description="Set the platform fee applied to every sale across the marketplace."
      />

      <div className="grid gap-4 lg:grid-cols-2 max-w-4xl">
        <StatTile
          icon={Percent}
          label="Current Platform Rate"
          value={`${commissionRatePct}%`}
          accent="terracotta"
          hint={`Vendors receive ${100 - commissionRatePct}% of each subtotal.`}
        />

        <Panel title="Adjust rate">
          <CommissionRateForm initialRate={commissionRatePct} />
        </Panel>
      </div>
    </div>
  );
}
