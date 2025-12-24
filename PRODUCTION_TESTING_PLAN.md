# DualTrack OS - Production Testing & Verification Plan

**Goal**: Verify all systems work together before launching to real users
**Focus**: Stripe + Vercel + Supabase integration, security, production readiness

---

## 🎯 Testing Strategy

### Phase 1: Local Testing (30 min)
Verify everything works locally before deploying

### Phase 2: Staging Testing (1 hour)
Deploy to Vercel, test with Stripe test mode

### Phase 3: Security Audit (30 min)
Review all security configurations

### Phase 4: Production Verification (30 min)
Final checks before going live

**Total Time**: ~2.5 hours

---

## 📋 Phase 1: Local Testing

### 1.1 Environment Variables Check

**Verify `.env.local` has all required values:**

```bash
# Run this command to check
cat .env.local
```

**Expected values**:
```bash
REACT_APP_SUPABASE_URL=https://[your-project].supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
REACT_APP_SENTRY_DSN=https://[your-sentry-dsn]@sentry.io/[project-id]
REACT_APP_SENTRY_ENABLED=true
REACT_APP_VERSION=1.0.0
```

**Checklist**:
- [ ] All variables present
- [ ] No placeholder values (e.g., "your-key-here")
- [ ] Supabase URL starts with `https://`
- [ ] Anon key starts with `eyJ`
- [ ] Stripe key starts with `pk_test_` or `pk_live_`

---

### 1.2 Local Build Test

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Run build
npm run build

# Check for errors
echo $?  # Should output: 0
```

**Checklist**:
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Build output is in `/build` folder
- [ ] Build size is reasonable (<5MB for main bundle)

---

### 1.3 Local Runtime Test

```bash
# Start dev server
npm start
```

**Test Scenarios**:

**Test 1: Basic App Load**
- [ ] App loads without console errors
- [ ] Landing page displays correctly
- [ ] Logo and branding appear
- [ ] Dark mode toggle works
- [ ] "Enter Here" button works

**Test 2: Onboarding Flow**
- [ ] Click "Enter Here" from landing page
- [ ] Onboarding screens load
- [ ] Can select life stage (if implemented) or age range
- [ ] Can enter name, age, weight
- [ ] kg/lbs toggle works
- [ ] Can select avatar
- [ ] Completes successfully and redirects to dashboard

**Test 3: Dashboard**
- [ ] Dashboard loads
- [ ] Bottom navigation visible (4 tabs)
- [ ] Energy tracking works (or daily check-in if implemented)
- [ ] Mood tracking works
- [ ] Training suggestions display
- [ ] Nutrition tracking works
- [ ] Wellness menu opens

**Test 4: Sentry Integration**
- [ ] Open browser console
- [ ] Look for Sentry initialization message
- [ ] Trigger a test error (click Sentry feedback widget if visible)
- [ ] Check Sentry dashboard for event

---

## 📋 Phase 2: Staging Testing (Vercel)

### 2.1 Deploy to Vercel

**Prerequisites**:
- [ ] Vercel account created
- [ ] Project connected to GitHub
- [ ] Environment variables set (see `VERCEL_SECRETS_QUICKREF.md`)

**Deploy**:
```bash
# Option 1: Push to GitHub (auto-deploy if enabled)
git push origin claude/strong50-lifestage-eKpTu

# Option 2: Manual deploy via CLI
vercel --prod
```

**Checklist**:
- [ ] Deployment succeeds
- [ ] No build errors in Vercel logs
- [ ] Deployment URL is accessible (e.g., https://dualtrack-os.vercel.app)

---

### 2.2 Test Deployed Frontend

**Navigate to your Vercel URL** (e.g., `https://dualtrack-os.vercel.app`)

**Test 1: Production Build**
- [ ] App loads without errors
- [ ] All images load correctly
- [ ] No broken links
- [ ] Performance is acceptable (<3s initial load)

**Test 2: Supabase Connection**
- [ ] Open browser console
- [ ] Check for Supabase connection errors
- [ ] Try Google sign-in (if OAuth is set up)
- [ ] Create test account and log in
- [ ] Verify user session persists after page refresh

**Test 3: Data Persistence**
- [ ] Complete onboarding with test account
- [ ] Enter some data (energy tracking, mood, etc.)
- [ ] Refresh page
- [ ] Verify data persists
- [ ] Log out and log back in
- [ ] Verify data still present

---

### 2.3 Test Stripe Integration (Test Mode)

