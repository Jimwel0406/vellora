import { redirect } from "next/navigation";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { PageHeader, Panel } from "@/components/shared/dashboard-ui";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin")
    redirect("/login");

  const messages = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  return (
    <div data-section="admin-messages" className="section-admin-messages">
      <PageHeader
        eyebrow="Support"
        title="Contact Inbox"
        description="Messages submitted through the contact form. Each message is also emailed to support."
      />

      {messages.length === 0 ? (
        <p className="text-sm text-clay">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Panel key={m.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-clay">{m.subject}</h3>
                  <p className="text-xs text-clay mt-0.5">
                    {m.name} ·{" "}
                    <a
                      href={`mailto:${m.email}`}
                      className="text-terracotta hover:text-clay transition-colors"
                    >
                      {m.email}
                    </a>
                  </p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-clay/40">
                  {new Date(m.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-clay/70 leading-relaxed whitespace-pre-wrap">
                {m.message}
              </p>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
