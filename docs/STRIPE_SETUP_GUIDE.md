# Stripe Payment Integration Setup Guide

This guide walks you through setting up Stripe payment processing for DualTrack OS subscriptions.

---

## 📋 Prerequisites

- Stripe account (create at https://stripe.com)
- DualTrack OS project set up locally
- Basic understanding of environment variables

**Time Required:** 15-20 minutes

---

## 🎯 Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click "Start now" or "Sign up"
3. Complete the registration process
4. Verify your email address

**Note:** You can test everything in "Test Mode" before going live.

---

## 🔑 Step 2: Get Your API Keys

1. Log in to Stripe Dashboard: https://dashboard.stripe.com
2. Make sure you're in **Test Mode** (toggle in top-right corner)
3. Navigate to: **Developers** → **API keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Save this key - you'll need it in Step 6

**Security Note:** Never commit your secret key to version control! Only use the publishable key in frontend code.

---

## 💳 Step 3: Create Products & Prices

You need to create 3 products (Starter, Premium, Gold) with 2 prices each (monthly & annual).

### Create Starter Tier Product

1. Go to: https://dashboard.stripe.com/products
2. Click **"+ Add product"**
3. Fill in:
   - **Name:** DualTrack OS - Starter
   - **Description:** Voice Diary, Cycle Tracking (Basic), and Essential Features
   - **Image:** (optional) Upload product image
4. Click **"Add pricing"**:

#### Monthly Price:
   - **Pricing model:** Standard pricing
   - **Price:** $4.99
   - **Billing period:** Monthly
   - **Currency:** USD
   - Click **"Add pricing"**

5. After creating monthly price, click **"Add another price"**

#### Annual Price:
   - **Pricing model:** Standard pricing
   - **Price:** $49.00
   - **Billing period:** Yearly
   - **Currency:** USD
   - Click **"Add pricing"**

6. Click **"Save product"**

7. **IMPORTANT:** Copy the Price IDs
   - Click on the monthly price → Copy the ID (starts with `price_`)
   - Click on the annual price → Copy the ID (starts with `price_`)
   - Save these IDs for Step 6

---

### Create Premium Tier Product

Repeat the process above with these details:

- **Name:** DualTrack OS - Premium
- **Description:** Energy & Mood AI, Advanced Cycle Tracking, Voice Diary
- **Monthly Price:** $9.99
- **Annual Price:** $99.00

**Copy both Price IDs!**

---

### Create Gold Tier Product

Repeat the process above with these details:

- **Name:** DualTrack OS - Gold
- **Description:** AI Coaching, Priority Support, All Premium Features
- **Monthly Price:** $19.99
- **Annual Price:** $199.00

**Copy both Price IDs!**

---

## 📊 Summary of Prices to Create

| Tier | Monthly | Annual | Annual Savings |
|------|---------|--------|----------------|
| Starter | $4.99 | $49.00 | $10.88 (18%) |
| Premium | $9.99 | $99.00 | $20.88 (17%) |
| Gold | $19.99 | $199.00 | $40.88 (17%) |

**Total:** 6 prices across 3 products

---

## 🔧 Step 4: Configure Checkout Settings (Optional but Recommended)

1. Go to: https://dashboard.stripe.com/settings/checkout
2. **Branding:**
   - Upload your logo
   - Set brand colors
   - Customize checkout appearance
3. **Customer portal:**
   - Enable customer portal (allows users to manage subscriptions)
   - Configure what customers can do (cancel, update payment, etc.)

---

## 📝 Step 5: Set Up Webhooks (For Production)

**Note:** This step is optional for testing but required for production.

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"**
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)

**Backend Implementation Required:**
You'll need to create an API endpoint at `/api/webhooks/stripe` to handle these events.

---

## 🌍 Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your values:

   ```bash
   # Stripe Configuration
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE

   # Starter Tier
   REACT_APP_STRIPE_STARTER_MONTHLY=price_ABC123DEF456
   REACT_APP_STRIPE_STARTER_ANNUAL=price_GHI789JKL012

   # Premium Tier
   REACT_APP_STRIPE_PREMIUM_MONTHLY=price_MNO345PQR678
   REACT_APP_STRIPE_PREMIUM_ANNUAL=price_STU901VWX234

   # Gold Tier
   REACT_APP_STRIPE_GOLD_MONTHLY=price_YZA567BCD890
   REACT_APP_STRIPE_GOLD_ANNUAL=price_EFG123HIJ456
   ```

3. Save the file

**Security Reminder:** Never commit `.env.local` to Git! It's in `.gitignore` by default.

---

## 🧪 Step 7: Test the Integration

1. Restart your development server:
   ```bash
   npm start
   ```

2. Navigate to the pricing page: `http://localhost:3000/pricing`

