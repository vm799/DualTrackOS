# DualTrack OS - Subscription Tier Architecture

## 🎯 Monetization Strategy Overview

**Philosophy:** Free-to-start, value-driven upgrades, premium features that transform productivity & wellness.

**Pricing Psychology:**
- Free tier is genuinely useful (build trust & habit)
- Starter tier is impulse-buy affordable ($4.99)
- Premium tier is professional power-user ($9.99)
- Gold tier is executive/enterprise ($19.99-$29.99)

---

## 💎 Subscription Tiers

### 🆓 **FREE TIER** - "Foundation"
**Price:** $0/month
**Target User:** Curious first-timers, students, casual users
**Value Prop:** "Get started with core productivity features"

#### ✅ Included Features:
**Core Productivity:**
- ✓ Basic Pomodoro Timer (25/5 intervals)
- ✓ Daily Task List (max 10 tasks)
- ✓ 2 Non-Negotiables Daily (choose 2 of 4)
- ✓ Energy/Mood Tracker (basic)
- ✓ Protein Tracker (manual entry only)
- ✓ Voice Diary (5 min max, no transcription)
- ✓ Dark Mode

**Wellness:**
- ✓ Hourly Wellness Snacks (3 options: exercise, breathing, water)
- ✓ Daily Check-in (mood + energy)

**Analytics:**
- ✓ Weekly summary email
- ✓ 7 days of history

#### ❌ Not Included:
- ✗ Full NDM system (only 2/day)
- ✗ Cycle tracking
- ✗ AI suggestions
- ✗ Advanced analytics
- ✗ Priority support

---

### 🌟 **STARTER TIER** - "Essentials Plus"
**Price:** $4.99/month or $49/year (save $10)
**Target User:** Committed users, health-conscious professionals
**Value Prop:** "Unlock full wellness system + smart features"

#### ✅ All Free Features PLUS:

**Enhanced Productivity:**
- ✓ **Unlimited Tasks** on Kanban board
- ✓ **Full NDM System** (4 daily non-negotiables)
- ✓ **Custom Pomodoro Intervals** (15/3, 50/10, etc.)
- ✓ **Fullscreen Pomodoro Mode**
- ✓ **Smart Task Prioritization**

**Women's Wellness (NEW!):**
- ✓ **Basic Cycle Tracking**
  - Period start/end logging
  - Phase calculation (4 phases)
  - Phase-based exercise suggestions
  - Phase-based nutrition suggestions
- ✓ **Daily Cycle Recommendations**
- ✓ **Energy adaptation** to cycle phase

**Enhanced Features:**
- ✓ **Voice Diary with Transcription** (real speech-to-text)
- ✓ **Smart Snack Suggestions** (clickable nutrition logging)
- ✓ **Nutrition Detail Modal** (meal ideas library)
- ✓ **30 days of history**

**Support:**
- ✓ Email support (48hr response)
- ✓ Monthly feature updates

#### 🎁 Bonus:
- Ad-free experience
- Early access to new features

---

### 💼 **PREMIUM TIER** - "Power User"
**Price:** $9.99/month or $99/year (save $20)
**Target User:** Peak performers, executives, wellness enthusiasts
**Value Prop:** "AI-powered insights + advanced cycle optimization"

#### ✅ All Starter Features PLUS:

**Advanced Cycle Management:**
- ✓ **Full Symptom Tracking** (PMS, cramps, mood, energy, etc.)
- ✓ **Custom Cycle Length** (irregular cycle support)
- ✓ **Smart Notifications**
  - Phase transition alerts
  - "Peak energy window" notifications
  - "Rest day recommended" warnings
- ✓ **Detailed Phase Breakdowns**
  - Early vs Late Luteal recommendations
  - Ovulation timing optimization
- ✓ **PMS Management Tools**
  - Craving-specific nutrition
  - Symptom-relief exercises
  - Mood support activities

**AI & Analytics:**
- ✓ **Predictive Insights**
  - "You perform best on Days 10-14"
  - "Schedule rest on Day 25 based on your pattern"
