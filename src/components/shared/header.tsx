"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, ShoppingCart, User, Menu, LayoutDashboard } from "lucide-react";
import { LogoMark } from "@/components/shared/logo-mark";
import { MobileNavDrawer } from "@/components/shared/mobile-drawer-variations";
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
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const accountHref = session?.user ? "/account" : "/login";
  const [searchOpen, setSearchOpen] = useState(false);
  const [sellerOpen, setSellerOpen] = useState(false);

  const isHome = pathname === "/";

  return (
    <>
      <header data-section="site-header" className={`z-50 transition-all duration-500 ease-out ${
        isHome
          ? `fixed top-0 left-0 right-0 ${scrolled ? "bg-[#FAF7EF] backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "bg-transparent"}`
          : "sticky top-0 bg-sand/90 backdrop-blur-md border-b border-clay/5"
      }`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between gap-6 py-4 lg:py-5">
          {/* Left: brand */}
          <Link href="/" className="flex items-center gap-2.5 select-none shrink-0">
            <LogoMark className={`h-7 w-7 lg:h-8 lg:w-8 ${
              isHome
                ? scrolled ? "text-clay" : "text-white"
                : "text-foreground"
            }`} />
            <h1 className={`text-xl lg:text-2xl font-black tracking-tighter uppercase ${
              isHome
                ? scrolled ? "text-clay" : "text-white"
                : "text-foreground"
            }`}>VELLORA</h1>
          </Link>

          {/* Center: nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-base font-bold font-label tracking-[0.15em] uppercase transition-colors ${
                    active
                      ? "text-terracotta"
                      : isHome
                        ? scrolled ? "text-clay hover:text-terracotta" : "text-white/80 hover:text-white"
                        : "text-clay hover:text-terracotta"
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
          <div className="flex items-center gap-2 lg:gap-3">
            {session?.user?.role === "vendor" && (
              <button
                type="button"
                onClick={() => setSellerOpen(true)}
                aria-label="Open seller dashboard"
                className={`relative inline-flex items-center gap-2 h-11 px-4 sm:px-5 rounded-full border text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  isHome
                    ? scrolled ? "border-clay/15 text-clay hover:text-terracotta hover:border-terracotta/40 hover:bg-clay/5" : "border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/10"
                    : "border-clay/15 text-clay hover:text-terracotta hover:border-terracotta/40 hover:bg-clay/5"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline">Seller</span>
              </button>
            )}
            {session?.user && <NotificationBell user={session.user} scrolled={scrolled} />}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={`hidden lg:inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors cursor-pointer ${
                isHome
                  ? scrolled ? "text-clay hover:text-terracotta hover:bg-clay/5" : "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-clay hover:text-terracotta hover:bg-clay/5"
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href={accountHref}
              aria-label="Account"
              className={`hidden lg:inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors ${
                isHome
                  ? scrolled ? "text-clay hover:text-terracotta hover:bg-clay/5" : "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-clay hover:text-terracotta hover:bg-clay/5"
              }`}
            >
              <User className="w-5 h-5" />
            </Link>
            {session?.user?.role !== "vendor" && (
              <Link
                href="/cart"
                aria-label="Cart"
                className={`relative inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors ${
                  isHome
                    ? scrolled ? "text-clay hover:text-terracotta hover:bg-clay/5" : "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-clay hover:text-terracotta hover:bg-clay/5"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[20px] h-[20px] px-1 bg-terracotta text-white text-[10px] font-bold flex items-center justify-center rounded-full">
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
                  className={`lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors cursor-pointer ${
                    isHome
                      ? scrolled ? "text-clay hover:text-terracotta hover:bg-clay/5" : "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-clay hover:text-terracotta hover:bg-clay/5"
                  }`}
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-6 h-6" />
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
