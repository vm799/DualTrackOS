# Vercel Frontend Deployment Guide

**Fix for error: "Environment Variable references Secret which does not exist"**

---

## ⚠️ The Problem

Your Vercel deployment is failing because `vercel.json` references Vercel Secrets that haven't been created yet:

```json
"env": {
  "REACT_APP_SUPABASE_URL": "@supabase_url",      // ❌ Secret doesn't exist
  "REACT_APP_SUPABASE_ANON_KEY": "@supabase_anon_key"  // ❌ Secret doesn't exist
}
```

The `@` prefix means Vercel will look for a **secret** (not an environment variable) with that name.

---

## ✅ Quick Fix (2 Methods)

### Method 1: Vercel Dashboard (Easiest - 2 minutes)

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your **DualTrackOS** project
3. Click **Settings** → **Environment Variables**
4. Add these **4 secrets**:

| Name | Value | Environment |
|------|-------|-------------|
| `supabase_url` | Get from Supabase Dashboard → Settings → API → Project URL | Production, Preview, Development |
| `supabase_anon_key` | Get from Supabase Dashboard → Settings → API → anon public | Production, Preview, Development |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` (your Stripe publishable key) | Production, Preview, Development |
| `REACT_APP_SENTRY_DSN` | (Optional - leave empty if not using Sentry) | Production, Preview, Development |

**IMPORTANT Notes:**
- Secret names are **case-sensitive**: `supabase_url` (lowercase with underscore)
- Do NOT add `REACT_APP_` prefix to the secret names (that's in `vercel.json` already)
- Select all 3 environments (Production, Preview, Development) for each variable
- Click "Save" after each one

5. Redeploy your project:
   - Go to **Deployments** tab
   - Click the **⋯** menu on the failed deployment
   - Click **Redeploy**

---

### Method 2: Vercel CLI (For developers)

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project (if not already linked)
vercel link

# Add secrets (one at a time)
vercel secrets add supabase_url "YOUR_SUPABASE_URL"
vercel secrets add supabase_anon_key "YOUR_FULL_ANON_KEY_HERE"

# Add environment variables (for Stripe, Sentry)
vercel env add REACT_APP_STRIPE_PUBLISHABLE_KEY
# Paste your Stripe publishable key when prompted
# Select: Production, Preview, Development (all 3)

vercel env add REACT_APP_SENTRY_DSN
# Paste your Sentry DSN or leave empty
# Select: Production, Preview, Development (all 3)

# Redeploy
vercel --prod
```

---

## 📋 Complete Environment Variables Checklist

### Required for Deployment ✅

These MUST be set or deployment will fail:

- **supabase_url** (secret)
  - Value: Your Supabase project URL
  - Get from: Supabase Dashboard → Settings → API → Project URL
  - Example: `https://abcdefghijklmnop.supabase.co`

- **supabase_anon_key** (secret)
  - Value: Your Supabase anon/public key
  - Get from: Supabase Dashboard → Settings → API → Project API keys → anon public
  - Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - **Safe to expose**: This key is designed to be public (protected by RLS)

### Optional but Recommended 🔧

- **REACT_APP_STRIPE_PUBLISHABLE_KEY** (env var)
  - Value: Your Stripe publishable key
  - Get from: https://dashboard.stripe.com/apikeys
  - Use **test key** (`pk_test_...`) for initial deployment
  - Use **live key** (`pk_live_...`) for production
  - **Safe to expose**: Publishable keys are designed to be public

- **REACT_APP_SENTRY_DSN** (env var)
  - Value: Your Sentry project DSN (for error tracking)
  - Get from: https://sentry.io/settings/projects/
  - Leave empty if not using Sentry
  - **Safe to expose**: DSN is public (only receives error reports)

- **REACT_APP_SENTRY_ENABLED** (env var)
  - Value: `true` or `false`
  - Default: `false`
  - Set to `true` only if you have Sentry configured

- **REACT_APP_VERSION** (env var)
  - Value: Your app version (e.g., `1.0.0`)
  - Used for Sentry release tracking
  - Default: `1.0.0`

---

## 🔍 Understanding Vercel Secrets vs Environment Variables

### Vercel Secrets (referenced with `@` in vercel.json)

- Stored securely and encrypted
- Shared across all projects in your team
- Cannot be read after creation (write-only)
- Good for: API keys, tokens, credentials
- **In your case**: `@supabase_url` and `@supabase_anon_key`

### Environment Variables (set directly)

- Project-specific
- Can be viewed and edited
- Can be different per environment (Production/Preview/Development)
- Good for: Configuration values, feature flags
- **In your case**: Stripe and Sentry config

---

## 🛠️ Alternative: Use Environment Variables Instead of Secrets

If you prefer NOT to use Vercel Secrets, you can update `vercel.json`:

**Current (uses secrets):**
```json
"env": {
  "REACT_APP_SUPABASE_URL": "@supabase_url",
  "REACT_APP_SUPABASE_ANON_KEY": "@supabase_anon_key"
}
```

**Alternative (uses env vars directly):**
```json
"env": {
  "REACT_APP_SUPABASE_URL": "",
  "REACT_APP_SUPABASE_ANON_KEY": ""
}
```

Then add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` as regular environment variables in Vercel dashboard.

**However**, using secrets is more secure and is the recommended approach for production.

---

## 🚨 Common Errors & Fixes

### Error: "Secret 'supabase_url' does not exist"

**Cause**: Secret not created in Vercel

**Fix**:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add secret named exactly `supabase_url` (lowercase, with underscore)
3. Paste your Supabase URL
4. Save and redeploy

---

### Error: "Build failed - Cannot read environment variable"

**Cause**: Environment variable not available during build

**Fix**: Ensure all env vars are set for the correct environment (Production/Preview/Development)

---

### Error: "Invalid Supabase URL"

**Cause**: URL is incorrect or malformed

**Fix**:
1. Go to Supabase Dashboard → Settings → API
2. Copy the exact URL (should be `https://[project-ref].supabase.co`)
3. Do NOT add trailing slash
4. Do NOT add `/rest/v1` or other paths

