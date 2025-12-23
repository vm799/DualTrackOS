# Edge Functions Environment Variables Checklist

**Use this checklist to verify all required environment secrets are configured for Edge Functions deployment.**

---

## ⚠️ Critical: All These Variables Must Be Set

Edge Functions deployment will FAIL if any required secrets are missing. Use this checklist to verify configuration.

---

## 1. Stripe Configuration (Required)

### Core Stripe Secrets

```bash
# Set these with: supabase secrets set KEY=value

✅ STRIPE_SECRET_KEY
   Value: [your stripe secret key here - starts with sk_live_ or sk_test_]
   Where to get: https://dashboard.stripe.com/apikeys
   Used by: create-checkout-session, stripe-webhook

✅ STRIPE_WEBHOOK_SECRET
   Value: [your webhook secret here - starts with whsec_]
   Where to get: https://dashboard.stripe.com/webhooks
   Used by: stripe-webhook
   NOTE: You must create the webhook endpoint FIRST, then get this secret
```

### Stripe Price IDs (Required - 6 total)

Create products and prices in Stripe Dashboard first, then set these:

```bash
# Starter Tier
✅ STRIPE_STARTER_MONTHLY_PRICE_ID
   Value: price_xxxxxxxxxxxxxxxxxxxxxxxx
   Product: DualTrack OS Starter (Monthly)

✅ STRIPE_STARTER_ANNUAL_PRICE_ID
   Value: price_xxxxxxxxxxxxxxxxxxxxxxxx
   Product: DualTrack OS Starter (Annual)

# Premium Tier
✅ STRIPE_PREMIUM_MONTHLY_PRICE_ID
   Value: price_xxxxxxxxxxxxxxxxxxxxxxxx
   Product: DualTrack OS Premium (Monthly)

✅ STRIPE_PREMIUM_ANNUAL_PRICE_ID
   Value: price_xxxxxxxxxxxxxxxxxxxxxxxx
   Product: DualTrack OS Premium (Annual)

# Gold Tier
✅ STRIPE_GOLD_MONTHLY_PRICE_ID
   Value: price_xxxxxxxxxxxxxxxxxxxxxxxx
   Product: DualTrack OS Gold (Monthly)

✅ STRIPE_GOLD_ANNUAL_PRICE_ID
   Value: price_xxxxxxxxxxxxxxxxxxxxxxxx
   Product: DualTrack OS Gold (Annual)
```

**How to create Stripe products/prices:**
1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Create product for each tier (Starter, Premium, Gold)
4. Add two prices per product: monthly and annual
5. Copy each Price ID (starts with `price_`)

---

## 2. Supabase Configuration (Required)

```bash
✅ SUPABASE_SERVICE_ROLE_KEY
   Value: [your service role key here - starts with eyJ...]
   Where to get: Supabase Dashboard → Settings → API → service_role key
   Used by: create-checkout-session, stripe-webhook
   WARNING: Keep this secret! Never expose in frontend code

# These are auto-provided by Supabase (no need to set manually):
✓ SUPABASE_URL (automatically injected)
✓ SUPABASE_ANON_KEY (automatically injected)
```

---

## 3. Verification Commands

### Check which secrets are currently set

```bash
# List all configured secrets
supabase secrets list

# You should see all 9 required secrets:
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
# - SUPABASE_SERVICE_ROLE_KEY
# - STRIPE_STARTER_MONTHLY_PRICE_ID
# - STRIPE_STARTER_ANNUAL_PRICE_ID
# - STRIPE_PREMIUM_MONTHLY_PRICE_ID
# - STRIPE_PREMIUM_ANNUAL_PRICE_ID
# - STRIPE_GOLD_MONTHLY_PRICE_ID
# - STRIPE_GOLD_ANNUAL_PRICE_ID
```

### Set missing secrets

```bash
# Set a single secret
supabase secrets set STRIPE_SECRET_KEY=[your-key-here]

# Set multiple secrets at once (from file)
# Create a .env.production file with all secrets:
STRIPE_SECRET_KEY=[your-stripe-key]
STRIPE_WEBHOOK_SECRET=[your-webhook-secret]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
STRIPE_STARTER_MONTHLY_PRICE_ID=price_xxxxx
STRIPE_STARTER_ANNUAL_PRICE_ID=price_xxxxx
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxxxx
STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_xxxxx
STRIPE_GOLD_MONTHLY_PRICE_ID=price_xxxxx
STRIPE_GOLD_ANNUAL_PRICE_ID=price_xxxxx

# Then load from file:
supabase secrets set --env-file .env.production
```

### Unset a secret (if you need to fix a typo)

```bash
supabase secrets unset STRIPE_SECRET_KEY
```

---

## 4. Common Deployment Errors

### Error: "Missing price ID for this tier/period"

**Cause**: One or more STRIPE_*_PRICE_ID secrets not set

**Fix**:
1. Create all 6 products/prices in Stripe Dashboard
2. Copy all 6 Price IDs
3. Set all 6 secrets: `supabase secrets set STRIPE_STARTER_MONTHLY_PRICE_ID=price_xxxxx`

