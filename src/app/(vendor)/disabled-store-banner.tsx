import { db } from "@/db";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function DisabledStoreBanner() {
  const session = await auth();
  if (!session?.user || session.user.role !== "vendor") return null;

  const store = await db
    .select({ id: stores.id, name: stores.name, active: stores.active })
    .from(stores)
    .where(eq(stores.userId, parseInt(session.user.id)))
    .then((r) => r[0]);

  if (!store || store.active) return null;

  return (
    <div
      role="status"
      data-section="vendor-disabled-banner"
      className="section-vendor-disabled-banner mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:px-5 flex items-start gap-3"
    >
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-white"
        aria-hidden
      >
        !
      </span>
      <div className="text-sm">
        <p className="font-semibold text-red-800">
          Your store &ldquo;{store.name}&rdquo; is disabled
        </p>
        <p className="text-red-700/80 text-[13px] leading-relaxed mt-0.5">
          Your storefront and products are hidden from shoppers while disabled.
          Contact the Vellora team to have it re-enabled.
        </p>
      </div>
    </div>
  );
}