- ✓ **Monthly Wellness Reports**
  - Exercise intensity by phase analysis
  - Nutrition adherence tracking
  - Energy/mood correlation graphs
- ✓ **Personalized Recommendations** (ML-powered)
- ✓ **Unlimited history** (lifetime data access)

**Productivity Enhancements:**
- ✓ **Advanced Analytics Dashboard**
- ✓ **Spirit Animal Scoring** (full algorithm)
- ✓ **Weekly planning assistant**
- ✓ **Goal tracking & streaks**

**Integration:**
- ✓ **Calendar Integration** (Google/Outlook)
- ✓ **Export Data** (CSV, JSON)

**Support:**
- ✓ Priority Email Support (24hr response)
- ✓ Live Chat Support (business hours)

---

### 👑 **GOLD TIER** - "Ultimate Optimization"
**Price:** $19.99/month or $199/year (save $40)
**Target User:** Executives, athletes, high performers, teams
**Value Prop:** "Enterprise-grade insights + coaching tools"

#### ✅ All Premium Features PLUS:

**Advanced AI & Predictions:**
- ✓ **AI Cycle Coach**
  - Personalized workout programming by phase
  - Adaptive nutrition planning
  - Real-time energy/phase recommendations
- ✓ **Predictive Performance Modeling**
  - "Best days for presentations next month"
  - "Optimal training schedule for race prep"
- ✓ **Habit Correlation Engine**
  - What habits maximize your energy?
  - Which foods improve your mood?

**Wearable Integration:**
- ✓ **Apple Watch / Garmin Sync**
- ✓ **Sleep tracking integration**
- ✓ **HRV-based recovery recommendations**
- ✓ **Automatic workout logging**

**Team & Collaboration (Optional Add-on):**
- ✓ **Team Dashboards** (manager view)
- ✓ **Shared wellness challenges**
- ✓ **Company wellness reports**

**Premium Content:**
- ✓ **Expert-led Webinars** (monthly)
- ✓ **Nutrition meal plans** (cycle-optimized)
- ✓ **Workout video library** (phase-specific)
- ✓ **Guided meditations**

**Concierge Support:**
- ✓ **1-on-1 Onboarding Call** (30 min)
- ✓ **VIP Support** (4hr response time)
- ✓ **Quarterly Check-in Calls** (optional)
- ✓ **Feature Requests** (priority queue)

**Data & Export:**
- ✓ **API Access** (for power users)
- ✓ **Advanced reporting** (custom dashboards)
- ✓ **Data portability** (full export anytime)

---

## 🔐 Paywall Implementation Strategy

### Technical Architecture

```javascript
// User subscription state
const subscriptionTiers = {
  FREE: 'free',
  STARTER: 'starter',
  PREMIUM: 'premium',
  GOLD: 'gold'
};

// Feature flags
const featureAccess = {
  cycleTracking: {
    free: false,
    starter: 'basic',    // phase calc + suggestions
    premium: 'advanced', // symptoms + predictions
    gold: 'enterprise'   // AI coaching
  },
  voiceTranscription: {
    free: false,
    starter: true,
    premium: true,
    gold: true
  },
  analyticsHistory: {
    free: '7days',
    starter: '30days',
    premium: 'unlimited',
    gold: 'unlimited'
  },
  // ... etc
};
```

### User Store Schema
```javascript
// src/store/useSubscriptionStore.js
const useSubscriptionStore = create((set) => ({
  subscriptionTier: 'free',  // free | starter | premium | gold
  subscriptionStatus: 'active', // active | cancelled | expired
  subscriptionEndDate: null,
  trialEndDate: null,

  // Feature access helpers
  hasFeature: (featureName) => {
    const tier = get().subscriptionTier;
    return featureAccess[featureName][tier];
  },

  requiresUpgrade: (featureName) => {
    return !get().hasFeature(featureName);
  }
}));
```

