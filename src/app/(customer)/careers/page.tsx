import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — Vellora",
  description: "Join the Vellora team",
};

export default function CareersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Careers</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <p>
          We&apos;re building the future of multi-vendor commerce — and we&apos;d love your help.
          At Vellora, you&apos;ll work with a passionate team dedicated to creating the best
          marketplace experience for both buyers and sellers.
        </p>
        <h2 className="text-xl font-semibold text-foreground mt-8">Open positions</h2>
        <p>We don&apos;t have any open positions right now, but we&apos;re always looking for talented people. 
        If you&apos;re interested in joining Vellora, reach out to us.</p>
        <p className="text-foreground font-medium">careers@vellora.com</p>
      </div>
    </div>
  );
}
