const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const MAIL_FROM = process.env.RESEND_FROM ?? "Vellora <onboarding@resend.dev>";

type SendEmailInput = { to: string; subject: string; html: string };

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set; skipping send to", to);
    return { skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: MAIL_FROM, to: [to], subject, html }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] Resend error ${res.status}: ${body.slice(0, 300)}`);
      return { error: res.status };
    }
    return { sent: true };
  } catch (e) {
    console.error("[email] send failed:", (e as Error).message);
    return { error: "network" };
  }
}

/* -- Branded HTML shell (inline styles for email clients) -- */
function shell(eyebrow: string, title: string, body: string, cta?: { label: string; href: string }, note?: string) {
  return `
  <div style="background-color:#F2E8CF;padding:32px 16px;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E4D9C3;border-radius:16px;overflow:hidden;">
      <div style="padding:28px 32px;border-bottom:1px solid #E4D9C3;">
        <span style="font-family:Georgia,serif;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#3D2B1F;">Vellora</span>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#A6634B;">${eyebrow}</p>
        <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;line-height:1.25;color:#3D2B1F;">${title}</h1>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#5C4636;">${body}</div>
        ${cta ? `<div style="margin:24px 0 8px;text-align:center;"><a href="${cta.href}" style="display:inline-block;padding:14px 28px;border-radius:10px;background-color:#A6634B;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">${cta.label}</a></div>` : ""}
        ${note ? `<p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#8A7565;">${note}</p>` : ""}
      </div>
      <div style="padding:20px 32px;border-top:1px solid #E4D9C3;background:#FBF6EC;">
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A7565;">© 2026 Vellora · Multi-vendor marketplace · <a href="mailto:support@vellora.example.com" style="color:#A6634B;text-decoration:none;">support@vellora.example.com</a></p>
      </div>
    </div>
  </div>`;
}

export function resetPasswordEmailHtml(resetUrl: string) {
  return shell(
    "Account security",
    "Reset your password",
    `<p>We received a request to reset the password for your Vellora account. If this wasn't you, you can safely ignore this email.</p>`,
    { label: "Reset password", href: resetUrl },
    `This link expires in 1 hour. If it has expired, request a new one from the sign-in page.`
  );
}

export type OrderConfirmationLine = { name: string; qty: number; price: number };

export function orderConfirmationEmailHtml(input: {
  orderId: number;
  totalCents: number;
  discountCents: number;
  lines: OrderConfirmationLine[];
}) {
  const rows = input.lines
    .map(
      (l) => `<tr>
        <td style="padding:8px 0;color:#3D2B1F;font-size:13px;">${l.name} × ${l.qty}</td>
        <td style="padding:8px 0;color:#5C4636;font-size:13px;text-align:right;">$${(l.price / 100).toFixed(2)}</td>
      </tr>`
    )
    .join("");
  const discountRow =
    input.discountCents > 0
      ? `<tr><td style="padding:8px 0;color:#15803D;font-size:13px;">Discount</td><td style="padding:8px 0;color:#15803D;font-size:13px;text-align:right;">−$${(input.discountCents / 100).toFixed(2)}</td></tr>`
      : "";
  const body = `
    <p>Thanks for your order! We've received your payment and the sellers are preparing your items.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0 8px;">
      ${rows}
      ${discountRow}
      <tr>
        <td style="padding:10px 0;border-top:1px solid #E4D9C3;color:#3D2B1F;font-size:14px;font-weight:700;">Total paid</td>
        <td style="padding:10px 0;border-top:1px solid #E4D9C3;color:#3D2B1F;font-size:14px;font-weight:700;text-align:right;">$${((input.totalCents - input.discountCents) / 100).toFixed(2)}</td>
      </tr>
    </table>`;
  return shell("Order confirmation", `Order #${input.orderId} is confirmed`, body);
}

export function newVendorOrderEmailHtml(input: {
  orderId: number;
  storeName: string;
  subtotalCents: number;
  baseUrl: string;
}) {
  return shell(
    "New order",
    `You have a new order #${input.orderId}`,
    `<p>${input.storeName} received a new order worth <strong>$${(input.subtotalCents / 100).toFixed(2)}</strong>. Review it in your seller dashboard.</p>`,
    { label: "View in dashboard", href: `${input.baseUrl}/vendor/orders` }
  );
}

export function welcomeEmailHtml(name: string, baseUrl: string) {
  return shell(
    "Welcome",
    `Welcome to Vellora, ${name}`,
    `<p>Your account is ready. Shop thoughtfully made goods from independent makers — electronics, home goods, stationery, and more.</p>`,
    { label: "Start shopping", href: `${baseUrl}/products` }
  );
}

export function newsletterSubscribeEmailHtml() {
  return shell(
    "Newsletter",
    "You're subscribed",
    `<p>Thanks for subscribing to the Vellora newsletter. We'll send occasional updates on new stores, products, and offers — no spam, and you can unsubscribe anytime.</p>`
  );
}

export function newsletterBroadcastEmailHtml(title: string, messageHtml: string) {
  return shell("Newsletter", title, messageHtml);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function contactEmailHtml(input: { name: string; email: string; message: string }) {
  return shell(
    "Support",
    "New contact message",
    `<p><strong>From:</strong> ${escapeHtml(input.name)} (${escapeHtml(input.email)})</p>
    <p><strong>Message:</strong></p>
    <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #E4D9C3;background:#FBF6EC;color:#3D2B1F;font-size:13px;line-height:1.6;">${escapeHtml(input.message)}</blockquote>`
  );
}