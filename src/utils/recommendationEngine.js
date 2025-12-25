/**
 * Recommendation Engine
 *
 * Rules-based recommendation system that analyzes user behavior
 * and provides personalized suggestions
 *
 * Features:
 * - Time-based recommendations
 * - Energy pattern analysis
 * - Productivity prediction
 * - Habit formation suggestions
 * - Task prioritization
 */

/**
 * Analyze user behavior patterns from session store
 * @param {object} sessionData - User session data
 * @returns {object} Behavior insights
 */
export const analyzeBehaviorPatterns = (sessionData) => {
  const {
    featureUseCount = {},
    navigationHistory = [],
    completedToday = [],
    streaks = {},
    lastCheckInEnergy = null,
    lastCheckInMood = null,
    timePatterns = {}
  } = sessionData;

  // Most used features
  const sortedFeatures = Object.entries(featureUseCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Peak productivity hours
  const peakHours = Object.entries(timePatterns.productivityByHour || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));

  // Preferred energy level for tasks
  const energyTaskCorrelation = timePatterns.energyTaskCorrelation || {};

  // Consistency score (0-100)
  const checkInStreak = streaks.checkIns || 0;
  const ndmStreak = streaks.ndmCompletions || 0;
  const consistencyScore = Math.min(100, ((checkInStreak + ndmStreak) / 2) * 5);

  return {
    topFeatures: sortedFeatures.map(([feature]) => feature),
    peakHours,
    energyTaskCorrelation,
    consistencyScore,
    isConsistent: consistencyScore >= 50,
    preferredTimeOfDay: getPeakTimeOfDay(peakHours),
    energyTrend: getEnergyTrend(sessionData.energyHistory || [])
  };
};

/**
 * Get recommendations based on current context
 * @param {object} context - Current user context
 * @param {object} behaviorPatterns - Analyzed behavior patterns
 * @returns {array} Array of recommendation objects
 */
