# Vellora — B2B Multi-Vendor Marketplace

## Overview
A **Shopee/Etsy-style marketplace** where multiple independent vendors register, list products, and sell on one platform. Buyers add items from different vendors into a single cart and check out once — the system automatically splits the payment and tracks commissions.

---

## Tech Stack

| Layer       | Choice                  |
| ----------- | ----------------------- |
| Framework   | Next.js 16 (App Router) |
| Language    | TypeScript              |
| Database    | PostgreSQL + Drizzle ORM |
| Auth        | NextAuth.js v5 (credentials + Google, roles: customer / vendor / admin) |
| Payments    | Stripe Checkout + DB-managed commission splits |
| Email       | Resend (`RESEND_API_KEY`) — order confirmations, vendor alerts, password reset, newsletter |
| UI          | Tailwind CSS v4 + shadcn-style components (design tokens per `DESIGN.md`) |
| Validation  | Zod                     |
| API         | Next.js API (route handlers) |

---

## Roles

1. **Customer** — browses products, adds to cart, checks out, reviews/purchases, asks questions, wishes & follows stores
2. **Vendor** — manages their store, products, sees incoming sub-orders & payouts
3. **Admin** — manages vendors & categories, sets commission rate, marks payouts paid, refunds, promos, newsletter broadcasts

---

## Database Schema (17 Tables)

- **users** — id, name, email, password, role, shipping address fields, createdAt
- **stores** — id, name, slug, description, logo, userId (FK), status
- **categories** — id, name, slug, parentId, emoji
- **products** — id, name, description, price, images[], stock, storeId (FK), categoryId (FK), variant options, tags, features
- **carts / cart_items** — per-user cart, productId + quantity + variant
- **orders** — id, userId (FK), totalAmount, status, stripePaymentId, promoCode, discountAmount, shipping fields
- **sub_orders** — id, orderId (FK), storeId (FK), subtotal, commission, vendorPayout, status, trackingNumber, shippedAt
- **order_items** — snapshot of product name/image/variant/price/quantity
- **payouts** — id, storeId (FK), amount, commissionDeducted, status (pending | paid)
- **reviews** — id, productId (FK), userId (FK), rating, comment
- **product_questions / product_answers / question_upvotes** — Q&A per product
- **store_follows** — user follows a store
- **wishlist_items** — user bookmark per product
- **notifications** — per-user feed (order, payout, system)
- **newsletter_subscribers** — email pipe for admin broadcasts
- **promo_codes** — code, discountType (percent|fixed), value, minOrder, maxUses, uses, expiresAt
- **settings** — key/value platform flags (e.g. `commission_rate_pct`)
- **password_reset_tokens** — 1h expiring tokens
- **contact_messages** — support contact form submissions

> Child rows (cart, orders, stores, reviews, follows, wishlist, notifications, tokens) use `ON DELETE CASCADE` from user/store/product.

---

## Smart Checkout Flow (Portfolio Centerpiece)

Buyer adds items from 3 different vendors to cart and pays once:

```
Order #1001 (Buyer: Juan — $60.50)
├── SubOrder → SneakerHub:  $45.00 - $4.50 (10%) = $40.50
├── SubOrder → GadgetZone:  $3.50  - $0.35 (10%) = $3.15
└── SubOrder → LuxeGoods:   $12.00 - $1.20 (10%) = $10.80
────────────────────────────────
Platform earns:     $6.05
Vendors combined: $54.45
```

Each vendor sees their own SubOrders + Payouts in their dashboard. Admin marks payouts as paid. Commission rate is configurable 0–50% (default 10%) in `/admin/commission`.

---

## Routes

### Customer
| Route | Purpose |
|---|---|
| `/` | Home (hero, featured products, categories, testimonials, newsletter) |
| `/products` | Shop with filters (category, price, sort, search) |
| `/products/[id]` | Product detail: gallery, variants, reviews, QA, wishlist, share, recently viewed |
| `/stores` / `/stores/[slug]` | Store directory + store page |
| `/cart` | Per-vendor cart groups + promo code |
| `/checkout` | Order review → Stripe Checkout |
| `/checkout/success` / `/checkout/cancel` | Post-payment confirm / abandoned |
| `/orders` / `/orders/[id]` | Order history + detail (per-store suborders, cancel pending) |
| `/account` | Personal info + shipping address |
| `/account/wishlist` | Saved products |
| `/account/following` | Followed stores |
| `/account/settings` | Password change + **account deletion** |
| `/about` `/careers` `/contact` `/privacy` `/terms` | Static pages |

### Auth
`/login`, `/register`, `/forgot-password`, `/reset-password` (credentials + Google)

