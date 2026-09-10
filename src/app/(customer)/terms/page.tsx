import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Vellora",
  description: "Vellora terms of service",
};

const sections = [
  { id: "intro", num: "00", label: "Introduction" },
  { id: "account", num: "01", label: "Account Responsibilities" },
  { id: "orders", num: "02", label: "Orders & Payments" },
  { id: "contact", num: "03", label: "Contact" },
];

export default function TermsPage() {
  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── Left: Contents navigation rail ── */}
          <aside className="hidden lg:block lg:w-[200px] xl:w-[220px] shrink-0">
            <div className="sticky top-32">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] font-label text-terracotta">
                Contents
              </span>
              <nav className="mt-6 flex flex-col gap-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-baseline gap-3 py-2 text-[12px] text-clay/40 hover:text-terracotta transition-colors group"
                  >
                    <span className="text-[10px] font-bold tracking-[0.1em] font-label text-clay/25 group-hover:text-terracotta/60 transition-colors">
                      {s.num}
                    </span>
                    <span className="tracking-wide">{s.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Main content column ── */}
          <main className="flex-1 max-w-[680px] lg:max-w-[720px] xl:max-w-[760px]">

            {/* Hero / page introduction */}
            <div id="intro" className="scroll-mt-32 mb-16 lg:mb-20">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] font-label text-terracotta">
                  Legal
                </span>
                <span className="text-[10px] font-bold tracking-[0.1em] font-label text-clay/40">
                  / 01
                </span>
              </div>
              <h1 className="text-[48px] sm:text-[56px] lg:text-[68px] font-heading font-semibold uppercase tracking-[-0.02em] text-clay leading-[0.95] mb-8 lg:mb-10">
                Terms of Service
              </h1>
              <p className="text-[15px] sm:text-[16px] text-clay/75 leading-[1.7] max-w-[520px]">
                By using Vellora, you agree to the following terms and conditions. Please read them carefully before using our marketplace.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span className="w-10 h-[2px] bg-terracotta rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-label text-clay/35">
                  Updated Jul 2025
                </span>
              </div>
            </div>

            {/* Mobile contents nav */}
            <div className="lg:hidden mb-12 -mx-1 overflow-x-auto">
              <div className="flex items-center gap-5 px-1 pb-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] font-label text-terracotta shrink-0">
                  Contents
                </span>
                {sections.slice(1).map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-[11px] text-clay/40 hover:text-terracotta transition-colors whitespace-nowrap"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <div className="h-px bg-clay/8 mt-2" />
            </div>

            {/* 01 — Account Responsibilities */}
            <section id="account" data-section="terms-account" className="scroll-mt-32 mb-18 lg:mb-24">
              <div className="flex items-baseline gap-4 mb-6 lg:mb-8">
                <span className="text-[28px] sm:text-[32px] lg:text-[36px] font-heading font-bold text-clay/35 leading-none">
                  01
                </span>
                <h2 className="text-[22px] sm:text-[24px] lg:text-[28px] font-heading font-semibold text-clay tracking-[-0.01em]">
                  Account Responsibilities
                </h2>
              </div>
              <div className="space-y-5">
                <p className="text-[15px] sm:text-[16px] text-clay/75 leading-[1.7]">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration.
                </p>
                <p className="text-[15px] sm:text-[16px] text-clay/75 leading-[1.7]">
                  Vellora reserves the right to suspend or terminate accounts that provide false information or engage in suspicious activity. Your profile is the gateway to a personalized marketplace experience; keep it secure.
                </p>
              </div>
            </section>

            {/* 02 — Orders & Payments */}
            <section id="orders" data-section="terms-orders" className="scroll-mt-32 mb-18 lg:mb-24">
              <div className="flex items-baseline gap-4 mb-6 lg:mb-8">
                <span className="text-[28px] sm:text-[32px] lg:text-[36px] font-heading font-bold text-clay/35 leading-none">
                  02
                </span>
                <h2 className="text-[22px] sm:text-[24px] lg:text-[28px] font-heading font-semibold text-clay tracking-[-0.01em]">
                  Orders & Payments
                </h2>
              </div>
              <div className="space-y-5">
                <p className="text-[15px] sm:text-[16px] text-clay/75 leading-[1.7]">
                  All prices are listed in USD and are subject to change. Orders are processed once payment is confirmed through our secure unified checkout system. We reserve the right to cancel any order if necessary due to vendor stock levels or technical errors.
                </p>

                {/* Smart Cart Routing — editorial callout */}
                <div className="my-8 lg:my-10 pl-5 border-l-[2px] border-terracotta/40">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] font-label text-terracotta">
                    Smart Cart Routing
                  </span>
                  <p className="mt-2.5 text-[13px] sm:text-[14px] text-clay/65 leading-[1.7]">
                    When you purchase from multiple vendors, our system automatically routes payments and shipping instructions. This ensures a one-checkout experience while maintaining the uniqueness of each vendor&apos;s fulfillment process.
                  </p>
                </div>

                <p className="text-[15px] sm:text-[16px] text-clay/75 leading-[1.7]">
                  Refunds and returns are subject to individual vendor policies, though Vellora provides a baseline of protection for every transaction made on the platform.
                </p>
              </div>
            </section>

            {/* 03 — Contact */}
            <section id="contact" data-section="terms-contact" className="scroll-mt-32">
              <div className="flex items-baseline gap-4 mb-6 lg:mb-8">
                <span className="text-[28px] sm:text-[32px] lg:text-[36px] font-heading font-bold text-clay/35 leading-none">
                  03
                </span>
                <h2 className="text-[22px] sm:text-[24px] lg:text-[28px] font-heading font-semibold text-clay tracking-[-0.01em]">
                  Contact
                </h2>
              </div>
              <p className="text-[15px] sm:text-[16px] text-clay/75 leading-[1.7] mb-8 lg:mb-10">
                For questions about these terms or legal inquiries, please reach out to our team. We are committed to transparency and clarity in all our partnerships.
              </p>
              <a
                href="mailto:legal@vellora.com"
                className="inline-flex items-center gap-2 bg-clay hover:bg-terracotta text-sand text-[11px] font-bold uppercase tracking-[0.12em] px-5 py-3 rounded-lg transition-colors duration-200"
              >
                legal@vellora.com
              </a>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
