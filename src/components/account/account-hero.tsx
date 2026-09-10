import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function AccountHero({
  user,
  title = "My Account",
  crumb = title,
  subtitle = "Manage your personal information, orders, and curated preferences in one place.",
}: {
  user: { name?: string | null; email?: string | null; role?: string | null };
  title?: string;
  crumb?: string;
  subtitle?: string;
}) {
  return (
    <header data-section="account-hero" className="section-account-hero mb-10 lg:mb-14">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-clay/40 mb-6"
      >
        <Link href="/" className="inline-flex items-center gap-1.5 hover:text-terracotta transition-colors">
          <Home className="w-3.5 h-3.5" strokeWidth={2} />
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-clay/25" strokeWidth={2} />
        <span className="text-terracotta">{crumb}</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-heading text-[36px] sm:text-[44px] lg:text-[48px] font-semibold text-clay leading-[1.05] tracking-[-0.02em] mb-2">
            {title}
          </h1>
          <p className="text-[14px] text-clay/50 max-w-lg leading-relaxed">{subtitle}</p>
        </div>

        {/* Compact editorial identity */}
        <div className="shrink-0 text-left lg:text-right">
          <p className="text-[14px] font-semibold text-clay leading-tight">
            {user.name || "User"}
          </p>
          <p className="mt-1">
            <span className="inline-block px-2 py-0.5 rounded-md bg-terracotta/10 text-terracotta text-[10px] font-bold uppercase tracking-[0.12em]">
              {user.role === "vendor" ? "Seller" : "Buyer"}
            </span>
          </p>
          <p className="mt-1.5 text-[12px] text-clay/45">
            {user.email}
          </p>
        </div>
      </div>
    </header>
  );
}