3. Click "Upgrade to Starter" (or any tier)

4. You should be redirected to Stripe Checkout

5. Use a Stripe test card:
   - **Card Number:** 4242 4242 4242 4242
   - **Expiry:** Any future date (e.g., 12/25)
   - **CVC:** Any 3 digits (e.g., 123)
   - **ZIP:** Any 5 digits (e.g., 12345)

6. Complete the checkout

7. You should be redirected back to `/dashboard?session_id=...&upgrade_success=true`

8. Check Stripe Dashboard → **Payments** to see the test payment

---

## ✅ Step 8: Verify Everything Works

### Checklist:

- [ ] Stripe account created and verified
- [ ] API keys obtained (publishable key)
- [ ] All 6 prices created (3 tiers × 2 billing periods)
- [ ] Price IDs copied and saved
- [ ] Environment variables configured in `.env.local`
- [ ] Development server restarted
- [ ] Test checkout completed successfully
- [ ] Redirect back to app works
- [ ] Payment visible in Stripe Dashboard

---

## 🚀 Step 9: Going Live (Production)

When you're ready to accept real payments:

1. **Complete Stripe account activation:**
   - Go to: https://dashboard.stripe.com/account/onboarding
   - Complete business details
   - Add bank account for payouts
   - Verify identity

2. **Switch to Live Mode:**
   - Toggle from "Test mode" to "Live mode" in Stripe Dashboard
   - Get your **Live** publishable key (starts with `pk_live_`)

3. **Recreate products in Live Mode:**
   - Repeat Step 3 in Live Mode
   - Get new Live price IDs

4. **Update environment variables:**
   - Use Live publishable key
   - Use Live price IDs
   - Deploy to production

5. **Set up production webhooks:**
   - Add production webhook endpoint
   - Update webhook secret in backend

6. **Test with real card** (use small amount first)

7. **Monitor payments:**
   - Check Stripe Dashboard → Payments regularly
   - Set up email notifications
   - Monitor webhook events

---

## 🔐 Security Best Practices

1. **Never expose secret keys:**
   - Only use publishable keys in frontend
   - Keep secret keys in backend environment only

2. **Verify payments server-side:**
   - Don't trust client-side subscription status
   - Verify with Stripe API on backend

3. **Use webhooks for subscription updates:**
   - Don't rely on redirect URLs alone
   - Webhooks are more reliable

4. **Enable Stripe Radar (fraud prevention):**
   - Available by default
   - Configure rules in Dashboard

5. **Implement proper error handling:**
   - Handle payment failures gracefully
   - Retry failed payments
   - Notify users of issues

---

## 🐛 Troubleshooting

### "Stripe is not configured" error

**Cause:** Environment variables not set correctly

**Fix:**
1. Check `.env.local` exists and has correct values
2. Restart development server after updating `.env.local`
3. Verify price IDs don't contain "placeholder"

---

### Checkout doesn't open

**Cause:** Invalid price ID or Stripe key

**Fix:**
1. Check browser console for errors
2. Verify publishable key is correct (starts with `pk_test_` or `pk_live_`)
3. Verify price IDs are from the same Stripe account
4. Make sure you're in the correct mode (Test vs Live)

---

### "No such price" error

**Cause:** Price ID doesn't exist or is from different mode

**Fix:**
1. Go to Stripe Dashboard → Products
2. Click on the price
3. Verify the ID matches exactly
4. Make sure you're in Test mode if using test price IDs

---

### Redirect doesn't work after payment

**Cause:** Success URL misconfigured

**Fix:**
1. Check console for redirect errors
2. Verify `successUrl` in `stripeService.js`
3. Make sure domain is allowed in Stripe settings

---

## 📚 Additional Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Checkout Docs:** https://stripe.com/docs/payments/checkout
- **Stripe Testing Guide:** https://stripe.com/docs/testing
- **Stripe Subscriptions:** https://stripe.com/docs/billing/subscriptions/overview
- **Stripe Webhooks:** https://stripe.com/docs/webhooks

---

## 💡 Next Steps

After Stripe is working:

1. **Implement webhook handler** to sync subscription status
2. **Add subscription management** (upgrade, downgrade, cancel)
3. **Connect to database** (store subscription tier in Supabase)
4. **Add backend verification** (verify tier before serving premium features)
5. **Set up email notifications** (payment receipts, failed payments)
6. **Add usage analytics** (track conversion rates)

See `docs/SUBSCRIPTION_ARCHITECTURE.md` for implementation details.

---

## ❓ Need Help?

- **Stripe Support:** https://support.stripe.com
- **Project Issues:** https://github.com/anthropics/claude-code/issues
- **Community:** Discord/Slack (if available)

---

**Last Updated:** 2025-12-22