export const getRecommendations = (context, behaviorPatterns) => {
  const recommendations = [];
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();

  const {
    energyLevel = 5,
    moodLevel = 5,
    completedNDM = false,
    hasCheckedInToday = false,
    currentStreak = 0,
    incompleteTasks = [],
    timeAvailable = 60, // minutes
    lastFocusSession = null
  } = context;

  // Priority 1: Check-in if not done
  if (!hasCheckedInToday && hour >= 6 && hour <= 22) {
    recommendations.push({
      id: 'checkin-reminder',
      type: 'action',
      priority: 'high',
      title: 'Start Your Day Right',
      description: 'Check in with your energy and mood to personalize your experience.',
      action: 'navigate:/check-in',
      confidence: 0.95,
      reasoning: 'Daily check-in not completed',
      estimatedTime: 2,
      energyRequired: 1
    });
  }

  // Priority 2: Energy-based task recommendations
  if (energyLevel >= 8) {
    // High energy: tackle hard tasks
    recommendations.push({
      id: 'tackle-hard-task',
      type: 'productivity',
      priority: 'high',
      title: 'Perfect Time for Deep Work',
      description: 'Your energy is high! Start your most challenging task with a Pomodoro session.',
      action: 'start-pomodoro',
      confidence: 0.9,
      reasoning: `High energy level (${energyLevel}/10)`,
      estimatedTime: 25,
      energyRequired: 8,
      expectedOutcome: 'Complete 1-2 hours of focused work'
    });
  } else if (energyLevel <= 3) {
    // Low energy: light tasks or rest
    recommendations.push({
      id: 'rest-or-light',
      type: 'wellness',
      priority: 'medium',
      title: 'Low Energy Detected',
      description: 'Consider a short walk, hydration break, or tackle light admin tasks.',
      action: 'show-wellness-tips',
      confidence: 0.85,
      reasoning: `Low energy level (${energyLevel}/10)`,
      estimatedTime: 10,
      energyRequired: 2,
      expectedOutcome: 'Restore 2-3 energy points'
    });
  } else if (energyLevel >= 5 && energyLevel <= 7) {
    // Medium energy: moderate tasks
    recommendations.push({
      id: 'moderate-task',
      type: 'productivity',
      priority: 'medium',
      title: 'Good Time for Moderate Tasks',
      description: 'Your energy is stable. Great for meetings, planning, or creative work.',
      action: 'open-braindump',
      confidence: 0.8,
      reasoning: `Medium energy level (${energyLevel}/10)`,
      estimatedTime: 15,
      energyRequired: 5,
      expectedOutcome: 'Make progress on 2-3 tasks'
    });
  }

  // Priority 3: NDM completion
  if (!completedNDM && hour >= 9 && hour <= 20) {
    recommendations.push({
      id: 'complete-ndm',
      type: 'habit',
      priority: 'high',
      title: 'Complete Your Must-Dos',
      description: 'You haven\'t finished all 4 non-negotiables today. Keep your streak going!',
      action: 'navigate:/dashboard#ndm',
      confidence: 0.92,
      reasoning: 'NDM not completed, habits are critical',
      estimatedTime: 20,
      energyRequired: 3,
      streakImpact: currentStreak > 0 ? `Maintain ${currentStreak}-day streak` : 'Start a new streak'
    });
  }

  // Priority 4: Pattern-based recommendations
  if (behaviorPatterns.topFeatures.includes('braindump') && hour >= 9 && hour <= 11) {
    recommendations.push({
      id: 'morning-braindump',
      type: 'habit',
      priority: 'medium',
      title: 'Your Usual Morning Brain Dump',
      description: 'You typically brain dump around this time. Clear your mind?',
      action: 'open-braindump',
      confidence: 0.75,
      reasoning: 'Pattern detected: morning brain dump habit',
      estimatedTime: 10,
      energyRequired: 3
    });
  }

  // Priority 5: Pomodoro based on focus history
  if (lastFocusSession) {
    const hoursSinceLastFocus = (Date.now() - lastFocusSession) / (1000 * 60 * 60);

    if (hoursSinceLastFocus >= 3 && energyLevel >= 6) {
      recommendations.push({
        id: 'focus-session',
        type: 'productivity',
        priority: 'medium',
        title: 'Time for Another Focus Session?',
        description: `It's been ${Math.floor(hoursSinceLastFocus)} hours since your last deep work session.`,
        action: 'start-pomodoro',
        confidence: 0.7,
        reasoning: 'Sufficient time since last focus session',
        estimatedTime: 25,
        energyRequired: 6
      });
    }
  }

  // Priority 6: Consistency boost
  if (currentStreak >= 7 && dayOfWeek !== 0 && dayOfWeek !== 6) {
    recommendations.push({
      id: 'streak-motivation',
      type: 'motivation',
      priority: 'low',
      title: `${currentStreak}-Day Streak! 🔥`,
      description: 'You\'re on a roll! Here are the habits that got you here.',
      action: 'show-streak-stats',
      confidence: 0.65,
      reasoning: 'Strong streak deserves recognition',
      estimatedTime: 2,
      energyRequired: 1
    });
  }

  // Priority 7: Time-of-day recommendations
  if (hour >= 6 && hour <= 8) {
    recommendations.push({
      id: 'morning-routine',
      type: 'wellness',
      priority: 'medium',
      title: 'Morning Routine',
      description: 'Set intentions for the day: nutrition plan, key priorities, energy check-in.',
      action: 'show-morning-routine',
      confidence: 0.8,
      reasoning: 'Morning hours (6-8 AM)',
      estimatedTime: 15,
      energyRequired: 4
    });
  } else if (hour >= 14 && hour <= 16 && energyLevel <= 5) {
    recommendations.push({
      id: 'afternoon-slump',
      type: 'wellness',
      priority: 'medium',
      title: 'Beat the Afternoon Slump',
      description: 'Try a 10-minute walk, protein snack, or power nap to restore energy.',
      action: 'show-energy-boost-tips',
      confidence: 0.75,
      reasoning: 'Afternoon energy dip (2-4 PM)',
      estimatedTime: 10,
      energyRequired: 2
    });
  } else if (hour >= 20 && hour <= 22) {
    recommendations.push({
      id: 'evening-winddown',
      type: 'wellness',
      priority: 'low',
      title: 'Wind Down for Better Sleep',
      description: 'Review your day, plan tomorrow, and start your evening routine.',
      action: 'show-evening-routine',
      confidence: 0.7,
      reasoning: 'Evening hours (8-10 PM)',
      estimatedTime: 20,
      energyRequired: 3
    });
  }

  // Sort by priority and confidence
  return recommendations
    .sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    })
    .slice(0, 5); // Top 5 recommendations
};

/**
 * Predict optimal time for a task based on patterns
 * @param {string} taskType - Type of task (e.g., 'focus', 'creative', 'admin')
 * @param {object} behaviorPatterns - User's behavior patterns
 * @returns {object} Optimal time suggestion
 */
