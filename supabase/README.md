# Supabase Setup Guide

## Prerequisites

- Supabase account (free tier works)
- Supabase CLI installed globally

## Installation

### 1. Install Supabase CLI

```bash
npm install -g supabase
# or
brew install supabase/tap/supabase
```

### 2. Login to Supabase

```bash
supabase login
```

## Apply Migrations to Your Supabase Project

### Option A: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project: https://app.supabase.com/project/YOUR_PROJECT_ID
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `migrations/20251222000000_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Verify success - you should see "Success. No rows returned"

### Option B: Using Supabase CLI (Recommended for Production)

#### Initialize Supabase in Your Project

```bash
# Run this from the project root (/home/user/DualTrackOS)
supabase init
```

This creates a `supabase/config.toml` file.

#### Link to Your Remote Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
# Find your project ref at: https://app.supabase.com/project/YOUR_PROJECT/settings/general
```

#### Push Migrations to Remote

```bash
supabase db push
```

This will apply all migrations in `supabase/migrations/` to your remote database.

## Verify Setup

Run these queries in the Supabase SQL Editor to verify:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_data', 'subscriptions', 'audit_logs', 'stripe_events');

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check policies exist
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

Expected output:
- 4 tables created
- All tables have `rowsecurity = true`
- Multiple policies per table

## Test RLS Policies

### Test as Authenticated User

```sql
-- This should work (authenticated user accessing own data)
SELECT * FROM user_data WHERE id = auth.uid();

-- This should return empty (can't see other users' data)
SELECT * FROM user_data WHERE id != auth.uid();
```

### Test Subscription Access

```sql
-- View your own subscription
SELECT * FROM subscriptions WHERE user_id = auth.uid();

-- Try to insert (should fail - only service role can insert)
INSERT INTO subscriptions (user_id, subscription_tier)
VALUES (auth.uid(), 'premium');
-- ERROR: new row violates row-level security policy
```

## Reset Database (Development Only)

**⚠️ WARNING: This will delete ALL data**

```bash
supabase db reset
```

## Create New Migration

```bash
supabase migration new your_migration_name
```

This creates a new file in `supabase/migrations/` with timestamp prefix.

## Troubleshooting

### "auth.users" table doesn't exist

If you get this error, your Supabase project might not have auth enabled. Check:
1. Go to **Authentication** → **Settings** in Supabase dashboard
2. Ensure Auth is enabled

### RLS policies blocking legitimate access

Check your auth token:
```sql
SELECT auth.uid(); -- Should return your user ID
SELECT auth.role(); -- Should return 'authenticated' or 'service_role'
```

### Can't connect with Supabase CLI

```bash
# Re-login
supabase logout
supabase login

# Check link status
supabase status
```

## Environment Variables After Setup

After running migrations, update your `.env.local`:

```bash
# Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_new_anon_key_here

# Service role key (NEVER expose to client - backend only!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Next Steps

1. ✅ Migrations applied
2. ⏭️ Set up Supabase Edge Functions (for backend API)
3. ⏭️ Implement Stripe webhook handler
4. ⏭️ Update React app to use new schema

## Database Schema Overview

```
user_data
├── id (UUID, FK to auth.users)
├── data (JSONB) - All app state
├── created_at
└── updated_at

subscriptions
├── id (UUID)
├── user_id (UUID, FK to auth.users)
├── stripe_customer_id
├── stripe_subscription_id
├── subscription_tier (free/starter/premium/gold)
├── subscription_status (active/cancelled/past_due/trialing)
├── billing_period (monthly/annual)
├── current_period_end
└── ... (see migration for full schema)

audit_logs
├── id (UUID)
├── user_id (UUID, FK to auth.users)
├── event_type
├── event_data (JSONB)
└── created_at

stripe_events
├── id (TEXT) - Stripe event ID
├── type
├── data (JSONB)
├── processed
└── created_at
```

## Helper Functions Available

```sql
-- Get user's subscription tier
SELECT get_user_subscription_tier(auth.uid());
-- Returns: 'free', 'starter', 'premium', or 'gold'

-- Check if user has active subscription
SELECT has_active_subscription(auth.uid());
-- Returns: true or false

-- Log audit event (from backend)
SELECT log_audit_event(
    user_id := 'uuid-here',
    event_type := 'subscription.created',
    event_data := '{"tier": "premium"}'::jsonb
);
```

## Security Notes

1. ✅ **RLS Enabled**: All tables have Row Level Security
2. ✅ **User Isolation**: Users can only access their own data
3. ✅ **Service Role Only**: Subscription modifications require service role
4. ✅ **Audit Trail**: All important actions logged to audit_logs
5. ✅ **Idempotent Webhooks**: stripe_events prevents duplicate processing

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Migration Issues: Check `/supabase/migrations/` files for syntax errors
