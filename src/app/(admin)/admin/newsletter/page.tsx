"use client";

import { useEffect, useState } from "react";
import { PageHeader, Panel, fieldInput, fieldLabel, primaryButton, Skeleton } from "@/components/shared/dashboard-ui";
import { Send, Mail, CheckCircle2, AlertCircle } from "lucide-react";

interface Subscriber {
  email: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [count, setCount] = useState<number | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [resultText, setResultText] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/newsletter")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setCount(data.count ?? 0);
        setSubscribers(data.subscribers ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult("error");
        setResultText(data.error || "Something went wrong.");
      } else {
        setResult("success");
        setResultText(`Sent to ${data.sent} of ${data.total} subscribers.`);
        setSubject("");
        setMessage("");
      }
    } catch {
      setResult("error");
      setResultText("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div data-section="admin-newsletter" className="section-admin-newsletter">
      <PageHeader
        eyebrow="Marketing"
        title="Newsletter"
        description="Email every subscriber on the list. Messages are wrapped in the Vellora brand template."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Compose broadcast"
          description={count == null ? "Loading subscriber count…" : `${count} subscriber${count === 1 ? "" : "s"} on the list`}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label htmlFor="subject" className={fieldLabel}>Subject</label>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="New stores are live on Vellora"
                className={fieldInput}
              />
            </div>
            <div>
              <label htmlFor="message" className={fieldLabel}>Message</label>
              <textarea
                id="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the email body here…"
                className={`${fieldInput} h-auto py-3 resize-y leading-relaxed`}
              />
            </div>

            {result === "success" && (
              <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle2 className="w-4 h-4" aria-hidden /> {resultText}
              </p>
            )}
            {result === "error" && (
              <p className="flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" aria-hidden /> {resultText}
              </p>
            )}

            <button
              type="submit"
              disabled={sending || (count ?? 0) === 0}
              className={`${primaryButton} disabled:opacity-50`}
            >
              <Send className="w-4 h-4" aria-hidden />
              {sending ? "Sending…" : "Send to all subscribers"}
            </button>
          </form>
        </Panel>

        <Panel title="Subscribers" className="lg:col-span-1" bodyClassName="p-0">
          {loading ? (
            <div className="p-5 space-y-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-6 py-12">
              <span className="w-12 h-12 rounded-xl bg-clay/[0.06] flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-clay/40" aria-hidden />
              </span>
              <p className="font-semibold text-clay">No subscribers yet</p>
              <p className="text-sm text-clay/50 mt-1">Emails captured from the footer form appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-clay/5 max-h-[420px] overflow-y-auto">
              {subscribers.map((s) => (
                <li key={s.email} className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-clay truncate">{s.email}</span>
                  <span className="text-[11px] text-clay/40 shrink-0">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}