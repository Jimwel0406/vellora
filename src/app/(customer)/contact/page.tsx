import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us — Vellora",
  description:
    "Get in touch with Vellora. Reach us by phone, WhatsApp, or email — we are happy to help.",
};

const STORE_IMG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=700&q=80&auto=format&fit=crop";

export default function ContactPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO — Asymmetric editorial
          ═══════════════════════════════════════════ */}
      <section
        data-section="contact-hero"
        className="section-contact-hero relative w-full overflow-hidden"
        style={{ height: "clamp(300px, 40vw, 430px)" }}
      >
        <img
          src={STORE_IMG}
          alt="Vellora marketplace storefront"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Localized left-side gradient — dark where text sits, fades toward right */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(30,20,14,0.55) 0%, rgba(30,20,14,0.40) 20%, rgba(30,20,14,0.18) 45%, rgba(30,20,14,0.06) 70%, transparent 100%)",
          }}
        />

        {/* Asymmetric text — left-aligned */}
        <div className="relative z-10 flex h-full items-center max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="py-10 sm:py-0">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 font-label">
              Get in touch
            </span>
            <h1 className="mt-3 font-heading text-[48px] sm:text-[56px] lg:text-[72px] xl:text-[80px] leading-[0.92] text-[#FAF7EF] tracking-[-0.03em]"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.10)" }}
            >
              Contact
              <br />
              Us
            </h1>
            <p className="mt-5 sm:mt-6 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.55] text-white/80 max-w-[440px]"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.08)" }}
            >
              We&apos;d love to hear from you — questions about an order, your store, or a
              partnership. Reach out and our team will get back to you soon.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MAIN — 35/65 asymmetric editorial grid
          Contact info + map left, form right
          ═══════════════════════════════════════════ */}
      <section data-section="contact-main" className="section-contact-main bg-[#FCFCF8]">
        <div className="max-w-[1120px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-12 lg:gap-16 items-start">

            {/* LEFT — Contact information + Map */}
            <div className="space-y-10 lg:space-y-12 lg:pr-8 lg:border-r border-clay/10">
              {/* Section label */}
              <div>
                <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-terracotta font-label">
                  Get in touch
                </span>
              </div>

              {/* Contact list — editorial typography */}
              <div className="space-y-0">
                <ContactItem label="Phone">
                  <a href="tel:207-8767-452" className="hover:text-terracotta transition-colors">
                    207-8767-452
                  </a>
                </ContactItem>

                <ContactItem label="WhatsApp">
                  <a href="https://wa.me/082123234345" className="hover:text-terracotta transition-colors" target="_blank" rel="noopener noreferrer">
                    082-123-234-345
                  </a>
                </ContactItem>

                <ContactItem label="Email">
                  <a href="mailto:support@vellora.com" className="hover:text-terracotta transition-colors">
                    support@vellora.com
                  </a>
                </ContactItem>

                <ContactItem label="Visit" border={false}>
                  <span>
                    2443 Oak Ridge Omaha,
                    <br />
                    QA 45065
                  </span>
                </ContactItem>
              </div>

              {/* Map */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay/40 font-label block mb-3">
                  Location
                </span>
                <div className="relative w-full h-[200px] sm:h-[240px] overflow-hidden bg-[#F1EDE6] rounded-[4px]">
                  <svg
                    className="h-full w-full"
                    viewBox="0 0 400 200"
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                  >
                    <g stroke="#E5DFD3" strokeWidth="1">
                      <path d="M0 40 H400" />
                      <path d="M0 100 H400" />
                      <path d="M0 160 H400" />
                      <path d="M80 0 V200" />
                      <path d="M200 0 V200" />
                      <path d="M320 0 V200" />
                    </g>
                    <g stroke="#FFFFFF" fill="none" strokeLinecap="round">
                      <path d="M0 80 Q 110 60 220 90 T 400 75" strokeWidth="8" />
                      <path d="M185 0 Q 195 100 155 200" strokeWidth="6" />
                      <path d="M0 155 L400 148" strokeWidth="5" />
                    </g>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta shadow-sm mb-2">
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-clay/50 font-label">
                      Vellora
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.12em] text-clay/35 font-label">
                      Omaha Store
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Contact form */}
            <div className="lg:pl-4">
              <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-terracotta font-label">
                Let&apos;s talk
              </span>
              <h2 className="mt-4 font-heading text-[32px] sm:text-[36px] lg:text-[42px] leading-[1.05] text-clay tracking-[-0.02em]">
                Send a message
              </h2>
              <p className="mt-3 text-[14px] sm:text-[15px] leading-[1.7] text-clay/55 max-w-[380px]">
                Our team will get back to you as soon as possible. We&apos;re here to help with anything you need.
              </p>

              {/* Thin editorial rule */}
              <div className="mt-8 mb-8 border-t border-clay/10" />

              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactItem({
  label,
  children,
  border = true,
}: {
  label: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div className={`py-5 ${border ? "border-b border-clay/10" : ""}`}>
      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label block mb-1.5">
        {label}
      </span>
      <div className="text-[16px] sm:text-[17px] text-clay leading-relaxed">
        {children}
      </div>
    </div>
  );
}
