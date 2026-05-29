# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run build        # prisma generate + next build
npm run seed         # seed MongoDB with demo providers & listings
npx tsc --noEmit     # type-check without emitting
npm run lint         # eslint
```

## Stack

- **Next.js 14 App Router** — all pages under `app/`. Server components by default; add `'use client'` only where state/hooks are needed.
- **MongoDB + Prisma** — `prisma/schema.prisma` is the source of truth. Run `npx prisma generate` after schema changes; migrations are not used (MongoDB).
- **NextAuth v4** — configured in `pages/api/auth/[...nextauth].ts` (Pages Router file). Session available server-side via `getCurrentUser()` action.
- **Stripe** — checkout session created in `app/api/stripe/checkout/route.ts`. Webhook at `app/api/stripe/webhook/route.ts` marks reservations PAID and triggers Twilio SMS.
- **Twilio** — SMS sent from the webhook handler only (not from client).
- **Tailwind CSS** — brand color scale (`brand-50` → `brand-900`) maps to indigo. Playfair Display loaded as `font-playfair` CSS variable via `--font-playfair`.
- **Zustand** — modal state only (`useLoginModal`, `useRegisterModal`, `useRentModal`, `useSearchModal`).

## Architecture

### Data flow
Server actions (`app/actions/`) fetch directly from Prisma and are called in page server components. They return "Safe" types (dates serialised to strings) defined in `app/types/index.ts`. Client components receive these as props.

### Auth pattern
`getCurrentUser()` reads the NextAuth session and returns a `SafeUser | null`. Protected pages redirect to `/` when null. The User model has a `role` field (`CUSTOMER` | `PROVIDER`) and `subscriptionStatus` for Stripe-gated provider features.

### Booking flow
1. Customer fills booking form on listing page → POST `/api/stripe/checkout` → creates `PENDING` reservation → redirects to Stripe hosted checkout.
2. Stripe webhook (`checkout.session.completed`) → updates reservation to `PAID` → sends SMS via Twilio to both customer and provider.
3. Success page at `/bookings/success?reservation=<id>` reads reservation status; `/bookings` redirects to `/trips`.

### Listing ownership
`app/properties/` = provider's own listings (CRUD). `app/trips/` = customer's bookings ("My Bookings"). `app/reservations/` = provider's incoming bookings.

### Image hosting
User-uploaded images go to Cloudinary (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`). Seed/editorial images use Unsplash (`images.unsplash.com` — whitelisted in `next.config.js`).

### Key env vars needed
`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PROVIDER_MONTHLY_PRICE_ID`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
