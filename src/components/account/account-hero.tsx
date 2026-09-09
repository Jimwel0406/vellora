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
  const firstLetter = user.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header data-section="account-hero" className="section-account-hero mb-8 lg:mb-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-clay/40 mb-5"
      >
        <Link href="/" className="inline-flex items-center gap-1.5 hover:text-terracotta transition-colors">
          <Home className="w-3.5 h-3.5" strokeWidth={2} />
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-clay/25" strokeWidth={2} />
        <span className="text-terracotta">{crumb}</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-terracotta leading-tight mb-3">
            {title}
          </h1>
          <p className="text-sm text-clay/60 max-w-lg leading-relaxed">{subtitle}</p>
        </div>
        <div className="shrink-0">
          <div className="flex items-center gap-3 bg-white rounded-full border border-clay/10 p-1.5 sm:p-2 pr-4 sm:pr-5 shadow-sm max-w-full">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white bg-clay/10 flex items-center justify-center text-base sm:text-xl font-bold text-clay/60 shrink-0">
              {firstLetter}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-bold text-sm text-clay leading-tight truncate max-w-[120px] sm:max-w-none">{user.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta text-[10px] font-bold uppercase tracking-widest shrink-0">
                  {user.role === "vendor" ? "Seller" : "Buyer"}
                </span>
              </div>
              <span className="text-[11px] text-clay/50 block truncate max-w-[160px] sm:max-w-none">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}