"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function FollowButton({
  slug,
  initialFollowing,
  isLoggedIn,
}: {
  storeId: number;
  slug: string;
  initialFollowing: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/stores/${slug}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/stores/${slug}/follow`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-200 active:scale-[0.97] ${
        following
          ? "bg-[#F2E8CF] text-[#3D2B1F] border border-[#3D2B1F]/20 hover:bg-[#EADDBC]"
          : "bg-transparent text-[#3D2B1F] border border-[#3D2B1F]/30 hover:border-[#A6634B] hover:text-[#A6634B]"
      }`}
    >
      <svg
        className={`w-4 h-4 transition-all duration-200 ${
          following ? "fill-current" : "fill-none stroke-current"
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {loading ? "..." : following ? "Following" : "Follow store"}
    </button>
  );
}