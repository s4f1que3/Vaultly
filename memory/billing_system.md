---
name: Vaultly Billing System
description: PayPal subscription billing architecture — plans, guard, grace periods, plan switching logic
type: project
---

PayPal Subscriptions API (sandbox mode) handles recurring billing. Two plans: monthly $8/year $100.

**Why:** User requested subscription gate for the whole app with custom billing-day logic and grace periods.

**How to apply:** When touching billing, auth guards, or subscription status — reference this architecture.

## Key files
- `backend/src/billing/paypal.service.ts` — PayPal OAuth + subscription CRUD
- `backend/src/billing/billing.service.ts` — business logic, cron grace-period enforcement
- `backend/src/billing/billing.controller.ts` — REST endpoints under /api/billing/*
- `backend/src/billing/guards/subscription.guard.ts` — global APP_GUARD, blocks 402 if no active sub
- `frontend/stores/useBillingStore.ts` — Zustand billing state
- `frontend/app/(auth)/subscribe/page.tsx` — plan selection → PayPal redirect
- `frontend/app/billing/success/page.tsx` — PayPal return, calls /billing/activate
- `frontend/components/billing/SubscriptionWall.tsx` — shown for frozen/expired accounts
- `database/billing_schema.sql` — SQL for app_subscriptions + payment_history tables (must be run in Supabase)

## Guard architecture
- `AuthGuard` registered as global APP_GUARD in app.module.ts
- `SubscriptionGuard` registered as APP_GUARD in billing.module.ts (runs after AuthGuard)
- `@Public()` skips both guards (used on /auth/check-email and /billing/webhook)
- `@SkipBillingCheck()` skips SubscriptionGuard only (used on entire BillingController and /auth/change-email)

## Billing logic
- billing_day = day of month user first subscribed (e.g. signed up on 4th → billed on 4th every month)
- Grace period on missed payment = last day of the current month (23:59:59)
- Cron at 01:00 UTC daily freezes past_due accounts whose grace_period_end has passed
- Monthly→Yearly: immediate PayPal charge, old subscription cancelled
- Yearly→Monthly: new monthly subscription starts at current_period_end (no immediate charge)
- Cancellation: removes payment_method_last4/brand, access continues until current_period_end

## PayPal plan IDs
First backend start logs plan IDs to console → add to backend/.env:
PAYPAL_MONTHLY_PLAN_ID=P-xxx
PAYPAL_YEARLY_PLAN_ID=P-xxx

## Webhook setup
Create webhook in PayPal developer dashboard pointing to:
  http://<your-public-url>/api/billing/webhook
Events: BILLING.SUBSCRIPTION.*, PAYMENT.SALE.COMPLETED
Then add PAYPAL_WEBHOOK_ID to backend/.env