**Prerequisites**:
- [ ] Stripe account created
- [ ] Test products/prices created in Stripe Dashboard
- [ ] Edge Functions deployed to Supabase (see `EDGE_FUNCTIONS_DEPLOYMENT.md`)
- [ ] STRIPE_SECRET_KEY set in Supabase secrets (test key: `sk_test_...`)
- [ ] STRIPE_PUBLISHABLE_KEY set in Vercel env vars (test key: `pk_test_...`)

**Test Stripe Checkout Flow**:

**Step 1: Navigate to Pricing Page**
- [ ] Click on "Upgrade" or navigate to `/pricing`
- [ ] Verify pricing tiers display (Starter, Premium, Gold)
- [ ] Verify monthly/annual toggle works

**Step 2: Start Checkout**
- [ ] Click "Subscribe" on any tier
- [ ] Verify redirect to Stripe Checkout
- [ ] Verify Stripe Checkout page loads (should show Stripe branding)

**Step 3: Complete Test Payment**
Use **Stripe test card**: `4242 4242 4242 4242`
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Checklist**:
- [ ] Test card is accepted
- [ ] No errors during checkout
- [ ] Redirects back to success URL (`/dashboard?session_id=...&upgrade_success=true`)
- [ ] Success message displays

**Step 4: Verify Subscription Created**
- [ ] Check Stripe Dashboard → Customers
- [ ] Verify test customer created
- [ ] Check Stripe Dashboard → Subscriptions
- [ ] Verify subscription is active
- [ ] Check Supabase Dashboard → Table Editor → `subscriptions`
- [ ] Verify row created with correct data

---

### 2.4 Test Stripe Webhooks

**Prerequisites**:
- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] Endpoint URL: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
- [ ] Events selected: All `checkout.*`, `customer.*`, `invoice.*`
- [ ] STRIPE_WEBHOOK_SECRET set in Supabase secrets

**Test Webhook Delivery**:

**Option 1: Trigger Events via Stripe Dashboard**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Select event: `checkout.session.completed`
5. Click "Send test webhook"

**Checklist**:
- [ ] Webhook receives event (check Stripe webhook logs)
- [ ] Supabase function processes event (check Supabase logs)
- [ ] No errors in Supabase function logs
- [ ] Event marked as processed in `stripe_events` table

**Option 2: Trigger Real Events via Stripe CLI**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local Supabase (if testing locally)
stripe listen --forward-to https://[your-project].supabase.co/functions/v1/stripe-webhook

# Trigger test event
stripe trigger checkout.session.completed
```

**Checklist**:
- [ ] Event received by webhook
- [ ] Supabase function processes successfully
- [ ] Database updated correctly

---

### 2.5 Test Edge Functions Directly

**Test create-checkout-session**:

```bash
# Get a user auth token first (from browser console after logging in):
# localStorage.getItem('supabase.auth.token')

curl -i --location --request POST \
  'https://[your-project].supabase.co/functions/v1/create-checkout-session' \
  --header 'Authorization: Bearer YOUR_USER_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "tier": "starter",
    "billingPeriod": "monthly"
  }'
```

**Expected Response**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

**Checklist**:
- [ ] Returns 200 status
- [ ] Returns sessionId and url
- [ ] URL is valid Stripe checkout link

**Test Errors**:

```bash
# Test missing auth token
curl -i --location --request POST \
  'https://[your-project].supabase.co/functions/v1/create-checkout-session' \
  --header 'Content-Type: application/json' \
  --data '{
    "tier": "starter",
    "billingPeriod": "monthly"
  }'
