# Edge Functions Deployment Guide

This guide covers deploying Supabase Edge Functions to production for DualTrack OS.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Supabase project created ([dashboard.supabase.com](https://dashboard.supabase.com))
- [ ] Stripe account with API keys
- [ ] Database schema deployed (see `/supabase/migrations/`)
- [ ] Environment variables configured

---

## 🚀 Quick Deploy (Production)

```bash
# 1. Login to Supabase
supabase login

# 2. Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# 3. Deploy all Edge Functions
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook

# 4. Set secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

---

## 📖 Detailed Step-by-Step Guide

### Step 1: Install Supabase CLI

```bash
# Install globally
npm install -g supabase

# Verify installation
supabase --version
# Should show: supabase 1.x.x
```

### Step 2: Create Supabase Project

1. Go to [dashboard.supabase.com](https://dashboard.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: DualTrack OS Production
   - **Database Password**: (generate strong password, save it!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### Step 3: Get Project Reference

1. In Supabase Dashboard, go to **Settings → General**
2. Copy your **Project Reference ID** (e.g., `abcdefghijklmnop`)
3. Save this - you'll need it for linking

### Step 4: Link Local Project to Production

```bash
# Navigate to your project
cd /path/to/DualTrackOS

# Link to Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# You'll be prompted to enter your database password
# (the one you created in Step 2)
```

**Expected Output**:
```
Linked to project YOUR_PROJECT_REF
```

### Step 5: Deploy Database Schema

Before deploying Edge Functions, deploy your database schema:

```bash
# Push migrations to production
supabase db push

# Verify tables were created
supabase db remote list
```

**Expected Tables**:
- `user_data`
- `subscriptions`
- `audit_logs`
- `stripe_events`

### Step 6: Configure Stripe

#### 6.1 Get Stripe API Keys

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Switch to **LIVE MODE** (toggle in top-right)
3. Go to **Developers → API Keys**
4. Copy:
   - **Publishable key**: `pk_live_xxxxx` (for frontend)
   - **Secret key**: `sk_live_xxxxx` (for Edge Functions)

#### 6.2 Create Webhook

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL to:
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret**: `whsec_xxxxx`

### Step 7: Set Environment Secrets

Edge Functions use secrets for sensitive values. Set them in production:

```bash
# Set Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY

# Set Stripe webhook secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET

# Set Supabase service role key (from Dashboard → Settings → API)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Verify secrets are set (will show names only, not values)
supabase secrets list
```

**Expected Output**:
```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
SUPABASE_SERVICE_ROLE_KEY
```

### Step 8: Deploy Edge Functions

Deploy each function individually:

```bash
# Deploy create-checkout-session function
supabase functions deploy create-checkout-session

# Expected output:
# Deploying create-checkout-session (project ref: YOUR_PROJECT_REF)
# Deployed create-checkout-session (status: ACTIVE)

# Deploy stripe-webhook function
supabase functions deploy stripe-webhook

# Expected output:
# Deploying stripe-webhook (project ref: YOUR_PROJECT_REF)
# Deployed stripe-webhook (status: ACTIVE)
```

**Function URLs**:
- Create Checkout: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-checkout-session`
- Stripe Webhook: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`

### Step 9: Update Frontend Environment Variables

Update your Vercel/frontend deployment with production values:

```bash
# In Vercel Dashboard → Settings → Environment Variables
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY_FROM_DASHBOARD
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
```

Or in `.env.production`:
```env
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
```

### Step 10: Test in Production

#### 10.1 Test Checkout Flow

1. Deploy frontend to production (Vercel)
2. Navigate to pricing page
3. Click "Upgrade to Starter"
4. Complete checkout with Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
5. Verify:
   - Redirected to success page
   - Subscription created in Stripe Dashboard
   - Subscription saved in `subscriptions` table (check Supabase Table Editor)

#### 10.2 Test Webhook

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Find your webhook endpoint
3. Click **Send test webhook**
4. Select `checkout.session.completed`
5. Verify:
   - Response status: 200 OK
   - Event logged in `stripe_events` table
   - Subscription status updated in `subscriptions` table

#### 10.3 Check Logs

```bash
# View Edge Function logs
supabase functions logs create-checkout-session --tail

# View webhook logs
supabase functions logs stripe-webhook --tail
```

Look for:
- ✅ `200 OK` responses
- ✅ No authentication errors
- ✅ No database errors

---

## 🔧 Troubleshooting

### Error: "Invalid JWT"

**Symptom**: 401 Unauthorized when calling Edge Function

**Solution**:
```bash
# Ensure you're passing the Supabase auth token
fetch('https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-checkout-session', {
  headers: {
    'Authorization': `Bearer ${session.access_token}` // ← This is required
  }
})
```

### Error: "Stripe API key invalid"

**Symptom**: Stripe errors in function logs

**Solution**:
```bash
# Verify you set the LIVE key, not test key
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxxxx  # NOT sk_test_

# Redeploy functions after updating secrets
supabase functions deploy create-checkout-session
```

### Error: "Webhook signature verification failed"

**Symptom**: 400 Bad Request on webhook endpoint

**Solution**:
```bash
# Ensure webhook secret matches Stripe dashboard
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Redeploy webhook function
supabase functions deploy stripe-webhook
```

### Error: "Row Level Security policy violation"

**Symptom**: Cannot insert into subscriptions table

**Solution**:
Webhook needs to use service role key:
```typescript
// In stripe-webhook/index.ts
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // ← Service role, not anon key
  { auth: { persistSession: false } }
)
```

### Error: "Function not found"

**Symptom**: 404 when calling Edge Function

**Solution**:
```bash
# Verify function is deployed
supabase functions list

# If not listed, redeploy
supabase functions deploy YOUR_FUNCTION_NAME
```

### Webhook Not Receiving Events

**Symptom**: Stripe events sent but not processed

**Checklist**:
1. ✅ Webhook URL correct in Stripe Dashboard
2. ✅ Webhook events selected (checkout.session.completed, etc.)
3. ✅ Edge Function deployed successfully
4. ✅ STRIPE_WEBHOOK_SECRET matches Stripe Dashboard
5. ✅ No CORS issues (Edge Functions handle CORS automatically)

**Debug**:
```bash
# Check function logs for errors
supabase functions logs stripe-webhook --tail

# In Stripe Dashboard → Webhooks → Your endpoint
# Click individual events to see request/response
```

---

## 🔄 Updating Edge Functions

When you make changes to Edge Functions:

```bash
# 1. Edit function locally
# /supabase/functions/YOUR_FUNCTION/index.ts

# 2. Test locally (optional but recommended)
supabase functions serve YOUR_FUNCTION

# 3. Deploy updated function
supabase functions deploy YOUR_FUNCTION

# 4. Verify deployment
supabase functions list
# Should show updated timestamp

# 5. Check logs for any errors
supabase functions logs YOUR_FUNCTION --tail
```

**Important**: Edge Functions deploy in seconds. No downtime required.

---

## 📊 Monitoring

### View Function Logs

```bash
# Real-time logs
supabase functions logs create-checkout-session --tail

# Last 100 log lines
supabase functions logs stripe-webhook --limit 100

# Filter by error level
supabase functions logs stripe-webhook --level error
```

### Metrics in Supabase Dashboard

1. Go to **Edge Functions** in Dashboard
2. Click function name
3. View:
   - Request count
   - Error rate
   - Latency (p50, p95, p99)
   - Memory usage

### Set Up Alerts

**Recommended**:
- Alert on error rate > 5%
- Alert on latency > 1000ms
- Alert on webhook failures

**How**:
1. Integrate Sentry with Edge Functions (see SENTRY_INTEGRATION.md)
2. Configure alert rules in Sentry dashboard

---

## 🔐 Security Checklist

Before going live:

- [ ] All secrets set using `supabase secrets set` (never hardcode)
- [ ] Service role key kept secret (never expose in frontend)
- [ ] Webhook signature verification enabled
- [ ] CORS configured properly (default is secure)
- [ ] RLS policies enabled on all tables
- [ ] Edge Functions using least-privilege service accounts
- [ ] Logs reviewed for security warnings
- [ ] Rate limiting considered (if needed)

---

## 💰 Cost Estimates

**Supabase Edge Functions**:
- Free tier: 500K function invocations/month
- Paid: $10 per 2M invocations

**Expected Usage** (10,000 active users):
- Checkout sessions: ~1,000/month (upgrades)
- Webhooks: ~5,000/month (subscription events)
- **Total**: ~6,000/month = **FREE**

**Scaling**: Even at 100K users, still within free tier.

---

## 📚 Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Runtime Reference](https://deno.land/manual)
- [Stripe Webhook Guide](https://stripe.com/docs/webhooks)
- [Database Migrations Guide](./supabase/README.md)

---

## ✅ Deployment Checklist

Use this checklist for production deployment:

### Pre-Deployment
- [ ] Supabase project created
- [ ] Database migrations run
- [ ] RLS policies tested
- [ ] Stripe account in live mode
- [ ] Webhook endpoint created in Stripe
- [ ] All secrets documented

### Deployment
- [ ] Edge Functions deployed
- [ ] Secrets set in production
- [ ] Frontend environment variables updated
- [ ] DNS configured (if using custom domain)

### Post-Deployment
- [ ] Test checkout flow end-to-end
- [ ] Verify webhook processing
- [ ] Check function logs for errors
- [ ] Monitor for first 24 hours
- [ ] Set up alerts

### Documentation
- [ ] Document function URLs
- [ ] Save webhook signing secret
- [ ] Update runbook with troubleshooting steps
- [ ] Share credentials with team (using password manager)

---

**Last Updated**: December 22, 2025
**Maintained by**: DualTrack OS Team
