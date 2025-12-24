# DualTrack OS - Production Launch Checklist

**Use this checklist to ensure everything is ready before launching to real users**

---

## 📋 Pre-Launch Checklist

### Phase 1: Code & Build (30 min)

- [ ] **Run production build locally**
  ```bash
  npm run build
  ```
  - Build completes without errors
  - No TypeScript errors
  - No linting warnings
  - Build size is reasonable (<5MB)

- [ ] **Run automated verification script**
  ```bash
  bash verify-production-ready.sh
  ```
  - All critical checks pass
  - Review and address warnings

- [ ] **Run tests**
  ```bash
  npm test
  ```
  - All 41 tests pass
  - No test failures

- [ ] **Check for security issues**
  - Review `SECURITY_AUDIT_CHECKLIST.md`
  - No hardcoded secrets in code
  - `.env.local` not committed to git
  - All critical security checks pass

---

### Phase 2: Database Setup (5-10 min)

- [ ] **Run database migration**
  ```bash
  supabase login
  supabase link --project-ref YOUR_PROJECT_REF
  supabase db push
  ```

- [ ] **Verify tables created**
  - Go to Supabase Dashboard → Table Editor
  - Verify 4 tables exist:
    - [ ] `user_data`
    - [ ] `subscriptions`
    - [ ] `stripe_events`
    - [ ] `audit_logs`

- [ ] **Verify RLS policies**
  - Each table has RLS enabled
  - Each table has appropriate policies
  - See `SECURITY_AUDIT_CHECKLIST.md` Section 3

---

### Phase 3: Stripe Setup (15-20 min)

- [ ] **Create Stripe account**
  - Sign up at https://dashboard.stripe.com
  - Verify email
  - Complete account setup

- [ ] **Create products & prices**
  - Create 3 products:
    - [ ] DualTrack OS Starter
    - [ ] DualTrack OS Premium
    - [ ] DualTrack OS Gold
  - Create 6 prices total:
    - [ ] Starter Monthly
    - [ ] Starter Annual
    - [ ] Premium Monthly
    - [ ] Premium Annual
    - [ ] Gold Monthly
    - [ ] Gold Annual
  - Copy all 6 Price IDs (start with `price_`)

- [ ] **Get API keys**
  - Go to Stripe Dashboard → Developers → API keys
  - Copy **Publishable key** (starts with `pk_test_` or `pk_live_`)
  - Copy **Secret key** (starts with `sk_test_` or `sk_live_`)
  - **Use TEST keys for beta, LIVE keys for production**

---

### Phase 4: Supabase Edge Functions (15-20 min)

- [ ] **Set Supabase secrets**
  ```bash
  supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx
  supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
  supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
  supabase secrets set STRIPE_STARTER_MONTHLY_PRICE_ID=price_xxxxx
  supabase secrets set STRIPE_STARTER_ANNUAL_PRICE_ID=price_xxxxx
  supabase secrets set STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxxxx
  supabase secrets set STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_xxxxx
  supabase secrets set STRIPE_GOLD_MONTHLY_PRICE_ID=price_xxxxx
  supabase secrets set STRIPE_GOLD_ANNUAL_PRICE_ID=price_xxxxx
  ```

- [ ] **Deploy Edge Functions**
  ```bash
  supabase functions deploy create-checkout-session
  supabase functions deploy stripe-webhook
  ```

- [ ] **Verify deployment**
  - Go to Supabase Dashboard → Edge Functions
  - Both functions show "Deployed" status
  - No deployment errors

---

### Phase 5: Stripe Webhooks (5-10 min)

- [ ] **Create webhook endpoint**
  - Go to Stripe Dashboard → Developers → Webhooks
  - Click "Add endpoint"
  - Endpoint URL: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
  - Select events:
    - [ ] `checkout.session.completed`
    - [ ] `customer.subscription.created`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
    - [ ] `invoice.paid`
    - [ ] `invoice.payment_failed`
  - Click "Add endpoint"

- [ ] **Get webhook secret**
  - Click on your webhook endpoint
  - Click "Reveal" on Signing secret
  - Copy the secret (starts with `whsec_`)
  - Set in Supabase:
    ```bash
    supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
    ```

- [ ] **Test webhook**
  - Click "Send test webhook"
  - Select `checkout.session.completed`
  - Verify webhook receives event (check logs)

---

### Phase 6: Vercel Deployment (10-15 min)

