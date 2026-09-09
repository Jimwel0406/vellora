# Vellora

A multi-vendor marketplace for thoughtfully made products — electronics, home goods, stationery, and sustainable lifestyle essentials from independent sellers.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)

## Overview

Vellora is a Shopee/Etsy-style marketplace where multiple vendors register, list products, and sell on one platform. Buyers add items from different vendors into a single cart and check out once — the system automatically splits payments and tracks commissions.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| Auth | NextAuth.js v5 (credentials + Google) |
| Payments | Stripe Checkout + commission splits |
| Email | Resend |
| UI | Tailwind CSS v4 + shadcn-style components |
| Validation | Zod |

## Features

- **Multi-vendor storefronts** — each vendor manages their own products, orders, and payouts
- **Smart checkout** — single payment split across vendors with automatic commission calculation
- **Customer accounts** — wishlist, order history, store following, reviews, Q&A
- **Vendor dashboard** — product management, order tracking, payout history
- **Admin panel** — vendor management, commission settings, promo codes, newsletter broadcasts
- **Responsive design** — mobile-first editorial ecommerce experience

## Getting Started

```bash
git clone https://github.com/Jimwel0406/vellora.git
cd vellora
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret
AUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

```bash
npm run db:migrate
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |

## Project Structure

```
src/
├── app/
│   ├── (customer)/     # Customer-facing routes
│   ├── (vendor)/       # Vendor dashboard
│   ├── (admin)/        # Admin dashboard
│   ├── account/        # Account settings
│   └── api/            # API route handlers
├── components/
│   ├── shared/         # Header, nav, dashboard UI
│   ├── home/           # Homepage components
│   └── ui/             # Design system primitives
├── db/
│   ├── schema/         # Drizzle ORM schemas
│   └── index.ts        # Database connection
├── lib/                # Auth, Stripe, email, utilities
└── types/              # TypeScript definitions
```

## License

Private — All rights reserved.
