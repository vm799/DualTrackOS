-- Migration: Add lifetime subscription support for AppSumo deals
-- Created: 2026-01-02

-- Add new columns to subscriptions table
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS is_lifetime BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS appsumo_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS appsumo_plan_id TEXT;

-- Index for fast code lookups during redemption
CREATE INDEX IF NOT EXISTS idx_subscriptions_appsumo_code
  ON subscriptions(appsumo_code)
  WHERE appsumo_code IS NOT NULL;

-- Comments for documentation
COMMENT ON COLUMN subscriptions.is_lifetime IS
  'True for AppSumo lifetime deals - subscription never expires';
COMMENT ON COLUMN subscriptions.appsumo_code IS
  'Unique AppSumo redemption code (format: APPSUMO-XXXX-XXXX)';
COMMENT ON COLUMN subscriptions.appsumo_plan_id IS
  'AppSumo plan tier (appsumo_ltd1, appsumo_ltd2, appsumo_ltd3)';

-- Update RLS policies to allow users to view their own AppSumo subscriptions
-- (Existing policies should already cover this, but verify)

-- Update helper function to recognize lifetime subscriptions
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM subscriptions
    WHERE user_id = user_uuid
      AND (
        -- Regular active subscriptions
        (subscription_status = 'active' AND NOT is_lifetime)
        OR
        -- Lifetime subscriptions (always active)
        (is_lifetime = TRUE)
      )
  );
$$;

COMMENT ON FUNCTION has_active_subscription IS
  'Returns true if user has an active subscription OR a lifetime deal';
