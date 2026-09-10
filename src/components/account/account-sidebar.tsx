import Link from "next/link";
import { signOutAction } from "@/app/account/actions";

export const ACCOUNT_NAV = [
  { label: "Personal Information", href: "/account" },
  { label: "My Orders", href: "/orders", countKey: "orders" as const },
  { label: "Wishlist", href: "/account/wishlist", countKey: "wishlist" as const },
  { label: "Following", href: "/account/following" },
  { label: "Password Manager", href: "/account/settings" },
];

export function AccountSidebar({
  active,
  orderCount,
  wishlistCount,
}: {
  active: string;
  orderCount?: number;
  wishlistCount?: number;
}) {
  const counts: Record<string, number> = {
    orders: orderCount ?? 0,
    wishlist: wishlistCount ?? 0,
  };

  return (
    <aside data-section="account-nav" className="section-account-nav w-full lg:w-60 shrink-0">
      <nav className="flex lg:flex-col gap-0.5 lg:gap-0 overflow-x-auto lg:overflow-visible -mx-1 px-1 lg:mx-0 lg:px-0">
        {ACCOUNT_NAV.map(({ label, href, countKey }) => {
          const isActive = href === active;
          const count = countKey !== undefined ? counts[countKey] : undefined;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex items-center gap-2 px-3 lg:px-4 py-2.5 lg:py-3 transition-all whitespace-nowrap shrink-0 lg:shrink rounded-none lg:rounded ${
                isActive
                  ? "text-clay font-bold"
                  : "text-clay/45 hover:text-clay"
              }`}
            >
              {/* Active indicator — terracotta left border on desktop */}
              {isActive && (
                <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-terracotta rounded-full" />
              )}
              <span className="text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.15em] font-label">
                {label}
              </span>
              {count !== undefined && (
                <span className="text-[10px] text-clay/30 font-label">
                  · {String(count).padStart(2, "0")}
                </span>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="hidden lg:block h-px bg-clay/10 my-3 mx-4" />

        <form action={signOutAction} className="shrink-0 lg:shrink">
          <button
            type="submit"
            className="flex items-center gap-2 px-3 lg:px-4 py-2.5 lg:py-3 rounded transition-all whitespace-nowrap text-red-600/60 hover:text-red-600 w-full text-left cursor-pointer"
          >
            <span className="text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.15em] font-label">
              Sign Out
            </span>
          </button>
        </form>
      </nav>
    </aside>
  );
}
