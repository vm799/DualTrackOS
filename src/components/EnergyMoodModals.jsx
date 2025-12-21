import React from 'react';
import { X, Check } from 'lucide-react';
import useEnergyMoodStore from '../store/useEnergyMoodStore';
import useStore from '../store/useStore';

/**
 * Energy and Mood Suggestion Modals
 * Displays smart suggestions based on user's current energy level and mood
 */
const EnergyMoodModals = () => {
  const darkMode = useStore((state) => state.darkMode);
  const {
    showEnergyModal,
    showMoodModal,
    selectedEnergyActions,
    selectedMoodActions,
    setShowEnergyModal,
    setShowMoodModal,
    handleEnergyActionSelect,
    handleMoodActionSelect,
    getSmartSuggestions,
  } = useEnergyMoodStore();

  const suggestions = getSmartSuggestions();

  // Energy Modal
  const renderEnergyModal = () => {
    if (!showEnergyModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4">
        <div className={`max-w-2xl w-full rounded-3xl p-8 relative max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-gray-900 border-2 border-yellow-500/30' : 'bg-white border-2 border-yellow-200'
        }`}>
          <button
            onClick={() => setShowEnergyModal(false)}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
              darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X size={24} />
          </button>

          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {suggestions.title}
          </h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {suggestions.message}
          </p>

          {suggestions.warning && (
            <div className={`p-4 rounded-xl mb-6 ${
              darkMode ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-300'
            }`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                {suggestions.warning}
              </p>
            </div>
          )}

          {/* Suggested Tasks */}
          <div className="mb-6">
            <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Suggested Tasks:
            </h4>
            <div className="space-y-2">
              {suggestions.tasks?.map((task, index) => {
                const isSelected = selectedEnergyActions.includes(task);
                return (
                  <button
                    key={index}
                    onClick={() => handleEnergyActionSelect(task)}
                    className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                      isSelected
                        ? darkMode
                          ? 'bg-emerald-500/20 border-2 border-emerald-500/40'
                          : 'bg-emerald-100 border-2 border-emerald-300'
                        : darkMode
                          ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-yellow-500/50'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? darkMode ? 'bg-emerald-500' : 'bg-emerald-500'
                        : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <span className={`text-sm ${
                      isSelected
                        ? darkMode ? 'text-emerald-400 font-semibold' : 'text-emerald-700 font-semibold'
                        : darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {task}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Suggested Snacks */}
          <div>
            <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Suggested Snacks:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.snacks?.map((snack, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    • {snack}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mood Modal
  const renderMoodModal = () => {
    if (!showMoodModal || !suggestions.moodWellness) return null;

    const moodData = suggestions.moodWellness;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4">
        <div className={`max-w-2xl w-full rounded-3xl p-8 relative max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-gray-900 border-2 border-pink-500/30' : 'bg-white border-2 border-pink-200'
        }`}>
          <button
            onClick={() => setShowMoodModal(false)}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
              darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X size={24} />
          </button>

          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
            {moodData.title}
          </h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {moodData.message}
          </p>

          {moodData.warning && (
            <div className={`p-4 rounded-xl mb-6 ${
              darkMode ? 'bg-pink-500/10 border border-pink-500/30' : 'bg-pink-50 border border-pink-300'
            }`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-pink-400' : 'text-pink-800'}`}>
                {moodData.warning}
              </p>
            </div>
          )}

          {/* Suggested Activities */}
          <div className="mb-6">
            <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Recommended Activities:
            </h4>
            <div className="space-y-2">
              {moodData.activities?.map((activity, index) => {
                const isSelected = selectedMoodActions.includes(activity);
                return (
                  <button
                    key={index}
                    onClick={() => handleMoodActionSelect(activity)}
                    className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                      isSelected
                        ? darkMode
                          ? 'bg-emerald-500/20 border-2 border-emerald-500/40'
                          : 'bg-emerald-100 border-2 border-emerald-300'
                        : darkMode
                          ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-pink-500/50'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? darkMode ? 'bg-emerald-500' : 'bg-emerald-500'
                        : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <span className={`text-sm ${
                      isSelected
                        ? darkMode ? 'text-emerald-400 font-semibold' : 'text-emerald-700 font-semibold'
                        : darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {activity}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Suggested Snacks */}
          <div className="mb-6">
            <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Mood-Supporting Snacks:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {moodData.snacks?.map((snack, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    • {snack}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {moodData.supplement && (
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-300'
            }`}>
              <p className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>
                💊 {moodData.supplement}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderEnergyModal()}
      {renderMoodModal()}
    </>
  );
};

export default EnergyMoodModals;
