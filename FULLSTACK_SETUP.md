# 🚀 Full-Stack Setup Guide
## Get DualTrack OS Live with Payments & Cloud Sync in 30 Minutes

---

## 📊 What You're Building

✅ **Cloud Auth**: Users sign in with Google
✅ **Cloud Sync**: Data syncs across devices
✅ **Payments**: Collect $97/month via Stripe
✅ **Production Deploy**: Live on Vercel

**Current Status**: ✅ Code is ready. You just need to configure the services.

---

## 🎯 Step 1: Set Up Supabase (10 minutes)

### Why Supabase?
- Free tier: 500MB database, 50,000 monthly active users
- Built-in auth (Google, email, etc.)
- Real-time database
- Auto-scales

### Setup Instructions:

1. **Create Account**
   ```
   Go to: https://supabase.com
   Click "Start your project"
   Sign up with GitHub (recommended)
   ```

2. **Create New Project**
   ```
   Project name: dualtrack-prod
   Database password: (generate strong password - save it!)
   Region: Choose closest to your users
   Click "Create new project"
   Wait 2-3 minutes for setup
   ```

3. **Get API Keys**
   ```
   Click "Settings" (gear icon)
   →Click "API"
   Copy these two values:

   ✓ Project URL (looks like: https://xxx.supabase.co)
   ✓ anon/public key (starts with "eyJ...")
   ```

4. **Create Database Table**
   ```
   Click "SQL Editor" (left sidebar)
   Click "New query"
   Paste this SQL:
   ```

   ```sql
   -- Create user_data table
   CREATE TABLE user_data (
     id uuid references auth.users ON DELETE CASCADE,
     data jsonb NOT NULL,
     updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
     PRIMARY KEY (id)
   );

   -- Enable Row Level Security
   ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

   -- Create policy: Users can only access their own data
   CREATE POLICY "Users can CRUD own data"
     ON user_data
     FOR ALL
     USING (auth.uid() = id)
     WITH CHECK (auth.uid() = id);

   -- Create index for performance
   CREATE INDEX user_data_updated_at_idx ON user_data(updated_at DESC);
   ```

   ```
   Click "Run" (or press Cmd/Ctrl + Enter)
   You should see "Success. No rows returned"
   ```

5. **Enable Google Auth**
   ```
   Click "Authentication" (left sidebar)
   → Click "Providers"
   → Find "Google" and click to expand
   → Toggle "Enable Sign in with Google"

   You'll need:
   - Google Client ID
   - Google Client Secret

   Get these from Google Cloud Console:
   ```

   **Get Google OAuth Credentials:**
   ```
   Go to: https://console.cloud.google.com
   Create new project or select existing
   → APIs & Services → Credentials
   → Create Credentials → OAuth 2.0 Client ID
   → Application type: Web application
   → Name: DualTrack OS
   → Authorized redirect URIs:
      https://xxx.supabase.co/auth/v1/callback
      (Replace xxx with your Supabase project ID)
   → Create
   → Copy Client ID and Client Secret

   Paste into Supabase Google provider settings
   → Click "Save"
   ```

---

## 💳 Step 2: Set Up Stripe (10 minutes)

### Why Stripe?
- Industry standard for payments
- 2.9% + 30¢ per transaction
- Payment Links = no code needed
- Handles taxes, invoices, subscriptions

### Setup Instructions:

1. **Create Account**
   ```
   Go to: https://dashboard.stripe.com/register
   Sign up with email
   Verify email
   Skip "Activate payments" for now
   ```

2. **Create Elite Payment Link**
   ```
   Click "Payment Links" (left sidebar)
   → Click "New"
   → Product name: "DualTrack Elite Membership"
   → Amount: $97.00 USD
   → Billing period: Monthly
   → Description: "Premium access to DualTrack OS with coaching and community"
   → Click "Create link"
   → Copy the payment link (looks like: https://buy.stripe.com/xxx)
   ```

3. **(Optional) Create Starter Plan**
   ```
   Click "New" again
   → Product name: "DualTrack Starter"
   → Amount: $19.00 USD
   → Billing period: Monthly
   → Click "Create link"
   → Copy the link
   ```

