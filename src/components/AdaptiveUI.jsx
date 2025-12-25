import React, { useEffect, useState } from 'react';
import useSessionStore from '../store/useSessionStore';

/**
 * AdaptiveUI Component
 *
 * Adjusts UI complexity based on user's behavior patterns
 * - Beginners: Simplified UI, more guidance, fewer options
 * - Intermediate: Balanced UI, some advanced features
 * - Power Users: Full feature set, keyboard shortcuts, advanced options
 *
 * Skill level determined by:
 * - Days active
 * - Feature usage diversity
 * - Keyboard shortcut usage
 * - Session frequency
 */

/**
 * Determine user skill level
 * @param {object} sessionData - User session data
 * @returns {object} Skill level and metrics
 */
const determineSkillLevel = (sessionData) => {
  const {
    streaks = {},
    featureUseCount = {},
    keyboardShortcutUses = 0,
    sessionsCount = 0,
    daysActive = 1
  } = sessionData;

  // Calculate metrics
  const checkInDays = streaks.checkIns || 0;
  const featuresUsed = Object.keys(featureUseCount).length;
  const totalActions = Object.values(featureUseCount).reduce((sum, count) => sum + count, 0);
  const avgActionsPerDay = daysActive > 0 ? totalActions / daysActive : 0;

  // Scoring system (0-100)
  let score = 0;

  // Days active (0-30 points)
  score += Math.min(30, checkInDays * 2);

  // Feature diversity (0-25 points)
  score += Math.min(25, featuresUsed * 3);

  // Engagement level (0-25 points)
  score += Math.min(25, avgActionsPerDay * 2);

  // Power user behaviors (0-20 points)
  score += Math.min(20, keyboardShortcutUses);

  // Classify skill level
  let level = 'beginner';
  if (score >= 70) level = 'power-user';
  else if (score >= 35) level = 'intermediate';

  return {
    level,
    score,
    metrics: {
      daysActive: checkInDays,
      featuresUsed,
      avgActionsPerDay: avgActionsPerDay.toFixed(1),
      keyboardShortcutUses,
      sessionsCount
    },
    recommendations: getSkillLevelRecommendations(level, score)
  };
};

/**
 * Get recommendations for progressing to next skill level
 */
const getSkillLevelRecommendations = (level, score) => {
  if (level === 'beginner') {
    return {
      nextLevel: 'intermediate',
      pointsNeeded: 35 - score,
      tips: [
        'Complete check-ins for 7 consecutive days',
        'Try all 4 must-dos (NDM)',
        'Explore the Pomodoro timer',
        'Use brain dump for mental clarity'
      ]
    };
  } else if (level === 'intermediate') {
    return {
      nextLevel: 'power-user',
      pointsNeeded: 70 - score,
      tips: [
        'Build a 30-day streak',
        'Learn keyboard shortcuts (Cmd+B, Cmd+P)',
        'Use command center (Cmd+C)',
        'Customize your workflow'
      ]
    };
  } else {
    return {
      nextLevel: 'master',
      pointsNeeded: 0,
      tips: [
        'You\'re a power user! Keep crushing it',
        'Share your workflow with others',
        'Explore advanced integrations'
      ]
    };
  }
};

/**
 * AdaptiveUI HOC (Higher-Order Component)
 *
 * Wraps child components and provides adaptive behavior
 */
const AdaptiveUI = ({ children, darkMode = false }) => {
  const sessionData = useSessionStore((state) => ({
    streaks: state.streaks,
    featureUseCount: state.featureUseCount || {},
    keyboardShortcutUses: state.keyboardShortcutUses || 0,
    sessionsCount: state.sessionsCount || 0,
    daysActive: state.streaks?.checkIns || 1
  }));

  const [skillLevel, setSkillLevel] = useState(null);

  useEffect(() => {
    const level = determineSkillLevel(sessionData);
    setSkillLevel(level);

    // Apply skill level to document for CSS targeting
    document.documentElement.setAttribute('data-skill-level', level.level);
  }, [sessionData]);

  if (!skillLevel) return children;

  // Pass skill level context to children
  return (
    <div className={`adaptive-ui skill-${skillLevel.level}`}>
      {typeof children === 'function'
        ? children(skillLevel)
        : children
      }
    </div>
  );
};

