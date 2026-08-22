"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";
import {
  Home,
  User,
  ClipboardList,
  ShoppingBag,
  Store,
  Info,
  Star,
  MessageCircle,
  ChevronDown,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavDrawerItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavDrawerSection {
  label: string;
  items: NavDrawerItem[];
}

export interface NavDrawerUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export const DEFAULT_DRAWER_SECTIONS: NavDrawerSection[] = [
  {
    label: "Navigation",
    items: [
      { label: "Home", href: "/", icon: Home },
      { label: "Shop", href: "/products", icon: ShoppingBag },
      { label: "Stores", href: "/stores", icon: Store },
      { label: "About", href: "/about", icon: Info },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "My Account", href: "/account", icon: User },
      { label: "My Orders", href: "/orders", icon: ClipboardList },
      { label: "My Favorites", href: "/account/wishlist", icon: Star },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "Contact Us", href: "/contact", icon: MessageCircle },
    ],
  },
];

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

  const effectiveSections: NavDrawerSection[] = sections ?? DEFAULT_DRAWER_SECTIONS;
  const vendorSections: NavDrawerSection[] =
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
        <DrawerPrimitive.Trigger
          render={trigger as React.ReactElement}
        />
      )}
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Backdrop
          data-slot="drawer-overlay"
          className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0"
        />

        <DrawerPrimitive.Popup
        data-slot="mobile-nav-drawer"
        className="fixed inset-y-0 left-0 z-50 flex flex-col w-[85vw] max-w-[420px] bg-white shadow-2xl outline-none transition-transform duration-300 ease-out data-starting-style:-translate-x-full data-ending-style:-translate-x-full"
        data-side="left"
      >
        {/* Close button */}
        <DrawerPrimitive.Close
          render={
            <button
              type="button"
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          }
        />

        {/* Profile header */}
        <div
          data-section="drawer-profile"
          className="section-drawer-profile relative shrink-0 h-[184px] overflow-hidden bg-gradient-to-br from-[#2A1D16] via-[#4A3524] to-[#7A5C3C]"
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -right-10 -top-14 w-52 h-52 rounded-full bg-terracotta/50 blur-3xl" />
            <div className="absolute -left-8 bottom-0 w-44 h-44 rounded-full bg-ochre/40 blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="relative z-10 flex flex-col justify-end h-full p-6">
            <DrawerPrimitive.Title className="sr-only">
              Navigation menu
            </DrawerPrimitive.Title>

            {/* Avatar */}
            <Link
              href={isSignedIn ? "/account" : "/login"}
              className="flex items-center gap-3.5 group"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={displayName}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white/70 shrink-0"
                />
              ) : (
                <span className="w-14 h-14 rounded-full bg-white/15 ring-2 ring-white/70 flex items-center justify-center text-xl font-bold text-white shrink-0">
                  {isSignedIn ? displayName.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                </span>
              )}

              {/* Name / email */}
              <div className="min-w-0 flex-1 text-white">
                <p className="text-[19px] font-semibold leading-tight truncate">
                  {displayName}
                </p>
                <p className="text-[14px] text-ochre/90 truncate">
                  {displayEmail}
                </p>
              </div>

              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white/70 group-hover:text-white group-hover:bg-white/10 transition-colors">
                <ChevronDown className="w-5 h-5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Scrollable nav content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-2" aria-label="Mobile navigation">
            {allSections.map((section, i) => (
              <div key={section.label}>
                {i > 0 && <div className="h-px bg-gray-100 mx-6" />}

                <p className="px-6 pt-6 pb-2 text-[13px] font-medium uppercase tracking-[0.12em] text-gray-400">
                  {section.label}
                </p>

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
                            "flex items-center gap-4 min-h-[48px] px-6 py-2.5 transition-colors cursor-pointer",
                            active
                              ? "bg-clay/5 text-clay"
                              : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                          )}
                        >
                          <span
                            className={cn(
                              "flex items-center justify-center w-6 h-6 shrink-0",
                              active ? "text-terracotta" : "text-gray-500"
                            )}
                          >
                            <Icon className="w-[22px] h-[22px]" strokeWidth={1.75} />
                          </span>
                          <span className="text-[15px] font-medium truncate">
                            {label}
                          </span>
                        </Link>
                      }
                    />
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="h-8" />
        </div>
      </DrawerPrimitive.Popup>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}