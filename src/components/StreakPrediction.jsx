import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, AlertTriangle, Calendar, Trophy, Target } from 'lucide-react';
import { predictStreakContinuation } from '../utils/recommendationEngine';
import useSessionStore from '../store/useSessionStore';

/**
 * StreakPrediction Component
 *
 * Predicts likelihood of streak continuation
 * Provides insights and recommendations to maintain streaks
 *
 * Features:
 * - Likelihood prediction (0-100%)
 * - Trend analysis
 * - Personalized recommendations
 * - Risk alerts
 * - Milestone tracking
 */
const StreakPrediction = ({ darkMode = false }) => {
  // HOOKS MUST ALWAYS BE CALLED IN SAME ORDER - TOP OF COMPONENT
  const [prediction, setPrediction] = useState(null);

  const sessionData = useSessionStore((state) => ({
    streaks: state.streaks || {},
    behaviorPatterns: state.behaviorPatterns || {},
    completedToday: state.completedToday || []
  }));

  useEffect(() => {
    const result = predictStreakContinuation(
      sessionData.streaks,
      sessionData.behaviorPatterns
    );
    setPrediction(result);
  }, [sessionData]);

  // Early return AFTER all hooks - this is safe
  if (!prediction) return null;

  const { likelihood, currentStreak, prediction: status, recommendation, confidenceLevel } = prediction;

  const statusConfig = {
    'likely': {
      icon: TrendingUp,
      color: 'emerald',
      bgClass: darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100',
      borderClass: darkMode ? 'border-emerald-500/50' : 'border-emerald-300',
      textClass: darkMode ? 'text-emerald-400' : 'text-emerald-700',
      iconClass: darkMode ? 'text-emerald-400' : 'text-emerald-600',
      label: 'Strong Momentum',
      emoji: '🚀'
    },
    'moderate': {
      icon: Flame,
      color: 'amber',
      bgClass: darkMode ? 'bg-amber-500/20' : 'bg-amber-100',
      borderClass: darkMode ? 'border-amber-500/50' : 'border-amber-300',
      textClass: darkMode ? 'text-amber-400' : 'text-amber-700',
      iconClass: darkMode ? 'text-amber-400' : 'text-amber-600',
      label: 'Building Habit',
      emoji: '⚡'
    },
    'at-risk': {
      icon: AlertTriangle,
      color: 'red',
      bgClass: darkMode ? 'bg-red-500/20' : 'bg-red-100',
      borderClass: darkMode ? 'border-red-500/50' : 'border-red-300',
      textClass: darkMode ? 'text-red-400' : 'text-red-700',
      iconClass: darkMode ? 'text-red-400' : 'text-red-600',
      label: 'Needs Attention',
      emoji: '⚠️'
    }
  };

  const config = statusConfig[status] || statusConfig.moderate;
  const Icon = config.icon;

  // Upcoming milestones
  const milestones = [
    { days: 3, label: '3-Day Starter', icon: '🌱', reached: currentStreak >= 3 },
    { days: 7, label: 'Week Warrior', icon: '⚡', reached: currentStreak >= 7 },
    { days: 14, label: '2-Week Champion', icon: '🔥', reached: currentStreak >= 14 },
    { days: 30, label: 'Monthly Master', icon: '🏆', reached: currentStreak >= 30 },
    { days: 90, label: '3-Month Legend', icon: '👑', reached: currentStreak >= 90 },
    { days: 365, label: 'Year Hero', icon: '🌟', reached: currentStreak >= 365 }
  ];

  const nextMilestone = milestones.find(m => !m.reached);
  const daysToNextMilestone = nextMilestone ? nextMilestone.days - currentStreak : 0;

  // Calculate success rate based on historical data
  const getSuccessRate = () => {
    // Simplified calculation - in real app, would use actual history
    if (currentStreak >= 30) return 92;
    if (currentStreak >= 14) return 78;
    if (currentStreak >= 7) return 65;
    if (currentStreak >= 3) return 48;
    return 30;
  };

  const successRate = getSuccessRate();

  return (
    <div className={`
      rounded-2xl p-6 border-2
      ${darkMode
        ? 'bg-slate-800/50 border-slate-700/50'
        : 'bg-white border-purple-200/50'
      }
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${config.bgClass}
          `}>
            <Icon size={24} className={config.iconClass} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Streak Health
            </h3>
            <p className={`text-sm ${config.textClass}`}>
              {config.label}
            </p>
          </div>
        </div>
        <div className="text-3xl">
          {config.emoji}
        </div>
      </div>

      {/* Current Streak */}
      <div className={`
        rounded-xl p-4 mb-4 border-2
        ${config.bgClass} ${config.borderClass}
      `}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className={config.iconClass} size={20} />
            <span className={`font-semibold ${config.textClass}`}>
              Current Streak
            </span>
          </div>
          <span className={`text-2xl font-bold ${config.textClass}`}>
            {currentStreak} days
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex-1 h-2 rounded-full overflow-hidden ${
            darkMode ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <div
              className={`h-full transition-all duration-500 bg-gradient-to-r ${
                status === 'likely'
                  ? 'from-emerald-500 to-teal-500'
                  : status === 'moderate'
                  ? 'from-amber-500 to-orange-500'
                  : 'from-red-500 to-pink-500'
              }`}
              style={{ width: `${likelihood}%` }}
            />
          </div>
          <span className={`text-sm font-semibold ${config.textClass}`}>
            {likelihood}%
          </span>
        </div>
        <p className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {recommendation}
        </p>
      </div>

      {/* Success Rate */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`
          rounded-lg p-3 border
          ${darkMode
            ? 'bg-slate-700/50 border-slate-600'
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-1">
            <Target size={16} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
            <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Success Rate
            </span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {successRate}%
          </p>
        </div>

        <div className={`
          rounded-lg p-3 border
          ${darkMode
            ? 'bg-slate-700/50 border-slate-600'
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Confidence
            </span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {confidenceLevel === 'high' ? 'High' : confidenceLevel === 'medium' ? 'Medium' : 'Low'}
          </p>
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <div className={`
          rounded-lg p-4 border
          ${darkMode
            ? 'bg-purple-500/10 border-purple-500/30'
            : 'bg-purple-50 border-purple-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={18} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
            <span className={`font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
              Next Milestone
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {nextMilestone.icon} {nextMilestone.label}
              </p>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {daysToNextMilestone} {daysToNextMilestone === 1 ? 'day' : 'days'} to go
              </p>
            </div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {nextMilestone.days}
            </div>
          </div>

          {/* Progress bar to next milestone */}
          <div className={`mt-3 h-2 rounded-full overflow-hidden ${
            darkMode ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(currentStreak / nextMilestone.days) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Milestones Grid */}
      <div className="mt-4">
        <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Achievements
        </p>
        <div className="grid grid-cols-3 gap-2">
          {milestones.slice(0, 6).map((milestone) => (
            <div
              key={milestone.days}
              className={`
                rounded-lg p-2 text-center border transition-all
                ${milestone.reached
                  ? darkMode
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-purple-100 border-purple-300'
                  : darkMode
                  ? 'bg-slate-700/30 border-slate-600/30 opacity-50'
                  : 'bg-gray-50 border-gray-200 opacity-50'
                }
              `}
            >
              <div className="text-xl mb-1">{milestone.icon}</div>
              <div className={`text-xs font-medium ${
                milestone.reached
                  ? darkMode ? 'text-purple-400' : 'text-purple-700'
                  : darkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {milestone.days}d
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      {status === 'at-risk' && (
        <div className={`
          mt-4 rounded-lg p-3 border-l-4
          ${darkMode
            ? 'bg-red-500/10 border-red-500'
            : 'bg-red-50 border-red-500'
          }
        `}>
          <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
            💡 Quick Tips to Save Your Streak
          </p>
          <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <li>• Set a daily reminder for check-ins</li>
            <li>• Complete check-in first thing in the morning</li>
            <li>• Focus on just one must-do today</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default StreakPrediction;
