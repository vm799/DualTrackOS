# DualTrack OS - Complete Setup Guide

**Production-Ready Deployment Guide**

This guide walks you through setting up DualTrack OS from scratch to production deployment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup (Supabase)](#database-setup-supabase)
4. [Backend API Setup (Edge Functions)](#backend-api-setup-edge-functions)
5. [Stripe Payment Setup](#stripe-payment-setup)
6. [Deployment (Vercel)](#deployment-vercel)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Accounts
- [ ] **GitHub** account (for code hosting)
- [ ] **Supabase** account (free tier) - https://supabase.com
- [ ] **Stripe** account (test mode) - https://stripe.com
- [ ] **Vercel** account (free tier) - https://vercel.com
- [ ] **Google Cloud** account (for OAuth) - https://console.cloud.google.com

### Required Software
- [ ] **Node.js** 18+ - https://nodejs.org
- [ ] **npm** or **yarn**
- [ ] **Git**
- [ ] **Supabase CLI** - `npm install -g supabase`

### Recommended (Optional)
- [ ] **Sentry** account (error monitoring) - https://sentry.io
- [ ] **Stripe CLI** (webhook testing) - https://stripe.com/docs/stripe-cli

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/DualTrackOS.git
cd DualTrackOS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

### 4. Start Development Server

```bash
npm start
```

The app should open at `http://localhost:3000`

---

## Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: DualTrack-OS
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait ~2 minutes for provisioning

### 2. Get API Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...` (long JWT token)
3. Add to `.env.local`:

```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Database Migrations

**Option A: Using Supabase Dashboard (Quickest)**

1. Go to **SQL Editor** in your Supabase project
2. Click **New Query**
3. Copy entire contents of `/supabase/migrations/20251222000000_initial_schema.sql`
4. Paste and click **Run**
5. Verify success: "Success. No rows returned"

**Option B: Using Supabase CLI (Recommended for Production)**

```bash
# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### 4. Verify Database Setup

Run this query in SQL Editor:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_data', 'subscriptions', 'audit_logs', 'stripe_events');
```

Expected: 4 rows returned

### 5. Enable Google OAuth

See `/docs/GOOGLE_OAUTH_SETUP.md` for detailed instructions.

**Quick Steps:**
1. Create Google Cloud project
2. Enable Google+ API
3. Configure OAuth consent screen
4. Create OAuth client ID
5. Add credentials to Supabase: **Authentication** → **Providers** → **Google**

---

## Backend API Setup (Edge Functions)

### 1. Set Environment Secrets

```bash
# Stripe Configuration
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Stripe Price IDs (create products first - see Stripe section)
supabase secrets set STRIPE_STARTER_MONTHLY_PRICE_ID=price_XXXXXXXX
supabase secrets set STRIPE_STARTER_ANNUAL_PRICE_ID=price_XXXXXXXX
supabase secrets set STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_XXXXXXXX
supabase secrets set STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_XXXXXXXX
supabase secrets set STRIPE_GOLD_MONTHLY_PRICE_ID=price_XXXXXXXX
supabase secrets set STRIPE_GOLD_ANNUAL_PRICE_ID=price_XXXXXXXX
```

### 2. Deploy Edge Functions

```bash
# Deploy checkout session creator
supabase functions deploy create-checkout-session

# Deploy webhook handler
supabase functions deploy stripe-webhook
```

### 3. Verify Deployment

```bash
# Check function logs
supabase functions logs create-checkout-session --tail
```

---

## Stripe Payment Setup

### 1. Create Stripe Account

1. Go to https://stripe.com
2. Sign up for account
3. Stay in **Test Mode** for development

### 2. Create Products

1. Go to **Products** in Stripe Dashboard
2. Create 3 products:

**Product 1: DualTrack Starter**
- Name: DualTrack Starter
- Price 1: $4.99/month (recurring)
- Price 2: $49/year (recurring, annual)

**Product 2: DualTrack Premium**
- Name: DualTrack Premium
- Price 1: $9.99/month (recurring)
- Price 2: $99/year (recurring, annual)

**Product 3: DualTrack Gold**
- Name: DualTrack Gold
- Price 1: $19.99/month (recurring)
- Price 2: $199/year (recurring, annual)

### 3. Copy Price IDs

For each price, copy the **Price ID** (starts with `price_`)

Add to Supabase secrets (see Backend API Setup step 1)

### 4. Configure Webhook

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click "Add endpoint"
3. **Endpoint URL**:
   ```
   https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook
   ```
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy **Signing secret** (starts with `whsec_`)
7. Add to Supabase:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
   ```

---

## Deployment (Vercel)

### 1. Connect GitHub Repository

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel will auto-detect React app

### 2. Configure Environment Variables

In Vercel project settings → **Environment Variables**, add:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Deploy

```bash
# From local machine
npm run build
vercel --prod

# Or push to main branch (auto-deploys)
git push origin main
```

### 4. Configure Custom Domain (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### 5. Update Google OAuth Redirect

1. Go to Google Cloud Console → **Credentials**
2. Edit OAuth client
3. Add production URLs:
   - **Authorized JavaScript origins**: `https://yourdomain.com`
   - **Authorized redirect URIs**: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

---

## Post-Deployment Verification

### 1. Test Authentication

- [ ] Visit your deployed app
- [ ] Click "Sign in with Google"
- [ ] Verify redirect to dashboard
- [ ] Check Supabase **Authentication** → **Users** for new user

### 2. Test Payment Flow (Test Mode)

- [ ] Click "Upgrade" or go to `/pricing`
- [ ] Select a tier (Starter/Premium/Gold)
- [ ] Complete checkout with test card: `4242 4242 4242 4242`
- [ ] Verify redirect to dashboard with success message
- [ ] Check Supabase `subscriptions` table for new entry
- [ ] Verify Stripe webhook received in **Developers** → **Webhooks**

### 3. Test Subscription Features

- [ ] Verify tier-appropriate features are unlocked
- [ ] Test feature gates (try accessing premium feature with starter tier)
- [ ] Check audit logs in Supabase

### 4. Test Error Handling

- [ ] Trigger a JavaScript error (e.g., access undefined property in console)
- [ ] Verify Error Boundary catches it and shows fallback UI
- [ ] Check browser console for error logs

### 5. Performance Check

- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Target scores:
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 80

---

## Monitoring & Maintenance

### 1. Error Monitoring (Recommended)

**Setup Sentry:**

```bash
npm install @sentry/react @sentry/tracing
```

Add to `src/index.js`:

```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. Database Backups

1. Enable Point-in-Time Recovery (PITR) in Supabase
2. Go to **Settings** → **Database** → **Backups**
3. Enable daily backups
4. Test restore process monthly

### 3. Monitor Stripe Webhooks

1. Check **Developers** → **Webhooks** regularly
2. Verify success rate > 95%
3. Investigate any failures in `stripe_events` table

### 4. Review Audit Logs

```sql
-- Check recent user actions
SELECT * FROM audit_logs
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### 5. Monitor Uptime

**Recommended Tools:**
- **UptimeRobot** (free) - https://uptimerobot.com
- **Pingdom** - https://pingdom.com
- **Better Uptime** - https://betteruptime.com

### 6. Security Checklist (Weekly)

- [ ] Review Supabase audit logs for unauthorized access
- [ ] Check Stripe for unusual payment patterns
- [ ] Verify RLS policies are active on all tables
- [ ] Review Vercel deployment logs for errors
- [ ] Update dependencies: `npm audit fix`

---

## Troubleshooting

### Issue: "Supabase not configured" error

**Solution:** Check `.env.local` has correct values and restart dev server

### Issue: Stripe checkout fails

**Solution:**
1. Verify Edge Function deployed: `supabase functions list`
2. Check function logs: `supabase functions logs create-checkout-session`
3. Verify price IDs are correct in secrets

### Issue: Webhook not receiving events

**Solution:**
1. Verify webhook URL is correct in Stripe Dashboard
2. Check signing secret matches: `supabase secrets list`
3. Test with Stripe CLI: `stripe listen --forward-to https://...`

### Issue: User can't sign in with Google

**Solution:**
1. Verify OAuth credentials in Google Cloud Console
2. Check redirect URI matches exactly
3. Ensure Google+ API is enabled
4. Wait 5 minutes after configuration changes

### Issue: Build fails on Vercel

**Solution:**
1. Check Vercel build logs for specific error
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check for missing dependencies

---

## Security Best Practices

### Production Checklist

Before going live with real users:

- [ ] **Rotate all API keys** exposed in git history (see SECURITY.md)
- [ ] **Force push** cleaned git history to remote
- [ ] **Enable RLS** on all database tables (already done in migration)
- [ ] **Review CORS** settings in Edge Functions (_shared/cors.ts)
- [ ] **Enable HTTPS** only (done automatically by Vercel)
- [ ] **Set up monitoring** (Sentry, LogRocket, or similar)
- [ ] **Test payment flow** end-to-end with test cards
- [ ] **Create Privacy Policy** and Terms of Service
- [ ] **Add cookie consent banner** (for GDPR compliance)
- [ ] **Implement rate limiting** on Edge Functions
- [ ] **Enable 2FA** on all service accounts (GitHub, Supabase, Stripe, Vercel)
- [ ] **Document recovery procedures** (what to do if Supabase goes down)
- [ ] **Set up automated backups** and test restore process
- [ ] **Add CSP headers** (already in vercel.json)
- [ ] **Test with real payment** in live mode (after switching from test mode)

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Google OAuth Guide**: /docs/GOOGLE_OAUTH_SETUP.md
- **Stripe Setup Guide**: /docs/STRIPE_SETUP_GUIDE.md
- **Gap Analysis**: /PRODUCTION_READINESS_GAP_ANALYSIS.md

---

## Next Steps After Setup

1. ✅ Setup complete
2. ⏭️ Write unit tests (see gap analysis)
3. ⏭️ Add Privacy Policy & Terms of Service
4. ⏭️ Optimize performance (remove Tailwind CDN)
5. ⏭️ Beta test with 10-20 users
6. ⏭️ Gather feedback and iterate
7. ⏭️ Launch! 🚀

---

**Last Updated**: December 22, 2025
**Maintainer**: DualTrack OS Team