### Paywall UI Component
```jsx
// src/components/PaywallModal.jsx
const PaywallModal = ({ feature, currentTier, recommendedTier }) => {
  return (
    <div className="paywall-modal">
      <h2>🔒 Upgrade to Unlock {feature}</h2>
      <p>You're on the <strong>{currentTier}</strong> plan.</p>
      <p>Upgrade to <strong>{recommendedTier}</strong> to access:</p>

      <div className="features-list">
        {/* Dynamic feature list based on tier difference */}
      </div>

      <PricingComparison current={currentTier} recommended={recommendedTier} />

      <button onClick={handleUpgrade}>
        Upgrade to {recommendedTier} - ${pricing[recommendedTier]}/mo
      </button>
    </div>
  );
};
```

### Graceful Degradation
```javascript
// Example: Cycle Tracking access
const openCycleTracker = () => {
  const { subscriptionTier, hasFeature } = useSubscriptionStore();

  if (!hasFeature('cycleTracking')) {
    // Show paywall with upgrade CTA
    setShowPaywall(true);
    setPaywallFeature('cycleTracking');
    setRecommendedTier('starter');
  } else {
    // Open full feature
    setShowCycleModal(true);
  }
};
```

---

## 💳 Payment Integration

### Recommended Provider: **Stripe**
**Why Stripe:**
- Best-in-class checkout experience
- Supports subscriptions out of the box
- Handles SCA (Strong Customer Authentication) for EU
- Easy upgrade/downgrade flows
- Webhooks for subscription events

### Implementation Steps:

1. **Stripe Setup:**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

2. **Products & Prices in Stripe Dashboard:**
```
Product: DualTrack Starter
- Monthly Price: $4.99
- Annual Price: $49 (recurring=year)

Product: DualTrack Premium
- Monthly Price: $9.99
- Annual Price: $99

Product: DualTrack Gold
- Monthly Price: $19.99
- Annual Price: $199
```

3. **Checkout Flow:**
```javascript
// src/services/stripeService.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export const createCheckoutSession = async (priceId, userId) => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, userId })
  });

  const session = await response.json();
  const stripe = await stripePromise;

  // Redirect to Stripe Checkout
  await stripe.redirectToCheckout({ sessionId: session.id });
};
```

4. **Webhook Handling (Backend):**
```javascript
// Supabase Edge Function: handle-stripe-webhook
export async function handleWebhook(event) {
  switch (event.type) {
    case 'checkout.session.completed':
      // User completed payment - activate subscription
      await activateSubscription(event.data.object);
      break;
    case 'customer.subscription.updated':
      // Subscription changed (upgrade/downgrade)
      await updateSubscription(event.data.object);
      break;
    case 'customer.subscription.deleted':
      // Subscription cancelled
      await deactivateSubscription(event.data.object);
      break;
  }
}
```

5. **User Subscription Status:**
```javascript
// Stored in Supabase
{
  user_id: uuid,
  stripe_customer_id: string,
  stripe_subscription_id: string,
  subscription_tier: 'free' | 'starter' | 'premium' | 'gold',
  subscription_status: 'active' | 'cancelled' | 'past_due',
  current_period_end: timestamp,
  cancel_at_period_end: boolean
}
```

---

## 📊 Pricing Psychology

### Price Anchoring
Show all tiers together to make Premium feel like "best value":

```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│      FREE        │     STARTER      │     PREMIUM      │       GOLD       │
│                  │                  │  🏆 BEST VALUE   │                  │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│      $0/mo       │     $4.99/mo     │     $9.99/mo     │    $19.99/mo     │
│                  │   or $49/year    │   or $99/year    │   or $199/year   │
│                  │   (Save $10)     │   (Save $20)     │   (Save $40)     │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

### Upgrade Triggers

**Free → Starter:**
- After 10 tasks hit limit
- After trying to access cycle tracking
- After 7 days of history (offer to unlock 30 days)

**Starter → Premium:**
- After using cycle tracking for 1 week (tease insights)
- During PMS week (offer symptom tracking)
- After 1 month (offer personalized AI recommendations)

**Premium → Gold:**
- Power users (daily active for 60+ days)
- When requesting API access
- When viewing monthly reports frequently

---

## 🎁 Free Trial Strategy

### 14-Day Premium Trial (New Users)
**Activation:**
- Offered during onboarding
- Requires credit card (Stripe)
- Auto-converts to paid at day 14 (can cancel anytime)

**Benefits:**
- Removes friction - experience full value first
- Higher conversion rate (40-50% vs 5-10% direct)
- Demonstrates value of premium features

**Implementation:**
```javascript
// On signup
if (isNewUser && !hasTrialBefore) {
  offer14DayPremiumTrial();
}

