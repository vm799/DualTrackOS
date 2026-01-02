# 🚀 AppSumo Pre-Launch Checklist

**Use this checklist to verify everything is ready before submitting to AppSumo.**

Last updated: January 2, 2026

---

## ✅ COMPLETED (By Claude)

- [x] **AppSumo code redemption API** (supabase/functions/redeem-appsumo-code/index.ts)
- [x] **Code redemption UI** (src/pages/RedeemCodePage.jsx)
- [x] **Database schema for lifetime deals** (supabase/migrations/20260102000000_add_lifetime_tier.sql)
- [x] **CORS security hardened** (supabase/functions/_shared/cors.ts)
- [x] **Privacy Policy page** (src/pages/PrivacyPolicyPage.jsx)
- [x] **Terms of Service page** (src/pages/TermsOfServicePage.jsx)
- [x] **FAQ page** (src/pages/FAQPage.jsx)
- [x] **Cookie consent banner** (implemented in src/App.jsx)
- [x] **react-cookie-consent installed**
- [x] **Git history cleaned** (local and feature branch)
- [x] **All legal routes added** (/privacy, /terms, /faq, /redeem)

---

## ⚠️ CRITICAL - YOU MUST DO THESE

### 1. Security (BLOCKING - DO FIRST)

- [ ] **Rotate Supabase Keys**
  ```bash
  # Go to: https://app.supabase.com/project/YOUR_PROJECT/settings/api
  # Click "Reset JWT secret"
  # Update .env.local with new REACT_APP_SUPABASE_ANON_KEY
  # Update Vercel environment variables
  ```

- [ ] **Force Push to Main** (if you have permissions)
  ```bash
  git push --force origin main
  # If 403 error: temporarily disable branch protection in GitHub settings
  ```

- [ ] **Verify Git History is Clean**
  ```bash
  git log --all --oneline | grep 63e610c
  # Should return nothing

  # Check on GitHub
  open https://github.com/YOUR_REPO/commit/63e610c
  # Should show 404
  ```

### 2. Configuration

- [ ] **Replace Google Analytics ID**
  - File: `public/index.html` (lines 41 & 46)
  - Replace `G-XXXXXXXXXX` with your real GA4 tracking ID
  - Create property at: https://analytics.google.com/

- [ ] **Update CORS Domain** (if needed)
  - File: `supabase/functions/_shared/cors.ts`
  - Add your production domain to ALLOWED_ORIGINS
  - Current: dualtrack.app, www.dualtrack.app, dualtrack.vercel.app

- [ ] **Set Production Environment Variables in Vercel**
  ```
  REACT_APP_SUPABASE_URL=https://your-project.supabase.co
  REACT_APP_SUPABASE_ANON_KEY=<NEW_ROTATED_KEY>
  REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_XXX (use LIVE key!)
  REACT_APP_SENTRY_DSN=<YOUR_SENTRY_DSN>
  REACT_APP_SENTRY_ENABLED=true
  REACT_APP_VERSION=1.0.0
  ```

- [ ] **Set Supabase Edge Function Secrets**
  ```bash
  cd supabase
  supabase secrets set STRIPE_SECRET_KEY=sk_live_XXX
  supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_XXX
  supabase secrets set STRIPE_STARTER_MONTHLY_PRICE_ID=price_XXX
  supabase secrets set STRIPE_STARTER_ANNUAL_PRICE_ID=price_XXX
  supabase secrets set STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_XXX
  supabase secrets set STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_XXX
  supabase secrets set STRIPE_GOLD_MONTHLY_PRICE_ID=price_XXX
  supabase secrets set STRIPE_GOLD_ANNUAL_PRICE_ID=price_XXX
  ```

### 3. Database Migration

- [ ] **Deploy Database Migration**
  ```bash
  cd supabase
  supabase db push
  # Verify in Supabase dashboard that columns exist:
  # - is_lifetime
  # - appsumo_code
  # - appsumo_plan_id
  ```

### 4. Edge Function Deployment

- [ ] **Deploy Redemption Function**
  ```bash
  cd supabase/functions
  supabase functions deploy redeem-appsumo-code
  ```

- [ ] **Re-deploy Updated CORS Functions**
  ```bash
  supabase functions deploy create-checkout-session
  supabase functions deploy stripe-webhook
  ```

