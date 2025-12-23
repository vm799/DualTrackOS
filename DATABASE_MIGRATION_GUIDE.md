# 🗄️ Database Migration Guide - DualTrack OS

**CRITICAL**: You must run this migration BEFORE deploying Edge Functions

---

## Current State

✅ **Existing**: `user_data` table
❌ **Missing**: `subscriptions`, `audit_logs`, `stripe_events` tables

**Why This Matters**: The Edge Functions (payment processing) require the `subscriptions` and `stripe_events` tables to work. Without these tables, payments will fail.

---

## Quick Migration (5 minutes)

### Option 1: Supabase CLI (Recommended)

```bash
# 1. Login to Supabase (if not already)
supabase login

# 2. Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# 3. Apply migration
supabase db push

# 4. Verify tables created
# Go to Supabase Dashboard → Table Editor
# You should see: user_data, subscriptions, audit_logs, stripe_events
```

### Option 2: Supabase Dashboard (Manual SQL)

**If CLI doesn't work or you prefer manual approach**:

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy the ENTIRE contents of `supabase/migrations/20251222000000_initial_schema.sql`
4. Paste into SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. Verify in Table Editor that 3 new tables appeared

---

## What This Migration Creates

### 1. `subscriptions` Table
**Purpose**: Stores Stripe subscription data

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | References auth.users |
| stripe_customer_id | TEXT | Stripe customer ID |
| stripe_subscription_id | TEXT | Stripe subscription ID |
| subscription_tier | TEXT | free, starter, premium, gold |
| subscription_status | TEXT | active, cancelled, trialing, etc. |
| current_period_end | TIMESTAMP | When subscription expires |
| trial_end | TIMESTAMP | When trial expires |
| amount_total | INTEGER | Price in cents |

**RLS Policies**:
- ✅ Users can view their own subscription
- ✅ Only service_role can insert/update (webhook handler)

### 2. `stripe_events` Table
**Purpose**: Idempotency for webhook processing (prevents duplicate charges)

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Stripe event ID (primary key) |
| type | TEXT | Event type (checkout.session.completed, etc.) |
| data | JSONB | Full Stripe event payload |
| processed | BOOLEAN | Whether event was handled |
| processed_at | TIMESTAMP | When processed |
| error | TEXT | Error message if processing failed |

**RLS Policies**:
- ✅ Only service_role can access (backend only)

### 3. `audit_logs` Table
**Purpose**: GDPR compliance and security tracking

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | User who performed action |
| event_type | TEXT | auth.login, subscription.created, etc. |
| event_data | JSONB | Additional context |
| ip_address | INET | User's IP address |
| user_agent | TEXT | Browser/device info |
| created_at | TIMESTAMP | When event occurred |

**RLS Policies**:
- ✅ Users can view their own audit logs
- ✅ Only service_role can insert logs

### 4. Helper Functions Created

```sql
-- Get user's subscription tier
get_user_subscription_tier(user_uuid UUID) → TEXT

-- Check if user has active subscription
has_active_subscription(user_uuid UUID) → BOOLEAN

-- Create audit log entry
log_audit_event(user_id, event_type, event_data, ip, user_agent) → UUID
```

---

## Verification Checklist

After running the migration, verify everything works:

### ✅ Step 1: Check Tables Exist

Go to **Supabase Dashboard → Table Editor**

You should see 4 tables:
- [x] `user_data` (already existed)
- [ ] `subscriptions` (NEW)
- [ ] `audit_logs` (NEW)
- [ ] `stripe_events` (NEW)

### ✅ Step 2: Check RLS Policies

**For `subscriptions` table**:
1. Click on table → "RLS Policies" tab
2. You should see 3 policies:
   - "Users can view own subscription" (SELECT)
   - "Service role can insert subscriptions" (INSERT)
   - "Service role can update subscriptions" (UPDATE)

**For `user_data` table**:
1. Should have 4 policies (SELECT, INSERT, UPDATE, DELETE)

**For `audit_logs` table**:
1. Should have 2 policies (SELECT for users, INSERT for service_role)

**For `stripe_events` table**:
1. Should have 1 policy (service_role only)

### ✅ Step 3: Check Functions

Go to **Supabase Dashboard → Database → Functions**

You should see 3 new functions:
- [ ] `get_user_subscription_tier`
- [ ] `has_active_subscription`
- [ ] `log_audit_event`

### ✅ Step 4: Test Subscription Query

Run this in SQL Editor:

```sql
-- Should return 'free' for your test user
SELECT get_user_subscription_tier(auth.uid());

-- Should return false (no paid subscription yet)
SELECT has_active_subscription(auth.uid());
```

### ✅ Step 5: Test RLS Policies

**Test as authenticated user**:

```sql
-- Should work (view own subscription)
SELECT * FROM subscriptions WHERE user_id = auth.uid();

-- Should fail with RLS error (can't view others' subscriptions)
SELECT * FROM subscriptions WHERE user_id != auth.uid();

-- Should fail (only service_role can insert)
INSERT INTO subscriptions (user_id, subscription_tier) VALUES (auth.uid(), 'premium');
```

