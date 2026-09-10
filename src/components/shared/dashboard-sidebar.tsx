"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type DashboardNavItem = { href: string; label: string; icon: LucideIcon };

function useIsActive(basePath: string) {
  const pathname = usePathname();
  return (href: string) => {
    if (href === basePath) return pathname === basePath;
    return pathname === href || pathname.startsWith(href + "/");
  };
}

export function DashboardSidebar({
  label,
  title,
  basePath,
  links,
  footerLink,
}: {
  label: string;
  title: string;
  basePath: string;
  links: DashboardNavItem[];
  footerLink?: { href: string; label: string; icon: LucideIcon };
}) {
  const isActive = useIsActive(basePath);

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden md:flex w-60 flex-col border-r border-clay/10 bg-white/70">
        <div className="px-5 pt-6 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-clay/40">{label}</p>
          <p className="text-sm font-bold text-clay mt-0.5">{title}</p>
        </div>
        <nav className="px-3 space-y-0.5" aria-label={label}>
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
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
                <Icon className="w-[18px] h-[18px]" aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>
        {footerLink && (
          <div className="px-3 pt-3 pb-5">
            <div className="h-px bg-clay/10 mb-2" aria-hidden />
            <Link
              href={footerLink.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-clay hover:text-clay hover:bg-clay/[0.04] transition-colors"
            >
              <footerLink.icon className="w-[18px] h-[18px]" aria-hidden />
              {footerLink.label}
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-clay/10 z-50 flex"
        aria-label={label}
      >
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[9px] font-bold uppercase tracking-wider transition-colors",
                active ? "text-terracotta" : "text-clay hover:text-clay"
              )}
            >
              <Icon className="w-4 h-4" aria-hidden />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