- [ ] **Test Edge Functions**
  ```bash
  # Test redemption endpoint
  curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/redeem-appsumo-code \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"code":"APPSUMO-TEST-0001","planId":"appsumo_ltd1"}'
  ```

### 5. Support Infrastructure

- [ ] **Create Support Email**
  - Set up support@dualtrack.app (or use Gmail workspace)
  - Add auto-responder with FAQ link
  - Test that emails are received

- [ ] **Create Legal Emails** (optional but recommended)
  - privacy@dualtrack.app
  - legal@dualtrack.app

- [ ] **Prepare Support Templates**
  - Code redemption issues
  - Login problems
  - Feature access questions
  - Refund requests

---

## 🧪 TESTING (CRITICAL)

### End-to-End Testing

- [ ] **Test Fresh Signup**
  - Google OAuth works
  - Redirects to onboarding
  - Onboarding completes
  - Lands on dashboard

- [ ] **Test AppSumo Code Redemption**
  - Navigate to /redeem
  - Enter test code: APPSUMO-TEST-0001
  - Select LTD1 tier
  - Code validates successfully
  - Subscription shows as "Starter Lifetime"
  - All Starter features unlock

- [ ] **Test Duplicate Code Prevention**
  - Try to redeem same code twice
  - Should show "already redeemed" error

- [ ] **Test Invalid Code Format**
  - Enter malformed code
  - Should show format error

- [ ] **Test Stripe Subscription** (non-AppSumo)
  - Click "Upgrade to Starter"
  - Stripe checkout loads
  - Test payment succeeds
  - Redirects to dashboard
  - Subscription shows as active

- [ ] **Test Stripe Webhooks**
  ```bash
  # Install Stripe CLI
  stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

  # Trigger test events
  stripe trigger checkout.session.completed
  stripe trigger customer.subscription.updated
  stripe trigger invoice.payment_failed

  # Verify events processed in Supabase stripe_events table
  ```

- [ ] **Test Legal Pages**
  - /privacy loads correctly
  - /terms loads correctly
  - /faq loads correctly
  - All links work

- [ ] **Test Cookie Banner**
  - Banner appears on first visit
  - "Accept" enables GA
  - "Decline" disables GA
  - Choice persists on reload

- [ ] **Test Security**
  - Try accessing another user's data (should fail)
  - Try calling API from curl without auth (should fail)
  - Try calling API from unauthorized domain (should fail CORS)
  - Verify old Supabase key doesn't work (after rotation)

- [ ] **Test Mobile Responsiveness**
  - iPhone Safari
  - Android Chrome
  - iPad
  - All pages render correctly

- [ ] **Test PWA Installation**
  - "Add to Home Screen" works on iOS
  - "Install App" works on Android
  - Offline mode works after first load

---

## 📊 MONITORING & ANALYTICS

- [ ] **Verify Sentry Error Tracking**
  - Trigger a test error
  - Check Sentry dashboard for event
  - Verify PII is masked

- [ ] **Verify Google Analytics**
  - Visit homepage
  - Check GA4 Real-Time view
  - Events are firing

- [ ] **Set Up Alerts**
  - Supabase usage alerts (80% threshold)
  - Stripe webhook failure alerts
  - Vercel deployment failure alerts
  - Sentry error rate alerts

---

## 🚢 DEPLOYMENT

- [ ] **Deploy to Production**
  ```bash
  npm run build
  # Verify build succeeds with no errors

  npm run deploy
  # OR
  git push origin main  # Auto-deploys via Vercel
  ```

- [ ] **Verify Production Deployment**
  - [ ] Homepage loads at production URL
  - [ ] /redeem page loads
  - [ ] /privacy page loads
  - [ ] /terms page loads
  - [ ] /faq page loads
  - [ ] Cookie banner shows
  - [ ] Google OAuth works
  - [ ] Stripe checkout works
  - [ ] AppSumo redemption works

- [ ] **Check Production Logs**
  - Vercel deployment logs (no errors)
  - Supabase Edge Function logs (no errors)
  - Browser console (no errors)

---

## 📝 APPSUMO SUBMISSION

### Marketing Materials Needed

- [ ] **Product Screenshots** (8-12 images)
  - Dashboard overview
  - Cycle tracking interface
  - Energy/mood tracking
  - Exercise library
  - Voice diary
  - NDM tracking
  - Settings page
  - Mobile responsive view

