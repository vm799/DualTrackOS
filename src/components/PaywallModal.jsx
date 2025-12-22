import React from 'react';
import { X, Check, Zap, Crown, Sparkles, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import {
  TIER_PRICING,
  TIER_FEATURES,
  TIER_NAMES,
  TIER_TAGLINES
} from '../constants/subscription';

/**
 * PaywallModal - Displays upgrade options when user hits a paywalled feature
 */
const PaywallModal = ({ feature, currentTier, requiredTier, onClose }) => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();

  const handleUpgrade = (tier) => {
    // For now, navigate to pricing page
    // TODO: Implement Stripe checkout
    navigate(`/pricing?upgrade=${tier}`);
    onClose();
  };

  // Tier icons
  const tierIcons = {
    starter: <Sparkles className="w-6 h-6" />,
    premium: <Zap className="w-6 h-6" />,
    gold: <Crown className="w-6 h-6" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4 overflow-y-auto">
      <div className={`max-w-5xl w-full rounded-3xl relative my-8 ${
        darkMode ? 'bg-gray-900 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'
      }`}>

        {/* Close button */}
        <div className={`sticky top-0 z-10 flex justify-end p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl`}>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X size={24} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Unlock {feature}
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You're on the <strong className="text-purple-500">{TIER_NAMES[currentTier]}</strong> plan.
              {currentTier === 'free' && (
                <> Upgrade to unlock premium features!</>
              )}
              {currentTier !== 'free' && requiredTier && (
                <> Upgrade to <strong className="text-purple-500">{TIER_NAMES[requiredTier]}</strong> to access this feature.</>
              )}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {['starter', 'premium', 'gold'].map((tier) => {
              const isRecommended = tier === requiredTier;
              const isCurrent = tier === currentTier;

              return (
                <PricingCard
                  key={tier}
                  tier={tier}
                  isRecommended={isRecommended}
                  isCurrent={isCurrent}
                  darkMode={darkMode}
                  tierIcon={tierIcons[tier]}
                  onSelect={() => handleUpgrade(tier)}
                />
              );
            })}
          </div>

          {/* Features comparison hint */}
          <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
              💡 All paid plans include unlimited tasks, full NDM system, voice transcription, and smart nutrition logging!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * PricingCard - Individual tier card
 */
const PricingCard = ({ tier, isRecommended, isCurrent, darkMode, tierIcon, onSelect }) => {
  const pricing = TIER_PRICING[tier];
  const features = TIER_FEATURES[tier];
  const tierName = TIER_NAMES[tier];
  const tagline = TIER_TAGLINES[tier];

  return (
    <div className={`rounded-xl p-6 border-2 relative transition-all hover:shadow-lg ${
      isRecommended
        ? darkMode
          ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50'
          : 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/50'
        : darkMode
          ? 'border-gray-700 bg-gray-800/50 hover:border-purple-500/50'
          : 'border-gray-200 bg-white hover:border-purple-300'
    }`}>

      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
            ⭐ RECOMMENDED
          </span>
        </div>
      )}

      {/* Current plan badge */}
      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            ✓ CURRENT
          </span>
        </div>
      )}

      {/* Tier header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${
          darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
        }`}>
          <div className={darkMode ? 'text-purple-400' : 'text-purple-600'}>
            {tierIcon}
          </div>
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {tierName}
          </h3>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            {tagline}
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            ${pricing.monthly}
          </span>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>/month</span>
        </div>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          or ${pricing.annual}/year (save ${pricing.savings})
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {features.slice(0, 5).map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {feature}
            </span>
          </li>
        ))}
        {features.length > 5 && (
          <li className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'} font-semibold`}>
            + {features.length - 5} more features
          </li>
        )}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isCurrent
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isRecommended
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
              : darkMode
                ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-2 border-purple-500/40 hover:border-purple-500/60'
                : 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300 hover:border-purple-400'
        }`}
      >
        {isCurrent ? 'Current Plan' : `Upgrade to ${tierName}`}
      </button>
    </div>
  );
};

export default PaywallModal;
