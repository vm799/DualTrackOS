/**
 * QuickCheckIn Component
 *
 * Shows a quick check-in for returning users
 * Displays status and clickable tiles to start their session
 */

import React from 'react';
import { X, TrendingUp, CheckCircle } from 'lucide-react';

const QuickCheckIn = ({
  darkMode,
  onClose,
  ndm,
  streaks,
  onOpenBrainDump,
  onOpenNutrition,
  onOpenMovement,
  onOpenMindfulness
}) => {
  const completedCount = [
    ndm?.nutrition,
    ndm?.movement,
    ndm?.mindfulness,
    ndm?.brainDump
  ].filter(Boolean).length;

  const tiles = [
    {
      id: 'braindump',
      icon: '🧠',
      label: 'Brain Dump',
      description: 'Clear your mind',
      completed: ndm?.brainDump,
      action: onOpenBrainDump
    },
    {
      id: 'nutrition',
      icon: '🥗',
      label: 'Nutrition',
      description: 'Track meals',
      completed: ndm?.nutrition,
      action: onOpenNutrition
    },
    {
      id: 'movement',
      icon: '🏃',
      label: 'Movement',
      description: 'Log exercise',
      completed: ndm?.movement,
      action: onOpenMovement
    },
    {
      id: 'mindfulness',
      icon: '🧘',
      label: 'Mindfulness',
      description: 'Box breathing',
      completed: ndm?.mindfulness,
      action: onOpenMindfulness
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`relative max-w-lg w-full mx-4 p-6 rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome Back! 👋
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Where would you like to start today?
            </p>
          </div>

          {/* Progress Summary */}
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${
                darkMode ? 'text-purple-300' : 'text-purple-900'
              }`}>
                Today's Progress
              </span>
              <span className={`text-lg font-bold ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {completedCount}/4
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(completedCount / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          {streaks && (
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg text-center ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className={`text-2xl font-bold ${
                  darkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  {streaks.checkIns || 0}
                </div>
                <div className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Day Streak
                </div>
              </div>
              <div className={`p-3 rounded-lg text-center ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className={`text-2xl font-bold ${
                  darkMode ? 'text-pink-400' : 'text-pink-600'
                }`}>
                  {streaks.ndmCompletions || 0}
                </div>
                <div className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  NDM Complete
                </div>
              </div>
            </div>
          )}

          {/* Quick Start Tiles */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Quick Start:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {tiles.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => {
                    if (tile.action) tile.action();
                    onClose();
                  }}
                  className={`p-4 rounded-xl text-center transition-all ${
                    tile.completed
                      ? darkMode
                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                        : 'bg-emerald-50 border-2 border-emerald-300'
                      : darkMode
                      ? 'bg-gray-700/50 border-2 border-gray-600 hover:border-purple-500/50 hover:scale-105'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300 hover:scale-105'
                  } hover:shadow-lg active:scale-95`}
                >
                  <div className="text-3xl mb-2">{tile.icon}</div>
                  <div className={`text-sm font-semibold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {tile.label}
                  </div>
                  <div className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tile.description}
                  </div>
                  {tile.completed && (
                    <div className="mt-2">
                      <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={onClose}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
              darkMode
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            I'll Browse First
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickCheckIn;