4. **Get API Keys**
   ```
   Click "Developers" (top right)
   → Click "API keys"
   → Copy "Publishable key" (starts with pk_test_...)

   Note: You're in TEST mode (see toggle top right)
   Use test mode until you get first beta customers
   Then activate your account and switch to LIVE mode
   ```

5. **Test Mode Credit Cards**
   ```
   Use these for testing:
   Card number: 4242 4242 4242 4242
   Expiry: Any future date (e.g., 12/34)
   CVC: Any 3 digits (e.g., 123)
   ZIP: Any 5 digits (e.g., 12345)
   ```

---

## 🌐 Step 3: Configure Your App (5 minutes)

1. **Create Environment File**
   ```bash
   cd /home/user/DualTrackOS
   cp .env.example .env.local
   ```

2. **Edit .env.local**
   ```bash
   # Paste your Supabase credentials
   REACT_APP_SUPABASE_URL=https://yourproject.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJ...your-anon-key...

   # Paste your Stripe payment links
   REACT_APP_STRIPE_ELITE_PAYMENT_LINK=https://buy.stripe.com/xxx
   REACT_APP_STRIPE_STARTER_PAYMENT_LINK=https://buy.stripe.com/yyy
   ```

3. **Test Locally**
   ```bash
   npm start
   ```

   Visit http://localhost:3000
   - Try signing in with Google
   - Add some data (gratitudes, tasks, etc.)
   - Sign out and sign back in
   - Verify data persists (cloud sync working!)

---

## 🚀 Step 4: Deploy to Vercel (5 minutes)

### Why Vercel?
- Free tier: Unlimited bandwidth, 100GB free
- Auto-deploys from Git
- Global CDN (fast worldwide)
- Built by the Next.js team

### Setup Instructions:

1. **Push to Git (if not already)**
   ```bash
   git add .
   git commit -m "Add Supabase auth and Stripe payments"
   git push -u origin claude/review-mvp-master-plan-eKpTu
   ```

2. **Create Vercel Account**
   ```
   Go to: https://vercel.com/signup
   Sign up with GitHub (easiest)
   ```

3. **Import Project**
   ```
   Click "Add New..." → "Project"
   → Find "DualTrackOS" repository
   → Click "Import"
   → Branch: claude/review-mvp-master-plan-eKpTu
   → Framework Preset: Create React App (auto-detected)
   → Click "Deploy"
   ```

4. **Add Environment Variables**
   ```
   BEFORE clicking deploy, click "Environment Variables"
   Add these one by one:

   Name: REACT_APP_SUPABASE_URL
   Value: (paste from .env.local)

   Name: REACT_APP_SUPABASE_ANON_KEY
   Value: (paste from .env.local)

   Name: REACT_APP_STRIPE_ELITE_PAYMENT_LINK
   Value: (paste from .env.local)

   Click "Add" for each
   ```

5. **Deploy!**
   ```
   Click "Deploy"
   Wait 2-3 minutes
   You'll get a URL like: dualtrack-os-xxx.vercel.app
   ```

6. **Update Supabase Redirect**
   ```
   Copy your Vercel URL
   Go back to Supabase
   → Authentication → URL Configuration
   → Site URL: https://your-app.vercel.app
   → Redirect URLs: https://your-app.vercel.app
   → Click "Save"
   ```

7. **Add Custom Domain (Optional)**
   ```
   In Vercel:
   → Click "Settings" → "Domains"
   → Add domain: dualtrack.app
   → Follow DNS instructions
   → Wait 24-48 hours for DNS propagation
   ```

---

## ✅ Step 5: Test Everything

### Auth Test:
1. Visit your Vercel URL
2. Click "Insights" tab
3. Click "Sign In with Google"
4. Grant permissions
5. Should see "✓ Signed in as you@email.com"

### Data Sync Test:
1. Add a gratitude on desktop
2. Open app on phone (same Google account)
3. Sign in
4. Should see same gratitude (cloud sync working!)

### Payment Test:
1. Click "⭐ Upgrade to Elite"
2. Should redirect to Stripe
3. Enter test card: 4242 4242 4242 4242
4. Complete purchase
5. Go to Stripe Dashboard → Payments
6. Should see test payment

---

## 📊 Revenue Dashboard

### Track Your Metrics:

