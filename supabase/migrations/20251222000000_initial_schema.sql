-- DualTrack OS - Initial Database Schema
-- Migration: 20251222000000_initial_schema
-- Description: Creates core tables with Row Level Security policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TABLE: user_data
-- Stores all user application data (Zustand state, preferences, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_data (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Metadata
    app_version TEXT,
    last_sync_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_data_updated_at ON user_data(updated_at);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_data_updated_at
    BEFORE UPDATE ON user_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: subscriptions
-- Stores Stripe subscription information
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Stripe identifiers
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,

    -- Subscription details
    subscription_tier TEXT NOT NULL DEFAULT 'free'
        CHECK (subscription_tier IN ('free', 'starter', 'premium', 'gold')),
    subscription_status TEXT NOT NULL DEFAULT 'active'
        CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid')),

    -- Billing information
    billing_period TEXT CHECK (billing_period IN ('monthly', 'annual')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,

    -- Trial information
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,

    -- Price information
    price_id TEXT, -- Stripe price ID
    amount_total INTEGER, -- Amount in cents
    currency TEXT DEFAULT 'usd',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure one subscription per user
    UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(subscription_status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(subscription_tier);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: audit_logs
-- Tracks important user actions for security and debugging
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Event details
    event_type TEXT NOT NULL, -- 'auth.login', 'subscription.created', 'data.exported', etc.
    event_data JSONB,

    -- Request metadata
    ip_address INET,
    user_agent TEXT,

    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================================
-- TABLE: stripe_events
-- Stores Stripe webhook events for idempotency and debugging
-- ============================================================================
CREATE TABLE IF NOT EXISTS stripe_events (
    id TEXT PRIMARY KEY, -- Stripe event ID
    type TEXT NOT NULL,
    data JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for finding unprocessed events
CREATE INDEX IF NOT EXISTS idx_stripe_events_processed ON stripe_events(processed, created_at);
CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON stripe_events(type);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: user_data
-- Users can only access their own data
-- ============================================================================

-- Allow users to SELECT their own data
CREATE POLICY "Users can view own data"
    ON user_data
    FOR SELECT
    USING (auth.uid() = id);

-- Allow users to INSERT their own data
CREATE POLICY "Users can insert own data"
    ON user_data
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Allow users to UPDATE their own data
CREATE POLICY "Users can update own data"
    ON user_data
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow users to DELETE their own data (for account deletion)
CREATE POLICY "Users can delete own data"
    ON user_data
    FOR DELETE
    USING (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES: subscriptions
-- Users can only view their own subscription
-- Service role can manage all subscriptions (for webhook handler)
-- ============================================================================

-- Allow users to SELECT their own subscription
CREATE POLICY "Users can view own subscription"
    ON subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can INSERT subscriptions (via webhook)
CREATE POLICY "Service role can insert subscriptions"
    ON subscriptions
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- Only service role can UPDATE subscriptions (via webhook)
CREATE POLICY "Service role can update subscriptions"
    ON subscriptions
    FOR UPDATE
    USING (auth.role() = 'service_role');

-- ============================================================================
-- RLS POLICIES: audit_logs
-- Users can view their own logs
-- Only service role can insert logs
-- ============================================================================

-- Allow users to SELECT their own audit logs
CREATE POLICY "Users can view own audit logs"
    ON audit_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can INSERT audit logs
CREATE POLICY "Service role can insert audit logs"
    ON audit_logs
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- RLS POLICIES: stripe_events
-- Only service role can access (backend only)
-- ============================================================================

-- Only service role can manage Stripe events
CREATE POLICY "Service role can manage stripe events"
    ON stripe_events
    FOR ALL
    USING (auth.role() = 'service_role');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get user's current subscription tier
CREATE OR REPLACE FUNCTION get_user_subscription_tier(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    tier TEXT;
BEGIN
    SELECT subscription_tier INTO tier
    FROM subscriptions
    WHERE user_id = user_uuid
    AND subscription_status IN ('active', 'trialing')
    LIMIT 1;

    -- Return 'free' if no active subscription found
    RETURN COALESCE(tier, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM subscriptions
        WHERE user_id = user_uuid
        AND subscription_status IN ('active', 'trialing')
        AND (current_period_end IS NULL OR current_period_end > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit event
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_event_type TEXT,
    p_event_data JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO audit_logs (user_id, event_type, event_data, ip_address, user_agent)
    VALUES (p_user_id, p_event_type, p_event_data, p_ip_address, p_user_agent)
    RETURNING id INTO log_id;

    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default free tier subscription for all existing users
INSERT INTO subscriptions (user_id, subscription_tier, subscription_status)
SELECT id, 'free', 'active'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE user_data IS 'Stores all user application data including Zustand state, preferences, and feature data';
COMMENT ON TABLE subscriptions IS 'Stores Stripe subscription information and manages access tiers';
COMMENT ON TABLE audit_logs IS 'Audit trail for security and compliance (GDPR, data access tracking)';
COMMENT ON TABLE stripe_events IS 'Stores Stripe webhook events for idempotency and debugging';

COMMENT ON FUNCTION get_user_subscription_tier IS 'Returns current subscription tier for a user (free, starter, premium, gold)';
COMMENT ON FUNCTION has_active_subscription IS 'Checks if user has an active paid subscription';
COMMENT ON FUNCTION log_audit_event IS 'Creates an audit log entry for security and compliance tracking';

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant authenticated users access to their own data
GRANT SELECT, INSERT, UPDATE, DELETE ON user_data TO authenticated;
GRANT SELECT ON subscriptions TO authenticated;
GRANT SELECT ON audit_logs TO authenticated;

-- Service role has full access (for backend operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
