"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";
import {
  User,
  ClipboardList,
  ShoppingBag,
  Store,
  ChevronRight,
  X,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavDrawerSection, NavDrawerUser } from "./mobile-nav-drawer";
import { DEFAULT_DRAWER_SECTIONS } from "./mobile-nav-drawer";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

interface MobileNavDrawerProps {
  sections?: NavDrawerSection[];
  user?: NavDrawerUser | null;
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MobileNavDrawer({
  sections = DEFAULT_DRAWER_SECTIONS,
  user,
  trigger,
  defaultOpen,
  open,
  onOpenChange,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const rootProps = {
    ...(open !== undefined && onOpenChange
      ? { open, onOpenChange }
      : defaultOpen !== undefined
        ? { defaultOpen }
        : {}),
  };

  const isSignedIn = Boolean(user?.name || user?.email);
  const displayName = user?.name || "Sign In";
  const displayEmail = user?.email || "Sign in to access your account";

  const effectiveSections = sections ?? DEFAULT_DRAWER_SECTIONS;
  const vendorSections =
    user?.role === "vendor"
      ? [
          {
            label: "Seller",
            items: [
              { label: "Seller Dashboard", href: "/vendor", icon: Store },
              { label: "My Products", href: "/vendor/products", icon: ShoppingBag },
              { label: "Seller Orders", href: "/vendor/orders", icon: ClipboardList },
            ],
          },
        ]
      : [];
  const allSections = [...vendorSections, ...effectiveSections];

  return (
    <DrawerPrimitive.Root {...rootProps}>
      {trigger && (
        <DrawerPrimitive.Trigger render={trigger as React.ReactElement} />
      )}
      <DrawerPrimitive.Portal>
        {/* Backdrop */}
        <DrawerPrimitive.Backdrop className="fixed inset-0 z-50 bg-[#1A1410]/50 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />

        {/* Drawer panel */}
        <DrawerPrimitive.Popup className="fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-[340px] bg-[#FAF7EF] shadow-[4px_0_24px_rgba(0,0,0,0.08)] outline-none transition-transform duration-300 ease-out data-starting-style:-translate-x-full data-ending-style:-translate-x-full">

          {/* Close button — top right */}
          <DrawerPrimitive.Close
            render={
              <button
                type="button"
                aria-label="Close navigation"
                className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center text-clay hover:text-clay transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            }
          />

          {/* Main content */}
          <div className="flex flex-col flex-1 min-w-0 h-full">

            {/* Profile header */}
            <div className="shrink-0 px-7 pt-10 pb-6">
              <DrawerPrimitive.Title className="sr-only">Navigation menu</DrawerPrimitive.Title>
              <Link href={isSignedIn ? "/account" : "/login"} className="flex items-center gap-3.5 group">
                {user?.image ? (
                  <img src={user.image} alt={displayName} className="w-[50px] h-[50px] rounded-full object-cover shrink-0" width="50" height="50" loading="lazy" />
                ) : (
                  <span className="w-[50px] h-[50px] rounded-full bg-clay/8 border border-clay/10 flex items-center justify-center text-[18px] font-semibold text-clay shrink-0">
                    {isSignedIn ? displayName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold text-clay leading-tight truncate">{displayName}</p>
                  <p className="text-[12px] sm:text-[13px] text-clay/45 truncate mt-0.5">{displayEmail}</p>
                </div>
              </Link>
            </div>

            {/* Divider */}
            <div className="mx-7 h-px bg-clay/10" />

            {/* Scrollable navigation */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <nav className="py-2" aria-label="Mobile navigation">
                {allSections.map((section, i) => (
                  <div key={section.label}>
                    {i > 0 && <div className="mx-7 h-px bg-clay/8" />}

                    {/* Section label */}
                    <p className="px-7 pt-6 pb-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-clay/35 font-label">
                      {section.label}
                    </p>

                    {/* Navigation rows */}
                    {section.items.map(({ label, href, icon: Icon }) => {
                      const active = isActive(pathname, href);
                      return (
                        <DrawerPrimitive.Close
                          key={label}
                          nativeButton={false}
                          render={
                            <Link
                              href={href}
                              className={cn(
                                "flex items-center gap-3.5 min-h-[48px] mx-3 px-4 py-2.5 rounded-[10px] transition-all cursor-pointer",
                                active
                                  ? "bg-terracotta/10 text-terracotta"
                                  : "text-clay hover:bg-clay/5"
                              )}
                            >
                              <Icon
                                className={cn("w-[18px] h-[18px] shrink-0", active ? "text-terracotta" : "text-clay/40")}
                                strokeWidth={1.75}
                              />
                              <span className={cn("text-[15px] truncate", active ? "font-semibold" : "font-medium")}>
                                {label}
                              </span>
                              <ChevronRight
                                className={cn(
                                  "ml-auto w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5",
                                  active ? "text-terracotta/50" : "text-clay/15"
                                )}
                              />
                            </Link>
                          }
                        />
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            {/* Bottom CTA — sticky */}
            <div className="shrink-0 border-t border-clay/10 px-7 py-5">
              <Link
                href="/products"
                className="group flex items-center justify-between gap-2 h-[48px] rounded-[12px] bg-terracotta px-5 text-white text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.10em] font-label hover:bg-terracotta-deep transition-all"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
