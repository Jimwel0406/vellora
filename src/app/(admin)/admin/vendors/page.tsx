import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { stores, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { PageHeader, Panel, tableHead } from "@/components/shared/dashboard-ui";
import { StoreStatusToggle } from "./store-status-toggle";

export default async function AdminVendorsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin")
    redirect("/login");

  const allStores = await db
    .select()
    .from(stores)
    .leftJoin(users, eq(stores.userId, users.id));

  const activeCount = allStores.filter(({ stores: s }) => s.active).length;

  return (
    <div data-section="admin-vendors" className="section-admin-vendors">
      <PageHeader
        eyebrow="Management"
        title="Vendors"
        description="Every store registered on the marketplace and its owner. Approve or disable a store's public presence."
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-green-800">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600" aria-hidden />
          {activeCount} active
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-700">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
          {allStores.length - activeCount} disabled
        </span>
      </div>

      {allStores.length === 0 ? (
        <p className="text-sm text-clay">No vendors registered yet.</p>
      ) : (
        <Panel bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-clay/10">
                  <th className={tableHead}>Store</th>
                  <th className={tableHead}>Owner</th>
                  <th className={tableHead}>Email</th>
                  <th className={tableHead}>Joined</th>
                  <th className={tableHead}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allStores.map(({ stores: store, users: user }) => (
                  <tr key={store.id} className="border-t border-clay/5 hover:bg-clay/[0.02] transition-colors">
                    <td className="p-4 text-sm">
                      <Link
                        href={`/stores/${store.slug}`}
                        className="font-medium text-clay underline underline-offset-4 hover:text-terracotta transition-colors"
                      >
                        {store.name}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-clay/70">{user?.name}</td>
                    <td className="p-4 text-sm text-clay/70">{user?.email}</td>
                    <td className="p-4 text-sm text-clay">
                      {new Date(store.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <StoreStatusToggle
                        storeId={store.id}
                        storeName={store.name}
                        active={store.active}
                      />
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
