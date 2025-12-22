import React, { useState } from 'react';
import { Calendar, Activity, Apple, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import useStore from '../store/useStore';
import useCycleStore from '../store/useCycleStore';

/**
 * Cycle Tracker Component
 * Displays current cycle phase with workout and nutrition recommendations
 */
const CycleTracker = () => {
  const darkMode = useStore((state) => state.darkMode);
  const userProfile = useStore((state) => state.userProfile);

  const {
    cycleDay,
    lastPeriodDate,
    setLastPeriodDate,
    getCurrentPhase,
    getPhaseInfo,
    getWorkoutRecommendations,
    getNutritionRecommendations,
    getPhaseTip,
    getDaysUntilNextPhase,
  } = useCycleStore();

  const [showSetup, setShowSetup] = useState(!lastPeriodDate);
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [periodDate, setPeriodDate] = useState('');

  const phaseInfo = getPhaseInfo();
  const workouts = getWorkoutRecommendations();
  const nutrition = getNutritionRecommendations();
  const tip = getPhaseTip();
  const nextPhase = getDaysUntilNextPhase();

  const handleSetPeriod = (e) => {
    e.preventDefault();
    if (periodDate) {
      setLastPeriodDate(periodDate);
      setShowSetup(false);
    }
  };

  // Get color classes based on phase
  const getPhaseColors = () => {
    if (!phaseInfo) return { bg: 'purple', text: 'purple' };

    const colors = {
      red: {
        bg: darkMode ? 'from-red-900/40 to-pink-900/40' : 'from-red-50 to-pink-50',
        border: darkMode ? 'border-red-500/30' : 'border-red-200',
        text: darkMode ? 'text-red-400' : 'text-red-600',
        accent: darkMode ? 'bg-red-500/20' : 'bg-red-100',
      },
      green: {
        bg: darkMode ? 'from-green-900/40 to-emerald-900/40' : 'from-green-50 to-emerald-50',
        border: darkMode ? 'border-green-500/30' : 'border-green-200',
        text: darkMode ? 'text-green-400' : 'text-green-600',
        accent: darkMode ? 'bg-green-500/20' : 'bg-green-100',
      },
      yellow: {
        bg: darkMode ? 'from-yellow-900/40 to-orange-900/40' : 'from-yellow-50 to-orange-50',
        border: darkMode ? 'border-yellow-500/30' : 'border-yellow-200',
        text: darkMode ? 'text-yellow-400' : 'text-yellow-600',
        accent: darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100',
      },
      purple: {
        bg: darkMode ? 'from-purple-900/40 to-pink-900/40' : 'from-purple-50 to-pink-50',
        border: darkMode ? 'border-purple-500/30' : 'border-purple-200',
        text: darkMode ? 'text-purple-400' : 'text-purple-600',
        accent: darkMode ? 'bg-purple-500/20' : 'bg-purple-100',
      },
    };

    return colors[phaseInfo.color] || colors.purple;
  };

  const colors = getPhaseColors();

  // Setup view for first-time users
  if (showSetup) {
    return (
      <div className={`rounded-xl p-6 transition-all ${
        darkMode
          ? 'bg-gradient-to-br from-purple-900/40 via-pink-900/20 to-purple-900/40 border-2 border-purple-500/30'
          : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <Calendar className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={24} />
          <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Cycle Tracker Setup
          </h3>
        </div>

        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Track your menstrual cycle to get personalized workout and nutrition recommendations based on your hormonal phases.
        </p>

        <form onSubmit={handleSetPeriod} className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              When did your last period start?
            </label>
            <input
              type="date"
              value={periodDate}
              onChange={(e) => setPeriodDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/50'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/50'
              }`}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
              darkMode
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            Start Tracking
          </button>

          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            🔒 Your cycle data is stored locally and never shared with third parties.
          </p>
        </form>
      </div>
    );
  }

  // Main tracker view
  return (
    <div className={`rounded-xl p-6 transition-all bg-gradient-to-br ${colors.bg} border-2 ${colors.border}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{phaseInfo?.emoji}</span>
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {phaseInfo?.name} Phase
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Day {cycleDay} • {phaseInfo?.description}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSetup(true)}
          className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Update
        </button>
      </div>

      {/* Energy Level Visualization */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Energy Level
          </p>
          <p className={`text-sm font-bold ${colors.text}`}>
            {phaseInfo?.energyLevel}/5
          </p>
        </div>
        <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
          <div
            className={`h-full rounded-full transition-all ${colors.accent}`}
            style={{ width: `${(phaseInfo?.energyLevel / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Next Phase */}
      {nextPhase && (
        <div className={`p-3 rounded-lg mb-4 ${colors.accent} border ${colors.border}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="font-semibold">{nextPhase.nextPhase}</span> in {nextPhase.days} day{nextPhase.days !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Phase Tip */}
      <div className={`p-4 rounded-xl mb-4 ${
        darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-start gap-3">
          <Lightbulb className={colors.text} size={20} />
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {tip}
          </p>
        </div>
      </div>

      {/* Workout Recommendations */}
      <div className="mb-4">
        <button
          onClick={() => setShowWorkouts(!showWorkouts)}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
            darkMode ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Activity className={colors.text} size={20} />
            <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Today's Workouts
            </span>
          </div>
          {showWorkouts ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showWorkouts && (
          <div className="mt-2 space-y-2">
            {workouts.map((workout, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  darkMode ? 'bg-gray-800/30' : 'bg-white/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{workout.emoji}</span>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {workout.type}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {workout.duration}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  workout.intensity === 'peak' ? 'bg-orange-500/20 text-orange-400' :
                  workout.intensity === 'high' ? 'bg-green-500/20 text-green-400' :
                  workout.intensity === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {workout.intensity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nutrition Recommendations */}
      <div>
        <button
          onClick={() => setShowNutrition(!showNutrition)}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
            darkMode ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Apple className={colors.text} size={20} />
            <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Nutrition Focus
            </span>
          </div>
          {showNutrition ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showNutrition && nutrition && (
          <div className="mt-2 space-y-3">
            {/* Protein Target */}
            <div className={`p-3 rounded-lg ${colors.accent} border ${colors.border}`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                Protein Target
              </p>
              <p className={`text-lg font-bold ${colors.text}`}>
                {nutrition.proteinTarget}g per lb body weight
              </p>
              {userProfile.weight && (
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  ≈ {Math.round(userProfile.weight * nutrition.proteinTarget)}g total
                </p>
              )}
            </div>

            {/* Focus Foods */}
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-white/50'}`}>
              <p className={`text-xs font-semibold uppercase mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {nutrition.focus}
              </p>
              <div className="space-y-2">
                {nutrition.foods.map((food, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-lg">{food.emoji}</span>
                    <div>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {food.name}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {food.benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avoid List */}
            {nutrition.avoid && nutrition.avoid.length > 0 && (
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  Try to Avoid
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {nutrition.avoid.join(', ')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CycleTracker;
