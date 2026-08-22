"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const inputCls =
    "mt-1.5 block w-full rounded-lg border border-clay/10 bg-white px-3.5 py-2.5 text-sm text-clay shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/50 placeholder:text-clay/30 transition-all";
  const labelCls =
    "block text-[11px] font-bold uppercase tracking-widest text-clay/50";

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <form
        onSubmit={saveProfile}
        className="bg-white rounded-xl border border-clay/5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-8"
      >
        <h3 className="font-bold text-clay mb-5">Profile</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={labelCls}>
              Name
            </label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="email" className={labelCls}>
              Email
            </label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </div>
        </div>
        {profileMsg && (
          <p className={`mt-4 text-sm ${profileMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
            {profileMsg.text}
          </p>
        )}
        <div className="mt-6">
          <Button type="submit" disabled={profileLoading}>
            {profileLoading ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </form>

      <form
        onSubmit={changePassword}
        className="bg-white rounded-xl border border-clay/5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-8"
      >
        <h3 className="font-bold text-clay mb-5">Change password</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className={labelCls}>
              Current password
            </label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={labelCls}>
              New password
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputCls}
              placeholder="At least 8 characters"
            />
          </div>
        </div>
        {passwordMsg && (
          <p className={`mt-4 text-sm ${passwordMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
            {passwordMsg.text}
          </p>
        )}
        <div className="mt-6">
          <Button type="submit" disabled={passwordLoading}>
            {passwordLoading ? "Updating..." : "Update password"}
          </Button>
        </div>
      </form>
    </div>
  );
}