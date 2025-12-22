import { renderHook, act } from '@testing-library/react';
import useSubscriptionStore from '../useSubscriptionStore';

describe('useSubscriptionStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useSubscriptionStore());
    act(() => {
      result.current.setSubscription({
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
        stripeCustomerId: null,
        stripeSubscriptionId: null
      });
    });
  });

  describe('Subscription Tier', () => {
    it('should initialize with free tier', () => {
      const { result } = renderHook(() => useSubscriptionStore());
      expect(result.current.subscriptionTier).toBe('free');
    });

    it('should update subscription tier', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      act(() => {
        result.current.setSubscriptionTier('starter');
      });

      expect(result.current.subscriptionTier).toBe('starter');
    });

    it('should support all tier levels', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      const tiers = ['free', 'starter', 'premium', 'gold'];

      tiers.forEach(tier => {
        act(() => {
          result.current.setSubscriptionTier(tier);
        });
        expect(result.current.subscriptionTier).toBe(tier);
      });
    });
  });

  describe('Subscription Status', () => {
    it('should initialize with active status', () => {
      const { result } = renderHook(() => useSubscriptionStore());
      expect(result.current.subscriptionStatus).toBe('active');
    });

    it('should update subscription status', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      act(() => {
        result.current.setSubscription({ subscriptionStatus: 'cancelled' });
      });

      expect(result.current.subscriptionStatus).toBe('cancelled');
    });

    it('should support all status types', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      const statuses = ['active', 'cancelled', 'past_due', 'trialing'];

      statuses.forEach(status => {
        act(() => {
          result.current.setSubscription({ subscriptionStatus: status });
        });
        expect(result.current.subscriptionStatus).toBe(status);
      });
    });
  });

  describe('Feature Access Control', () => {
    it('should allow access for free tier features on free plan', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      act(() => {
        result.current.setSubscriptionTier('free');
      });

      // Free tier should have access to basic features
      expect(result.current.subscriptionTier).toBe('free');
    });

    it('should upgrade from free to starter', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      act(() => {
        result.current.setSubscriptionTier('free');
      });
      expect(result.current.subscriptionTier).toBe('free');

      act(() => {
        result.current.setSubscriptionTier('starter');
      });
      expect(result.current.subscriptionTier).toBe('starter');
    });

    it('should upgrade from starter to premium', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      act(() => {
        result.current.setSubscriptionTier('starter');
      });
      expect(result.current.subscriptionTier).toBe('starter');

      act(() => {
        result.current.setSubscriptionTier('premium');
      });
      expect(result.current.subscriptionTier).toBe('premium');
    });

    it('should upgrade to gold tier', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      act(() => {
        result.current.setSubscriptionTier('gold');
      });

      expect(result.current.subscriptionTier).toBe('gold');
    });
  });

  describe('Subscription Lifecycle', () => {
    it('should handle cancellation', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      act(() => {
        result.current.setSubscription({
          subscriptionTier: 'premium',
          subscriptionStatus: 'active'
        });
      });

      expect(result.current.subscriptionTier).toBe('premium');
      expect(result.current.subscriptionStatus).toBe('active');

      act(() => {
        result.current.setSubscription({ subscriptionStatus: 'cancelled' });
      });

      expect(result.current.subscriptionStatus).toBe('cancelled');
    });

    it('should handle past_due status', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      act(() => {
        result.current.setSubscription({ subscriptionStatus: 'past_due' });
      });

      expect(result.current.subscriptionStatus).toBe('past_due');
    });

    it('should handle trial period', () => {
      const { result } = renderHook(() => useSubscriptionStore());

      act(() => {
        result.current.setSubscription({ subscriptionStatus: 'trialing' });
      });

      expect(result.current.subscriptionStatus).toBe('trialing');
      expect(result.current.isTrial()).toBe(true);
    });
  });
});