**Stripe Dashboard**
```
https://dashboard.stripe.com
- MRR (Monthly Recurring Revenue)
- Churn rate
- Successful payments
- Failed payments
```

**Supabase Dashboard**
```
https://app.supabase.com
- Total users
- Daily active users
- Database size
```

**Vercel Analytics**
```
https://vercel.com/analytics
- Page views
- Unique visitors
- Geographic distribution
```

---

## 💰 Going Live (After Beta Testing)

### When You Have 10-20 Beta Users:

1. **Activate Stripe Account**
   ```
   Stripe Dashboard → Activate your account
   Provide:
   - Business details
   - Bank account (for payouts)
   - Tax information
   ```

2. **Switch to Production Mode**
   ```
   Toggle "Test mode" OFF (top right in Stripe)
   Create NEW payment links in production mode
   Update .env.local with production links
   Redeploy on Vercel
   ```

3. **Go Live Checklist**
   - ✅ 20+ beta testimonials
   - ✅ No critical bugs
   - ✅ 40%+ Day-7 retention
   - ✅ Stripe account activated
   - ✅ Custom domain configured
   - ✅ Legal pages (Privacy, Terms)

---

## 🔥 Marketing Integration

### Add These Next (Week 2):

**Email Marketing (Loops.so)**
```
Free tier: 1,000 contacts
- Welcome email sequence
- Weekly digest
- Abandoned cart recovery
Integration: 15 minutes
```

**Analytics (PostHog)**
```
Free tier: 1M events/month
- User behavior tracking
- Funnel analysis
- Feature flags
Integration: 10 minutes
```

**Customer Support (Intercom)**
```
$74/month
- Live chat
- Knowledge base
- Email support
Integration: 20 minutes
```

---

## 🚨 Common Issues & Fixes

### "Supabase not configured" shows in app
```
Problem: Environment variables not set
Fix: Check .env.local exists and has correct values
     Restart npm start after editing
```

### Google sign-in doesn't work
```
Problem: Redirect URI mismatch
Fix: In Google Cloud Console, add:
     https://yourproject.supabase.co/auth/v1/callback
     https://your-app.vercel.app
```

### Data not syncing
```
Problem: Row Level Security blocking writes
Fix: Run the SQL policy creation again (Step 1.4)
     Check browser console for errors
```

### Stripe payment link doesn't appear
```
Problem: Environment variable not set
Fix: Add REACT_APP_STRIPE_ELITE_PAYMENT_LINK to:
     1. .env.local (for local dev)
     2. Vercel Environment Variables (for production)
     Redeploy
```

---

## 💡 Next Steps

**Week 1: Beta Launch**
```bash
# You're ready to launch! Share on LinkedIn:
"I built a perimenopause tracking OS for dual-career women.

Looking for 50 beta testers (free lifetime access).

Features:
✓ Real-time health tracking
✓ Pomodoro focus timer
✓ Daily planning system
✓ Cloud sync across devices

DM 'TRACK' for early access"
```

**Week 2-4: Paid Launch**
```
- Collect testimonials from beta users
- Create pricing page
- Launch Elite program ($97/month)
- Target: 20 paying customers
- Expected MRR: $1,940
```

**Month 2: Corporate Pilots**
```
- Create corporate pitch deck
- Email 50 HR departments
- Target: 1 pilot at $25K
- Expected ARR: $25K + individual MRR
```

---

## 🎯 Success Metrics

### Track Weekly:

| Metric | Week 1 | Week 4 | Week 8 |
|--------|--------|--------|--------|
| **Users** | 50 | 200 | 500 |
| **Paid** | 0 | 20 | 75 |
| **MRR** | $0 | $1,940 | $7,275 |
| **Retention** | N/A | 40% | 50% |

---

## 🙋‍♀️ Support

**If you get stuck:**

1. Check browser console for errors (F12)
2. Check Supabase logs (Dashboard → Logs)
3. Check Vercel deployment logs
4. Search error message on Stack Overflow
5. Ask in Supabase Discord: https://discord.supabase.com

---

## 🎉 You Did It!

Your full-stack app is now:
- ✅ Accepting payments
- ✅ Syncing data to cloud
- ✅ Deployed to production
- ✅ Ready for users

**Time to get your first customer!** 🚀
