"use client";

import Link from "next/link";
import { ScrollToTop } from "@/components/home/scroll-to-top";

export function FooterCustomer() {
  return (
    <footer data-section="customer-footer" className="section-customer-footer bg-clay text-white/50 py-32 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 mb-32">
          <div className="md:col-span-5">
            <h1 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">VELLORA</h1>
            <p className="text-sm leading-relaxed max-w-sm mb-12 font-medium">
              Connecting discerning shoppers with exceptional independent makers around the world. We believe in slow commerce and lasting objects.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.56a9.83 9.83 0 01-2.83.77 4.93 4.93 0 002.17-2.72 9.86 9.86 0 01-3.13 1.2 4.93 4.93 0 00-8.38 4.48A13.98 13.98 0 011.64 3.15 4.93 4.93 0 003.17 9.72a4.91 4.91 0 01-2.23-.62V9.16a4.93 4.93 0 003.95 4.83 4.94 4.94 0 01-2.22.08 4.93 4.93 0 004.6 3.42A9.87 9.87 0 010 19.54a13.94 13.94 0 007.55 2.21c9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.43-.01-.64A10.01 10.01 0 0024 4.56z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Browse</h4>
            <ul className="space-y-6 text-xs uppercase tracking-[0.1em] font-medium">
              <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/stores" className="hover:text-white transition-colors">Stores</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Sell</h4>
            <ul className="space-y-6 text-xs uppercase tracking-[0.1em] font-medium">
              <li><Link href="/register" className="hover:text-white transition-colors">Become a Seller</Link></li>
              <li><Link href="/stores" className="hover:text-white transition-colors">Browse All</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Seller Login</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Company</h4>
            <ul className="space-y-6 text-xs uppercase tracking-[0.1em] font-medium">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-12 text-[9px] uppercase font-bold tracking-[0.3em]">
          <p>&copy; {new Date().getFullYear()} Vellora. All rights reserved.</p>
          <div className="flex gap-10 mt-8 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <ScrollToTop className="hover:text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}
