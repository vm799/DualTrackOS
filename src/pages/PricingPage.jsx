import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ArrowLeft, Crown, Zap, Sparkles, Heart, Loader } from 'lucide-react';
import useStore from '../store/useStore';
import useSubscriptionStore from '../store/useSubscriptionStore';
import {
  TIER_PRICING,
  TIER_FEATURES,
  TIER_NAMES,
  TIER_TAGLINES
} from '../constants/subscription';
import { createCheckoutSession, isStripeConfigured, getCheckoutStatus } from '../services/stripeService';
import Logo from '../components/Logo';

/**
 * PricingPage - Full pricing page with all tiers
 */
const PricingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const darkMode = useStore((state) => state.darkMode);
  const user = useStore((state) => state.user);
  const currentTier = useSubscriptionStore((state) => state.subscriptionTier);
  const setTier = useSubscriptionStore((state) => state.setTier);

  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'annual'
  const [loadingTier, setLoadingTier] = useState(null); // Track which tier is loading
  const [error, setError] = useState(null);
  const highlightedTier = searchParams.get('upgrade') || 'premium'; // Which tier to highlight
  const stripeConfigured = isStripeConfigured();

  // Check for successful checkout on mount
  useEffect(() => {
    const status = getCheckoutStatus();

    if (status.success && status.sessionId) {
      // User just completed a checkout
      // TODO: Verify session with backend and update tier
      // For now, show success message
      alert('🎉 Payment successful! Your subscription is now active.');

      // Clear URL params
      window.history.replaceState({}, document.title, '/pricing');
    } else if (status.cancelled) {
      setError('Checkout was cancelled. Feel free to try again!');

      // Clear URL params after showing message
      setTimeout(() => {
        window.history.replaceState({}, document.title, '/pricing');
        setError(null);
      }, 5000);
    }
  }, []);

  const handleSelectPlan = async (tier) => {
    setError(null);

    if (tier === 'free') {
      // Already on free, redirect to dashboard
      navigate('/dashboard');
      return;
    }

    if (tier === currentTier) {
      // Already on this tier
      navigate('/dashboard');
      return;
    }

    // Check if Stripe is configured
    if (!stripeConfigured) {
      setError(
        '⚠️ Payment system is not configured yet. Please contact support or try again later.'
      );
      return;
    }

    try {
      setLoadingTier(tier);

      // Create Stripe checkout session
      const result = await createCheckoutSession(tier, billingPeriod, {
        customerEmail: user?.email,
        userId: user?.id,
      });

      if (result.error) {
        setError(result.error);
        setLoadingTier(null);
      }
      // If successful, user will be redirected to Stripe
      // No need to clear loading state as page will redirect
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to start checkout. Please try again.');
      setLoadingTier(null);
    }
  };

  const tierIcons = {
    free: <Heart className="w-8 h-8" />,
    starter: <Sparkles className="w-8 h-8" />,
    premium: <Zap className="w-8 h-8" />,
    gold: <Crown className="w-8 h-8" />
  };

  return (
    <div className={`min-h-screen transition-all ${
      darkMode ? 'bg-[#191919] text-white' : 'bg-gray-50 text-gray-900'
    }`}>

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b ${
        darkMode ? 'bg-gray-900/95 border-gray-800 backdrop-blur-lg' : 'bg-white/95 border-gray-200 backdrop-blur-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
                darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold">Choose Your Plan</h1>
            </div>
            <Logo size="medium" />
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6 text-center">
        <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Unlock Your Full Potential
        </h2>
        <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Choose the plan that's right for you. Upgrade or downgrade anytime.
        </p>

        {/* Error message */}
        {error && (
          <div className={`max-w-2xl mx-auto mb-6 p-4 rounded-xl ${
            darkMode ? 'bg-red-500/20 border-2 border-red-500/30' : 'bg-red-50 border-2 border-red-200'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
          </div>
        )}

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              billingPeriod === 'monthly'
                ? darkMode
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-600 text-white'
                : darkMode
                  ? 'bg-gray-800 text-gray-400 hover:text-white'
                  : 'bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all relative ${
              billingPeriod === 'annual'
                ? darkMode
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-600 text-white'
                : darkMode
                  ? 'bg-gray-800 text-gray-400 hover:text-white'
                  : 'bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
          >
            Annual
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['free', 'starter', 'premium', 'gold'].map((tier) => {
            const isHighlighted = tier === highlightedTier;
            const isCurrent = tier === currentTier;

            return (
              <PricingTierCard
                key={tier}
                tier={tier}
                billingPeriod={billingPeriod}
                isHighlighted={isHighlighted}
                isCurrent={isCurrent}
                darkMode={darkMode}
                tierIcon={tierIcons[tier]}
                isLoading={loadingTier === tier}
                onSelect={() => handleSelectPlan(tier)}
              />
            );
          })}
        </div>

        {/* FAQ / Features */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className={`text-2xl font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            All Plans Include
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Pomodoro timer for focused work',
              'Task management & Kanban board',
              'Non-Negotiables Daily Metrics (NDM)',
              'Energy & mood tracking',
              'Wellness snacks (exercise, breathing, hydration)',
              'Brain dump for thoughts & ideas',
              'Voice diary for check-ins',
              'Dark mode for comfortable viewing'
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial / Social proof */}
        <div className={`mt-16 max-w-3xl mx-auto p-8 rounded-2xl ${
          darkMode ? 'bg-purple-900/20 border-2 border-purple-500/30' : 'bg-purple-50 border-2 border-purple-200'
        }`}>
          <p className={`text-lg italic text-center mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            "DualTrack OS transformed how I manage my energy, workouts, and nutrition throughout my cycle.
            The AI insights are game-changing!"
          </p>
          <p className={`text-center font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            — Sarah, Premium User
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Individual pricing tier card
 */
const PricingTierCard = ({ tier, billingPeriod, isHighlighted, isCurrent, darkMode, tierIcon, isLoading, onSelect }) => {
  const tierName = TIER_NAMES[tier];
  const tagline = TIER_TAGLINES[tier];
  const features = TIER_FEATURES[tier];

  let price, savings;
  if (tier === 'free') {
    price = 0;
    savings = null;
  } else {
    const pricing = TIER_PRICING[tier];
    price = billingPeriod === 'monthly' ? pricing.monthly : pricing.annual / 12;
    savings = billingPeriod === 'annual' ? pricing.savings : null;
  }

  return (
    <div className={`rounded-2xl p-6 border-2 relative transition-all ${
      isHighlighted
        ? darkMode
          ? 'border-purple-500 bg-purple-500/10 ring-4 ring-purple-500/50 transform scale-105'
          : 'border-purple-500 bg-purple-50 ring-4 ring-purple-500/50 transform scale-105'
        : darkMode
          ? 'border-gray-700 bg-gray-800/50 hover:border-purple-500/50'
          : 'border-gray-200 bg-white hover:border-purple-300'
    }`}>

      {/* Badges */}
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
            ⭐ RECOMMENDED
          </span>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            ✓ CURRENT
          </span>
        </div>
      )}

      {/* Tier header */}
      <div className="text-center mb-6">
        <div className={`inline-flex p-3 rounded-2xl mb-3 ${
          darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
        }`}>
          <div className={darkMode ? 'text-purple-400' : 'text-purple-600'}>
            {tierIcon}
          </div>
        </div>
        <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {tierName}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          {tagline}
        </p>
      </div>

      {/* Pricing */}
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-5xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            ${tier === 'free' ? '0' : price.toFixed(2)}
          </span>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            /month
          </span>
        </div>
        {savings && (
          <p className={`text-xs mt-1 font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            Save ${savings}/year
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6 min-h-[300px]">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onSelect}
        disabled={isCurrent || isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          isCurrent || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isHighlighted
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
              : darkMode
                ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-2 border-purple-500/40'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isLoading && <Loader className="animate-spin" size={18} />}
        {isCurrent ? 'Current Plan' : isLoading ? 'Loading...' : tier === 'free' ? 'Get Started' : `Upgrade to ${tierName}`}
      </button>
    </div>
  );
};

export default PricingPage;