// Trial tracking
{
  userId: uuid,
  trialTier: 'premium',
  trialStartDate: timestamp,
  trialEndDate: timestamp,  // 14 days from start
  hasConverted: boolean
}
```

### Upgrade Trials (Existing Users)
**7-Day Upgrade Trial:**
- Starter users can try Premium for 7 days
- Premium users can try Gold for 7 days
- One trial per tier, ever

---

## 📈 Conversion Optimization

### In-App Upsells

**Strategic Placement:**
1. **Paywall on feature access** (primary)
2. **Banner in Settings** (always visible)
3. **Post-NDM completion modal** (daily reminder)
4. **Weekly email** (usage summary + upgrade CTA)

**Messaging Examples:**

**Free → Starter:**
> "You've completed 5 days of NDMs! 🎉 Unlock the FULL system with Starter for just $4.99/mo."

**Starter → Premium:**
> "You're on Day 24 of your cycle. Premium users get PMS symptom tracking + craving management tools. Upgrade now!"

**Premium → Gold:**
> "Your monthly report is ready! Gold users get AI-powered insights into your best performance days. Try it free for 7 days."

---

## 🧪 A/B Testing Plan

### Pricing Tests
1. **Test monthly vs annual emphasis:**
   - Variant A: Show monthly first
   - Variant B: Show annual first (with savings badge)

2. **Test free trial length:**
   - Control: 14 days
   - Variant: 30 days (hypothesis: longer → higher conversion)

3. **Test tier naming:**
   - Control: Starter, Premium, Gold
   - Variant: Essentials, Pro, Ultimate

### Feature Gate Tests
1. **Cycle tracking paywall timing:**
   - Immediate vs after 1 week of onboarding
2. **Voice transcription:**
   - Hard paywall vs "transcription disabled" soft gate

---

## 📱 Mobile App Pricing (Future)

**iOS/Android App - In-App Purchases:**
- Same tier structure
- Apple/Google take 15-30% cut (factor into pricing)
- Potential: $5.99/$11.99/$21.99 (slightly higher for app store fees)

---

## 🎯 Revenue Projections

### Assumptions:
- 10,000 active users
- Conversion rates: Free→Starter (15%), Starter→Premium (25%), Premium→Gold (10%)

### Monthly Recurring Revenue (MRR):

```
Free Users:     6,000 × $0      = $0
Starter Users:  3,000 × $4.99   = $14,970
Premium Users:    750 × $9.99   = $7,492
Gold Users:        75 × $19.99  = $1,499
─────────────────────────────────────────
TOTAL MRR:                        $23,961

Annual MRR: $287,532
```

### At 100k users (scaled 10x):
- **$2.4M ARR** (annual recurring revenue)

---

## 🚀 Launch Strategy

### Phase 1: Free + Starter Only (Month 1-3)
- Build trust with free tier
- Perfect Starter tier features
- Gather feedback
- Goal: 1,000 paying Starter users

### Phase 2: Add Premium (Month 4-6)
- Launch cycle tracking fully
- Add AI insights
- Goal: 25% of Starter users upgrade to Premium

### Phase 3: Add Gold (Month 7-12)
- Wearable integrations
- Team features
- Goal: 10% of Premium users upgrade to Gold

---

## 🔒 Churn Prevention

### Strategies:
1. **Exit surveys:** Ask why before cancellation
2. **Pause subscription:** Offer 1-month pause instead of cancel
3. **Downgrade option:** Offer to downgrade to lower tier
4. **Win-back campaigns:** Email cancelled users after 30 days with special offer

### Retention Features:
- **Streak tracking:** "You're on a 47-day NDM streak! Don't lose it."
- **Data loss warning:** "Your 6 months of cycle data will be deleted if you cancel."
- **Community:** Premium/Gold users get access to exclusive Discord community

---

**End of Subscription Architecture Document**
