import { supabase } from '../supabaseClient';

/**
 * Stripe Service - Server-Side Implementation
 * All Stripe operations go through Supabase Edge Functions for security
 *
 * SETUP REQUIRED:
 * 1. Deploy Supabase Edge Functions (see /supabase/functions/README.md)
 * 2. Configure Stripe secrets in Supabase
 * 3. Set up Stripe webhook
 */

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;

/**
 * Create Checkout Session via Backend
 *
 * Calls Supabase Edge Function which creates a Stripe Checkout session
 *
 * @param {string} tier - Subscription tier (starter, premium, gold)
 * @param {string} billingPeriod - Billing period (monthly, annual)
 * @param {object} options - Additional options
 * @param {string} options.successUrl - URL to redirect after success (optional)
 * @param {string} options.cancelUrl - URL to redirect if cancelled (optional)
 * @returns {Promise<{sessionId?: string, url?: string, error?: string}>}
 */
export const createCheckoutSession = async (tier, billingPeriod, options = {}) => {
  try {
    // Validate inputs
    if (!['starter', 'premium', 'gold'].includes(tier)) {
      throw new Error(`Invalid tier: ${tier}`);
    }
    if (!['monthly', 'annual'].includes(billingPeriod)) {
      throw new Error(`Invalid billing period: ${billingPeriod}`);
    }

    if (!supabase) {
      return {
        error: 'Supabase is not configured. Please set up your environment variables.',
      };
    }

    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return {
        error: 'You must be logged in to upgrade your subscription.',
      };
    }

    // Build success and cancel URLs
    const baseUrl = window.location.origin;
    const successUrl = options.successUrl || `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&upgrade_success=true`;
    const cancelUrl = options.cancelUrl || `${baseUrl}/pricing?upgrade_cancelled=true`;

    // Call backend Edge Function to create checkout session
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tier,
        billingPeriod,
        successUrl,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const data = await response.json();

    // Redirect to Stripe Checkout
    if (data.url) {
      window.location.href = data.url;
    }

    return {
      sessionId: data.sessionId,
      url: data.url,
    };

  } catch (err) {
    console.error('Checkout session error:', err);
    return { error: err.message || 'Failed to start checkout' };
  }
};

/**
 * Get User's Current Subscription
 *
 * Fetches subscription details from Supabase
 *
 * @returns {Promise<{tier: string, status: string, periodEnd: string, error?: string}>}
 */
export const getUserSubscription = async () => {
  try {
    if (!supabase) {
      return { error: 'Supabase not configured', tier: 'free', status: 'active' };
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: 'Not authenticated', tier: 'free', status: 'active' };
    }

    // Query subscriptions table
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // User doesn't have a subscription record yet
      if (error.code === 'PGRST116') {
        return { tier: 'free', status: 'active' };
      }
      throw error;
    }

    return {
      tier: data.subscription_tier || 'free',
      status: data.subscription_status || 'active',
      periodEnd: data.current_period_end,
      cancelAtPeriodEnd: data.cancel_at_period_end,
      billingPeriod: data.billing_period,
      stripeCustomerId: data.stripe_customer_id,
    };

  } catch (err) {
    console.error('Error fetching subscription:', err);
    return { error: err.message, tier: 'free', status: 'active' };
  }
};

/**
 * Create Customer Portal Session
 * Allows users to manage their subscription (upgrade, downgrade, cancel)
 *
 * TODO: Implement Edge Function for this
 *
 * @returns {Promise<{url?: string, error?: string}>}
 */
export const createCustomerPortalSession = async () => {
  try {
    if (!supabase) {
      return { error: 'Supabase not configured' };
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { error: 'You must be logged in' };
    }

    // TODO: Create edge function for customer portal
    // For now, redirect to Stripe's customer portal manually
    // This requires creating a customer portal edge function

    return {
      error: 'Customer portal is not yet implemented. Please contact support to manage your subscription.',
    };

  } catch (err) {
    console.error('Customer portal error:', err);
    return { error: err.message || 'Failed to create portal session' };
  }
};

/**
 * Cancel Subscription
 * Cancels the user's subscription at the end of the billing period
 *
 * TODO: Implement Edge Function for this
 *
 * @returns {Promise<{success?: boolean, error?: string}>}
 */
export const cancelSubscription = async () => {
  try {
    if (!supabase) {
      return { error: 'Supabase not configured' };
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { error: 'You must be logged in' };
    }

    // TODO: Create edge function for cancellation
    // This should call Stripe API to cancel subscription at period end

    return {
      error: 'Cancellation is not yet implemented. Please contact support.',
    };

  } catch (err) {
    console.error('Cancellation error:', err);
    return { error: err.message || 'Failed to cancel subscription' };
  }
};

/**
 * Verify Stripe is configured
 * @returns {boolean}
 */
export const isStripeConfigured = () => {
  return !!SUPABASE_URL && !!supabase;
};

/**
 * Get checkout status from URL params
 * Call this after user returns from Stripe checkout
 *
 * @returns {{success: boolean, sessionId?: string, cancelled: boolean}}
 */
export const getCheckoutStatus = () => {
  const params = new URLSearchParams(window.location.search);

  return {
    success: params.get('upgrade_success') === 'true',
    sessionId: params.get('session_id'),
    cancelled: params.get('upgrade_cancelled') === 'true',
  };
};

/**
 * Sync subscription status with Stripe
 * Useful after user returns from checkout to ensure latest status
 *
 * The webhook should handle this automatically, but this provides
 * a manual sync option if needed
 *
 * @returns {Promise<{success?: boolean, error?: string}>}
 */
export const syncSubscriptionStatus = async () => {
  try {
    // Just refetch from database - webhook should have updated it
    const subscription = await getUserSubscription();

    if (subscription.error) {
      return { error: subscription.error };
    }

    return { success: true, subscription };

  } catch (err) {
    console.error('Sync error:', err);
    return { error: err.message || 'Failed to sync subscription' };
  }
};

const stripeService = {
  createCheckoutSession,
  getUserSubscription,
  createCustomerPortalSession,
  cancelSubscription,
  isStripeConfigured,
  getCheckoutStatus,
  syncSubscriptionStatus,
};

export default stripeService;
