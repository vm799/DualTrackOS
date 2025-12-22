import React, { useState } from 'react';
import { TrendingUp, Save, History } from 'lucide-react';
import useStore from '../store/useStore';
import useStrong50Store from '../store/useStrong50Store';

/**
 * Pull-Up Progression Tracker
 * Skill-based progression for Strong50 users
 *
 * Stages:
 * 1. Dead hang (duration)
 * 2. Negative reps
 * 3. Assisted pull-ups
 * 4. Unassisted reps
 */
const PullUpProgressionTracker = () => {
  const darkMode = useStore((state) => state.darkMode);
  const { pullUpProgression, setPullUpStage, logPullUpSession } = useStrong50Store();

  const [showHistory, setShowHistory] = useState(false);
  const [logValue, setLogValue] = useState('');
  const [logNotes, setLogNotes] = useState('');

  const stages = [
    {
      id: 'dead-hang',
      name: 'Dead Hang',
      description: 'Build grip strength & shoulder stability',
      emoji: '⏱️',
      unit: 'seconds',
      target: '60s',
    },
    {
      id: 'negatives',
      name: 'Negative Reps',
      description: 'Control the descent, build eccentric strength',
      emoji: '⬇️',
      unit: 'reps',
      target: '8 reps',
    },
    {
      id: 'assisted',
      name: 'Assisted Pull-ups',
      description: 'Use band or machine to reduce body weight',
      emoji: '🔗',
      unit: 'reps',
      target: '10 reps',
    },
    {
      id: 'unassisted',
      name: 'Unassisted Pull-ups',
      description: 'Full bodyweight pull-up - the goal!',
      emoji: '💪',
      unit: 'reps',
      target: '5+ reps',
    },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === pullUpProgression.currentStage);
  const currentStage = stages[currentStageIndex];

  const handleLogSession = () => {
    if (!logValue) return;

    const value = parseInt(logValue);
    logPullUpSession(pullUpProgression.currentStage, logNotes || value);

    setLogValue('');
    setLogNotes('');
  };

  return (
    <div className={`rounded-xl p-6 ${
      darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className={darkMode ? 'text-orange-400' : 'text-orange-600'} size={28} />
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pull-Up Progression
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Master the skill, one stage at a time
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-2 rounded-lg transition-all ${
            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <History size={20} />
        </button>
      </div>

      {/* Stage selector */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {stages.map((stage, index) => {
          const isActive = stage.id === pullUpProgression.currentStage;
          const isCompleted = index < currentStageIndex;

          return (
            <button
              key={stage.id}
              onClick={() => setPullUpStage(stage.id)}
              className={`p-3 rounded-lg text-left transition-all ${
                isActive
                  ? darkMode
                    ? 'bg-orange-500/20 border-2 border-orange-500/50'
                    : 'bg-orange-100 border-2 border-orange-400'
                  : isCompleted
                    ? darkMode
                      ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                      : 'bg-emerald-100 border-2 border-emerald-400'
                    : darkMode
                      ? 'bg-gray-800/30 border-2 border-gray-700 hover:border-gray-600'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{stage.emoji}</span>
                <span className={`text-xs font-semibold ${
                  isActive
                    ? darkMode ? 'text-orange-400' : 'text-orange-700'
                    : isCompleted
                      ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                      : darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isCompleted && '✓ '}Stage {index + 1}
                </span>
              </div>
              <div className={`text-sm font-semibold mb-1 ${
                isActive || isCompleted
                  ? darkMode ? 'text-white' : 'text-gray-900'
                  : darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {stage.name}
              </div>
              <div className={`text-xs ${
                isActive || isCompleted
                  ? darkMode ? 'text-gray-400' : 'text-gray-600'
                  : darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Target: {stage.target}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current stage info */}
      <div className={`p-4 rounded-lg mb-4 ${
        darkMode ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'
      }`}>
        <h4 className={`font-bold mb-1 ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>
          Current Focus: {currentStage.name}
        </h4>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {currentStage.description}
        </p>
      </div>

      {/* Log session */}
      <div className="space-y-3">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Log Today's Session ({currentStage.unit})
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={logValue}
              onChange={(e) => setLogValue(e.target.value)}
              placeholder={`Enter ${currentStage.unit}`}
              className={`flex-1 px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-800 border-2 border-gray-700 text-white focus:border-orange-500'
                  : 'bg-white border-2 border-gray-200 text-gray-900 focus:border-orange-500'
              } focus:outline-none`}
            />
            <button
              onClick={handleLogSession}
              disabled={!logValue}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                logValue
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save size={18} />
              Log
            </button>
          </div>
        </div>

        {/* Optional notes */}
        <input
          type="text"
          value={logNotes}
          onChange={(e) => setLogNotes(e.target.value)}
          placeholder="Optional notes (e.g., 'Felt strong today!')"
          className={`w-full px-4 py-2 rounded-lg ${
            darkMode
              ? 'bg-gray-800 border-2 border-gray-700 text-white focus:border-orange-500'
              : 'bg-white border-2 border-gray-200 text-gray-900 focus:border-orange-500'
          } focus:outline-none`}
        />
      </div>

      {/* History */}
      {showHistory && pullUpProgression.history.length > 0 && (
        <div className={`mt-6 p-4 rounded-lg ${
          darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        }`}>
          <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Recent Sessions
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {pullUpProgression.history.slice(-10).reverse().map((entry, idx) => (
              <div key={idx} className={`text-sm flex justify-between ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <span className="font-semibold">
                  {stages.find((s) => s.id === entry.stage)?.name}: {entry.value || entry.notes}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PullUpProgressionTracker;
