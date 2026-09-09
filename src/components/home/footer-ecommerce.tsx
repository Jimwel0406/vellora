import Link from "next/link";
import { LogoMark } from "@/components/shared/logo-mark";
import { ScrollToTop } from "@/components/home/scroll-to-top";

const QUICK_LINKS = [
  { label: "My Account", href: "/account" },
  { label: "Order Tracking", href: "/orders" },
  { label: "Shop", href: "/products" },
  { label: "New Arrivals", href: "/products" },
  { label: "Best Sellers", href: "/products" },
];

const CUSTOMER_CARE = [
  { label: "support@vellora.com", href: "mailto:support@vellora.com" },
  { label: "(888) 123-4567", href: "tel:+18881234567" },
  { label: "Shipping & Returns", href: "/terms" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact Us", href: "/contact" },
];

export function FooterEcommerce() {
  return (
    <footer data-section="home-footer" className="section-home-footer bg-[#FAF7EF] border-t border-clay/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-14 lg:pt-20 pb-16 lg:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1.25fr_1.5fr] gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <LogoMark className="w-7 h-7 text-clay" />
              <span className="text-xl font-black tracking-tighter uppercase text-clay">
                Vellora
              </span>
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta mt-3">
              Shop more, live better
            </p>
            <p className="text-base text-clay leading-relaxed mt-4 max-w-xs">
              Your one-stop destination for quality products, great value, and everyday essentials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-clay">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-base text-clay hover:text-terracotta transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-clay">
              Customer Care
            </h4>
            <ul className="mt-5 space-y-3">
              {CUSTOMER_CARE.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-base text-clay hover:text-terracotta transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-clay">
              Download Our App
            </h4>
            <p className="text-base text-clay leading-relaxed mt-5">
              Shop on the go with our mobile app.
            </p>
            <div className="mt-5 space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl border border-clay/20 px-4 py-3 hover:border-terracotta/50 hover:bg-white transition-colors"
              >
                <svg className="w-6 h-6 text-clay" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span>
                  <span className="block text-[10px] uppercase tracking-widest text-clay">
                    Download on the
                  </span>
                  <span className="block text-base font-bold text-clay">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl border border-clay/20 px-4 py-3 hover:border-terracotta/50 hover:bg-white transition-colors"
              >
                <svg className="w-6 h-6 text-clay" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.61 1.81 13.79 12 3.61 22.19a1.96 1.96 0 0 1-.53-1.39V3.2a1.96 1.96 0 0 1 .53-1.39zM14.91 13.12 17.5 15.7 5.27 21.77l9.64-8.65zm2.72-2.72L19.89 8.3c.93.53.93 1.71 0 2.24l-2.26 1.29-2.68-2.71 2.68-2.72zM5.27 2.23l12.23 6.07-2.59 2.58-9.64-8.65z" />
                </svg>
                <span>
                  <span className="block text-[10px] uppercase tracking-widest text-clay">
                    Get it on
                  </span>
                  <span className="block text-base font-bold text-clay">Google Play</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-clay/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-clay">
          <p>&copy; {new Date().getFullYear()} Vellora. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-terracotta transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-terracotta transition-colors">
              Terms
            </Link>
            <ScrollToTop className="hover:text-terracotta" />
          </div>
        </div>
      </div>
    </footer>
  );
}