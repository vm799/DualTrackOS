# Vercel Deployment - Quick Reference Card

## 🚨 Fix "Secret does not exist" Error

### Step 1: Go to Vercel Dashboard
https://vercel.com/dashboard → Select **DualTrackOS** → **Settings** → **Environment Variables**

### Step 2: Add These Secrets/Variables

Copy-paste these exactly (case-sensitive):

#### Secret 1: supabase_url
```
Name: supabase_url
Value: [Get from: Supabase Dashboard → Settings → API → Project URL]
       OR from your .env.local file (REACT_APP_SUPABASE_URL)
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Secret 2: supabase_anon_key
```
Name: supabase_anon_key
Value: [Get from: Supabase Dashboard → Settings → API → anon public key]
       OR from your .env.local file (REACT_APP_SUPABASE_ANON_KEY)
       Starts with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 3: REACT_APP_STRIPE_PUBLISHABLE_KEY (Optional)
```
Name: REACT_APP_STRIPE_PUBLISHABLE_KEY
Value: [Your Stripe publishable key from https://dashboard.stripe.com/apikeys]
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 4: REACT_APP_SENTRY_DSN (Optional)
```
Name: REACT_APP_SENTRY_DSN
Value: [Your Sentry DSN or leave empty]
Environment: ✅ Production ✅ Preview ✅ Development
```

### Step 3: Redeploy
Go to **Deployments** tab → Click **⋯** on failed deployment → **Redeploy**

---

## ⚠️ Common Mistakes

❌ **WRONG**: Adding `@` before the secret name
✅ **RIGHT**: Just `supabase_url` (no @ symbol)

❌ **WRONG**: Adding `REACT_APP_` prefix to secrets
✅ **RIGHT**: `supabase_url` and `supabase_anon_key` (no prefix)

❌ **WRONG**: Forgetting to select all 3 environments
✅ **RIGHT**: Check Production, Preview, AND Development

❌ **WRONG**: Forgetting to redeploy after adding secrets
✅ **RIGHT**: Always redeploy for changes to take effect

---

## 📞 Need Your Credentials?

### Get Supabase URL and Anon Key:
1. Go to https://app.supabase.com
2. Select your project
3. Settings → API
4. Copy "Project URL" and "anon public" key

### Get Stripe Publishable Key:
1. Go to https://dashboard.stripe.com/apikeys
2. Copy the "Publishable key" (starts with pk_test_ or pk_live_)
3. **Use TEST key** (`pk_test_`) for initial deployment

---

## 🎯 That's It!

After adding these 2-4 variables, your Vercel deployment should succeed.

Full details in: `VERCEL_DEPLOYMENT_GUIDE.md`
