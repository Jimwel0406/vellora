import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Vellora",
  description: "Vellora terms of service",
};

export default function TermsPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-32 lg:py-48">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-32">
            <h3 className="font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta mb-8">Contents</h3>
            <ul className="space-y-6">
              <li>
                <a href="#intro" className="text-sm text-clay/50 hover:text-terracotta transition-all border-l-2 border-transparent hover:border-terracotta pl-4 block">
                  Introduction
                </a>
              </li>
              <li>
                <a href="#account" className="text-sm text-clay/50 hover:text-terracotta transition-all border-l-2 border-transparent hover:border-terracotta pl-4 block">
                  Account Responsibilities
                </a>
              </li>
              <li>
                <a href="#orders" className="text-sm text-clay/50 hover:text-terracotta transition-all border-l-2 border-transparent hover:border-terracotta pl-4 block">
                  Orders &amp; Payments
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-clay/50 hover:text-terracotta transition-all border-l-2 border-transparent hover:border-terracotta pl-4 block">
                  Contact &amp; Legal
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-9 xl:col-span-8 max-w-3xl">
          <div className="mb-24">
            <span className="inline-block px-4 py-1 bg-terracotta/10 text-terracotta text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
              Updated July 2026
            </span>
            <h1 id="intro" className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-clay mb-8 leading-tight scroll-mt-40">
              Terms of Service
            </h1>
            <p className="text-lg text-clay/60 leading-relaxed">
              By using Vellora, you agree to the following terms and conditions. Please read them carefully before using our marketplace.
            </p>
            <div className="w-20 h-1 bg-terracotta mt-10" />
          </div>

          <section id="account" data-section="terms-account" className="section-terms-account mb-24 max-w-2xl group scroll-mt-40">
            <div className="flex items-start gap-4 mb-8">
              <span className="font-heading text-4xl text-terracotta/40 leading-none">01</span>
              <h2 className="font-heading text-3xl text-clay">Account responsibilities</h2>
            </div>
            <div className="md:pl-12 space-y-4">
              <p className="text-base text-clay/60 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration.
              </p>
              <p className="text-base text-clay/60 leading-relaxed">
                Vellora reserves the right to suspend or terminate accounts that provide false information or engage in suspicious activity. Your profile is the gateway to a personalized marketplace experience; keep it secure.
              </p>
            </div>
          </section>

          <section id="orders" data-section="terms-orders" className="section-terms-orders mb-24 max-w-2xl group scroll-mt-40">
            <div className="flex items-start gap-4 mb-8">
              <span className="font-heading text-4xl text-terracotta/40 leading-none">02</span>
              <h2 className="font-heading text-3xl text-clay">Orders and payments</h2>
            </div>
            <div className="md:pl-12 space-y-4">
              <p className="text-base text-clay/60 leading-relaxed">
                All prices are listed in USD and are subject to change. Orders are processed once payment is confirmed through our secure unified checkout system. We reserve the right to cancel any order if necessary due to vendor stock levels or technical errors.
              </p>
              <div className="bg-sand/50 p-8 rounded-xl border border-clay/10 my-8">
                <h4 className="text-[10px] font-bold uppercase font-label tracking-[0.2em] text-terracotta mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="1.5" />
                  </svg>
                  Smart Cart Routing
                </h4>
                <p className="text-sm text-clay/60 leading-relaxed">
                  When you purchase from multiple vendors, our system automatically routes payments and shipping instructions. This ensures a &ldquo;one-checkout&rdquo; experience while maintaining the uniqueness of each vendor&apos;s fulfillment process.
                </p>
              </div>
              <p className="text-base text-clay/60 leading-relaxed">
                Refunds and returns are subject to individual vendor policies, though Vellora provides a baseline of protection for every transaction made on the platform.
              </p>
            </div>
          </section>

          <section id="contact" data-section="terms-contact" className="section-terms-contact max-w-2xl group scroll-mt-40">
            <div className="flex items-start gap-4 mb-8">
              <span className="font-heading text-4xl text-terracotta/40 leading-none">03</span>
              <h2 className="font-heading text-3xl text-clay">Contact</h2>
            </div>
            <div className="md:pl-12 space-y-8">
              <p className="text-base text-clay/60 leading-relaxed">
                For questions about these terms or legal inquiries, please reach out to our team. We are committed to transparency and clarity in all our partnerships.
              </p>
              <a
                href="mailto:legal@vellora.com"
                className="inline-flex items-center gap-3 px-8 py-4 bg-clay text-white text-[10px] font-bold uppercase font-label tracking-[0.2em] rounded-full hover:bg-terracotta transition-all shadow-lg"
              >
                legal@vellora.com
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2" />
                </svg>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