### Vendor
| Route | Purpose |
|---|---|
| `/vendor` | Overview: revenue, orders, top products, payout snapshot |
| `/vendor/products` (+ `/new`, `/[id]/edit`) | CRUD listings with features/tags/variants |
| `/vendor/orders` | Incoming sub-orders + commission breakdown |
| `/vendor/payouts` | Payout history + totals |
| `/vendor/settings` | Store name/description edit |
| `/vendor/setup` | First-time store creation |

### Admin
| Route | Purpose |
|---|---|
| `/admin` | Stats: orders, revenue, commission, charts |
| `/admin/vendors` | Store status toggle (enable/disable) |
| `/admin/orders` | All orders + refund via Stripe |
| `/admin/payouts` | Mark vendor payouts paid |
| `/admin/commission` | Set platform commission rate |
| `/admin/categories` | Manage category tree |
| `/admin/promos` | Create promo codes |
| `/admin/newsletter` | Broadcast to subscribers |

### API (30 handlers)
`api/auth/[...nextauth]`, `api/auth/register`, `api/auth/forgot-password`, `api/auth/reset-password`, `api/auth/guard`,
`api/cart`, `api/products` (+ `/[id]`, `/[id]/qa`), `api/categories`, `api/stores` (+ `/[slug]`, `/[slug]/follow`),
`api/checkout`, `api/stripe/webhook`, `api/orders/[id]/cancel`, `api/reviews`, `api/wishlist`, `api/search`,
`api/payouts`, `api/settings`, `api/promo-codes` (+ `/validate`), `api/newsletter` (+ `/send`), `api/notifications`,
`api/account` (+ `/password`, `/delete`), `api/admin/orders/[id]/refund`, `api/admin/stores/[id]`, `api/contact`

---

## Local Setup

```bash
# PostgreSQL should be running (installed via winget)
cd vellora

# .env: DATABASE_URL, AUTH_SECRET, AUTH_URL, STRIPE_* keys + optional RESEND_*
npm run dev
```

Useful scripts: `npm run lint`, `npm run test` (Vitest), `npm run db:migrate`, `npm run seed`, `npm run seo:audit`.

---

## Vercel Deployment

### 1. Database (Neon — Free Tier)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a project, copy the connection string
3. It looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/vellora?sslmode=require`

### 2. Environment Variables (Vercel Dashboard)
```
DATABASE_URL=<your-neon-connection-string>
AUTH_SECRET=<generate with: openssl rand -hex 32>
AUTH_URL=https://your-app.vercel.app
STRIPE_SECRET_KEY / STRIPE_PUBLISHABLE_KEY / STRIPE_WEBHOOK_SECRET
RESEND_API_KEY / RESEND_FROM (optional; emails skipped if unset)
```

### 3. Database Driver for Production
The local setup uses `pg`. For Vercel/Neon, switch `src/db/index.ts` to use the Neon driver:

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
```

### 4. Deploy
```bash
npx vercel --prod
```

---

## Project Structure

```
vellora/
├── src/
│   ├── app/
│   │   ├── (customer)/       # Customer-facing routes
│   │   ├── (vendor)/         # Vendor dashboard (sidebar layout)
│   │   ├── (admin)/          # Admin dashboard (sidebar layout)
│   │   ├── account/          # Customer account (personal info, settings, wishlist, following)
│   │   ├── api/              # API route handlers (30)
│   │   └── login|register|forgot-password|reset-password/
│   ├── components/
│   │   ├── shared/           # Header, navbars, sidebars, dashboard UI, auth guard
│   │   ├── account/          # Account layout helpers
│   │   ├── charts/           # Area/donut/sparkline
│   │   ├── home/             # Hero, product cards, testimonials, footer
│   │   └── ui/               # shadcn-style primitives
│   ├── db/
│   │   ├── schema/           # 17 Drizzle schema files
│   │   └── index.ts          # DB connection (pg driver)
│   ├── lib/
│   │   ├── auth.ts           # NextAuth v5 config
│   │   ├── stripe.ts         # Stripe client
│   │   ├── email.ts          # Resend client + branded email templates
│   │   ├── complete-order.ts # Stripe webhook/success completion logic
│   │   ├── vendor-payout.ts  # Commission split math
│   │   ├── promo.ts          # Promo validation/usage
│   │   ├── product-options.ts|product-qa.ts|dashboard.ts|notifications.ts
│   │   └── utils.ts          # formatPrice, slugify, cn
│   ├── types/                # NextAuth type augmentation
│   └── proxy.ts              # Next.js 16 Proxy (middleware)
├── drizzle.config.ts
├── .env
├── DESIGN.md                 # Design tokens (colors/typography/components)
└── package.json
```