/**
 * useAdaptiveFeatures Hook
 *
 * Provides feature flags based on skill level
 */
export const useAdaptiveFeatures = () => {
  const sessionData = useSessionStore((state) => ({
    streaks: state.streaks,
    featureUseCount: state.featureUseCount || {},
    keyboardShortcutUses: state.keyboardShortcutUses || 0,
    sessionsCount: state.sessionsCount || 0,
    daysActive: state.streaks?.checkIns || 1
  }));

  const skillLevel = determineSkillLevel(sessionData);

  // Feature flags based on skill level
  const features = {
    // Beginner features (always enabled)
    showOnboardingHints: true,
    showTooltips: true,
    showProgressIndicators: true,
    simplifiedNavigation: skillLevel.level === 'beginner',

    // Intermediate features
    showKeyboardShortcuts: skillLevel.level !== 'beginner',
    showAdvancedStats: skillLevel.level !== 'beginner',
    enableQuickActions: skillLevel.level !== 'beginner',

    // Power user features
    showCommandCenter: skillLevel.level === 'power-user',
    enableCustomization: skillLevel.level === 'power-user',
    showAdvancedIntegrations: skillLevel.level === 'power-user',
    enableBulkActions: skillLevel.level === 'power-user',

    // Adaptive UI elements
    navStyle: skillLevel.level === 'beginner' ? 'simple' : skillLevel.level === 'intermediate' ? 'standard' : 'compact',
    helpLevel: skillLevel.level === 'beginner' ? 'detailed' : skillLevel.level === 'intermediate' ? 'moderate' : 'minimal',
    defaultView: skillLevel.level === 'beginner' ? 'guided' : 'dashboard'
  };

  return {
    skillLevel: skillLevel.level,
    skillScore: skillLevel.score,
    metrics: skillLevel.metrics,
    recommendations: skillLevel.recommendations,
    features
  };
};

/**
 * SkillLevelBadge Component
 *
 * Displays user's current skill level with progress
 */
export const SkillLevelBadge = ({ darkMode = false, showProgress = true }) => {
  const { skillLevel, skillScore, metrics, recommendations } = useAdaptiveFeatures();

  const levelConfig = {
    beginner: {
      label: 'Getting Started',
      color: 'blue',
      icon: '🌱',
      bgClass: darkMode ? 'bg-blue-500/20' : 'bg-blue-100',
      textClass: darkMode ? 'text-blue-400' : 'text-blue-700',
      borderClass: darkMode ? 'border-blue-500/50' : 'border-blue-300'
    },
    intermediate: {
      label: 'Building Momentum',
      color: 'purple',
      icon: '⚡',
      bgClass: darkMode ? 'bg-purple-500/20' : 'bg-purple-100',
      textClass: darkMode ? 'text-purple-400' : 'text-purple-700',
      borderClass: darkMode ? 'border-purple-500/50' : 'border-purple-300'
    },
    'power-user': {
      label: 'Power User',
      color: 'amber',
      icon: '🚀',
      bgClass: darkMode ? 'bg-amber-500/20' : 'bg-amber-100',
      textClass: darkMode ? 'text-amber-400' : 'text-amber-700',
      borderClass: darkMode ? 'border-amber-500/50' : 'border-amber-300'
    }
  };

  const config = levelConfig[skillLevel] || levelConfig.beginner;
  const progress = skillScore;
  const nextThreshold = skillLevel === 'beginner' ? 35 : skillLevel === 'intermediate' ? 70 : 100;
  const progressPercent = (progress / nextThreshold) * 100;

  return (
    <div className={`
      rounded-xl p-4 border-2
      ${config.bgClass} ${config.borderClass}
      backdrop-blur-sm
    `}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <div className={`font-semibold ${config.textClass}`}>
            {config.label}
          </div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {metrics.daysActive} days active • {metrics.featuresUsed} features explored
          </div>
        </div>
      </div>

      {showProgress && skillLevel !== 'power-user' && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              Progress to {recommendations.nextLevel}
            </span>
            <span className={config.textClass}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div
              className={`h-full transition-all duration-500 progress-fill ${
                darkMode ? `bg-${config.color}-500` : `bg-${config.color}-600`
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {recommendations.pointsNeeded > 0
              ? `${recommendations.pointsNeeded} more points needed`
              : 'Keep going!'
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveUI;
