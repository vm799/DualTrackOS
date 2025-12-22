import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Crown, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import useSubscriptionStore from '../store/useSubscriptionStore';
import { TIER_NAMES } from '../constants/subscription';

/**
 * FeaturePreview - Shows features in limited preview mode instead of blocking them
 *
 * Philosophy: Let users TRY features with limitations, then invite them to upgrade
 * This is much more effective than blocking features completely
 */
const FeaturePreview = ({
  feature,
  requiredTier,
  children,
  previewLimits = {},
  upgradeMessage = {}
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const { hasTier, subscriptionTier } = useSubscriptionStore();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Check if user has access to full feature
  const hasFullAccess = hasTier(requiredTier);

  // If they have full access, render normally
  if (hasFullAccess) {
    return <>{children}</>;
  }

  // They don't have access - show preview mode
  const tierIcon = requiredTier === 'starter' ? <Sparkles size={16} /> : <Crown size={16} />;
  const tierName = TIER_NAMES[requiredTier] || requiredTier;

  // Get upgrade message or use defaults
  const defaultMessage = {
    title: `Unlock Full ${feature}`,
    benefits: [
      'Remove all limitations',
      'Access full feature set',
      'Priority support'
    ],
    cta: `Upgrade to ${tierName}`
  };

  const message = { ...defaultMessage, ...upgradeMessage };

  return (
    <div className={`relative rounded-xl overflow-hidden ${
      darkMode ? 'bg-gray-800/30 border-2 border-purple-500/20' : 'bg-purple-50/30 border-2 border-purple-200'
    }`}>
      {/* Preview Mode Banner */}
      <div className={`px-4 py-2 border-b flex items-center justify-between ${
        darkMode ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-100 border-purple-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-xs font-semibold ${
            darkMode ? 'text-purple-400' : 'text-purple-600'
          }`}>
            {tierIcon}
            <span>Preview Mode</span>
          </div>
          {previewLimits.description && (
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              • {previewLimits.description}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowUpgradePrompt(!showUpgradePrompt)}
          className={`text-xs font-semibold flex items-center gap-1 transition-all animate-pulse hover:animate-none ${
            darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
          }`}
        >
          Unlock
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Feature Content (in preview mode) */}
      <div className="relative">
        {/* Pass previewMode prop to children */}
        {React.cloneElement(children, {
          previewMode: true,
          previewLimits
        })}
      </div>

      {/* Inline Upgrade Prompt (collapsible) */}
      {showUpgradePrompt && (
        <div className={`p-4 border-t ${
          darkMode ? 'bg-purple-900/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className={`text-sm font-bold mb-2 ${
                darkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>
                {message.title}
              </h4>
              <ul className="space-y-1 mb-3">
                {message.benefits.map((benefit, idx) => (
                  <li key={idx} className={`text-xs flex items-center gap-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span className="text-green-500">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => navigate(`/pricing?upgrade=${requiredTier}`)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                requiredTier === 'starter'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  : requiredTier === 'premium'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
              }`}
            >
              {message.cta}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturePreview;
