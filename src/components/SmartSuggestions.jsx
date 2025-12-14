import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

/**
 * SmartSuggestions - Energy and Mood-Based Recommendations
 *
 * Displays personalized suggestions based on:
 * - Current energy level (1-5 scale, tracked 3x daily)
 * - Current mood state (energized, focused, calm, tired, anxious, overwhelmed)
 *
 * Features:
 * - Energy-based task recommendations
 * - Mood-based wellness activities
 * - Nutrition suggestions optimized for current state
 * - "Ultimate Gentle Mode" for crisis situations (low energy + overwhelmed)
 *
 * Research-backed recommendations from PhD-level balance psychology
 */
const SmartSuggestions = ({ suggestions, darkMode, onAddTask, currentHour }) => {
  if (!suggestions) return null;

  const isUltimateGentle = suggestions.type === 'crisis';

  // Helper to get color classes for icons
  const getIconColor = (color) => {
    if (darkMode) {
      if (color === 'orange') return 'text-orange-400';
      if (color === 'rose') return 'text-rose-400';
      if (color === 'purple') return 'text-purple-400';
      if (color === 'blue') return 'text-blue-400';
      return 'text-cyan-400';
    } else {
      if (color === 'orange') return 'text-orange-600';
      if (color === 'rose') return 'text-rose-600';
      if (color === 'purple') return 'text-purple-600';
      if (color === 'blue') return 'text-blue-600';
      return 'text-cyan-600';
    }
  };

  // Helper to get background gradient classes
  const getBackgroundGradient = (color) => {
    if (darkMode) {
      if (color === 'orange') return 'bg-gradient-to-br from-orange-900/50 via-amber-900/50 to-orange-900/50 border-2 border-orange-500/40';
      if (color === 'rose') return 'bg-gradient-to-br from-rose-900/50 via-pink-900/50 to-rose-900/50 border-2 border-rose-500/40';
      if (color === 'purple') return 'bg-gradient-to-br from-purple-900/50 via-violet-900/50 to-purple-900/50 border-2 border-purple-500/40';
      if (color === 'blue') return 'bg-gradient-to-br from-blue-900/50 via-indigo-900/50 to-blue-900/50 border-2 border-blue-500/40';
      return 'bg-gradient-to-br from-cyan-900/50 via-teal-900/50 to-cyan-900/50 border-2 border-cyan-500/40';
    } else {
      if (color === 'orange') return 'bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300';
      if (color === 'rose') return 'bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-rose-300';
      if (color === 'purple') return 'bg-gradient-to-br from-purple-100 to-violet-100 border-2 border-purple-300';
      if (color === 'blue') return 'bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-300';
      return 'bg-gradient-to-br from-cyan-100 to-teal-100 border-2 border-cyan-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Energy-Based Suggestions */}
      <div className={`rounded-xl p-6 transition-all duration-300 shadow-lg backdrop-blur-sm ${getBackgroundGradient(suggestions.color)}`}>
        <div className="flex items-center mb-3">
          <Lightbulb className={`mr-2 ${getIconColor(suggestions.color)}`} size={24} />
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isUltimateGentle ? '🌸 Ultimate Gentle Mode' : `⚡ Energy: ${suggestions.title}`}
          </h3>
        </div>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {suggestions.message}
        </p>

        {suggestions.warning && (
          <div className={`p-3 rounded-lg mb-4 ${
            darkMode
              ? 'bg-rose-500/20 border border-rose-500/40'
              : 'bg-rose-100 border border-rose-300'
          }`}>
            <p className={`text-sm font-semibold ${darkMode ? 'text-rose-300' : 'text-rose-700'}`}>
              {suggestions.warning}
            </p>
          </div>
        )}

        {/* Task Suggestions */}
        {suggestions.tasks && suggestions.tasks.length > 0 && (
          <div className="mb-4">
            <h4 className={`text-xs font-bold mb-2 uppercase tracking-wide ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Recommended Actions
            </h4>
            <div className="space-y-2">
              {suggestions.tasks.map((task, idx) => (
                <button
                  key={idx}
                  onClick={() => onAddTask(currentHour, task)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200'
                      : 'bg-white/60 hover:bg-white border border-white/40 text-gray-800'
                  }`}
                >
                  <span className="text-sm">✓ {task}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Snack Recommendations */}
        {suggestions.snacks && suggestions.snacks.length > 0 && (
          <div>
            <h4 className={`text-xs font-bold mb-2 uppercase tracking-wide ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Fuel Your Energy
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.snacks.map((snack, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-xs ${
                    darkMode
                      ? 'bg-white/5 border border-white/10 text-gray-300'
                      : 'bg-white/40 border border-white/30 text-gray-700'
                  }`}
                >
                  🍽️ {snack}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mood-Based Wellness Recommendations (Separate Section) */}
      {suggestions.moodWellness && !isUltimateGentle && (
        <div className={`rounded-xl p-6 transition-all duration-300 shadow-lg backdrop-blur-sm ${getBackgroundGradient(suggestions.moodWellness.color)}`}>
          <div className="flex items-center mb-3">
            <Sparkles className={`mr-2 ${getIconColor(suggestions.moodWellness.color)}`} size={24} />
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🎭 Mood: {suggestions.moodWellness.title}
            </h3>
          </div>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {suggestions.moodWellness.message}
          </p>

          {/* Mood Activities */}
          {suggestions.moodWellness.activities && suggestions.moodWellness.activities.length > 0 && (
            <div className="mb-4">
              <h4 className={`text-xs font-bold mb-2 uppercase tracking-wide ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Wellness Activities
              </h4>
              <div className="space-y-2">
                {suggestions.moodWellness.activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-sm ${
                      darkMode
                        ? 'bg-white/10 border border-white/20 text-gray-200'
                        : 'bg-white/60 border border-white/40 text-gray-800'
                    }`}
                  >
                    ✨ {activity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood Snacks */}
          {suggestions.moodWellness.snacks && suggestions.moodWellness.snacks.length > 0 && (
            <div>
              <h4 className={`text-xs font-bold mb-2 uppercase tracking-wide ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Mood-Boosting Nutrition
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.moodWellness.snacks.map((snack, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg text-xs ${
                      darkMode
                        ? 'bg-white/5 border border-white/10 text-gray-300'
                        : 'bg-white/40 border border-white/30 text-gray-700'
                    }`}
                  >
                    🍽️ {snack}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supplement suggestion if available */}
          {suggestions.moodWellness.supplement && (
            <div className={`mt-4 p-3 rounded-lg ${
              darkMode
                ? 'bg-purple-500/20 border border-purple-500/40'
                : 'bg-purple-100 border border-purple-300'
            }`}>
              <p className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                💊 {suggestions.moodWellness.supplement}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
