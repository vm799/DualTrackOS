import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Battery, Heart, Target, Utensils, Dumbbell, Briefcase, Sparkles, Flower2, Brain } from 'lucide-react';
import Logo from '../components/Logo';

const CheckInPage = ({ darkMode }) => {
  const navigate = useNavigate();
  const [energyLevel, setEnergyLevel] = useState(null);
  const [mood, setMood] = useState(null);
  const [showPrioritySelection, setShowPrioritySelection] = useState(false);

  const moodOptions = [
    { id: 'energized', label: 'Energized', emoji: '⚡', color: 'cyan' },
    { id: 'focused', label: 'Focused', emoji: '🎯', color: 'purple' },
    { id: 'calm', label: 'Calm', emoji: '😌', color: 'green' },
    { id: 'tired', label: 'Tired', emoji: '😴', color: 'blue' },
    { id: 'stressed', label: 'Stressed', emoji: '😰', color: 'orange' },
    { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😓', color: 'red' },
  ];

  const priorityOptions = [
    { id: 'nutrition', label: 'Nutrition', icon: Utensils, description: 'Plan meals & track protein', route: '/dashboard', color: 'emerald' },
    { id: 'movement', label: 'Movement', icon: Dumbbell, description: 'Log exercise & activity', route: '/dashboard', color: 'blue' },
    { id: 'productivity', label: 'Productivity', icon: Briefcase, description: 'Manage tasks & focus time', route: '/productivity', color: 'purple' },
    { id: 'wellness', label: 'Wellness', icon: Sparkles, description: 'Breathing, mindfulness & self-care', route: '/dashboard', color: 'pink' },
    { id: 'energy', label: 'Energy Tracking', icon: Battery, description: 'Track patterns & get insights', route: '/dashboard', color: 'cyan' },
    { id: 'braindump', label: 'Brain Dump', icon: Brain, description: 'Clear your mind & organize thoughts', route: '/dashboard', color: 'amber' },
  ];

  const handleContinue = () => {
    if (energyLevel && mood) {
      setShowPrioritySelection(true);
    }
  };

  const handlePrioritySelect = (route) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSkip = () => {
    navigate('/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50'
    }`}>
      {/* Logo - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <Logo size="large" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`max-w-2xl w-full rounded-2xl p-8 shadow-2xl ${
          darkMode
            ? 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-xl'
            : 'bg-white border-2 border-gray-100'
        }`}>

          {!showPrioritySelection ? (
            /* STEP 1: Energy & Mood Check-In */
            <>
              <div className="text-center mb-8">
                <Heart className={`mx-auto mb-4 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} size={48} />
                <h1 className={`text-3xl font-bold mb-2 ${
                  darkMode
                    ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
                    : 'text-gray-900'
                }`}>
                  Check-In Time
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Let's see how you're doing today
                </p>
              </div>

              {/* Energy Level */}
              <div className="mb-6">
                <label className={`block text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <Battery className="inline mr-2" size={20} />
                  How's your energy right now?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setEnergyLevel(level)}
                      className={`py-4 rounded-xl text-2xl font-bold transition-all ${
                        energyLevel === level
                          ? darkMode
                            ? 'bg-cyan-500/30 border-2 border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                            : 'bg-cyan-200 border-2 border-cyan-500 ring-2 ring-cyan-400/50 scale-105'
                          : darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600 hover:scale-105'
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:scale-105'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  1 = Exhausted • 5 = Energized
                </p>
              </div>

              {/* Mood */}
              {energyLevel && (
                <div className="mb-6">
                  <label className={`block text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    How are you feeling?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {moodOptions.map((moodOption) => (
                      <button
                        key={moodOption.id}
                        onClick={() => setMood(moodOption.id)}
                        className={`p-4 rounded-xl text-left transition-all ${
                          mood === moodOption.id
                            ? darkMode
                              ? 'bg-purple-500/30 border-2 border-purple-400 ring-2 ring-purple-400/50'
                              : 'bg-purple-200 border-2 border-purple-500 ring-2 ring-purple-400/50'
                            : darkMode
                              ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600'
                              : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{moodOption.emoji}</div>
                        <div className={`text-sm font-medium ${
                          mood === moodOption.id
                            ? darkMode ? 'text-white' : 'text-gray-900'
                            : darkMode ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          {moodOption.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleContinue}
                  disabled={!energyLevel || !mood}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    !energyLevel || !mood
                      ? darkMode
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : darkMode
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  }`}
                >
                  {!energyLevel || !mood ? 'Select Energy & Mood' : 'Continue'}
                </button>

                <button
                  onClick={handleSkip}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Skip to Dashboard
                </button>
              </div>
            </>
          ) : (
            /* STEP 2: Priority Selection */
            <>
              <div className="text-center mb-8">
                <Target className={`mx-auto mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} size={48} />
                <h1 className={`text-3xl font-bold mb-2 ${
                  darkMode
                    ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
                    : 'text-gray-900'
                }`}>
                  What do you want to tackle first?
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose your focus and we'll guide you there
                </p>
              </div>

              {/* Priority Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {priorityOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handlePrioritySelect(option.route)}
                      className={`p-6 rounded-xl text-left transition-all hover:scale-105 ${
                        darkMode
                          ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-purple-500/50'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-400'
                      }`}
                    >
                      <Icon className={`mb-3 text-${option.color}-500`} size={32} />
                      <h3 className={`text-lg font-bold mb-1 ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Explore All Features Button */}
              <button
                onClick={handleSkip}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Explore All Features →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