```

**Expected**: 401 Unauthorized

**Checklist**:
- [ ] Returns 401 for missing auth
- [ ] Returns 400 for invalid tier
- [ ] Returns 400 for missing billingPeriod

---

## 📋 Phase 3: Security Audit

### 3.1 API Key Security

**Supabase API Keys**:

**Checklist**:
- [ ] ✅ `REACT_APP_SUPABASE_ANON_KEY` is in frontend (safe - designed to be public)
- [ ] ✅ `REACT_APP_SUPABASE_URL` is in frontend (safe - public)
- [ ] ❌ `SUPABASE_SERVICE_ROLE_KEY` is NEVER in frontend (should be in Edge Functions only)
- [ ] All API keys rotated before launch (see Action 3 in `PRODUCTION_STATUS_CURRENT.md`)

**Stripe API Keys**:

**Checklist**:
- [ ] ✅ `REACT_APP_STRIPE_PUBLISHABLE_KEY` is in frontend (safe - designed to be public)
- [ ] ❌ `STRIPE_SECRET_KEY` is NEVER in frontend (should be in Edge Functions only)
- [ ] ❌ `STRIPE_WEBHOOK_SECRET` is NEVER in frontend (should be in Edge Functions only)
- [ ] Using TEST keys for staging (`pk_test_...`, `sk_test_...`)
- [ ] Plan to switch to LIVE keys before production (`pk_live_...`, `sk_live_...`)

**Sentry DSN**:
- [ ] ✅ `REACT_APP_SENTRY_DSN` is in frontend (safe - designed to be public)

---

### 3.2 Row Level Security (RLS) Verification

**Check Supabase RLS Policies**:

1. Go to Supabase Dashboard → Table Editor
2. For each table, verify RLS is enabled:

**Table: `user_data`**
- [ ] RLS enabled
- [ ] Policy: Users can SELECT their own data (`auth.uid() = id`)
- [ ] Policy: Users can INSERT their own data (`auth.uid() = id`)
- [ ] Policy: Users can UPDATE their own data (`auth.uid() = id`)
- [ ] Policy: Users can DELETE their own data (`auth.uid() = id`)

**Table: `subscriptions`**
- [ ] RLS enabled
- [ ] Policy: Users can SELECT their own subscriptions (`auth.uid() = user_id`)
- [ ] Policy: Service role can INSERT/UPDATE/DELETE (for webhooks)

**Table: `stripe_events`**
- [ ] RLS enabled
- [ ] Policy: Only service role can access (webhooks only)

**Table: `audit_logs`**
- [ ] RLS enabled
- [ ] Policy: Users can SELECT their own logs (`auth.uid() = user_id`)
- [ ] Policy: Service role can INSERT (for audit trail)

---

### 3.3 Frontend Security Headers

**Check Vercel Headers** (configured in `vercel.json`):

```bash
# Test headers with curl
curl -I https://your-app.vercel.app
```

**Expected Headers**:
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains`

**Already configured in `vercel.json`**: ✅

---

### 3.4 Authentication Security

**Test Auth Flows**:

**Test 1: Unauthorized Access**
- [ ] Navigate to `/dashboard` without logging in
- [ ] Should redirect to landing page or show "Please sign in"
- [ ] Cannot access protected routes without auth

**Test 2: Session Persistence**
- [ ] Log in
- [ ] Close browser
- [ ] Reopen browser
- [ ] Navigate to app
- [ ] Should still be logged in (session persists)

**Test 3: Logout**
- [ ] Click logout
- [ ] Verify localStorage cleared
- [ ] Verify Supabase session cleared
- [ ] Cannot access dashboard after logout

**Test 4: Token Expiration**
- [ ] Log in
- [ ] Wait for token to expire (or manually expire in Supabase Dashboard)
- [ ] Try to access protected resource
- [ ] Should prompt to log in again

---

### 3.5 Input Validation & XSS Protection

**Test User Input Fields**:

**Test 1: Name Input** (in Onboarding)
```javascript
// Try entering:
<script>alert('XSS')</script>
```
- [ ] Script does not execute
- [ ] Input is sanitized/escaped
- [ ] Displays as plain text

**Test 2: SQL Injection** (if using raw SQL anywhere)
```javascript
// Try entering in any text field:
' OR '1'='1
```
- [ ] No SQL errors
- [ ] Input treated as plain text

**Test 3: Long Inputs**
```javascript
// Enter 10,000 character string in name field
```
- [ ] App doesn't crash
- [ ] Input is truncated or rejected
- [ ] Validation error shows

---

### 3.6 HTTPS Enforcement

**Checklist**:
- [ ] Vercel automatically enforces HTTPS (all HTTP → HTTPS redirect)
- [ ] Supabase uses HTTPS for all endpoints
- [ ] Stripe Checkout uses HTTPS
- [ ] No mixed content warnings in browser console

---

### 3.7 Environment Variables Audit

**Check for Exposed Secrets**:

```bash
# Search codebase for hardcoded secrets
grep -r "sk_live_" src/
grep -r "sk_test_" src/
grep -r "whsec_" src/
grep -r "service_role" src/
```

**Expected**: No results (all secrets should be in env files, not code)

