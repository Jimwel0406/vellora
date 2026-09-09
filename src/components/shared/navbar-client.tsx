"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShoppingCart, Menu, Search, XIcon, ArrowRight } from "lucide-react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { BrandLogo } from "./brand-logo";

function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    interface CartItemShape {
      quantity?: number;
      cart_items?: { quantity: number } | null;
    }

    function fetchCount() {
      fetch("/api/cart?_=" + Date.now())
        .then((r) => r.json())
        .then((data) => {
          if (data.items) {
            setCount(
              (data.items as CartItemShape[]).reduce(
                (sum, item) => sum + (item.cart_items?.quantity ?? item.quantity ?? 1),
                0
              )
            );
          }
        })
        .catch(() => {});
    }

    fetchCount();
    window.addEventListener("cart-updated", fetchCount);
    return () => window.removeEventListener("cart-updated", fetchCount);
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function NavbarClient({
  session,
}: {
  session: { user?: { id: string; name?: string | null; role?: string } } | null;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAuthPage = pathname?.startsWith("/auth");
  const isVendor = session?.user?.role === "vendor";
  const isAdmin = session?.user?.role === "admin";

  return (
    <header
      data-section="navbar"
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out ${
        scrolled
          ? "bg-[#FAF7EF]/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center select-none" draggable={false}>
          <BrandLogo className="h-7 w-auto text-foreground" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Browse</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">Products</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/stores">Stores</Link>
          </Button>
          {isVendor && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/vendor">Dashboard</Link>
            </Button>
          )}
          {isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          )}
        </nav>

        <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-9 pl-9 pr-4 rounded-lg border bg-muted/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          {!isAuthPage && (
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <CartBadge />
            </Link>
          )}

          <div className="hidden md:flex items-center gap-2">
            {session?.user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/orders">Orders</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" className="shadow-sm" asChild>
                  <Link href="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors cursor-pointer">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0" showCloseButton={false}>
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>

              {/* Header row: logo + close */}
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <Link href="/" className="flex items-center select-none" draggable={false}>
                  <BrandLogo className="h-7 w-auto text-foreground" />
                </Link>
                <SheetPrimitive.Close
                  render={
                    <Button variant="ghost" size="icon" className="rounded-full" />
                  }
                >
                  <XIcon className="w-5 h-5" />
                  <span className="sr-only">Close</span>
                </SheetPrimitive.Close>
              </div>

              {/* Search bar */}
              <div className="px-4 pt-4">
                <form onSubmit={handleSearch}>
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full h-10 pl-9 pr-4 rounded-lg border bg-muted/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                </form>
              </div>

              {/* Menu items */}
              <nav className="flex-1 px-4 pt-4 space-y-1">
                <MobileLink href="/">Browse</MobileLink>
                <MobileLink href="/products">Products</MobileLink>
                <MobileLink href="/stores">Stores</MobileLink>
                {isVendor && (
                  <MobileLink href="/vendor">Dashboard</MobileLink>
                )}
                {isAdmin && (
                  <MobileLink href="/admin">Admin</MobileLink>
                )}
              </nav>

              {/* Auth section */}
              <div className="mx-4 mb-2">
                {session?.user ? (
                  <div className="rounded-xl bg-muted/40 p-2.5 space-y-0.5">
                    <MobileLink href="/orders">My Orders</MobileLink>
                    <MobileLink href="/cart">Cart</MobileLink>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-left text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-muted/40 p-2.5 space-y-1.5">
                    <Button variant="ghost" className="w-full justify-center rounded-lg text-sm font-medium h-11 active:scale-[0.97] transition-all" asChild>
                      <Link href="/login">Sign in</Link>
                    </Button>
                    <Button className="w-full rounded-lg text-sm font-medium h-11 shadow-sm active:scale-[0.97] transition-all group" asChild>
                      <Link href="/register" className="flex items-center justify-center gap-2">
                        Get started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Social + Copyright */}
              <div className="border-t px-4 py-3">
                <div className="flex items-center gap-2.5 mb-3">
                  <SocialIcon href="#" label="Twitter">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </SocialIcon>
                  <SocialIcon href="#" label="GitHub">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.3 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                  </SocialIcon>
                  <SocialIcon href="#" label="LinkedIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </SocialIcon>
                </div>
                <p className="text-xs text-muted-foreground">&copy; 2026 Vellora</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-3 py-4 rounded-lg text-sm font-medium hover:bg-muted active:scale-[0.97] transition-all"
    >
      {children}
    </Link>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const brandHover: Record<string, string> = {
    Twitter: "hover:bg-black hover:text-white",
    GitHub: "hover:bg-gray-900 hover:text-white",
    LinkedIn: "hover:bg-[#0A66C2] hover:text-white",
  };

  return (
    <a
      href={href}
      aria-label={label}
      className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground transition-all duration-200 ${brandHover[label] || "hover:bg-primary/10 hover:text-primary"}`}
    >
      {children}
    </a>
  );
}
