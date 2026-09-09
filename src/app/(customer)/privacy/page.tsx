import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Vellora",
  description: "Vellora privacy policy",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-32 lg:py-48">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-32">
            <h3 className="font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta mb-8">Contents</h3>
            <ul className="space-y-6">
              <li>
                <a href="#introduction" className="text-sm text-clay/50 hover:text-terracotta transition-all border-l-2 border-transparent hover:border-terracotta pl-4 block">
                  Introduction
                </a>
              </li>
              <li>
                <a href="#information-collection" className="text-sm text-clay/50 hover:text-terracotta transition-all border-l-2 border-transparent hover:border-terracotta pl-4 block">
                  Information We Collect
                </a>
              </li>
              <li>
                <a href="#use-of-information" className="text-sm text-clay/50 hover:text-terracotta transition-all border-l-2 border-transparent hover:border-terracotta pl-4 block">
                  How We Use Your Information
                </a>
              </li>
              <li>
                <a href="#data-security" className="text-sm text-clay/50 hover:text-terracotta transition-all border-l-2 border-transparent hover:border-terracotta pl-4 block">
                  Data Security
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-clay/50 hover:text-terracotta transition-all border-l-2 border-transparent hover:border-terracotta pl-4 block">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-9 xl:col-span-8 max-w-3xl">
          <div className="mb-24">
            <span className="inline-block px-4 py-1 bg-terracotta/10 text-terracotta text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
              Updated Oct 2024
            </span>
            <h1 id="intro" className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-clay mb-8 leading-tight scroll-mt-40">
              Privacy Policy
            </h1>
            <p className="text-lg text-clay/60 leading-relaxed">
              At Vellora, we believe transparency is the foundation of trust. This policy outlines our commitment to protecting your digital footprint while curating a bespoke marketplace experience.
            </p>
            <div className="w-20 h-1 bg-terracotta mt-10" />
          </div>

          <section id="introduction" data-section="privacy-introduction" className="section-privacy-introduction mb-24 max-w-2xl group scroll-mt-40">
            <div className="flex items-start gap-4 mb-8">
              <span className="font-heading text-4xl text-terracotta/40 leading-none">01</span>
              <h2 className="font-heading text-3xl text-clay">Introduction</h2>
            </div>
            <div className="md:pl-12 space-y-4">
              <p className="text-base text-clay/60 leading-relaxed">
                Welcome to the Vellora marketplace. Your privacy is paramount to us. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from vellora.com (the &ldquo;Site&rdquo;).
              </p>
              <p className="text-base text-clay/60 leading-relaxed">
                We operate as a sophisticated marketplace platform for independent sellers and brands worldwide. When you interact with our platform, you are entering a secure ecosystem designed to handle complex multi-vendor transactions with the utmost discretion and technical precision.
              </p>
            </div>
          </section>

          <div className="mb-24 rounded-xl overflow-hidden shadow-sm aspect-[21/9]">
            <img
              className="w-full h-full object-cover grayscale-[20%] contrast-[1.05]"
              alt="Minimalist flat lay of stationery and smartphone on warm cream linen surface"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8s1EIAE7dEcIS2CEuP5bjAZi-k_4gh4YbIw7tCknuOxPEYbE4Uiq-byw-DbXiCy1wSzUt80F3_WFJb02aBJYB0-Kf3GWkbvd48VFEy2RrCAc6gxRN7v8R_pfpEVughyii4n1NWmgM9tEgFBeHeq02yLNe6NY88aqFY0e9M8F2kbV4aiWoeHjW9Vnps3DmMSh0sGpp04ksRDQZWz6AnTP8Idr7qHvPjZWIEKQrf0BE43-oUFlnfYzJ"
            />
          </div>

          <section id="information-collection" data-section="privacy-information-collection" className="section-privacy-information-collection mb-24 max-w-2xl group scroll-mt-40">
            <div className="flex items-start gap-4 mb-8">
              <span className="font-heading text-4xl text-terracotta/40 leading-none">02</span>
              <h2 className="font-heading text-3xl text-clay">Information we collect</h2>
            </div>
            <div className="md:pl-12 space-y-6">
              <p className="text-base text-clay/60 leading-relaxed">
                When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
              </p>
              <div className="bg-sand/50 p-8 rounded-xl border border-clay/10 space-y-4">
                <h4 className="text-[10px] font-bold uppercase font-label tracking-[0.2em] text-terracotta">Device Information</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start text-sm text-clay/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-2 flex-shrink-0" />
                    <span>&ldquo;Cookies&rdquo; are data files that are placed on your device or computer.</span>
                  </li>
                  <li className="flex gap-3 items-start text-sm text-clay/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-2 flex-shrink-0" />
                    <span>&ldquo;Log files&rdquo; track actions occurring on the Site.</span>
                  </li>
                  <li className="flex gap-3 items-start text-sm text-clay/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-2 flex-shrink-0" />
                    <span>&ldquo;Web beacons,&rdquo; &ldquo;tags,&rdquo; and &ldquo;pixels&rdquo; are electronic files used to record information about how you browse.</span>
                  </li>
                </ul>
              </div>
              <p className="text-base text-clay/60 leading-relaxed">
                Additionally when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information, email address, and phone number.
              </p>
            </div>
          </section>

          <section id="use-of-information" data-section="privacy-use-of-information" className="section-privacy-use-of-information mb-24 max-w-2xl group scroll-mt-40">
            <div className="flex items-start gap-4 mb-8">
              <span className="font-heading text-4xl text-terracotta/40 leading-none">03</span>
              <h2 className="font-heading text-3xl text-clay">How we use your information</h2>
            </div>
            <div className="md:pl-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="font-bold text-clay text-sm uppercase tracking-widest">Order Fulfillment</h4>
                <p className="text-sm text-clay/60 leading-relaxed">
                  We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-clay text-sm uppercase tracking-widest">Risk Mitigation</h4>
                <p className="text-sm text-clay/60 leading-relaxed">
                  We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site.
                </p>
              </div>
            </div>
          </section>

          <section id="data-security" data-section="privacy-data-security" className="section-privacy-data-security mb-24 max-w-2xl group scroll-mt-40">
            <div className="flex items-start gap-4 mb-8">
              <span className="font-heading text-4xl text-terracotta/40 leading-none">04</span>
              <h2 className="font-heading text-3xl text-clay">Data Security</h2>
            </div>
            <div className="md:pl-12 space-y-4">
              <p className="text-base text-clay/60 leading-relaxed">
                To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
              </p>
              <p className="text-base text-clay/60 leading-relaxed">
                If you provide us with your credit card information, the information is encrypted using secure socket layer technology (SSL) and stored with a AES-256 encryption. Although no method of transmission over the Internet or electronic storage is 100% secure, we follow all PCI-DSS requirements.
              </p>
            </div>
          </section>

          <section id="contact" data-section="privacy-contact" className="section-privacy-contact max-w-2xl group scroll-mt-40">
            <div className="flex items-start gap-4 mb-8">
              <span className="font-heading text-4xl text-terracotta/40 leading-none">05</span>
              <h2 className="font-heading text-3xl text-clay">Contact</h2>
            </div>
            <div className="md:pl-12 space-y-8">
              <p className="text-base text-clay/60 leading-relaxed">
                Questions? Reach out to our dedicated team.
              </p>
              <a
                href="mailto:privacy@vellora.com"
                className="inline-flex items-center gap-3 px-8 py-4 bg-clay text-white text-[10px] font-bold uppercase font-label tracking-[0.2em] rounded-full hover:bg-terracotta transition-all shadow-lg"
              >
                privacy@vellora.com
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
