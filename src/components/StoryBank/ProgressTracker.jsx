import React from 'react';
import { Target, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

/**
 * Progress Tracker Component
 *
 * Displays progress toward 365-story yearly goal
 * Shows if user is on track based on days elapsed
 */
const ProgressTracker = ({ progress, darkMode }) => {
  const { count, target, percentage, remaining, onTrack, daysElapsed, daysRemaining } = progress;

  const expectedStories = Math.floor((daysElapsed / 365) * target);
  const delta = count - expectedStories;

  return (
    <div className="mt-4">
      {/* Progress Bar */}
      <div className="relative">
        <div className={`h-2 rounded-full overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-gray-200'
        }`}>
          <div
            className={`h-full transition-all duration-500 ${
              onTrack
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        {/* Milestone Markers */}
        <div className="absolute top-0 left-0 right-0 flex justify-between px-1" style={{ top: '-2px' }}>
          {[25, 50, 75].map(milestone => (
            <div
              key={milestone}
              className={`w-1 h-6 rounded-full ${
                percentage >= milestone
                  ? darkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                  : darkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}
              style={{ marginLeft: `${milestone}%`, transform: 'translateX(-50%)' }}
              title={`${milestone}% milestone`}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Count */}
          <div className="flex items-center gap-2">
            <Target className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={18} />
            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {count} / {target} stories
            </span>
          </div>

          {/* On Track Indicator */}
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
            onTrack
              ? darkMode
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-emerald-100 text-emerald-700'
              : darkMode
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-amber-100 text-amber-700'
          }`}>
            {onTrack ? (
              <>
                <TrendingUp size={14} />
                On Track
              </>
            ) : (
              <>
                <TrendingDown size={14} />
                {delta < 0 ? `${Math.abs(delta)} behind` : 'Catching up'}
              </>
            )}
          </div>
        </div>

        {/* Days Remaining */}
        <div className={`flex items-center gap-1.5 text-xs ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Calendar size={14} />
          <span>{daysRemaining} days left in year</span>
        </div>
      </div>

      {/* Motivational Message */}
      {count < target && (
        <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {onTrack
            ? `Keep it up! You're ${delta > 0 ? delta : 0} stories ahead of schedule.`
            : `Need ${remaining} more stories. Average ${Math.ceil(remaining / (daysRemaining || 1))} per ${daysRemaining < 30 ? 'day' : 'week'} to reach your goal.`
          }
        </p>
      )}

      {count >= target && (
        <p className={`mt-2 text-xs font-semibold ${
          darkMode ? 'text-emerald-400' : 'text-emerald-600'
        }`}>
          🎉 Goal achieved! You've documented {count} stories this year!
        </p>
      )}
    </div>
  );
};

export default ProgressTracker;
