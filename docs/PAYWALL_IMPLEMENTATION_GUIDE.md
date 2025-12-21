# Paywall System - Technical Implementation Guide

## 🏗️ Architecture Overview

This guide shows how to implement a subscription paywall system into DualTrack OS using clean, modular code.

---

## 📁 File Structure

```
src/
├── store/
│   ├── useSubscriptionStore.js   # NEW - Subscription state management
│   └── useFeatureFlags.js         # NEW - Feature access control
├── services/
│   ├── stripeService.js           # NEW - Stripe integration
│   └── subscriptionService.js     # NEW - Subscription logic
├── components/
│   ├── PaywallModal.jsx           # NEW - Upgrade prompts
│   ├── PricingTable.jsx           # NEW - Pricing comparison
│   ├── UpgradeBanner.jsx          # NEW - In-app upsell
│   └── FeatureGate.jsx            # NEW - Wrapper for gated features
├── pages/
│   ├── PricingPage.jsx            # NEW - Full pricing page
│   └── SettingsPage.jsx           # MODIFY - Add subscription management
└── hooks/
    └── useFeatureAccess.js        # NEW - Custom hook for checking access
```

---

## 1️⃣ Subscription Store

### `/src/store/useSubscriptionStore.js`

```javascript
import { create } from 'zustand';

const TIERS = {
  FREE: 'free',
  STARTER: 'starter',
  PREMIUM: 'premium',
  GOLD: 'gold'
};

const TIER_HIERARCHY = {
  free: 0,
  starter: 1,
  premium: 2,
  gold: 3
};

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

  // Getters
  getTier: () => get().subscriptionTier,
  isActive: () => get().subscriptionStatus === 'active' || get().subscriptionStatus === 'trialing',
  isTrial: () => get().subscriptionStatus === 'trialing',
  hasTier: (requiredTier) => {
    const current = TIER_HIERARCHY[get().subscriptionTier];
    const required = TIER_HIERARCHY[requiredTier];
    return current >= required;
  },

  // Feature access
  canAccess: (feature) => {
    const tier = get().subscriptionTier;
    return FEATURE_ACCESS[feature]?.[tier] ?? false;
  }
}));

// Feature access matrix
const FEATURE_ACCESS = {
  cycleTracking: {
    free: false,
    starter: 'basic',
    premium: 'advanced',
    gold: 'enterprise'
  },
  voiceTranscription: {
    free: false,
    starter: true,
    premium: true,
    gold: true
  },
  fullNDM: {
    free: false,
    starter: true,
    premium: true,
    gold: true
  },
  aiInsights: {
    free: false,
    starter: false,
    premium: true,
    gold: true
  },
  wearableIntegration: {
    free: false,
    starter: false,
    premium: false,
    gold: true
  },
  unlimitedHistory: {
    free: false,
    starter: false,
    premium: true,
    gold: true
  },
  apiAccess: {
    free: false,
    starter: false,
    premium: false,
    gold: true
  }
};

export { TIERS, FEATURE_ACCESS };
export default useSubscriptionStore;
```

---

## 2️⃣ Feature Gate Component

### `/src/components/FeatureGate.jsx`

```javascript
import React from 'react';
import useSubscriptionStore from '../store/useSubscriptionStore';
import PaywallModal from './PaywallModal';

/**
 * Wrapper component to gate features behind subscription tiers
 *
 * Usage:
 * <FeatureGate feature="cycleTracking" requiredTier="starter">
 *   <CycleTracker />
 * </FeatureGate>
 */
const FeatureGate = ({
  feature,
  requiredTier,
  children,
  fallback = null,
  showPaywall = true
}) => {
  const { hasTier, canAccess } = useSubscriptionStore();
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  const hasAccess = requiredTier ? hasTier(requiredTier) : canAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showPaywall) {
    return (
      <>
        <div onClick={() => setShowUpgradeModal(true)}>
          {fallback || <LockedFeaturePreview feature={feature} />}
        </div>
        {showUpgradeModal && (
          <PaywallModal
            feature={feature}
            requiredTier={requiredTier}
            onClose={() => setShowUpgradeModal(false)}
          />
        )}
      </>
    );
  }

  return fallback;
};

const LockedFeaturePreview = ({ feature }) => {
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none opacity-50">
        {/* Preview content */}
        <div className="p-6 rounded-xl bg-gray-100">
          <p className="text-gray-500">Feature preview...</p>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 shadow-2xl text-center">
          <p className="text-2xl mb-2">🔒</p>
          <p className="font-bold text-lg">Unlock {feature}</p>
          <p className="text-sm text-gray-600">Upgrade to access this feature</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureGate;
```

