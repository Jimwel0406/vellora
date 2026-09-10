"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const inputCls =
  "mt-1.5 block w-full rounded-lg border border-clay/15 bg-[#FAF7EF] px-4 py-3 text-[14px] text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 placeholder:text-clay/40 transition-all";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-[0.15em] text-clay/60 font-label";

export function SettingsForm({
  name: initialName,
  email: initialEmail,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg({ type: "success", text: "Profile updated." });
        router.refresh();
      } else {
        setProfileMsg({ type: "error", text: data.error || "Something went wrong" });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Something went wrong" });
    } finally {
      setProfileLoading(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: "success", text: "Password updated." });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setPasswordMsg({ type: "error", text: data.error || "Something went wrong" });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Something went wrong" });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      {/* Profile */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label mb-3">
          Profile
        </p>
        <p className="text-[13px] text-clay/50 mb-8 max-w-md leading-relaxed">
          Keep your account information up to date.
        </p>

        <form onSubmit={saveProfile} className="max-w-lg">
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className={labelCls}>
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {profileMsg && (
            <p className={`mt-4 text-[13px] font-medium ${profileMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
              {profileMsg.text}
            </p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={profileLoading}
              className="inline-flex items-center gap-2 bg-terracotta hover:bg-clay text-white px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-[0.15em] transition-all disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {profileLoading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Divider */}
      <div className="h-px bg-clay/8" />

      {/* Change Password */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-clay/40 font-label mb-3">
          Change Password
        </p>
        <p className="text-[13px] text-clay/50 mb-8 max-w-md leading-relaxed">
          Update your password to keep your account secure.
        </p>

        <form onSubmit={changePassword} className="max-w-lg">
          <div className="space-y-5">
            <div>
              <label htmlFor="currentPassword" className={labelCls}>
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputCls}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-clay/30 hover:text-clay/60 transition-colors"
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="newPassword" className={labelCls}>
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputCls}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-clay/30 hover:text-clay/60 transition-colors"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-clay/35 font-label">
                At least 8 characters
              </p>
            </div>
          </div>

          {passwordMsg && (
            <p className={`mt-4 text-[13px] font-medium ${passwordMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
              {passwordMsg.text}
            </p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center gap-2 bg-terracotta hover:bg-clay text-white px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-[0.15em] transition-all disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>

        {/* Security note */}
        <p className="mt-8 text-[11px] text-clay/30 font-label uppercase tracking-[0.15em]">
          Account Security &mdash; Your password is used only to secure your Vellora account.
        </p>
      </div>
    </div>
  );
}
