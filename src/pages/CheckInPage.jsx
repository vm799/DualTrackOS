import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Battery, Heart, Target, Utensils, Dumbbell, Briefcase, Sparkles, Brain } from 'lucide-react';
import Logo from '../components/Logo';
import useSessionStore from '../store/useSessionStore';

const CheckInPage = ({ darkMode }) => {
  const navigate = useNavigate();
  const [energyLevel, setEnergyLevel] = useState(null);
  const [showPrioritySelection, setShowPrioritySelection] = useState(false);

  // Session store for streak tracking
  const updateStreak = useSessionStore ((state) => state.updateStreak);

  // Update check-in streak on mount
  useEffect(() => {
    updateStreak('checkIn');
  }, [updateStreak]);

  const priorityOptions = [
    {
      id: 'nutrition',
      label: 'Nutrition',
      icon: Utensils,
      description: 'Plan meals & track protein',
      route: '/dashboard',
      modal: 'nutrition',
      scrollTo: 'nutrition',
      color: 'emerald'
    },
    {
      id: 'movement',
      label: 'Movement',
      icon: Dumbbell,
      description: 'Log exercise & activity',
      route: '/dashboard',
      modal: 'movement',
      scrollTo: 'nutrition',
      color: 'blue'
    },
    {
      id: 'productivity',
      label: 'Productivity',
      icon: Briefcase,
      description: 'Manage tasks & focus time',
      route: '/productivity',
      scrollTo: 'pomodoro',
      color: 'purple'
    },
    {
      id: 'wellness',
      label: 'Wellness',
      icon: Sparkles,
      description: 'Breathing, mindfulness & self-care',
      route: '/dashboard',
      scrollTo: 'energy',
      color: 'pink'
    },
    {
      id: 'energy',
      label: 'Energy Tracking',
      icon: Battery,
      description: 'Track patterns & get insights',
      route: '/dashboard',
      scrollTo: 'energy',
      color: 'cyan'
    },
    {
      id: 'braindump',
      label: 'Brain Dump',
      icon: Brain,
      description: 'Clear your mind & organize thoughts',
      route: '/dashboard',
      modal: 'braindump',
      color: 'amber'
    },
  ];

  const handleContinue = () => {
    if (energyLevel) {
      setShowPrioritySelection(true);
    }
  };

  const handlePrioritySelect = (priority) => {
    // Store user intent in localStorage for the destination page to read
    const intent = {
      priority: priority.id,
      energy: energyLevel,
      timestamp: Date.now()
    };
    localStorage.setItem('checkin_intent', JSON.stringify(intent));

    // Navigate with hash for modal/section targeting
    const hash = priority.modal || priority.scrollTo || '';
    const destination = hash ? `${priority.route}#${hash}` : priority.route;

    navigate(destination);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSkip = () => {
    navigate('/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get time-based recommendations
  const getTimeBasedGuidance = (energy) => {
    if (!energy) return null;

    const hour = new Date().getHours();
    let timeOfDay, mealSuggestion, workSuggestion, color;

    // Determine time of day and base recommendations
    if (hour >= 5 && hour < 11) {
      timeOfDay = 'Morning';
      color = 'amber';
      mealSuggestion = energy >= 3
        ? '🍳 Fuel up: Protein-rich breakfast (eggs, Greek yogurt, protein shake)'
        : '🥤 Keep it light: Smoothie or oatmeal with berries';

      if (energy >= 4) {
        workSuggestion = '💪 Peak time: Tackle your most challenging task or important decision';
      } else if (energy === 3) {
        workSuggestion = '📧 Moderate capacity: Handle emails, meetings, routine tasks';
      } else {
        workSuggestion = '🧘‍♀️ Gentle mode: Light tasks only, consider a short walk or breathing exercise';
      }
    } else if (hour >= 11 && hour < 14) {
      timeOfDay = 'Midday';
      color = 'emerald';
      mealSuggestion = energy >= 3
        ? '🥗 Balanced lunch: Protein + veggies + complex carbs (salmon salad, chicken bowl)'
        : '🍲 Easy digest: Light soup or sandwich, avoid heavy meals';

      if (energy >= 4) {
        workSuggestion = '🎯 Focus time: Deep work session or important presentations';
      } else if (energy === 3) {
        workSuggestion = '🤝 Collaboration: Team meetings, brainstorming, lighter work';
      } else {
        workSuggestion = '💆‍♀️ Rest mode: Take a break, short nap (20 min), or mindfulness';
      }
    } else if (hour >= 14 && hour < 17) {
      timeOfDay = 'Afternoon';
      color = 'cyan';
      mealSuggestion = energy >= 3
        ? '🥜 Energy boost: Nuts, protein bar, apple with almond butter'
        : '🍵 Gentle pick-me-up: Green tea, handful of berries, dark chocolate';

      if (energy >= 4) {
        workSuggestion = '⚡ Power through: Finish tasks, prepare for tomorrow, strategic planning';
      } else if (energy === 3) {
        workSuggestion = '📝 Wrap up: Organize notes, reply to messages, light admin work';
      } else {
        workSuggestion = '🌿 Wind down: Delegate if possible, postpone non-urgent items';
      }
    } else if (hour >= 17 && hour < 21) {
      timeOfDay = 'Evening';
      color = 'purple';
      mealSuggestion = energy >= 3
        ? '🍽️ Balanced dinner: Lean protein + veggies + healthy fats (grilled fish, stir-fry)'
        : '🥣 Light dinner: Soup, salad, or small portion to aid sleep';

      if (energy >= 4) {
        workSuggestion = '📚 Personal growth: Learn something new, plan tomorrow, creative projects';
      } else if (energy === 3) {
        workSuggestion = '🏠 Home mode: Family time, light chores, prepare for next day';
      } else {
        workSuggestion = '🛀 Self-care: Bath, gentle stretching, early bedtime prep';
      }
    } else {
      timeOfDay = 'Night';
      color = 'indigo';
      mealSuggestion = '💤 Wind down: Avoid food 2-3 hours before bed, herbal tea if needed';

      if (energy >= 4) {
        workSuggestion = '😴 Still wired? Journal, read, meditation - no screens 1hr before bed';
      } else {
        workSuggestion = '🌙 Rest mode: Wind-down routine, dim lights, prepare for restful sleep';
      }
    }

    return {
      timeOfDay,
      color,
      mealSuggestion,
      workSuggestion,
      energyLevel: energy
    };
  };

  const guidance = getTimeBasedGuidance(energyLevel);

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

              {/* Time-Based Guidance */}
              {guidance && (
                <div className={`mb-6 p-6 rounded-xl border-2 ${
                  darkMode
                    ? `bg-${guidance.color}-500/10 border-${guidance.color}-500/30`
                    : `bg-${guidance.color}-50 border-${guidance.color}-200`
                }`}>
                  <h3 className={`text-xl font-bold mb-4 ${
                    darkMode ? `text-${guidance.color}-300` : `text-${guidance.color}-700`
                  }`}>
                    ✨ {guidance.timeOfDay} Recommendations (Energy: {guidance.energyLevel}/5)
                  </h3>

                  <div className="space-y-4">
                    {/* Meal Suggestion */}
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Nutrition
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {guidance.mealSuggestion}
                      </p>
                    </div>

                    {/* Work Suggestion */}
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Work & Productivity
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {guidance.workSuggestion}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleContinue}
                  disabled={!energyLevel}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    !energyLevel
                      ? darkMode
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : darkMode
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  }`}
                >
                  {!energyLevel ? 'Select Energy Level' : 'Continue'}
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
                      onClick={() => handlePrioritySelect(option)}
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
