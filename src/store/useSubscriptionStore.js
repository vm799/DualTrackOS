import { create } from 'zustand';
import { TIER_HIERARCHY, FEATURE_ACCESS } from '../constants/subscription';

/**
 * Subscription Store
 * Manages user subscription tier and feature access
 */
const useSubscriptionStore = create((set, get) => ({
  // State
  subscriptionTier: 'free',
  subscriptionStatus: 'active', // active | cancelled | past_due | trialing
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  trialEndDate: null,

  // Actions
  setSubscription: (data) => set(data),

  setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),

  // Getters
  getTier: () => get().subscriptionTier,

  isActive: () => {
    const status = get().subscriptionStatus;
    return status === 'active' || status === 'trialing';
  },

  isTrial: () => get().subscriptionStatus === 'trialing',

  /**
   * Check if user has a specific tier or higher
   * @param {string} requiredTier - Tier to check against
   * @returns {boolean}
   */
  hasTier: (requiredTier) => {
    const currentTier = get().subscriptionTier;
    const current = TIER_HIERARCHY[currentTier] || 0;
    const required = TIER_HIERARCHY[requiredTier] || 0;
    return current >= required;
  },

  /**
   * Check if user can access a feature
   * @param {string} feature - Feature name from FEATURE_ACCESS
   * @returns {boolean|string} - true, false, or access level string
   */
  canAccess: (feature) => {
    const tier = get().subscriptionTier;
    const access = FEATURE_ACCESS[feature];

    if (!access) {
      console.warn(`Feature "${feature}" not found in FEATURE_ACCESS`);
      return false;
    }

    return access[tier] ?? false;
  },

  /**
   * Check if feature requires upgrade
   * @param {string} feature - Feature name
   * @returns {boolean}
   */
  requiresUpgrade: (feature) => {
    const access = get().canAccess(feature);
    return !access || access === false;
  },

  /**
   * Get subscription status display
   * @returns {string}
   */
  getStatusDisplay: () => {
    const { subscriptionTier, subscriptionStatus, currentPeriodEnd } = get();

    if (subscriptionTier === 'free') return 'Free Plan';
    if (subscriptionStatus === 'trialing') return 'Trial';
    if (subscriptionStatus === 'cancelled' && currentPeriodEnd) {
      const endDate = new Date(currentPeriodEnd);
      return `Active until ${endDate.toLocaleDateString()}`;
    }
    if (subscriptionStatus === 'past_due') return 'Payment Issue';

    return 'Active';
  }
}));

export default useSubscriptionStore;