- [ ] **Create Vercel account**
  - Sign up at https://vercel.com
  - Connect GitHub account

- [ ] **Import project**
  - Click "New Project"
  - Select DualTrackOS repository
  - Configure build settings (auto-detected)

- [ ] **Set environment variables**
  - Go to Settings → Environment Variables
  - Add secrets (all 3 environments: Production, Preview, Development):
    - [ ] `supabase_url` = Your Supabase URL
    - [ ] `supabase_anon_key` = Your Supabase anon key
    - [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` = Your Stripe publishable key
    - [ ] `REACT_APP_SENTRY_DSN` = Your Sentry DSN (optional)

- [ ] **Deploy**
  - Click "Deploy"
  - Wait for build to complete
  - Verify deployment succeeds

- [ ] **Test deployed app**
  - Navigate to your Vercel URL
  - App loads without errors
  - Can complete onboarding
  - Can navigate between pages

---

### Phase 7: API Key Rotation (5 min)

**For security, rotate all API keys before launch:**

- [ ] **Rotate Supabase keys**
  - Go to Supabase Dashboard → Settings → API
  - Click "Regenerate" for:
    - [ ] anon/public key
    - [ ] service_role key
  - Update keys in:
    - [ ] Vercel environment variables
    - [ ] Supabase Edge Function secrets

- [ ] **Verify rotation didn't break anything**
  - Test app still works
  - Test Stripe checkout still works

---

### Phase 8: End-to-End Testing (30-60 min)

Follow **PRODUCTION_TESTING_PLAN.md** for comprehensive testing:

**Quick Test (10 min)**:
- [ ] Landing page loads
- [ ] Can complete onboarding
- [ ] Dashboard loads with data
- [ ] Can click "Subscribe" (redirects to Stripe)
- [ ] Can complete checkout with test card: `4242 4242 4242 4242`
- [ ] Redirects back to dashboard with success message
- [ ] Subscription appears in Stripe Dashboard
- [ ] Subscription row created in Supabase `subscriptions` table

**Full Test (60 min)**:
- [ ] Follow all scenarios in `PRODUCTION_TESTING_PLAN.md`
- [ ] Test all user flows
- [ ] Test all error cases
- [ ] Verify Sentry receives errors
- [ ] Verify webhooks process correctly

---

### Phase 9: Security Audit (30 min)

Follow **SECURITY_AUDIT_CHECKLIST.md**:

**Critical Checks**:
- [ ] No secrets exposed in frontend code
- [ ] `.env.local` not committed to git
- [ ] RLS enabled on all Supabase tables
- [ ] HTTPS enforced everywhere
- [ ] Cannot access protected routes without auth

**High Priority Checks**:
- [ ] API keys rotated
- [ ] Input validation working (XSS/SQL injection tests)
- [ ] Error messages don't leak sensitive info

**Security Score**: ___ / 100 (run audit to calculate)
- Must be 80+ to launch

---

### Phase 10: Legal Compliance (Variable)

- [ ] **Customize legal docs**
  - Replace all `[Your Company Name]` placeholders
  - Replace all `[Your Email]` placeholders
  - Add your contact information
  - Add your business address

- [ ] **Attorney review** (recommended before accepting payments)
  - Send `legal/PRIVACY_POLICY.md` to attorney
  - Send `legal/TERMS_OF_SERVICE.md` to attorney
  - Incorporate attorney feedback
  - Cost: $500-1,000 | Time: 1-2 weeks

- [ ] **Publish legal docs**
  - Add Privacy Policy link to footer
  - Add Terms of Service link to footer
  - Both links work and display correct content

---

### Phase 11: Monitoring Setup (10 min)

- [ ] **Sentry**
  - Account created at https://sentry.io
  - Project created
  - DSN added to environment variables
  - Test error sent and appears in dashboard
  - Email alerts configured

- [ ] **Uptime Monitoring** (optional)
  - Set up UptimeRobot or Pingdom
  - Monitor: Your Vercel URL
  - Alert: Email when down

- [ ] **Know where to check logs**
  - [ ] Vercel logs: Vercel Dashboard → Deployments → Click deployment
  - [ ] Supabase logs: Supabase Dashboard → Logs
  - [ ] Stripe logs: Stripe Dashboard → Developers → Events
  - [ ] Sentry errors: Sentry Dashboard → Issues

---

## 🚀 Launch Day Checklist

### 1 Hour Before Launch

- [ ] **Final smoke test**
  - Test complete user flow end-to-end
  - Verify no errors in browser console
  - Verify Sentry is receiving events
  - Verify Stripe checkout works

- [ ] **Switch to LIVE mode** (if not already)
  - Update Stripe keys from `pk_test_` to `pk_live_`
  - Update Stripe keys from `sk_test_` to `sk_live_`
  - Verify webhook endpoint is in LIVE mode
  - Test one real payment (small amount)

- [ ] **Prepare support channels**
  - Support email is monitored
  - Sentry alerts go to correct email/Slack
  - Phone/contact info is current

### At Launch

- [ ] **Announce launch**
  - Post on social media (if applicable)
  - Email beta users (if any)
  - Update status page (if applicable)

- [ ] **Monitor actively for first 24 hours**
  - Check Sentry every few hours
  - Check Stripe for new subscriptions
  - Check support email
  - Respond to issues immediately

### First Week After Launch

- [ ] **Daily monitoring**
  - Review Sentry errors
  - Review Stripe Dashboard
  - Check for support requests
  - Monitor Vercel analytics

- [ ] **Collect feedback**
  - Survey first users
  - Track most common questions/issues
  - Document bugs to fix

- [ ] **Plan iteration**
  - Prioritize bug fixes
  - Consider feature requests
  - Plan next release

---

## 🎯 Launch Decision Matrix

### Can I launch?

**Scenario A: All checks pass, attorney reviewed**
→ ✅ **LAUNCH TO PUBLIC** 🚀

**Scenario B: All critical checks pass, no attorney review yet**
→ ✅ **LAUNCH TO BETA** (10-20 users, no payments until attorney review)

**Scenario C: Some critical checks fail**
→ ❌ **DO NOT LAUNCH** - Fix critical issues first

**Scenario D: All checks pass but need more testing**
→ ✅ **LAUNCH TO FRIENDS/FAMILY** - Get feedback before public

---

## 📊 Production Readiness Score

**Current Status**: 75/100 (C+) - Ready for Beta Launch

**To reach 85/100 (Public Launch Ready)**:
- [ ] Attorney review of legal docs (+5 points)
- [ ] Expand test coverage to 50%+ (+5 points)
- [ ] Complete all end-to-end tests (+3 points)
- [ ] Fix all high-priority security issues (+2 points)

---

## 🚨 Emergency Procedures

### If Something Goes Wrong After Launch

**Severity 1: Site Down**
1. Check Vercel status page
2. Check Supabase status page
3. Check recent deployments for errors
4. Roll back to previous deployment if needed
5. Notify users via status page/social media

**Severity 2: Payment Issues**
1. Check Stripe Dashboard → Events for errors
2. Check Supabase Edge Functions logs
3. Verify webhook is receiving events
4. Contact Stripe support if needed
5. Pause new signups until resolved

**Severity 3: Data Issue**
1. Check Supabase RLS policies
2. Review recent database changes
3. Restore from backup if needed (Supabase auto-backups)
4. Notify affected users
5. Document incident

**Severity 4: Security Breach**
1. **Immediately**: Rotate all API keys
2. Take app offline if actively being exploited
3. Assess damage (what data was accessed)
4. Notify affected users within 72 hours (GDPR requirement)
5. Document incident and prevention steps

---

## 📞 Support Contacts

**Vercel Support**: https://vercel.com/support
**Supabase Support**: https://supabase.com/support
**Stripe Support**: https://support.stripe.com
**Sentry Support**: https://sentry.io/support

**Emergency Escalation**:
- For critical payment issues: Stripe support (fastest response)
- For critical security issues: Rotate keys immediately, then contact all platforms
- For critical data issues: Supabase support + restore from backup

---

## ✅ Final Sign-Off

**Before clicking "Launch", confirm:**

- [ ] I have completed all critical checks
- [ ] I have tested end-to-end with real payment
- [ ] I know how to access all monitoring dashboards
- [ ] I have legal docs ready (reviewed or scheduled for review)
- [ ] I have support channels set up
- [ ] I am prepared to monitor actively for 24-48 hours
- [ ] I have a rollback plan if something goes wrong

**Signed**: _________________________ **Date**: _____________

---

**Good luck with your launch! You've got this.** 🚀

For detailed testing procedures, see:
- `PRODUCTION_TESTING_PLAN.md` - End-to-end testing guide
- `SECURITY_AUDIT_CHECKLIST.md` - Security review
- `verify-production-ready.sh` - Automated verification script
