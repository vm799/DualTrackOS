import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import useSubscriptionStore from '../store/useSubscriptionStore';
import PaywallModal from './PaywallModal';
import { FEATURE_NAMES, getMinimumTierForFeature } from '../constants/subscription';

/**
 * FeatureGate - Wrapper component to gate features behind subscription tiers
 *
 * Usage:
 * <FeatureGate feature="cycleTracking" requiredTier="starter">
 *   <CycleTracker />
 * </FeatureGate>
 *
 * Or with custom fallback:
 * <FeatureGate
 *   feature="cycleTracking"
 *   requiredTier="starter"
 *   fallback={<LockedMessage />}
 * >
 *   <CycleTracker />
 * </FeatureGate>
 */
const FeatureGate = ({
  feature,
  requiredTier = null,
  children,
  fallback = null,
  showPaywall = true,
  blurPreview = false
}) => {
  const { hasTier, canAccess, getTier } = useSubscriptionStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Determine if user has access
  const hasAccess = requiredTier
    ? hasTier(requiredTier)
    : canAccess(feature);

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // Auto-detect required tier if not specified
  const minimumTier = requiredTier || getMinimumTierForFeature(feature);
  const featureName = FEATURE_NAMES[feature] || feature;
  const currentTier = getTier();

  // If no paywall should be shown, return fallback or null
  if (!showPaywall) {
    return fallback || null;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return (
      <>
        <div onClick={() => setShowUpgradeModal(true)}>
          {fallback}
        </div>
        {showUpgradeModal && (
          <PaywallModal
            feature={featureName}
            currentTier={currentTier}
            requiredTier={minimumTier}
            onClose={() => setShowUpgradeModal(false)}
          />
        )}
      </>
    );
  }

  // Default: Show blurred preview with lock icon
  return (
    <>
      <div
        onClick={() => setShowUpgradeModal(true)}
        className="relative cursor-pointer group"
      >
        {/* Blurred preview */}
        {blurPreview && (
          <div className="blur-sm pointer-events-none opacity-50 select-none">
            {children}
          </div>
        )}

        {/* Lock overlay */}
        <div className={`${blurPreview ? 'absolute inset-0' : ''} flex items-center justify-center ${blurPreview ? 'bg-black/20' : ''}`}>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-2xl text-center max-w-sm mx-auto transform transition-all group-hover:scale-105">
            <Lock className="w-12 h-12 mx-auto mb-3 text-white" />
            <h3 className="text-xl font-bold text-white mb-2">
              {featureName}
            </h3>
            <p className="text-white/90 text-sm mb-4">
              Unlock this feature with {minimumTier === 'starter' ? 'Starter' : minimumTier === 'premium' ? 'Premium' : 'Gold'}
            </p>
            <button className="bg-white text-purple-600 font-bold py-2 px-6 rounded-lg hover:bg-purple-50 transition-all">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {showUpgradeModal && (
        <PaywallModal
          feature={featureName}
          currentTier={currentTier}
          requiredTier={minimumTier}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
};

export default FeatureGate;