**Checklist**:
- [ ] No hardcoded API keys in source code
- [ ] No secrets committed to Git (check `.gitignore`)
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.production` is in `.gitignore` (if exists)

---

## 📋 Phase 4: Production Verification

### 4.1 Database Migration Verification

**Check Database Tables**:

1. Go to Supabase Dashboard → Table Editor
2. Verify all required tables exist:

**Checklist**:
- [ ] `user_data` table exists
- [ ] `subscriptions` table exists
- [ ] `stripe_events` table exists
- [ ] `audit_logs` table exists

**If any missing**, run database migration:
```bash
supabase db push
```

---

### 4.2 Edge Functions Deployment Verification

**Check Deployed Functions**:

1. Go to Supabase Dashboard → Edge Functions
2. Verify functions are deployed:

**Checklist**:
- [ ] `create-checkout-session` deployed
- [ ] `stripe-webhook` deployed
- [ ] Both functions show "Deployed" status
- [ ] No deployment errors

**Check Secrets**:

```bash
# List configured secrets
supabase secrets list
```

**Expected secrets** (9 total):
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] STRIPE_STARTER_MONTHLY_PRICE_ID
- [ ] STRIPE_STARTER_ANNUAL_PRICE_ID
- [ ] STRIPE_PREMIUM_MONTHLY_PRICE_ID
- [ ] STRIPE_PREMIUM_ANNUAL_PRICE_ID
- [ ] STRIPE_GOLD_MONTHLY_PRICE_ID
- [ ] STRIPE_GOLD_ANNUAL_PRICE_ID

**If any missing**, see `EDGE_FUNCTIONS_ENV_CHECKLIST.md`

---

### 4.3 Vercel Deployment Verification

**Check Vercel Settings**:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Checklist**:
- [ ] `supabase_url` secret set (all 3 environments)
- [ ] `supabase_anon_key` secret set (all 3 environments)
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` env var set
- [ ] `REACT_APP_SENTRY_DSN` env var set (if using Sentry)

**Check Deployment**:
- [ ] Latest deployment is successful
- [ ] Production URL is live
- [ ] No build errors
- [ ] No runtime errors in logs

---

### 4.4 Stripe Configuration Verification

**Stripe Dashboard Checks**:

1. Go to https://dashboard.stripe.com

**Products & Prices**:
- [ ] 3 products created (Starter, Premium, Gold)
- [ ] 6 prices created (2 per product: monthly + annual)
- [ ] All prices are active
- [ ] Correct amounts set

