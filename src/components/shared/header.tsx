"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, ShoppingCart, User, Menu, LayoutDashboard } from "lucide-react";
import { LogoMark } from "@/components/shared/logo-mark";
import { MobileNavDrawer } from "@/components/shared/mobile-nav-drawer";
import { SearchDialog } from "@/components/shared/search-dialog";
import { SellerDashboardOverlay } from "@/components/shared/seller-dashboard-overlay";
import { NotificationBell } from "@/components/shared/notification-bell";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Stores", href: "/stores" },
  { label: "About", href: "/about" },
];

function isActive(pathname: string | null, href: string) {
  if (href === "/") return pathname === "/";
  return pathname?.startsWith(href);
}

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/cart?_=" + Date.now());
        if (!res.ok) return;
        const data = await res.json();
        const count = data.items?.reduce((s: number, i: { cart_items: { quantity: number } }) => s + i.cart_items.quantity, 0) ?? 0;
        setCartCount(count);
      } catch { /* ignore */ }
    }
    fetchCount();
    const handler = () => fetchCount();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  const accountHref = session?.user ? "/account" : "/login";
  const [searchOpen, setSearchOpen] = useState(false);
  const [sellerOpen, setSellerOpen] = useState(false);

  return (
    <>
      <header data-section="site-header" className="section-site-header md:sticky md:top-0 z-50 bg-sand/90 backdrop-blur-md border-b border-clay/5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between gap-6 py-4 lg:py-5">
          {/* Left: brand */}
          <Link href="/" className="flex items-center gap-2.5 select-none shrink-0">
            <LogoMark className="h-7 w-7 lg:h-8 lg:w-8 text-foreground" />
            <h1 className="text-xl lg:text-2xl font-black tracking-tighter uppercase text-foreground">VELLORA</h1>
          </Link>

          {/* Center: nav */}
          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-sm font-bold font-label tracking-[0.2em] uppercase transition-colors ${
                    active ? "text-terracotta" : "text-clay/70 hover:text-terracotta"
                  }`}
                >
                  {label}
                  <span
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-terracotta transition-all duration-200 ${
                      active ? "w-4" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            {session?.user?.role === "vendor" && (
              <button
                type="button"
                onClick={() => setSellerOpen(true)}
                aria-label="Open seller dashboard"
                className="relative inline-flex items-center gap-2 h-10 px-3 sm:px-4 rounded-full border border-clay/15 text-[11px] font-bold uppercase tracking-[0.12em] text-clay/70 hover:text-terracotta hover:border-terracotta/40 hover:bg-clay/5 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Seller</span>
              </button>
            )}
            {session?.user && <NotificationBell user={session.user} />}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-full text-clay/70 hover:text-terracotta hover:bg-clay/5 transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href={accountHref}
              aria-label="Account"
              className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-full text-clay/70 hover:text-terracotta hover:bg-clay/5 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
                        {session?.user?.role !== "vendor" && (
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-clay/70 hover:text-terracotta hover:bg-clay/5 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-terracotta text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile menu */}
            <MobileNavDrawer
              user={session?.user}
              trigger={
                <button
                  className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-clay/70 hover:text-terracotta hover:bg-clay/5 transition-colors cursor-pointer"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              }
            />
          </div>
        </div>
      </div>
      <SearchDialog key={searchOpen ? "open" : "closed"} open={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>
      <SellerDashboardOverlay open={sellerOpen} onClose={() => setSellerOpen(false)} />
    </>
  );
}
