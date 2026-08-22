"use client";

import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { LayoutDashboard, ReceiptText, Store, Tags, DollarSign, Users, Home, Ticket, Mail, MessageSquare } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
  { href: "/admin/vendors", label: "Vendors", icon: Store },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/commission", label: "Commission", icon: DollarSign },
  { href: "/admin/payouts", label: "Payouts", icon: Users },
  { href: "/admin/promos", label: "Promos", icon: Ticket },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/messages", label: "Contact", icon: MessageSquare },
];

export function AdminSidebar() {
  return (
    <DashboardSidebar
      label="Admin"
      title="Control Panel"
      basePath="/admin"
      links={links}
      footerLink={{ href: "/", label: "View storefront", icon: Home }}
    />
  );
}