- [ ] **Demo Video** (2-3 minutes)
  - Hook: Problem statement (0:00-0:15)
  - Solution: Product overview (0:15-0:45)
  - Demo: Key features (0:45-2:00)
  - Benefits: Outcomes (2:00-2:30)
  - CTA: Get lifetime access (2:30-2:45)

- [ ] **Product Copy**
  - Headline: "Your Personal Operating System for Fluctuating Energy, Hormones & Multiple Life Demands"
  - Tagline: "Built for badass women who refuse to burn out"
  - Feature list (see APPSUMO_LAUNCH_PLAN.md)
  - Customer testimonials (3-5 quotes)

- [ ] **Brand Assets**
  - Logo (transparent PNG, 1000x1000px)
  - Icon (512x512px)
  - Cover image (1200x630px)
  - Favicon

- [ ] **Customer Testimonials**
  - At least 3 testimonials
  - Include name, role, photo (if possible)
  - Focus on transformation/results

### AppSumo Application

- [ ] **Apply at AppSumo**
  - Go to: https://sell.appsumo.com/apply
  - Fill out seller application
  - Provide product details
  - Upload marketing materials

- [ ] **Set Deal Structure**
  - LTD Tier 1: $49 (Starter lifetime)
  - LTD Tier 2: $99 (Premium lifetime)
  - LTD Tier 3: $199 (Gold lifetime)

- [ ] **Provide Test Codes**
  - Generate 5-10 test codes
  - Share with AppSumo team for verification
  - Format: APPSUMO-TEST-0001, etc.

- [ ] **Set Up Code Generation** (AppSumo will handle this)
  - Provide redemption endpoint URL
  - Document API format
  - Test code generation flow

---

## 🎯 POST-LAUNCH (First 48 Hours)

- [ ] **Monitor Support Email**
  - Respond within 6 hours max
  - Track common questions
  - Update FAQ as needed

- [ ] **Monitor Sentry**
  - Check for new errors
  - Fix critical issues immediately
  - Create hotfix branch if needed

- [ ] **Monitor Stripe**
  - Watch for failed webhooks
  - Check for unusual activity
  - Verify payments processing correctly

- [ ] **Monitor Supabase**
  - Check database performance
  - Watch for query timeouts
  - Monitor storage usage

- [ ] **Track Metrics**
  - Code redemption rate
  - Support ticket volume
  - Refund requests
  - User activation rate
  - Error rate

- [ ] **Engage with Buyers**
  - Respond to AppSumo reviews
  - Thank early adopters
  - Fix issues proactively
  - Ask for testimonials

---

## 🔥 EMERGENCY PROCEDURES

### If Production Breaks

```bash
# Rollback deployment
vercel rollback

# OR redeploy last known good commit
git checkout <LAST_GOOD_COMMIT>
npm run deploy
```

### If Database is Down

- Check Supabase status: https://status.supabase.com
- App will fall back to localStorage (data safe)
- Users can continue working offline
- Data syncs when DB comes back

### If Stripe Webhooks Fail

- Check Stripe dashboard → Developers → Webhooks
- Retry failed events manually
- Verify webhook secret is correct
- Check Supabase Edge Function logs

### If Mass Refunds Happening

- Identify root cause (bug, misleading marketing, bad UX)
- Fix immediately
- Email affected users
- Update AppSumo listing if needed
- Learn and iterate

---

## 📞 EMERGENCY CONTACTS

**Supabase Support:** support@supabase.com
**Stripe Support:** https://support.stripe.com
**Vercel Support:** https://vercel.com/support
**AppSumo Support:** sellers@appsumo.com

---

## ✅ FINAL VERIFICATION

Before submitting to AppSumo, confirm:

- [ ] All security vulnerabilities fixed
- [ ] All legal pages live and accessible
- [ ] AppSumo redemption flow tested end-to-end
- [ ] Support email active and monitored
- [ ] Analytics and error tracking working
- [ ] Production deployment stable for 24+ hours
- [ ] Marketing materials ready
- [ ] You're ready for 100-500 new users in first week

---

**When all boxes are checked, you're ready to submit to AppSumo!**

**Good luck! 🚀**

Questions? Review APPSUMO_LAUNCH_PLAN.md for detailed instructions.
