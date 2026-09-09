import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/shared/providers";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import "./globals.css";

const BASE_URL =
  process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-label",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Vellora — Multi-Vendor Marketplace",
    template: "%s | Vellora",
  },
  description:
    "Vellora is a multi-vendor marketplace for thoughtfully made products — electronics, home goods, stationery, and sustainable lifestyle essentials from independent sellers.",
  keywords: [
    "Vellora",
    "multi-vendor marketplace",
    "electronics",
    "home goods",
    "stationery",
    "sustainable living",
    "eco-friendly products",
    "shop online",
  ],
  openGraph: {
    title: "Vellora — Multi-Vendor Marketplace",
    description:
      "Shop quality electronics, home goods, stationery, and sustainable essentials from independent vendors.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vellora — Multi-Vendor Marketplace",
    description:
      "Shop quality electronics, home goods, stationery, and sustainable essentials from independent vendors.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${BASE_URL}/#website`,
                  url: BASE_URL,
                  name: "Vellora",
                  description:
                    "Vellora is a multi-vendor marketplace for thoughtfully made products — electronics, home goods, stationery, and sustainable lifestyle essentials from independent sellers.",
                  inLanguage: "en-US",
                  publisher: {
                    "@type": "Organization",
                    "@id": `${BASE_URL}/#organization`,
                    name: "Vellora",
                    url: BASE_URL,
                  },
                },
                {
                  "@type": "Organization",
                  "@id": `${BASE_URL}/#organization`,
                  name: "Vellora",
                  url: BASE_URL,
                  logo: `${BASE_URL}/logo.png`,
                  sameAs: [],
                  contactPoint: {
                    "@type": "ContactPoint",
                    email: "support@vellora.example.com",
                    contactType: "customer support",
                  },
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  );
}
