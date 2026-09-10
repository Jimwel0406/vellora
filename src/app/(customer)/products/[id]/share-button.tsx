"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: name, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <button
      onClick={handleShare}
      className={cn(
        "p-2 rounded-full border border-clay/15 text-clay transition-colors",
        copied
          ? "text-emerald-600 border-emerald-300 bg-emerald-50"
          : "hover:text-terracotta hover:border-terracotta/40"
      )}
      aria-label={copied ? "Link copied" : "Share product"}
    >
      {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
    </button>
  );
}