export const predictOptimalTaskTime = (taskType, behaviorPatterns) => {
  const { peakHours = [], preferredTimeOfDay = 'morning' } = behaviorPatterns;

  const taskTimeProfiles = {
    focus: {
      optimalHours: peakHours.length > 0 ? peakHours : [9, 10, 11],
      minEnergyRequired: 7,
      idealDuration: 90,
      description: 'Deep work requires high energy and minimal distractions'
    },
    creative: {
      optimalHours: [10, 11, 14, 15],
      minEnergyRequired: 6,
      idealDuration: 60,
      description: 'Creative work benefits from fresh mind and moderate energy'
    },
    admin: {
      optimalHours: [13, 14, 16, 17],
      minEnergyRequired: 4,
      idealDuration: 30,
      description: 'Administrative tasks can be done during lower energy periods'
    },
    planning: {
      optimalHours: [8, 9, 17, 18],
      minEnergyRequired: 5,
      idealDuration: 45,
      description: 'Planning works well at the start or end of the day'
    }
  };

  const profile = taskTimeProfiles[taskType] || taskTimeProfiles.admin;
  const currentHour = new Date().getHours();

  // Find next optimal time
  const nextOptimalHour = profile.optimalHours.find(h => h > currentHour) || profile.optimalHours[0];

  return {
    taskType,
    nextOptimalHour,
    minEnergyRequired: profile.minEnergyRequired,
    idealDuration: profile.idealDuration,
    reasoning: profile.description,
    isOptimalNow: profile.optimalHours.includes(currentHour),
    confidence: peakHours.includes(nextOptimalHour) ? 0.9 : 0.7
  };
};

/**
 * Predict habit streak likelihood
 * @param {object} streakData - Current streak data
 * @param {object} behaviorPatterns - User's behavior patterns
 * @returns {object} Prediction result
 */
export const predictStreakContinuation = (streakData, behaviorPatterns) => {
  const { checkIns = 0, ndmCompletions = 0 } = streakData;
  const { consistencyScore = 0 } = behaviorPatterns;

  const currentHour = new Date().getHours();
  const isLateInDay = currentHour >= 18;

  // Calculate likelihood (0-100%)
  let likelihood = consistencyScore;

  // Adjust based on streak length
  if (checkIns >= 7) likelihood += 15; // Week+ streak adds momentum
  if (checkIns >= 30) likelihood += 10; // Month+ streak very likely to continue

  // Penalize if late in day and not done
  if (isLateInDay && checkIns > 0) {
    likelihood -= 20;
  }

  // Cap at 95% (never 100% certain)
  likelihood = Math.min(95, Math.max(5, likelihood));

  return {
    likelihood,
    currentStreak: checkIns,
    longestStreak: Math.max(checkIns, ndmCompletions),
    prediction: likelihood >= 70 ? 'likely' : likelihood >= 40 ? 'moderate' : 'at-risk',
    recommendation: likelihood < 40
      ? 'Check in now to maintain your streak!'
      : likelihood < 70
      ? 'Don\'t forget to check in today'
      : 'You\'re on track to maintain your streak',
    confidenceLevel: likelihood >= 70 ? 'high' : likelihood >= 40 ? 'medium' : 'low'
  };
};

// Helper functions

function getPeakTimeOfDay(peakHours) {
  if (!peakHours || peakHours.length === 0) return 'morning';

  const avgHour = peakHours.reduce((sum, h) => sum + h, 0) / peakHours.length;

  if (avgHour < 12) return 'morning';
  if (avgHour < 17) return 'afternoon';
  return 'evening';
}

function getEnergyTrend(energyHistory) {
  if (!energyHistory || energyHistory.length < 3) return 'stable';

  const recent = energyHistory.slice(-7); // Last 7 entries
  const avg = recent.reduce((sum, e) => sum + e.level, 0) / recent.length;

  const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
  const secondHalf = recent.slice(Math.floor(recent.length / 2));

  const firstAvg = firstHalf.reduce((sum, e) => sum + e.level, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, e) => sum + e.level, 0) / secondHalf.length;

  const diff = secondAvg - firstAvg;

  if (diff >= 1.5) return 'improving';
  if (diff <= -1.5) return 'declining';
  return 'stable';
}

export default {
  analyzeBehaviorPatterns,
  getRecommendations,
  predictOptimalTaskTime,
  predictStreakContinuation
};
