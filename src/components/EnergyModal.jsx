import React from 'react';
import { X, Lightbulb, Zap } from 'lucide-react';

/**
 * EnergyModal - Interactive Energy Management Modal
 *
 * Displays energy-based smart tips and recommendations
 * Users can click suggestions to add them to tasks or food diary
 *
 * Features:
 * - Energy-specific task recommendations
 * - Food/snack suggestions that add to food diary
 * - Click-to-add functionality for all suggestions
 * - Tap-away or X button to close
 */
const EnergyModal = ({
  isOpen,
  onClose,
  energyLevel,
  suggestions,
  darkMode,
  onAddTask,
  onAddToFoodDiary,
  currentHour,
  selectedActions = [],
  onActionSelect
}) => {
  if (!isOpen || !suggestions) return null;

  const handleAddTask = (task) => {
    onAddTask(currentHour, task);
    if (onActionSelect) {
      onActionSelect(task);
    }
  };

  const handleAddFood = (food) => {
    onAddToFoodDiary(food);
    if (onActionSelect) {
      onActionSelect(food);
    }
  };

  const isActionSelected = (action) => {
    return selectedActions.includes(action);
  };

  // Get color based on energy level
  const getEnergyColor = () => {
    if (energyLevel <= 2) return 'rose';
    if (energyLevel === 3) return 'orange';
    if (energyLevel === 4) return 'blue';
    return 'cyan';
  };

  const color = suggestions.color || getEnergyColor();

  const getColorClasses = () => {
    const colors = {
      rose: {
        bg: darkMode ? 'bg-rose-500/10' : 'bg-rose-50',
        border: darkMode ? 'border-rose-500/30' : 'border-rose-200',
        text: darkMode ? 'text-rose-400' : 'text-rose-600',
        button: darkMode ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/40' : 'bg-rose-100 hover:bg-rose-200 border-rose-300',
        gradient: darkMode ? 'from-rose-900/50 via-pink-900/50 to-rose-900/50' : 'from-rose-100 to-pink-100'
      },
      orange: {
        bg: darkMode ? 'bg-orange-500/10' : 'bg-orange-50',
        border: darkMode ? 'border-orange-500/30' : 'border-orange-200',
        text: darkMode ? 'text-orange-400' : 'text-orange-600',
        button: darkMode ? 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/40' : 'bg-orange-100 hover:bg-orange-200 border-orange-300',
        gradient: darkMode ? 'from-orange-900/50 via-amber-900/50 to-orange-900/50' : 'from-orange-100 to-amber-100'
      },
      blue: {
        bg: darkMode ? 'bg-blue-500/10' : 'bg-blue-50',
        border: darkMode ? 'border-blue-500/30' : 'border-blue-200',
        text: darkMode ? 'text-blue-400' : 'text-blue-600',
        button: darkMode ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/40' : 'bg-blue-100 hover:bg-blue-200 border-blue-300',
        gradient: darkMode ? 'from-blue-900/50 via-indigo-900/50 to-blue-900/50' : 'from-blue-100 to-indigo-100'
      },
      cyan: {
        bg: darkMode ? 'bg-cyan-500/10' : 'bg-cyan-50',
        border: darkMode ? 'border-cyan-500/30' : 'border-cyan-200',
        text: darkMode ? 'text-cyan-400' : 'text-cyan-600',
        button: darkMode ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40' : 'bg-cyan-100 hover:bg-cyan-200 border-cyan-300',
        gradient: darkMode ? 'from-cyan-900/50 via-teal-900/50 to-cyan-900/50' : 'from-cyan-100 to-teal-100'
      }
    };
    return colors[color] || colors.cyan;
  };

  const colorClasses = getColorClasses();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`max-w-lg w-full max-h-[80vh] overflow-y-auto pointer-events-auto rounded-2xl shadow-2xl ${
            darkMode ? 'bg-gray-900 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b backdrop-blur-xl ${
            darkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <Zap className={colorClasses.text} size={28} />
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Energy Level: {energyLevel}/5
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {suggestions.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Message */}
            <div className={`p-4 rounded-lg bg-gradient-to-br ${colorClasses.gradient} border-2 ${colorClasses.border}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {suggestions.message}
              </p>
            </div>

            {/* Warning if present */}
            {suggestions.warning && (
              <div className={`p-4 rounded-lg ${colorClasses.bg} border ${colorClasses.border}`}>
                <p className={`text-sm font-semibold ${colorClasses.text}`}>
                  {suggestions.warning}
                </p>
              </div>
            )}

            {/* Task Recommendations */}
            {suggestions.tasks && suggestions.tasks.length > 0 && (
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Lightbulb className="inline mr-1" size={14} />
                  Recommended Actions (Click to Add to Tasks)
                </h3>
                <div className="space-y-2">
                  {suggestions.tasks.map((task, idx) => {
                    const isSelected = isActionSelected(task);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAddTask(task)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? darkMode
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 line-through opacity-60'
                              : 'bg-emerald-100 border-emerald-400 text-emerald-700 line-through opacity-60'
                            : colorClasses.button + ' ' + (darkMode ? 'text-gray-200' : 'text-gray-800')
                        }`}
                        disabled={isSelected}
                      >
                        <span className="text-sm">{isSelected ? '✓✓' : '✓'} {task}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Food/Snack Suggestions */}
            {suggestions.snacks && suggestions.snacks.length > 0 && (
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  🍽️ Energy-Boosting Nutrition (Click to Add to Food Diary)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.snacks.map((snack, idx) => {
                    const isSelected = isActionSelected(snack);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAddFood(snack)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          isSelected
                            ? darkMode
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 line-through opacity-60'
                              : 'bg-emerald-100 border-emerald-400 text-emerald-700 line-through opacity-60'
                            : darkMode
                              ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-gray-300'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                        disabled={isSelected}
                      >
                        <span className="text-sm">{isSelected ? '✓✓' : '🍽️'} {snack}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`sticky bottom-0 p-4 border-t backdrop-blur-xl ${
            darkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
          }`}>
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnergyModal;
