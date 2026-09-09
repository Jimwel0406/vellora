"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is Vellora?",
    answer:
      "Vellora is a curated marketplace connecting you with independent sellers, artisans, and brands. We carefully vet every seller to ensure quality, authenticity, and a premium shopping experience.",
  },
  {
    question: "How do I become a seller?",
    answer:
      "Click the 'Seller' button in the navigation to apply. We review each application to maintain our quality standards. Once approved, you'll get access to your own storefront to showcase and sell your products.",
  },
  {
    question: "What's the return policy?",
    answer:
      "We offer a 30-day return policy on most items. If you're not satisfied with your purchase, contact the seller directly through your order page. Each seller manages their own returns, but Vellora ensures fair resolution for all parties.",
  },
  {
    question: "How does shipping work?",
    answer:
      "Shipping is handled by individual sellers. Delivery times and costs vary depending on the seller's location and your address. Most orders ship within 2–5 business days, and you'll receive tracking information once your order is dispatched.",
  },
  {
    question: "How are sellers vetted?",
    answer:
      "Every seller goes through a rigorous application process. We verify their identity, review product quality, and assess their commitment to customer service. This ensures you always shop with confidence on Vellora.",
  },
];

function FaqItem({
  number,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  number: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-t border-clay/10">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-5 py-6 sm:py-7 text-left cursor-pointer group"
      >
        <span className="font-label text-xs font-semibold uppercase tracking-[0.15em] text-clay/50 mt-1 shrink-0 w-6">
          {number}
        </span>
        <span className="flex-1 font-heading text-lg sm:text-xl text-clay group-hover:text-terracotta transition-colors duration-200">
          {question}
        </span>
        <span
          className={`mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center text-clay/50 transition-transform duration-300 ${
            isOpen ? "rotate-45 text-terracotta" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-base text-clay/65 leading-relaxed pl-11 pr-4 pb-7">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#FAF7EF] pt-24 sm:pt-32 lg:pt-40 pb-16 lg:py-24 scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-20">
        {/* Editorial layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-[0.38fr_0.62fr] gap-10 lg:gap-20">

          {/* ── Left: Heading + support ── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2.5px] bg-terracotta rounded-full" />
              <span className="text-2xl font-bold uppercase tracking-[0.3em] text-terracotta font-label">
                Questions
              </span>
            </div>

            <h2 className="font-heading text-[40px] sm:text-[48px] lg:text-[56px] text-clay leading-[1.05] tracking-tight">
              Frequently
              <br />
              Asked
            </h2>

            <p className="mt-5 text-base sm:text-lg text-clay/50 leading-relaxed max-w-sm">
              Everything you need to know about shopping and selling on Vellora.
            </p>

            {/* Editorial rule */}
            <div className="mt-10 lg:mt-16 h-px bg-clay/10" />

            {/* Support — minimal editorial CTA */}
            <div className="mt-8 lg:mt-10">
              <p className="text-sm text-clay/50 font-medium mb-3">
                Still have questions?
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 font-label text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-clay hover:text-terracotta transition-colors duration-200"
              >
                Get in touch
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* ── Right: FAQ index ── */}
          <div className="flex flex-col">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem
                key={i}
                number={String(i + 1).padStart(2, "0")}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
            {/* Bottom rule */}
            <div className="border-t border-clay/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
