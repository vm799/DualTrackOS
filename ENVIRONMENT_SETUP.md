# Environment Setup & Security Guide

## ✅ Conflicts Resolved

The merge conflicts with the `main` branch have been successfully resolved:

- **`.env.example`** - Kept in repository (contains safe placeholder values)
- **`.env`** - Removed from git (contained real secrets - NOT SAFE)
- **`.env.local`** - Protected by `.gitignore` (for your actual secrets)

## 🔒 Security Status

### Protected Files (Safe ✅)
These files are in `.gitignore` and will **NEVER** be committed to git:
- `.env`
- `.env.local`
- `.env.development.local`
- `.env.test.local`
- `.env.production.local`

### Public Files (Safe ✅)
- `.env.example` - Contains placeholder values only, safe to commit

## 📝 How to Add Your API Keys

### Step 1: Create Your Local Environment File

```bash
# Copy the example file
cp .env.example .env.local
```

### Step 2: Edit `.env.local` with Your Real Keys

Open `.env.local` in your editor and replace the placeholder values:

```bash
# Supabase Configuration
# Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api
REACT_APP_SUPABASE_URL=https://your-actual-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key

# Stripe Configuration
# Get these from: https://dashboard.stripe.com/apikeys
REACT_APP_STRIPE_STARTER_PAYMENT_LINK=https://buy.stripe.com/test_your-actual-link
```

### Step 3: Verify Security

Run this command to ensure your secrets are protected:

```bash
# This should return EMPTY (no .env or .env.local files)
git ls-files | grep -E "\.env$|\.env\.local$"

# This should return ONLY .env.example
git ls-files | grep "\.env"
```

## 🚨 CRITICAL SECURITY RULES

### ❌ NEVER DO THIS:
- **NEVER** commit `.env` or `.env.local` to git
- **NEVER** share your `.env.local` file with anyone
- **NEVER** post your API keys in issues, pull requests, or public forums
- **NEVER** use real API keys in `.env.example` (use placeholders only)

### ✅ ALWAYS DO THIS:
- **ALWAYS** use `.env.local` for your actual secrets
- **ALWAYS** keep `.env.example` with placeholder values
- **ALWAYS** verify `.gitignore` includes `.env` and `.env.local`
- **ALWAYS** rotate keys immediately if accidentally exposed

## 🔑 Getting Your API Keys

### Supabase Keys
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **Anon/Public Key** → `REACT_APP_SUPABASE_ANON_KEY`

### Stripe Payment Links
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Go to Products → Add Product
3. Create "DualTrackOS Starter" for $19/month
4. Generate payment link
5. Copy the link → `REACT_APP_STRIPE_STARTER_PAYMENT_LINK`

## 🧪 Testing Your Setup

After adding your keys to `.env.local`:

```bash
# Restart your development server
npm start
```

The app should now:
- ✅ Allow Google OAuth login via Supabase
- ✅ Sync data to Supabase cloud
- ✅ Display Stripe payment link on payment page

## 🛡️ What If Keys Are Exposed?

If you accidentally commit API keys to git:

1. **Immediately rotate the keys:**
   - Supabase: Settings → API → Reset keys
   - Stripe: Dashboard → API Keys → Roll keys

2. **Remove from git history:**
   ```bash
   # WARNING: This rewrites history - coordinate with team first
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force push (if you have permission):**
   ```bash
   git push --force
   ```

4. **Update your `.env.local` with new keys**

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Payment Links](https://stripe.com/docs/payment-links)
- [Twelve-Factor App - Config](https://12factor.net/config)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Remember: Your API keys are like passwords. Guard them carefully!** 🔐
