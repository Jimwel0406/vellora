"use client";

import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { LayoutDashboard, Package, ShoppingBag, Wallet, Settings, Store } from "lucide-react";

const links = [
  { href: "/vendor", label: "Overview", icon: LayoutDashboard },
  { href: "/vendor/products", label: "Products", icon: Package },
  { href: "/vendor/orders", label: "Orders", icon: ShoppingBag },
  { href: "/vendor/payouts", label: "Payouts", icon: Wallet },
  { href: "/vendor/settings", label: "Settings", icon: Settings },
];

export function VendorSidebar() {
  const [storeSlug, setStoreSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then((data) => {
        if (data?.slug) setStoreSlug(data.slug);
      })
      .catch(() => {});
  }, []);

  return (
    <DashboardSidebar
      label="Vendor"
      title="Seller Studio"
      basePath="/vendor"
      links={links}
      footerLink={{
        href: storeSlug ? `/stores/${storeSlug}` : "/stores",
        label: "View storefront",
        icon: Store,
      }}
    />
  );
}