---

### Error: "Unauthorized" when app tries to connect to Supabase

**Cause**: Anon key is incorrect or expired

**Fix**:
1. Go to Supabase Dashboard → Settings → API
2. Copy the **anon public** key (NOT the service_role key!)
3. Update the `supabase_anon_key` secret in Vercel
4. Redeploy

---

## 📊 Deployment Checklist

Before deploying to Vercel, verify:

- [ ] **Supabase Project Created**
  - [ ] Database tables exist (user_data, subscriptions, stripe_events, audit_logs)
  - [ ] Row Level Security (RLS) enabled and policies configured
  - [ ] Edge Functions deployed (optional for initial deployment)

- [ ] **Vercel Secrets Set**
  - [ ] `supabase_url` - Your Supabase project URL
  - [ ] `supabase_anon_key` - Your Supabase anon public key

- [ ] **Vercel Environment Variables Set** (optional but recommended)
  - [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Stripe test or live key
  - [ ] `REACT_APP_SENTRY_DSN` - Sentry DSN (if using)
  - [ ] `REACT_APP_SENTRY_ENABLED` - `true` or `false`
  - [ ] `REACT_APP_VERSION` - App version number

- [ ] **Code Pushed to GitHub/GitLab/Bitbucket**
  - [ ] Latest changes committed
  - [ ] Pushed to main or production branch

- [ ] **Vercel Project Connected**
  - [ ] Git repository linked to Vercel
  - [ ] Automatic deployments enabled (optional)

---

## 🚀 Deployment Workflow

### Initial Deployment

1. **Set up Vercel secrets** (via Dashboard or CLI)
2. **Push code** to your git repository
3. **Deploy** via Vercel Dashboard or CLI
4. **Verify** deployment at your Vercel URL

### Updating Deployment

1. **Make code changes** locally
2. **Test locally**: `npm start`
3. **Commit and push** to git
4. Vercel auto-deploys (if enabled) or manually redeploy
5. **Verify** changes at Vercel URL

### Updating Environment Variables

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Edit the variable
3. Save
4. **Important**: Redeploy for changes to take effect
   - Go to Deployments tab
   - Click ⋯ menu → Redeploy

---

## 🔐 Security Best Practices

### Safe to Expose (Public in frontend)
✅ `REACT_APP_SUPABASE_URL` - Protected by RLS
✅ `REACT_APP_SUPABASE_ANON_KEY` - Protected by RLS, designed to be public
✅ `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Designed to be public
✅ `REACT_APP_SENTRY_DSN` - Designed to be public

### NEVER Expose in Frontend
❌ `SUPABASE_SERVICE_ROLE_KEY` - This bypasses RLS! Only use in Edge Functions
❌ `STRIPE_SECRET_KEY` - Server-side only! Use in Edge Functions only
❌ `STRIPE_WEBHOOK_SECRET` - Server-side only!

### Key Points
- All `REACT_APP_*` variables are embedded in the frontend build and are public
- Never put sensitive server-side keys in `REACT_APP_*` variables
- Use Supabase Edge Functions for server-side operations requiring sensitive keys
- Enable Row Level Security (RLS) on all Supabase tables

---

## 📞 Getting Your Supabase Credentials

If you don't have your Supabase URL and anon key:

1. Go to https://app.supabase.com
2. Select your **DualTrackOS** project
3. Click **Settings** (gear icon in sidebar)
4. Click **API** in the settings menu
5. Copy:
   - **Project URL**: `https://[project-ref].supabase.co`
   - **anon public key**: Long string starting with `eyJhbG...`

**Where to find your values**:
- Check your local `.env.local` file for `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
- OR get fresh values from Supabase Dashboard → Settings → API

---

## 🎯 Next Steps After Vercel Deployment

Once your frontend is deployed on Vercel:

1. **Test the deployed app**
   - Create a test account
   - Verify Supabase connection works
   - Check that data saves properly

2. **Set up custom domain** (optional)
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Configure DNS records

3. **Configure Stripe webhooks**
   - Point Stripe webhooks to your Supabase Edge Function URL
   - Not to your Vercel frontend URL

4. **Enable Sentry** (optional)
   - Create Sentry project
   - Add DSN to Vercel
   - Set `REACT_APP_SENTRY_ENABLED=true`

5. **Monitor deployments**
   - Check Vercel deployment logs
   - Monitor Sentry for errors
   - Review Supabase logs

---

## 💡 Pro Tips

1. **Use Preview Deployments**: Every git push to a feature branch creates a preview URL for testing
2. **Enable Auto-Deployment**: Vercel can auto-deploy when you push to main/master
3. **Use Environment-Specific Variables**: Set different values for Production vs Preview
4. **Check Build Logs**: If deployment fails, click on the failed deployment to see detailed logs
5. **Test Locally First**: Always run `npm run build` locally before deploying

---

## 📝 Summary

**To fix your current error:**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add secret: `supabase_url` = `https://sgrttaivtqjdkbuvtfus.supabase.co`
3. Add secret: `supabase_anon_key` = (your anon key from .env.local)
4. Add env var: `REACT_APP_STRIPE_PUBLISHABLE_KEY` = (your Stripe key)
5. Save all and redeploy

**Your deployment should succeed!** 🎉
