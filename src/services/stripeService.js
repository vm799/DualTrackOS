import { loadStripe } from '@stripe/stripe-js';

/**
 * Stripe Service
 * Handles all Stripe payment processing for subscriptions
 *
 * SETUP REQUIRED:
 * 1. Create Stripe account at https://stripe.com
 * 2. Get your publishable key from https://dashboard.stripe.com/apikeys
 * 3. Create products and prices in Stripe Dashboard
 * 4. Replace STRIPE_PUBLISHABLE_KEY and price IDs below
 */

// TODO: Replace with your actual Stripe publishable key
// Get from: https://dashboard.stripe.com/apikeys
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE';

// Initialize Stripe (lazy loaded)
let stripePromise = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Stripe Price IDs
 *
 * TODO: Create these products in your Stripe Dashboard:
 * 1. Go to https://dashboard.stripe.com/products
 * 2. Create a product for each tier (Starter, Premium, Gold)
 * 3. Add both monthly and annual prices to each product
 * 4. Copy the price IDs (they start with 'price_') and paste below
 *
 * IMPORTANT: These are placeholder IDs - replace with your actual Stripe price IDs
 */
export const STRIPE_PRICE_IDS = {
  starter: {
    monthly: process.env.REACT_APP_STRIPE_STARTER_MONTHLY || 'price_starter_monthly_placeholder',
    annual: process.env.REACT_APP_STRIPE_STARTER_ANNUAL || 'price_starter_annual_placeholder',
  },
  premium: {
    monthly: process.env.REACT_APP_STRIPE_PREMIUM_MONTHLY || 'price_premium_monthly_placeholder',
    annual: process.env.REACT_APP_STRIPE_PREMIUM_ANNUAL || 'price_premium_annual_placeholder',
  },
  gold: {
    monthly: process.env.REACT_APP_STRIPE_GOLD_MONTHLY || 'price_gold_monthly_placeholder',
    annual: process.env.REACT_APP_STRIPE_GOLD_ANNUAL || 'price_gold_annual_placeholder',
  },
};

/**
 * Create Checkout Session and redirect to Stripe Checkout
 *
 * @param {string} tier - Subscription tier (starter, premium, gold)
 * @param {string} billingPeriod - Billing period (monthly, annual)
 * @param {object} options - Additional options
 * @param {string} options.customerEmail - Customer email (optional)
 * @param {string} options.successUrl - URL to redirect after success (optional)
 * @param {string} options.cancelUrl - URL to redirect if cancelled (optional)
 * @returns {Promise<{error?: string}>}
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

    // Get the price ID
    const priceId = STRIPE_PRICE_IDS[tier]?.[billingPeriod];
    if (!priceId || priceId.includes('placeholder')) {
      return {
        error: 'Stripe is not configured yet. Please set up your Stripe account and add price IDs to the environment variables.',
      };
    }

    // Get Stripe instance
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    // Build success and cancel URLs
    const baseUrl = window.location.origin;
    const successUrl = options.successUrl || `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&upgrade_success=true`;
    const cancelUrl = options.cancelUrl || `${baseUrl}/pricing?upgrade_cancelled=true`;

    // For production, this should be done server-side for security
    // For now, we'll use client-side checkout (simpler setup)
    //
    // PRODUCTION TODO: Move this to a backend API endpoint
    // The backend should:
    // 1. Create the checkout session via Stripe API
    // 2. Return the session ID to the client
    // 3. Client redirects to checkout using the session ID

    console.log('Creating checkout session:', {
      tier,
      billingPeriod,
      priceId,
      successUrl,
      cancelUrl,
    });

    // Redirect to Stripe Checkout
    // Note: This uses Stripe's client-side checkout for simplicity
    // In production, create session server-side for better security
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      successUrl,
      cancelUrl,
      customerEmail: options.customerEmail,
      // Optional: Add metadata for tracking
      clientReferenceId: options.userId || 'guest',
    });

    if (error) {
      console.error('Stripe checkout error:', error);
      return { error: error.message };
    }

    // If we reach here, redirect is happening
    return {};

  } catch (err) {
    console.error('Checkout session error:', err);
    return { error: err.message || 'Failed to start checkout' };
  }
};

/**
 * Create Customer Portal Session
 * Allows users to manage their subscription (upgrade, downgrade, cancel)
 *
 * REQUIRES: Backend implementation with Stripe API
 * This is a placeholder - needs server-side implementation
 *
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<{url?: string, error?: string}>}
 */
export const createCustomerPortalSession = async (customerId) => {
  // TODO: Implement backend endpoint for this
  // Backend should:
  // 1. Verify user authentication
  // 2. Get their Stripe customer ID from database
  // 3. Create portal session via Stripe API
  // 4. Return portal URL to client

  console.log('Customer portal requested for:', customerId);

  return {
    error: 'Customer portal requires backend implementation. For now, contact support to manage your subscription.',
  };
};

/**
 * Verify Stripe is configured
 * @returns {boolean}
 */
export const isStripeConfigured = () => {
  // Check if publishable key is set
  if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY.includes('YOUR_KEY_HERE')) {
    return false;
  }

  // Check if at least one price ID is set
  const hasRealPriceId = Object.values(STRIPE_PRICE_IDS).some(tier =>
    Object.values(tier).some(priceId => !priceId.includes('placeholder'))
  );

  return hasRealPriceId;
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

export default {
  createCheckoutSession,
  createCustomerPortalSession,
  isStripeConfigured,
  getCheckoutStatus,
  STRIPE_PRICE_IDS,
};
