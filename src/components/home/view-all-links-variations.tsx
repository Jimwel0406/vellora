"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

const LINKS = [
  {
    href: "/products?sort=best-selling",
    eyebrow: "See more",
    title: "View all best sellers",
    image: "/links-bestsellers.jpg",
    delay: 0.1,
  },
  {
    href: "/products?sort=newest",
    eyebrow: "Just in",
    title: "Shop new arrivals",
    image: "/links-newarrivals.jpg",
    delay: 0.15,
  },
  {
    href: "/products?sort=top-rated",
    eyebrow: "Highly rated",
    title: "Shop top rated",
    image: "/links-toprated.jpg",
    delay: 0.2,
  },
];

export function ViewAllLinks() {
  return (
    <div className="flex flex-col flex-1 gap-4">
      {LINKS.map((link, i) => {
        const isLast = i === LINKS.length - 1;
        return (
          <Reveal key={link.href} delay={link.delay}>
            <Link
              href={link.href}
              className={`group relative flex items-center justify-between h-full rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/[0.2] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 ${
                isLast ? "min-h-[7rem] sm:min-h-[8rem]" : "h-28 sm:h-32"
              }`}
            >
              <img
                src={link.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 group-hover:from-black/80 group-hover:via-black/50 transition-all duration-300" />
              <div className="relative z-10 px-5 py-5 sm:px-7 sm:py-0">
                <p className="text-sm font-bold uppercase font-label tracking-[0.3em] text-white/80">
                  {link.eyebrow}
                </p>
                <p className="mt-1.5 text-xl sm:text-2xl font-heading font-bold text-white">
                  {link.title}
                </p>
              </div>
              <span className="relative z-10 mr-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-clay group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
