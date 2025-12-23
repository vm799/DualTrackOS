# 🚀 Quick Start Deployment Guide (No Docker Required!)

**For**: Users without Docker who want to deploy to production quickly

---

## ✅ What You Need

- [ ] Node.js and npm installed
- [ ] Supabase account (free tier works)
- [ ] Stripe account (test mode works initially)
- [ ] Database migration completed (see `DATABASE_MIGRATION_GUIDE.md`)

**You do NOT need**: Docker, containers, or any virtualization

---

## 📝 Step-by-Step (30 minutes)

### 1. Install Supabase CLI (2 minutes)

```bash
npm install -g supabase

# Verify installation
supabase --version
```

**Troubleshooting**: If you see Docker warnings, ignore them! Docker is NOT required for deployment.

---

### 2. Login to Supabase (2 minutes)

```bash
supabase login
```

This will open your browser. Click "Authorize" to link your account.

---

### 3. Link Your Project (3 minutes)

First, get your project reference ID:
1. Go to [dashboard.supabase.com](https://dashboard.supabase.com)
2. Select your project
3. Go to **Settings → General**
4. Copy **Project Reference ID** (looks like: `abcdefghijklmnop`)

Then link:

```bash
cd /path/to/DualTrackOS

supabase link --project-ref YOUR_PROJECT_REF
```

Enter your database password when prompted.

**Expected output**:
```
Linked to project YOUR_PROJECT_REF
```

---

### 4. Deploy Edge Functions (5 minutes)

```bash
# Deploy payment checkout function
supabase functions deploy create-checkout-session

# Deploy webhook handler
supabase functions deploy stripe-webhook
```

**Expected output for each**:
```
Deploying create-checkout-session (project ref: YOUR_REF)
Deployed create-checkout-session (status: ACTIVE)
```

✅ If you see "status: ACTIVE", deployment succeeded!

**Ignore Docker warnings** - they don't affect production deployment.

---

### 5. Set Environment Secrets (5 minutes)

#### Get Stripe Keys:
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Click **Developers → API Keys**
3. Copy:
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
   - Note: You'll get webhook secret in next step

#### Get Supabase Service Role Key:
1. Go to Supabase Dashboard → **Settings → API**
2. Copy **service_role secret** (NOT the anon key)

#### Set the secrets:

```bash
# Stripe secret key (test mode for now)
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Supabase service role key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Webhook secret (get this in Step 6 after creating webhook)
# We'll set this after we have the webhook secret
```

---

### 6. Configure Stripe Webhook (10 minutes)

#### Get your webhook URL:

Your webhook URL is:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook
```

Replace `YOUR_PROJECT_REF` with your actual project reference ID.

#### Create webhook endpoint:

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Paste your webhook URL
4. Click **Select events**
5. Add these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click **Add endpoint**

#### Get webhook signing secret:

After creating the webhook:
1. Click on your new webhook endpoint
2. Click **Reveal** under "Signing secret"
3. Copy the secret (starts with `whsec_`)

#### Set webhook secret:

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

---

### 7. Verify Deployment (3 minutes)

#### Check function status:

```bash
# View deployed functions
supabase functions list
```

You should see:
```
create-checkout-session    ACTIVE
stripe-webhook             ACTIVE
```

#### Test webhook endpoint:

```bash
curl https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook
```

Expected response (this is good!):
```json
{"error": "No signature found in request"}
```

This means the endpoint is live and waiting for Stripe to send signed requests.

---

### 8. Update Frontend Environment Variables (5 minutes)

#### If using Vercel:

1. Go to Vercel Dashboard → Your Project → **Settings → Environment Variables**
2. Add/update:
   ```
   REACT_APP_SUPABASE_URL = https://YOUR_PROJECT_REF.supabase.co
   REACT_APP_SUPABASE_ANON_KEY = your_anon_key_from_dashboard
   REACT_APP_STRIPE_PUBLISHABLE_KEY = pk_test_your_stripe_key
   ```
3. Redeploy your app

#### If using .env.production:

Create/update `.env.production`:
```env
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

---

## ✅ Success Checklist

After deployment, verify:

- [ ] `supabase functions list` shows both functions as ACTIVE
- [ ] Stripe webhook endpoint created and shows "Enabled"
- [ ] Frontend environment variables updated
- [ ] Database has 4 tables: user_data, subscriptions, stripe_events, audit_logs

---

## 🧪 Test Your Deployment

### Test 1: Create Checkout Session

1. Open your deployed app
2. Go to pricing page
3. Click "Upgrade to Starter"
4. Should redirect to Stripe checkout page

**If this works**: Payment flow is working! ✅

### Test 2: Verify Webhook

1. Complete a test payment with card: `4242 4242 4242 4242`
2. After payment, check Supabase Table Editor → `subscriptions` table
3. You should see your subscription record

**If subscription appears**: Webhook is working! ✅

---

## 🐛 Common Issues

### "Cannot find module 'supabase'"

**Solution**: Install CLI globally:
```bash
npm install -g supabase
```

### "Project not linked"

**Solution**: Run link command again:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### "Docker not found"

**Solution**: **Ignore this!** Docker is not needed for production deployment. As long as you see "Deployed ... (status: ACTIVE)", you're good.

### "relation 'subscriptions' does not exist"

**Solution**: You need to run the database migration first!
```bash
# See DATABASE_MIGRATION_GUIDE.md
supabase db push
```

### "Invalid JWT" or "401 Unauthorized"

**Solution**: Make sure you're passing the auth token when calling Edge Functions:
```javascript
const { data } = await supabase.functions.invoke('create-checkout-session', {
  headers: {
    Authorization: `Bearer ${session.access_token}`
  }
})
```

---

## 📊 View Logs

To see what's happening in your Edge Functions:

```bash
# View logs for checkout function
supabase functions logs create-checkout-session --tail

# View logs for webhook function
supabase functions logs stripe-webhook --tail
```

Press `Ctrl+C` to stop tailing.

---

## 🎉 You're Done!

Your Edge Functions are now deployed to production!

**Next steps**:
1. Test payment flow end-to-end
2. Monitor function logs for errors
3. When ready for real payments, switch Stripe to live mode:
   - Update `STRIPE_SECRET_KEY` to `sk_live_...`
   - Update frontend with `pk_live_...`
   - Create new webhook endpoint for production

---

## 📚 More Help

- Full guide: `EDGE_FUNCTIONS_DEPLOYMENT.md`
- Database setup: `DATABASE_MIGRATION_GUIDE.md`
- Production launch: `PRODUCTION_LAUNCH_SUMMARY.md`
- Supabase docs: https://supabase.com/docs/guides/functions

---

**Last Updated**: December 23, 2025
**Time to Deploy**: ~30 minutes
**Docker Required**: NO ✅