---

## 3️⃣ Paywall Modal

### `/src/components/PaywallModal.jsx`

```javascript
import React from 'react';
import { X, Check, Zap } from 'lucide-react';
import useStore from '../store/useStore';
import useSubscriptionStore from '../store/useSubscriptionStore';
import { TIER_FEATURES, TIER_PRICING } from '../constants/subscription';

const PaywallModal = ({ feature, requiredTier, onClose }) => {
  const darkMode = useStore((state) => state.darkMode);
  const currentTier = useSubscriptionStore((state) => state.subscriptionTier);

  const handleUpgrade = (tier) => {
    // Redirect to pricing page or open Stripe checkout
    window.location.href = `/pricing?upgrade=${tier}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4">
      <div className={`max-w-4xl w-full rounded-3xl relative ${
        darkMode ? 'bg-gray-900 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'
      }`}>
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          <div className="text-center mb-8">
            <Zap className="w-16 h-16 mx-auto mb-4 text-purple-500" />
            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Unlock {feature}
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You're on the <strong className="text-purple-500">{currentTier}</strong> plan.
              Upgrade to <strong className="text-purple-500">{requiredTier}</strong> to access this feature.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {['starter', 'premium', 'gold'].map((tier) => (
              <PricingCard
                key={tier}
                tier={tier}
                isRecommended={tier === requiredTier}
                isCurrent={tier === currentTier}
                darkMode={darkMode}
                onSelect={() => handleUpgrade(tier)}
              />
            ))}
          </div>

          {/* Feature Comparison */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
              💡 All plans include: Pomodoro timer, task management, wellness tracking, and more!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingCard = ({ tier, isRecommended, isCurrent, darkMode, onSelect }) => {
  const pricing = TIER_PRICING[tier];
  const features = TIER_FEATURES[tier];

  return (
    <div className={`rounded-xl p-6 border-2 relative ${
      isRecommended
        ? darkMode
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-purple-500 bg-purple-50'
        : darkMode
          ? 'border-gray-700 bg-gray-800/50'
          : 'border-gray-200 bg-white'
    }`}>
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            RECOMMENDED
          </span>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            CURRENT PLAN
          </span>
        </div>
      )}

      <h3 className={`text-2xl font-bold mb-2 capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {tier}
      </h3>

      <div className="mb-4">
        <span className={`text-4xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          ${pricing.monthly}
        </span>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>/month</span>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          or ${pricing.annual}/year (save ${pricing.savings})
        </p>
      </div>

      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isCurrent
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isRecommended
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : darkMode
                ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/40'
                : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
        }`}
      >
        {isCurrent ? 'Current Plan' : `Upgrade to ${tier}`}
      </button>
    </div>
  );
};

export default PaywallModal;
```

---

## 4️⃣ Constants File

### `/src/constants/subscription.js`

```javascript
export const TIER_PRICING = {
  starter: {
    monthly: 4.99,
    annual: 49,
    savings: 10
  },
  premium: {
    monthly: 9.99,
    annual: 99,
    savings: 20
  },
  gold: {
    monthly: 19.99,
    annual: 199,
    savings: 40
  }
};

export const TIER_FEATURES = {
  starter: [
    'Unlimited tasks',
    'Full 4 NDM system',
    'Basic cycle tracking',
    'Voice transcription',
    '30 days history',
    'Smart nutrition logging'
  ],
  premium: [
    'Everything in Starter',
    'Advanced cycle tracking',
    'AI-powered insights',
    'Symptom tracking',
    'Unlimited history',
    'Priority support'
  ],
  gold: [
    'Everything in Premium',
    'Wearable integration',
    'API access',
    'Team features',
    'VIP support',
    'Expert webinars'
  ]
};
```

---

## 5️⃣ Usage Examples

### Example 1: Gate Cycle Tracking

```javascript
// In Dashboard.jsx
import FeatureGate from '../components/FeatureGate';
import CycleTracker from '../components/CycleTracker';

<FeatureGate feature="cycleTracking" requiredTier="starter">
  <CycleTracker />
</FeatureGate>
```

### Example 2: Conditional Button

```javascript
// In ProteinTracker.jsx
import useSubscriptionStore from '../store/useSubscriptionStore';

const ProteinTracker = () => {
  const { hasTier } = useSubscriptionStore();
  const canLogFood = hasTier('starter');

  return (
    <button
      onClick={() => {
        if (!canLogFood) {
          setShowPaywall(true);
        } else {
          openNutritionModal();
        }
      }}
    >
      {canLogFood ? 'Log Food →' : 'Unlock Food Logging 🔒'}
    </button>
  );
};
```

### Example 3: Inline Feature Check

```javascript
// In VoiceDiary.jsx
const VoiceDiary = () => {
  const { canAccess } = useSubscriptionStore();
  const hasTranscription = canAccess('voiceTranscription');

  return (
    <div>
      {hasTranscription ? (
        <p>Live transcript: {currentTranscript}</p>
      ) : (
        <p>🔒 Upgrade to Starter for voice transcription</p>
      )}
    </div>
  );
};
```

---

## 6️⃣ Stripe Integration

### `/src/services/stripeService.js`

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export const createCheckoutSession = async (priceId, userId, tier) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        userId,
        tier,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`
      })
    });

    const session = await response.json();
    const stripe = await stripePromise;

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (error) {
      console.error('Stripe checkout error:', error);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
  }
};

export const createBillingPortalSession = async (customerId) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/settings`
      })
    });

    const session = await response.json();
    window.location.href = session.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
  }
};
```

---

## 7️⃣ Backend - Supabase Functions

### Webhook Handler (`supabase/functions/stripe-webhook/index.ts`)

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDelete(event.data.object);
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

async function handleCheckoutComplete(session: any) {
  const { client_reference_id: userId, subscription } = session;

  // Update user subscription in database
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: subscription,
      subscription_tier: session.metadata.tier,
      subscription_status: 'active',
      current_period_end: new Date(session.subscription.current_period_end * 1000)
    });

  if (error) console.error('Error updating subscription:', error);
}
```

---

## 8️⃣ Database Schema

### Supabase Table: `subscriptions`

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'starter', 'premium', 'gold')),
  subscription_status TEXT CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🎯 Implementation Checklist

- [ ] Create `useSubscriptionStore.js`
- [ ] Create `FeatureGate.jsx` component
- [ ] Create `PaywallModal.jsx` component
- [ ] Create `PricingPage.jsx`
- [ ] Add subscription constants
- [ ] Set up Stripe products/prices in dashboard
- [ ] Implement Stripe checkout flow
- [ ] Create Supabase webhook function
- [ ] Create `subscriptions` table in Supabase
- [ ] Add subscription management to `SettingsPage.jsx`
- [ ] Wrap gated features with `<FeatureGate>`
- [ ] Test free → starter upgrade
- [ ] Test starter → premium upgrade
- [ ] Test cancellation flow

---

**Implementation Priority:** Start with Feature Gate and Paywall Modal first. They can work with hardcoded tiers before Stripe integration is complete.