**Webhooks**:
- [ ] Webhook endpoint created
- [ ] Endpoint URL: `https://[project].supabase.co/functions/v1/stripe-webhook`
- [ ] All required events selected:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.paid`
  - [ ] `invoice.payment_failed`
- [ ] Webhook secret copied to Supabase secrets

**API Keys**:
- [ ] Publishable key starts with `pk_test_` (staging) or `pk_live_` (production)
- [ ] Secret key starts with `sk_test_` (staging) or `sk_live_` (production)

---

### 4.5 Legal Compliance Verification

**Legal Documents**:
- [ ] Privacy Policy created (`legal/PRIVACY_POLICY.md`)
- [ ] Terms of Service created (`legal/TERMS_OF_SERVICE.md`)
- [ ] Both docs customized (no placeholders left)
- [ ] Attorney review completed (or scheduled)

**Frontend Links**:
- [ ] Privacy Policy link in footer
- [ ] Terms of Service link in footer
- [ ] Both links work and display correct content

---

### 4.6 Monitoring & Error Tracking

**Sentry**:
- [ ] Sentry project created
- [ ] DSN configured in environment variables
- [ ] Sentry initialized in app (check browser console)
- [ ] Test error sent to Sentry
- [ ] Error appears in Sentry dashboard
- [ ] Session replay enabled (if desired)

**Supabase Logs**:
- [ ] Know how to access Supabase logs (Dashboard → Logs)
- [ ] Can filter by Edge Function
- [ ] Can see recent errors (if any)

**Vercel Logs**:
- [ ] Know how to access Vercel logs (Dashboard → Deployments → Click deployment)
- [ ] Can see build logs
- [ ] Can see runtime logs (if any)

---

## 🧪 End-to-End Test Scenarios

### Scenario 1: New User Signup & Subscription

**Flow**:
1. Navigate to landing page
2. Click "Sign in with Google" (or create account if no OAuth)
3. Complete onboarding (name, age, weight, avatar)
4. Navigate to dashboard
5. Enter energy/mood data
6. Navigate to pricing page
7. Click "Subscribe" on Starter tier (monthly)
8. Complete Stripe checkout with test card
9. Verify redirect back to dashboard
10. Verify subscription status updated

**Checklist**:
- [ ] All steps complete without errors
- [ ] User can access dashboard after checkout
- [ ] Subscription visible in Stripe Dashboard
- [ ] Subscription row created in Supabase `subscriptions` table
- [ ] Audit log created in `audit_logs` table

---

### Scenario 2: Existing User Upgrade

**Flow**:
1. Log in as existing free user
2. Navigate to pricing page
3. Click "Upgrade" on Premium tier (annual)
4. Complete Stripe checkout
5. Verify redirect back to dashboard
6. Verify new subscription replaces old

**Checklist**:
- [ ] Upgrade completes successfully
- [ ] Old subscription canceled (if applicable)
- [ ] New subscription active
- [ ] User charged correct amount (check Stripe Dashboard)

---

### Scenario 3: Failed Payment

**Flow**:
1. Navigate to pricing page
2. Click "Subscribe" on any tier
3. Use Stripe **test card for declined payment**: `4000 0000 0000 0002`
4. Verify error message displays
5. Verify no subscription created

**Checklist**:
- [ ] Stripe shows payment failed
- [ ] User not charged
- [ ] No subscription created in database
- [ ] User can retry with valid card

---

### Scenario 4: Webhook Retry

**Flow**:
1. Simulate webhook failure (temporarily disable `stripe-webhook` function)
2. Complete a checkout (subscription created in Stripe)
3. Verify webhook delivery failed (check Stripe webhook logs)
4. Re-enable `stripe-webhook` function
5. Manually retry webhook from Stripe Dashboard
6. Verify webhook now succeeds

**Checklist**:
- [ ] Webhook retry works
- [ ] Subscription eventually synced to database
- [ ] No duplicate subscriptions created (idempotency works)

---

## 🚨 Critical Issues Checklist

**Before launching to production, verify NONE of these are true**:

- [ ] ❌ SUPABASE_SERVICE_ROLE_KEY exposed in frontend code
- [ ] ❌ STRIPE_SECRET_KEY exposed in frontend code
- [ ] ❌ No RLS policies on `subscriptions` table (allows anyone to see all subscriptions)
- [ ] ❌ Hardcoded API keys in source code
- [ ] ❌ `.env.local` committed to Git
- [ ] ❌ Edge Functions not deployed (payments won't work)
- [ ] ❌ Database migration not run (Edge Functions will error)
- [ ] ❌ Stripe webhook not configured (subscriptions won't update)
- [ ] ❌ No error monitoring (you won't know if things break)
- [ ] ❌ No legal docs (liable for user data issues)

**If ANY of these are true, STOP and fix before launching.**

---

## ✅ Production Readiness Sign-Off

**Only proceed to production if ALL of these are true**:

### Technical
- [ ] All tests in Phase 1 pass (local testing)
- [ ] All tests in Phase 2 pass (staging testing)
- [ ] All checks in Phase 3 pass (security audit)
- [ ] All checks in Phase 4 pass (production verification)
- [ ] All end-to-end scenarios work
- [ ] No critical issues found

### Business
- [ ] Legal docs reviewed by attorney
- [ ] Privacy Policy & Terms of Service published
- [ ] Support email/system in place
- [ ] Plan for handling customer inquiries
- [ ] Refund process defined and documented

### Monitoring
- [ ] Sentry configured and tested
- [ ] Error alerts set up (email/Slack)
- [ ] Database backups enabled (Supabase auto-backup)
- [ ] Uptime monitoring in place (optional: UptimeRobot, Pingdom)

---

## 🎯 Testing Timeline

| Phase | Duration | Can Do In Parallel? |
|-------|----------|---------------------|
| Phase 1: Local Testing | 30 min | No (prerequisite) |
| Phase 2: Staging Testing | 1 hour | No (needs Phase 1) |
| Phase 3: Security Audit | 30 min | Yes (can do during Phase 2) |
| Phase 4: Production Verification | 30 min | Yes (can do during Phase 2) |

**Total Minimum Time**: 1.5 hours (if running phases in parallel)
**Total Sequential Time**: 2.5 hours (if running phases one after another)

---

## 📞 Next Steps

1. **Start with Phase 1** (local testing) - 30 minutes
2. **Deploy to Vercel** and complete Phase 2 (staging testing) - 1 hour
3. **Run security audit** (Phase 3) while testing - 30 minutes
4. **Verify production config** (Phase 4) - 30 minutes
5. **Fix any issues found**
6. **Sign off on production readiness**
7. **Launch to beta users!** 🚀

---

**Ready to start testing? Begin with Phase 1.** ✅