---

### Error: "relation 'subscriptions' does not exist"

**Cause**: Database migration not run

**Fix**: Follow `DATABASE_MIGRATION_GUIDE.md` to create required tables

---

### Error: "Webhook signature verification failed"

**Cause**: STRIPE_WEBHOOK_SECRET incorrect or not set

**Fix**:
1. Go to Stripe Dashboard → Webhooks
2. Find your webhook endpoint
3. Click "Reveal" on Signing Secret
4. Copy the signing secret value (starts with whsec_)
5. Set: `supabase secrets set STRIPE_WEBHOOK_SECRET=[your-webhook-secret]`

---

### Error: "Unauthorized" in create-checkout-session

**Cause**: SUPABASE_SERVICE_ROLE_KEY not set or incorrect

**Fix**:
1. Go to Supabase Dashboard → Settings → API
2. Copy the `service_role` key (NOT the anon key)
3. Set: `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]`

---

## 5. Complete Deployment Checklist

Before deploying Edge Functions, verify:

- [ ] **Database Migration Complete**
  - [ ] `subscriptions` table exists
  - [ ] `stripe_events` table exists
  - [ ] `audit_logs` table exists
  - [ ] RLS policies configured
  - [ ] `log_audit_event` function exists

- [ ] **Stripe Configuration Complete**
  - [ ] Stripe account created
  - [ ] 3 products created (Starter, Premium, Gold)
  - [ ] 6 prices created (monthly + annual for each tier)
  - [ ] All 6 Price IDs copied
  - [ ] Stripe API keys generated (test or live)

- [ ] **Supabase Secrets Set** (9 total)
  - [ ] STRIPE_SECRET_KEY
  - [ ] STRIPE_WEBHOOK_SECRET
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] STRIPE_STARTER_MONTHLY_PRICE_ID
  - [ ] STRIPE_STARTER_ANNUAL_PRICE_ID
  - [ ] STRIPE_PREMIUM_MONTHLY_PRICE_ID
  - [ ] STRIPE_PREMIUM_ANNUAL_PRICE_ID
  - [ ] STRIPE_GOLD_MONTHLY_PRICE_ID
  - [ ] STRIPE_GOLD_ANNUAL_PRICE_ID

- [ ] **Edge Functions Deployed**
  - [ ] `create-checkout-session` deployed successfully
  - [ ] `stripe-webhook` deployed successfully
  - [ ] Functions showing in Supabase Dashboard

- [ ] **Stripe Webhook Configured**
  - [ ] Webhook endpoint created in Stripe
  - [ ] Endpoint URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
  - [ ] Events selected (all `checkout.*`, `customer.*`, `invoice.*`)
  - [ ] Signing secret copied and set

---

## 6. Quick Verification Script

After deployment, test your Edge Functions:

```bash
# Test create-checkout-session (requires auth token)
curl -i --location --request POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/create-checkout-session' \
  --header 'Authorization: Bearer YOUR_USER_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{"tier":"starter","billingPeriod":"monthly"}'

# Should return: {"sessionId":"cs_test_xxxxx","url":"https://checkout.stripe.com/..."}

# Test stripe-webhook (requires Stripe signature - use Stripe CLI)
stripe trigger checkout.session.completed
```

---

## 7. Security Notes

**Never commit these to git:**
- `.env.production` (add to `.gitignore`)
- Any file containing `STRIPE_SECRET_KEY`
- Any file containing `SUPABASE_SERVICE_ROLE_KEY`
- Any file containing `STRIPE_WEBHOOK_SECRET`

**Safe to commit:**
- Price IDs (they're references, not secrets)
- Supabase URL (it's public)
- Supabase anon key (designed to be public with RLS)

**Key rotation schedule:**
- Rotate `STRIPE_SECRET_KEY` every 90 days
- Rotate `SUPABASE_SERVICE_ROLE_KEY` every 90 days
- Rotate `STRIPE_WEBHOOK_SECRET` when webhook endpoint changes

---

## 8. Testing vs Production

### Test Mode (Recommended for initial deployment)

Use Stripe test keys for initial deployment:
- Set `STRIPE_SECRET_KEY` to your test key (starts with sk_test_)
- Create test products/prices in Stripe
- Use Stripe test cards (4242 4242 4242 4242)

### Production Mode (After testing confirms everything works)

Switch to live keys:
1. Create products/prices in LIVE mode in Stripe
2. Update all secrets with live values:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=[your-live-key]
   supabase secrets set STRIPE_STARTER_MONTHLY_PRICE_ID=price_live_xxxxx
   # ... (update all 9 secrets)
   ```
3. Update webhook endpoint in Stripe to production URL
4. Test with real card (small amount first!)

---

## Next Steps

After completing this checklist:
1. Run `supabase secrets list` to verify all 9 secrets are set
2. Deploy Edge Functions: `supabase functions deploy create-checkout-session`
3. Deploy webhook handler: `supabase functions deploy stripe-webhook`
4. Configure Stripe webhook endpoint
5. Test with a test purchase
6. Monitor Supabase logs: `supabase functions logs create-checkout-session`
