import React from 'react';

/**
 * NDMStatusBar - Non-Negotiables Daily Tracker
 *
 * Displays progress for the 4 daily non-negotiables:
 * - Nutrition (protein-rich breakfast)
 * - Movement (HIIT/exercise)
 * - Mindfulness (meditation/breathing)
 * - Brain Dump (thought capture)
 *
 * Each item is clickable to navigate to the appropriate view or open a modal
 */
const NDMStatusBar = ({ ndm, darkMode, setCurrentView, openMindfulMoment, openBrainDump }) => {
  const completedCount = [ndm.nutrition, ndm.movement, ndm.mindfulness, ndm.brainDump].filter(Boolean).length;
  const completionPercent = (completedCount / 4) * 100;

  return (
    <div className="mt-4 max-w-sm mx-auto">
      <div className={`rounded-lg p-2 ${
        darkMode
          ? 'bg-gray-800/50 border border-gray-700/50'
          : 'bg-white/50 border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-semibold uppercase tracking-wide ${
            darkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Today's Non-Negotiables
          </span>
          <span className={`text-xs font-bold ${
            darkMode ? 'text-purple-400' : 'text-purple-600'
          }`}>
            {completedCount}/4
          </span>
        </div>

        {/* Progress Bar */}
        <div className={`h-1.5 rounded-full overflow-hidden mb-2 ${
          darkMode ? 'bg-gray-900/50' : 'bg-gray-200'
        }`}>
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {/* Outstanding Items - Clickable */}
        <div className="grid grid-cols-4 gap-1.5">
          {/* Nutrition */}
          <button
            onClick={() => setCurrentView('food')}
            className={`text-center p-1.5 rounded transition-all cursor-pointer ${
              ndm.nutrition
                ? darkMode
                  ? 'bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-emerald-100 border border-emerald-300 hover:bg-emerald-200'
                : darkMode
                  ? 'bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50'
                  : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className="text-base">{ndm.nutrition ? '✅' : '🍽️'}</div>
            <div className={`text-xs mt-0.5 ${
              ndm.nutrition
                ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                : darkMode ? 'text-gray-600' : 'text-gray-500'
            }`}>
              Nutrition
            </div>
          </button>

          {/* Movement */}
          <button
            onClick={() => setCurrentView('exercise')}
            className={`text-center p-1.5 rounded transition-all cursor-pointer ${
              ndm.movement
                ? darkMode
                  ? 'bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-emerald-100 border border-emerald-300 hover:bg-emerald-200'
                : darkMode
                  ? 'bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50'
                  : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className="text-base">{ndm.movement ? '✅' : '🏃'}</div>
            <div className={`text-xs mt-0.5 ${
              ndm.movement
                ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                : darkMode ? 'text-gray-600' : 'text-gray-500'
            }`}>
              Movement
            </div>
          </button>

          {/* Mindfulness */}
          <button
            onClick={openMindfulMoment}
            className={`text-center p-1.5 rounded transition-all cursor-pointer ${
              ndm.mindfulness
                ? darkMode
                  ? 'bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-emerald-100 border border-emerald-300 hover:bg-emerald-200'
                : darkMode
                  ? 'bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50'
                  : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className="text-base">{ndm.mindfulness ? '✅' : '🧘'}</div>
            <div className={`text-xs mt-0.5 ${
              ndm.mindfulness
                ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                : darkMode ? 'text-gray-600' : 'text-gray-500'
            }`}>
              Mindful
            </div>
          </button>

          {/* Brain Dump */}
          <button
            onClick={openBrainDump}
            className={`text-center p-1.5 rounded transition-all cursor-pointer ${
              ndm.brainDump
                ? darkMode
                  ? 'bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-emerald-100 border border-emerald-300 hover:bg-emerald-200'
                : darkMode
                  ? 'bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50'
                  : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className="text-base">{ndm.brainDump ? '✅' : '📝'}</div>
            <div className={`text-xs mt-0.5 ${
              ndm.brainDump
                ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                : darkMode ? 'text-gray-600' : 'text-gray-500'
            }`}>
              Brain Dump
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NDMStatusBar;
