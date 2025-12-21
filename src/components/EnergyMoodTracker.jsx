import React from 'react';
import { Zap, Heart } from 'lucide-react';
import useEnergyMoodStore from '../store/useEnergyMoodStore';
import useStore from '../store/useStore';
import EnergyMoodModals from './EnergyMoodModals';

const EnergyMoodTracker = () => {
  const darkMode = useStore((state) => state.darkMode);
  const {
    energyTracking,
    currentMood,
    selectedEnergyActions,
    selectedMoodActions,
    showEnergyModal,
    showMoodModal,
    setCurrentEnergy,
    setCurrentMood,
    setShowEnergyModal,
    setShowMoodModal,
    getTimeOfDay,
    getCurrentPeriodEnergy,
    getCurrentEnergy,
    getEnergyBasedSuggestions,
    getMoodBasedWellness,
    getSmartSuggestions,
  } = useEnergyMoodStore();

  const currentPeriodEnergy = getCurrentPeriodEnergy();
  const welcomeMessage = useStore((state) => state.getWelcomeMessage); // Assuming getWelcomeMessage is in useStore
  const userProfile = useStore((state) => state.userProfile);

  // Energy Selector
  const renderEnergySelector = () => {
    const energySuggestions = getSmartSuggestions();
    const totalEnergyActions = energySuggestions.tasks ? energySuggestions.tasks.length : 0;
    // selectedEnergyActions is within useEnergyMoodStore
    const allEnergyActionsComplete = currentPeriodEnergy && totalEnergyActions > 0 && selectedEnergyActions.length >= totalEnergyActions;

    return (
      <div className={`rounded-xl p-4 transition-all duration-300 ${
        allEnergyActionsComplete
          ? darkMode
            ? 'bg-emerald-900/30 border-2 border-emerald-500/50 shadow-lg backdrop-blur-sm'
            : 'bg-emerald-50 border-2 border-emerald-400 shadow-md'
          : darkMode
            ? 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-yellow-500/50 shadow-lg backdrop-blur-sm'
            : 'bg-white border-2 border-gray-100 hover:border-yellow-400 shadow-md'
      }`}>
        {allEnergyActionsComplete && (
          <div className={`text-xs text-center mb-2 font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ✓ COMPLETE
          </div>
        )}
        <div className="flex items-center justify-center mb-2">
          <Zap className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} size={24} />
        </div>
        <div className={`text-sm font-bold uppercase text-center mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          ENERGY
        </div>
        <div className={`text-center mb-3`}>
          <span className={`text-2xl font-bold ${darkMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent' : 'text-gray-900'}`}>
            {currentPeriodEnergy || '?'}/5
          </span>
        </div>
        <div className={`text-xs text-center mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          {getTimeOfDay()}
          {currentPeriodEnergy && (
            <button
              onClick={() => setShowEnergyModal(true)}
              className="text-xs mt-1 underline hover:text-yellow-500 cursor-pointer"
            >
              Click for tips
            </button>
          )}
        </div>
        {/* Energy level selector - clicking opens modal with tips */}
        <div className="flex justify-between mt-2">
          {[1, 2, 3, 4, 5].map(level => (
            <button
              key={level}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentEnergy(level);
                setTimeout(() => setShowEnergyModal(true), 100);
              }}
              className={`w-8 h-8 rounded-full transition-all ${
                currentPeriodEnergy === level
                  ? darkMode
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50'
                    : 'bg-yellow-500'
                  : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <span className={`text-xs font-bold ${
                currentPeriodEnergy === level ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {level}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Mood Selector
  const renderMoodSelector = () => {
    const moodSuggestions = getSmartSuggestions();
    const totalMoodActions = moodSuggestions.moodWellness?.activities ? moodSuggestions.moodWellness.activities.length : 0;
    // selectedMoodActions is within useEnergyMoodStore
    const allMoodActionsComplete = currentMood && totalMoodActions > 0 && selectedMoodActions.length >= totalMoodActions;

    return (
      <div className={`rounded-xl p-4 transition-all duration-300 ${
        allMoodActionsComplete
          ? darkMode
            ? 'bg-emerald-900/30 border-2 border-emerald-500/50 shadow-lg backdrop-blur-sm'
            : 'bg-emerald-50 border-2 border-emerald-400 shadow-md'
          : darkMode
            ? 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-purple-500/50 shadow-lg backdrop-blur-sm'
            : 'bg-white border-2 border-gray-100 hover:border-purple-400 shadow-md'
      }`}>
        {allMoodActionsComplete && (
          <div className={`text-xs text-center mb-2 font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ✓ COMPLETE
          </div>
        )}
        <div className="flex items-center justify-center mb-2">
          <Heart className={darkMode ? 'text-pink-400' : 'text-pink-500'} size={24} />
        </div>
        <div className={`text-sm font-bold uppercase text-center mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          MOOD
        </div>
        {currentMood && (
          <div className={`text-xs text-center mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            Current: {currentMood}
            <button
              onClick={() => setShowMoodModal(true)}
              className="block text-xs mt-1 underline hover:text-pink-500 cursor-pointer mx-auto"
            >
              Click for wellness tips
            </button>
          </div>
        )}
        {/* Mood selector grid - clicking opens modal with tips */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { mood: 'energized', emoji: '😊' },
            { mood: 'focused', emoji: '🎯' },
            { mood: 'calm', emoji: '😌' },
            { mood: 'tired', emoji: '😴' },
            { mood: 'anxious', emoji: '😰' },
            { mood: 'overwhelmed', emoji: '😫' }
          ].map(({ mood, emoji }) => (
            <button
              key={mood}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentMood(mood);
                setTimeout(() => setShowMoodModal(true), 100);
              }}
              className={`p-2 rounded-lg text-xl transition-all ${
                currentMood === mood
                  ? darkMode
                    ? 'bg-purple-500/30 border-2 border-purple-500/50 scale-110'
                    : 'bg-purple-100 border-2 border-purple-400 scale-110'
                  : darkMode
                    ? 'bg-gray-700/30 hover:bg-gray-700/50 border-2 border-transparent'
                    : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {renderEnergySelector()}
        {renderMoodSelector()}
      </div>
      <EnergyMoodModals />
    </>
  );
};

export default EnergyMoodTracker;