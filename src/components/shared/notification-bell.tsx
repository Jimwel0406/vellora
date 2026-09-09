"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Bell,
  BellRing,
  ShoppingBag,
  Package,
  Star,
  Users,
  Wallet,
  Check,
  Loader2,
} from "lucide-react";

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

type SessionUser = { id?: string; name?: string | null } | null | undefined;

const TYPE_ICONS: Record<string, typeof ShoppingBag> = {
  order: ShoppingBag,
  ship: Package,
  review: Star,
  follow: Users,
  payout: Wallet,
};

function timeAgo(iso: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(iso).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function NotificationBell({ user, scrolled }: { user: SessionUser; scrolled?: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });

  const isSignedIn = Boolean(user?.id);

  async function fetchNotifications(): Promise<{
    notifications: NotificationItem[];
    unreadCount: number;
  } | null> {
    if (!isSignedIn) return null;
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (!isSignedIn) return;
    async function load() {
      const data = await fetchNotifications();
      if (data) {
        setNotifications(data.notifications ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isSignedIn]);

  function toggle() {
    if (!open) {
      const rect = buttonRef.current?.getBoundingClientRect();
      setPanelPos({
        top: (rect?.bottom ?? 0) + 8,
        right: rect ? window.innerWidth - rect.right : 16,
      });
      setOpen(true);
      setLoading(true);
      fetchNotifications()
        .then((data) => {
          if (data) {
            setNotifications(data.notifications ?? []);
            setUnreadCount(data.unreadCount ?? 0);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function markAllRead() {
    setMarking(true);
    try {
      await fetch("/api/notifications", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      /* ignore */
    }
    setMarking(false);
  }

  async function openItem(n: NotificationItem) {
    if (!n.isRead) {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [n.id] }),
      }).catch(() => {});
      setUnreadCount((c) => Math.max(0, c - 1));
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x))
      );
    }
    setOpen(false);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        aria-expanded={open}
        className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer ${
          isHome
            ? scrolled ? "text-clay hover:text-terracotta hover:bg-clay/5" : "text-white/70 hover:text-white hover:bg-white/10"
            : "text-clay hover:text-terracotta hover:bg-clay/5"
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-terracotta text-white text-[9px] font-bold flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[70]">
            <button
              type="button"
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-clay/30 backdrop-blur-[1px] cursor-default"
            />
            <div
              role="dialog"
              aria-label="Notifications"
              className="absolute w-[340px] max-w-[calc(100vw-1rem)] flex flex-col bg-white rounded-2xl shadow-2xl border border-clay/10 overflow-hidden"
              style={{ top: panelPos.top, right: panelPos.right }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-clay/10">
                <p className="text-sm font-bold text-clay flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-terracotta" />
                  Notifications
                </p>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    disabled={marking}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-terracotta hover:text-clay transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {marking ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[420px] overflow-y-auto">
                {loading && notifications.length === 0 ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-sm text-clay/50">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <Bell className="w-6 h-6 text-clay/30 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-clay">No notifications yet</p>
                    <p className="text-xs text-clay/50 mt-1">
                      Order updates, reviews, and more will show up here.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-clay/5">
                    {notifications.map((n) => {
                      const Icon = TYPE_ICONS[n.type] ?? BellRing;
                      const inner = (
                        <>
                          <span
                            className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
                              n.isRead
                                ? "bg-clay/5 text-clay/40"
                                : "bg-terracotta/10 text-terracotta"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span
                                className={`text-sm font-semibold truncate ${
                                  n.isRead ? "text-clay/60" : "text-clay"
                                }`}
                              >
                                {n.title}
                              </span>
                              {!n.isRead && (
                                <span
                                  aria-hidden="true"
                                  className="w-2 h-2 rounded-full bg-terracotta shrink-0"
                                />
                              )}
                            </span>
                            {n.message && (
                              <span className="block text-xs text-clay/50 mt-0.5 truncate">
                                {n.message}
                              </span>
                            )}
                            <span className="block text-[10px] text-clay/40 mt-1">
                              {timeAgo(n.createdAt)}
                            </span>
                          </span>
                        </>
                      );
                      return (
                        <li key={n.id}>
                          {n.link ? (
                            <Link
                              href={n.link}
                              onClick={() => openItem(n)}
                              className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
                                n.isRead
                                  ? "hover:bg-clay/[0.03]"
                                  : "bg-terracotta/[0.03] hover:bg-terracotta/[0.06]"
                              }`}
                            >
                              {inner}
                            </Link>
                          ) : (
                            <div
                              onClick={() => openItem(n)}
                              className={`flex items-start gap-3 px-4 py-3 ${
                                n.isRead ? "" : "bg-terracotta/[0.03]"
                              }`}
                            >
                              {inner}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}