---

## Common Issues & Fixes

### Issue 1: "relation subscriptions already exists"

**Cause**: Migration already ran partially

**Fix**:
```sql
-- Drop tables and re-run migration
DROP TABLE IF EXISTS stripe_events CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Then re-run the full migration
```

### Issue 2: "must be owner of function update_updated_at_column"

**Cause**: Function already exists from previous attempt

**Fix**:
```sql
-- Drop the function and re-run
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Then re-run the full migration
```

### Issue 3: "permission denied for schema auth"

**Cause**: User doesn't have access to auth schema

**Fix**: This is normal. The migration references `auth.users` which is Supabase's built-in auth table. Make sure you're running as the database owner (you should be if using the dashboard).

### Issue 4: Migration runs but no tables appear

**Cause**: Transaction may have rolled back

**Fix**:
1. Check for errors in the SQL output
2. Scroll through ENTIRE migration output for red errors
3. Fix any errors and re-run
4. Verify with: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`

---

## Rollback (if needed)

If something goes wrong, you can rollback:

```sql
-- Remove all tables created by migration
DROP TABLE IF EXISTS stripe_events CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Remove functions
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS get_user_subscription_tier CASCADE;
DROP FUNCTION IF EXISTS has_active_subscription CASCADE;
DROP FUNCTION IF EXISTS log_audit_event CASCADE;

-- user_data table is NOT dropped (already existed)
```

---

## After Migration: Update .env.local

Once migration is complete, you may need to add Supabase service role key for local testing:

```env
# .env.local

# Public keys (already configured)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key

# Service role key (ONLY for local Edge Functions testing)
# NEVER commit this or expose in client-side code!
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Get from: Supabase Dashboard → Settings → API → service_role secret
```

**⚠️ WARNING**: The `service_role` key bypasses ALL RLS policies. Never use it in client-side code!

---

## Next Steps

After successful migration:

1. ✅ Verify all tables exist in Dashboard
2. ✅ Verify RLS policies are in place
3. ✅ Test functions work
4. ➡️ **Proceed to Edge Functions deployment** (see `EDGE_FUNCTIONS_DEPLOYMENT.md`)

---

## Migration Timeline

| Step | Time | Difficulty |
|------|------|------------|
| Login to Supabase CLI | 2 min | Easy |
| Link to project | 1 min | Easy |
| Run migration | 1 min | Easy |
| Verify tables | 1 min | Easy |
| **Total** | **5 min** | **Easy** |

---

## Security Notes

### ✅ What This Migration Does for Security

1. **Row Level Security (RLS)**: Users can ONLY access their own data
2. **Service Role Protection**: Payment data can only be modified by backend
3. **Audit Logging**: All important actions are tracked for GDPR compliance
4. **Idempotency**: Duplicate Stripe events are automatically prevented
5. **Cascade Deletion**: When user deletes account, all their data is removed

### ✅ What's Protected

- Users cannot view others' subscriptions
- Users cannot modify their own subscription tier (prevents free → premium hack)
- Users cannot access Stripe webhook events
- Only Edge Functions (with service_role key) can create/update subscriptions

---

## GDPR Compliance

The `audit_logs` table helps with GDPR requirements:

### Right to Access
```sql
-- User can view all their audit logs
SELECT event_type, created_at, event_data
FROM audit_logs
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### Right to Data Portability
```sql
-- Export all user data (for GDPR data export)
SELECT
    u.data as app_data,
    s.subscription_tier,
    s.subscription_status,
    a.event_type,
    a.created_at
FROM user_data u
LEFT JOIN subscriptions s ON s.user_id = u.id
LEFT JOIN audit_logs a ON a.user_id = u.id
WHERE u.id = auth.uid();
```

### Right to Erasure
```sql
-- Delete all user data (CASCADE handles subscriptions, audit logs, etc.)
DELETE FROM auth.users WHERE id = auth.uid();
```

---

## Support

### If Migration Fails

1. **Take a screenshot** of the error message
2. **Copy the exact SQL error** from the output
3. Check the "Common Issues" section above
4. Verify you're using the correct Supabase project
5. Check that you have Owner/Admin role in Supabase project

### Need Help?

- **Supabase Docs**: https://supabase.com/docs/guides/database/migrations
- **Supabase Support**: Dashboard → Support (for paid plans)
- **Community**: https://github.com/supabase/supabase/discussions

---

## Summary

**Before Migration**: 1 table (`user_data`)
**After Migration**: 4 tables + 3 helper functions + RLS policies

**Critical for**: Payment processing, GDPR compliance, security

**Time Required**: 5 minutes
**Difficulty**: Easy (copy-paste SQL or run one CLI command)

**Next Step**: Deploy Edge Functions (see `EDGE_FUNCTIONS_DEPLOYMENT.md`)

---

**Last Updated**: December 23, 2025
**Migration File**: `supabase/migrations/20251222000000_initial_schema.sql`
