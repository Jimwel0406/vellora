"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  Settings,
  Store,
  X,
} from "lucide-react";

const links = [
  { href: "/vendor", label: "Overview", icon: LayoutDashboard },
  { href: "/vendor/products", label: "Products", icon: Package },
  { href: "/vendor/orders", label: "Orders", icon: ShoppingBag },
  { href: "/vendor/payouts", label: "Payouts", icon: Wallet },
  { href: "/vendor/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === "/vendor") return false;
  return pathname.startsWith(href + "/");
}

export function SellerDashboardOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [storeSlug, setStoreSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/stores")
      .then((r) => r.json())
      .then((data) => {
        if (data?.slug) setStoreSlug(data.slug);
      })
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close seller dashboard"
        onClick={onClose}
        className={`absolute inset-0 bg-clay/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Seller Dashboard"
        className={`absolute inset-y-0 right-0 flex w-[300px] max-w-[85%] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-clay/10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-clay/40">
              Vendor
            </p>
            <h2 className="text-lg font-bold text-[#1A1A1A]">Seller Dashboard</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-clay/60 transition-colors hover:bg-clay/5 hover:text-clay"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Seller">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "text-terracotta bg-terracotta/[0.07]"
                    : "text-clay/60 hover:text-clay hover:bg-clay/[0.04]"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-terracotta" />
                )}
                <Icon className="w-[18px] h-[18px]" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-6 pt-4 border-t border-clay/10">
          <Link
            href={storeSlug ? `/stores/${storeSlug}` : "/stores"}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-clay/50 hover:text-clay hover:bg-clay/[0.04] transition-colors"
          >
            <Store className="w-[18px] h-[18px]" />
            View storefront
          </Link>
        </div>
      </aside>
    </div>
  );
}