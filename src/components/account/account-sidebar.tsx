import Link from "next/link";
import { User, Package, Heart, Store, Settings, LogOut } from "lucide-react";
import { signOutAction } from "@/app/account/actions";

export const ACCOUNT_NAV = [
  { label: "Personal Information", href: "/account", icon: User },
  { label: "My Orders", href: "/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Following", href: "/account/following", icon: Store },
  { label: "Password Manager", href: "/account/settings", icon: Settings },
];

export function AccountSidebar({ active }: { active: string }) {
  return (
    <aside data-section="account-nav" className="section-account-nav w-full lg:w-72 shrink-0">
      <nav className="flex lg:flex-col gap-2 p-1 -mx-1 lg:mx-0 overflow-x-auto lg:overflow-visible">
        {ACCOUNT_NAV.map(({ label, href, icon: Icon }) => {
          const isActive = href === active;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`group flex items-center gap-3 px-4 lg:px-5 py-3 rounded-xl transition-all whitespace-nowrap shrink-0 lg:shrink ${
                isActive
                  ? "bg-terracotta/10 text-clay border border-terracotta/30"
                  : "text-clay/50 hover:text-clay hover:bg-clay/[0.04] border border-transparent"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? "text-terracotta" : "text-clay/40 group-hover:text-terracotta"
                }`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className="text-xs lg:text-[13px] font-semibold">{label}</span>
              {isActive && <span className="ml-auto hidden lg:block w-1.5 h-1.5 rounded-full bg-terracotta" />}
            </Link>
          );
        })}

        <div className="hidden lg:block h-px bg-clay/10 mx-4 my-2" />

        <form action={signOutAction} className="shrink-0 lg:shrink">
          <button
            type="submit"
            className="flex items-center gap-3 px-4 lg:px-5 py-3 rounded-xl transition-all whitespace-nowrap text-red-500 hover:bg-red-50 w-full text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            <span className="text-xs lg:text-[13px] font-semibold">Sign Out</span>
          </button>
        </form>
      </nav>
    </aside>
  );
}