/**
 * Subscription tier pricing and features
 */

export const TIERS = {
  FREE: 'free',
  STARTER: 'starter',
  PREMIUM: 'premium',
  GOLD: 'gold'
};

export const TIER_HIERARCHY = {
  free: 0,
  starter: 1,
  premium: 2,
  gold: 3
};

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

export const TIER_NAMES = {
  free: 'Free',
  starter: 'Starter',
  premium: 'Premium',
  gold: 'Gold'
};

export const TIER_TAGLINES = {
  free: 'Foundation',
  starter: 'Essentials Plus',
  premium: 'Power User',
  gold: 'Ultimate Optimization'
};

export const TIER_FEATURES = {
  free: [
    'Basic Pomodoro timer (25/5)',
    'Up to 10 daily tasks',
    '2 Non-Negotiables per day',
    'Basic energy & mood tracking',
    '7 days of history',
    'Dark mode'
  ],
  starter: [
    'Everything in Free',
    'Unlimited tasks',
    'Full 4 NDM system',
    'Basic cycle tracking',
    'Voice transcription',
    'Smart nutrition logging',
    '30 days of history'
  ],
  premium: [
    'Everything in Starter',
    'Advanced cycle tracking',
    'AI-powered insights',
    'Symptom tracking & PMS tools',
    'Unlimited history',
    'Priority support',
    'Monthly wellness reports'
  ],
  gold: [
    'Everything in Premium',
    'Wearable integration',
    'API access',
    'Team features',
    'VIP support (4hr response)',
    'Expert webinars',
    'AI Cycle Coach'
  ]
};

// Feature access matrix
export const FEATURE_ACCESS = {
  // Core productivity
  unlimitedTasks: {
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
  customPomodoro: {
    free: false,
    starter: true,
    premium: true,
    gold: true
  },

  // Women's wellness
  cycleTracking: {
    free: false,
    starter: 'basic',      // phase calc + suggestions
    premium: 'advanced',   // symptoms + predictions
    gold: 'enterprise'     // AI coaching
  },

  // Voice & AI
  voiceTranscription: {
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

  // Analytics
  historyDays: {
    free: 7,
    starter: 30,
    premium: 'unlimited',
    gold: 'unlimited'
  },
  monthlyReports: {
    free: false,
    starter: false,
    premium: true,
    gold: true
  },

  // Advanced
  wearableIntegration: {
    free: false,
    starter: false,
    premium: false,
    gold: true
  },
  apiAccess: {
    free: false,
    starter: false,
    premium: false,
    gold: true
  },
  teamFeatures: {
    free: false,
    starter: false,
    premium: false,
    gold: true
  },

  // Support
  support: {
    free: 'community',
    starter: 'email',      // 48hr response
    premium: 'priority',   // 24hr response
    gold: 'vip'            // 4hr response
  }
};

// Feature display names for paywall
export const FEATURE_NAMES = {
  cycleTracking: 'Women\'s Cycle Tracking',
  voiceTranscription: 'Voice-to-Text Transcription',
  fullNDM: 'Full 4 NDM System',
  unlimitedTasks: 'Unlimited Tasks',
  aiInsights: 'AI-Powered Insights',
  wearableIntegration: 'Wearable Integration',
  apiAccess: 'API Access',
  teamFeatures: 'Team Collaboration',
  monthlyReports: 'Monthly Wellness Reports'
};

// Helper to get minimum tier for a feature
export const getMinimumTierForFeature = (featureName) => {
  const access = FEATURE_ACCESS[featureName];
  if (!access) return null;

  const tiers = ['free', 'starter', 'premium', 'gold'];
  for (const tier of tiers) {
    const hasAccess = access[tier];
    if (hasAccess === true || (typeof hasAccess === 'string' && hasAccess !== 'false')) {
      return tier;
    }
  }
  return 'gold'; // Default to highest tier
};
