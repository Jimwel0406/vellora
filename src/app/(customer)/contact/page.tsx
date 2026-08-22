import type { Metadata } from "next";
import { Phone, Mail, Store, MapPin } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us — Vellora",
  description:
    "Get in touch with Vellora. Reach us by phone, WhatsApp, or email — we are happy to help.",
};

const BAKERY_IMG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=700&q=80&auto=format&fit=crop";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 0 0-7.9 13.4L3 21l4.8-1.1A9 9 0 1 0 12 3z" />
      <path d="M8.6 9.4c.5 3.6 2.9 6 6.5 6.5l1.1-1.2-2-1.5-1.1.9c-1-.5-1.8-1.4-2.3-2.4l.9-1.1-1.6-2-1.2 1.3z" />
    </svg>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[95px] flex-col items-center justify-center gap-2 rounded-lg bg-[#F7F1EF] px-3 py-4 text-center">
      <span className="text-[26px] leading-none text-[#10232B]/80">{icon}</span>
      <div>
        <h3 className="text-[12px] font-semibold text-[#10232B]">{title}</h3>
        <p className="mt-0.5 text-[11px] leading-snug text-[#555555]">{children}</p>
      </div>
    </div>
  );
}

function MapPlaceholder() {
  return (
    <div className="relative mt-4 h-[220px] w-full overflow-hidden rounded-[4px] bg-[#F1EDE6] md:h-auto md:flex-1">
      <svg
        className="h-full w-full"
        viewBox="0 0 400 150"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g stroke="#E5DFD3" strokeWidth="1">
          <path d="M0 30 H400" />
          <path d="M0 75 H400" />
          <path d="M0 120 H400" />
          <path d="M60 0 V150" />
          <path d="M200 0 V150" />
          <path d="M320 0 V150" />
        </g>
        <g stroke="#FFFFFF" fill="none" strokeLinecap="round">
          <path d="M0 60 Q 110 40 220 70 T 400 55" strokeWidth="8" />
          <path d="M185 0 Q 195 80 155 150" strokeWidth="6" />
          <path d="M0 115 L400 108" strokeWidth="5" />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C98255] shadow">
          <MapPin className="h-5 w-5 text-white" />
        </span>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <section data-section="contact-hero" className="section-contact-hero relative flex min-h-[300px] w-full items-center justify-center overflow-hidden md:min-h-[340px]">
        <img
          src={BAKERY_IMG}
          alt="Vellora marketplace storefront"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60" />
        <div className="relative z-10 mx-auto max-w-[850px] px-6 py-16 text-center">
          <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-[#10232B] md:text-[46px]">
            Contact Us
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-[15px] font-medium leading-relaxed text-[#10232B]/90 md:text-[17px]">
            We&apos;d love to hear from you — questions about an order, your store, or a
            partnership. <span className="text-[#A6634B]">Reach out</span> and our team will
            get back to you soon.
          </p>
        </div>
      </section>

      <section data-section="contact-info" className="section-contact-info bg-[#FCFCF8]">
        <div className="mx-auto w-[88%] max-w-[880px] py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.15fr] md:gap-[50px]">
            <div className="flex flex-col">
              <div className="grid grid-cols-2 gap-3.5">
                <InfoCard icon={<Phone className="h-[26px] w-[26px]" />} title="Phone">
                  207-8767-452
                </InfoCard>
                <InfoCard icon={<WhatsAppIcon className="h-[26px] w-[26px]" />} title="Whatsapp">
                  082-123-234-345
                </InfoCard>
                <InfoCard icon={<Mail className="h-[26px] w-[26px]" />} title="Email">
                  <a href="mailto:support@vellora.com" className="hover:underline">
                    support@vellora.com
                  </a>
                </InfoCard>
                <InfoCard icon={<Store className="h-[26px] w-[26px]" />} title="Our Shop">
                  2443 Oak Ridge Omaha,
                  <br />
                  QA 45065
                </InfoCard>
              </div>
              <MapPlaceholder />
            </div>

            <div>
              <h2 className="text-[28px] font-bold leading-tight text-[#10232B] md:text-[30px]">
                Get In Touch
              </h2>
              <p className="mt-3 max-w-[400px] text-[12px] leading-relaxed text-[#555555]">
                Send us a message and our team will get back to you as soon as possible. We&apos;re
                here to help with anything you need.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
