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
const NDMStatusBar = ({ ndm, darkMode, openNutrition, openMovement, openMindfulMoment, openBrainDump }) => {
  const completedCount = [ndm.nutrition, ndm.movement, ndm.mindfulness, ndm.brainDump].filter(Boolean).length;
  const completionPercent = (completedCount / 4) * 100;

  return (
    <div className={`mb-6 max-w-2xl mx-auto ${
      darkMode ? '' : ''
    }`}>
      <div className={`rounded-2xl p-4 shadow-lg ${
        darkMode
          ? 'bg-gradient-to-br from-gray-800/80 via-purple-900/20 to-gray-800/80 border-2 border-purple-500/30 backdrop-blur-sm'
          : 'bg-white border-2 border-purple-200 shadow-purple-100'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-bold uppercase tracking-wide ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Today's Non-Negotiables
          </span>
          <span className={`text-sm font-bold px-2 py-1 rounded ${
            completedCount === 4
              ? darkMode
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
              : darkMode
                ? 'text-purple-400'
                : 'text-purple-600'
          }`}>
            {completedCount}/4
          </span>
        </div>

        {/* Progress Bar */}
        <div className={`h-2 rounded-full overflow-hidden mb-4 ${
          darkMode ? 'bg-gray-900/50' : 'bg-gray-200'
        }`}>
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-500"
            style={{
              width: `${completionPercent}%`,
              boxShadow: completedCount > 0 ? '0 0 10px rgba(168, 85, 247, 0.5)' : 'none'
            }}
          />
        </div>

        {/* Outstanding Items - Clickable */}
        <div className="grid grid-cols-4 gap-2">
          {/* Nutrition */}
          <button
            onClick={openNutrition}
            className={`text-center p-3 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${
              ndm.nutrition
                ? darkMode
                  ? 'bg-emerald-500/20 border-2 border-emerald-500/40 hover:bg-emerald-500/30 hover:scale-105 shadow-lg'
                  : 'bg-emerald-100 border-2 border-emerald-300 hover:bg-emerald-200 hover:scale-105 shadow-md'
                : darkMode
                  ? 'bg-gray-700/30 border-2 border-gray-700/50 hover:bg-purple-700/40 hover:border-purple-500/50 hover:scale-105'
                  : 'bg-gray-100 border-2 border-gray-200 hover:bg-purple-100 hover:border-purple-300 hover:scale-105'
            }`}
            style={{
              boxShadow: ndm.nutrition ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            <div className="text-xl mb-1">{ndm.nutrition ? '✅' : '🍽️'}</div>
            <div className={`text-[10px] font-semibold ${
              ndm.nutrition
                ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                : darkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Nutrition
            </div>
          </button>

          {/* Movement */}
          <button
            onClick={openMovement}
            className={`text-center p-3 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${
              ndm.movement
                ? darkMode
                  ? 'bg-emerald-500/20 border-2 border-emerald-500/40 hover:bg-emerald-500/30 hover:scale-105 shadow-lg'
                  : 'bg-emerald-100 border-2 border-emerald-300 hover:bg-emerald-200 hover:scale-105 shadow-md'
                : darkMode
                  ? 'bg-gray-700/30 border-2 border-gray-700/50 hover:bg-purple-700/40 hover:border-purple-500/50 hover:scale-105'
                  : 'bg-gray-100 border-2 border-gray-200 hover:bg-purple-100 hover:border-purple-300 hover:scale-105'
            }`}
            style={{
              boxShadow: ndm.movement ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            <div className="text-xl mb-1">{ndm.movement ? '✅' : '🏃'}</div>
            <div className={`text-[10px] font-semibold ${
              ndm.movement
                ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                : darkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Movement
            </div>
          </button>

          {/* Mindfulness */}
          <button
            onClick={openMindfulMoment}
            className={`text-center p-3 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${
              ndm.mindfulness
                ? darkMode
                  ? 'bg-emerald-500/20 border-2 border-emerald-500/40 hover:bg-emerald-500/30 hover:scale-105 shadow-lg'
                  : 'bg-emerald-100 border-2 border-emerald-300 hover:bg-emerald-200 hover:scale-105 shadow-md'
                : darkMode
                  ? 'bg-gray-700/30 border-2 border-gray-700/50 hover:bg-purple-700/40 hover:border-purple-500/50 hover:scale-105'
                  : 'bg-gray-100 border-2 border-gray-200 hover:bg-purple-100 hover:border-purple-300 hover:scale-105'
            }`}
            style={{
              boxShadow: ndm.mindfulness ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            <div className="text-xl mb-1">{ndm.mindfulness ? '✅' : '🧘'}</div>
            <div className={`text-[10px] font-semibold ${
              ndm.mindfulness
                ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                : darkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Mindful
            </div>
          </button>

          {/* Brain Dump */}
          <button
            onClick={openBrainDump}
            className={`text-center p-3 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${
              ndm.brainDump
                ? darkMode
                  ? 'bg-emerald-500/20 border-2 border-emerald-500/40 hover:bg-emerald-500/30 hover:scale-105 shadow-lg'
                  : 'bg-emerald-100 border-2 border-emerald-300 hover:bg-emerald-200 hover:scale-105 shadow-md'
                : darkMode
                  ? 'bg-gray-700/30 border-2 border-gray-700/50 hover:bg-purple-700/40 hover:border-purple-500/50 hover:scale-105'
                  : 'bg-gray-100 border-2 border-gray-200 hover:bg-purple-100 hover:border-purple-300 hover:scale-105'
            }`}
            style={{
              boxShadow: ndm.brainDump ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            <div className="text-xl mb-1">{ndm.brainDump ? '✅' : '📝'}</div>
            <div className={`text-[10px] font-semibold ${
              ndm.brainDump
                ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                : darkMode ? 'text-gray-500' : 'text-gray-600'
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
