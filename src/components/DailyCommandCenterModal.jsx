import React, { useState } from 'react';
import { X, TrendingUp, Plus, Award, Battery, Zap, Users } from 'lucide-react';
import useStore from '../store/useStore';
import useDailyMetricsStore from '../store/useDailyMetricsStore';
import useNDMStore from '../store/useNDMStore';
import useEnergyMoodStore from '../store/useEnergyMoodStore';
import useRoleStore from '../store/useRoleStore';

const DailyCommandCenterModal = () => {
  const darkMode = useStore((state) => state.darkMode);
  const {
    dailyMetrics,
    showCommandCenterModal,
    quickWinInput,
    setShowCommandCenterModal,
    setQuickWinInput,
    addQuickWin,
  } = useDailyMetricsStore();

  // NDM tracking
  const ndm = useNDMStore((state) => state.ndm);
  const ndmCount = [ndm.nutrition, ndm.movement, ndm.mindfulness, ndm.brainDump].filter(Boolean).length;

  // Energy and Mood tracking
  const {
    energyTracking,
    currentMood,
    getCurrentEnergy,
    getCurrentPeriodEnergy
  } = useEnergyMoodStore();
  const avgEnergy = getCurrentEnergy();
  const currentEnergy = getCurrentPeriodEnergy();

  // Role tracking
  const {
    hasCompletedRoleSetup,
    getTotalMentalLoad,
    getSelfCarePercentage,
    isSelfCareNeglected
  } = useRoleStore();

  const [winCategory, setWinCategory] = useState('productivity');

  const StatRow = ({ label, value, color }) => (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );

  return showCommandCenterModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg">
      <div className={`max-w-2xl w-full rounded-3xl p-8 relative ${darkMode ? 'bg-gray-900 border-2 border-cyan-500/30' : 'bg-white border-2 border-cyan-200'}`}>
        <button
          onClick={() => setShowCommandCenterModal(false)}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
            darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Close"
        >
          <X size={24} />
        </button>

        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Daily Command Center
        </h3>

        <div className="space-y-4">
          {/* Energy & Mood Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-xl p-4 ${darkMode ? 'bg-gradient-to-br from-yellow-900/30 via-orange-900/20 to-yellow-900/30 border border-yellow-500/30' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Battery className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} size={20} />
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Energy</h4>
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {currentEnergy || '?'}/5
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Current period • Avg: {avgEnergy}/5
              </p>
            </div>

            <div className={`rounded-xl p-4 ${darkMode ? 'bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={20} />
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mood</h4>
              </div>
              <div className={`text-lg font-semibold capitalize ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                {currentMood || 'Not tracked'}
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                How you're feeling today
              </p>
            </div>
          </div>

          {/* Mental Load (if role setup complete) */}
          {hasCompletedRoleSetup && (
            <div className={`rounded-xl p-4 ${darkMode ? 'bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-indigo-900/30 border border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} size={20} />
                  <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mental Load</h4>
                </div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                  {getTotalMentalLoad()}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Self-care</span>
                <span className={`font-semibold ${
                  getSelfCarePercentage() < 10
                    ? darkMode ? 'text-rose-400' : 'text-rose-600'
                    : darkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  {getSelfCarePercentage()}%
                </span>
              </div>
              {isSelfCareNeglected() && (
                <p className={`text-xs mt-2 ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                  ⚠️ Self-care is under 10% of your tasks
                </p>
              )}
            </div>
          )}

          {/* Metrics Overview */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Daily Metrics</h4>
            <div className="space-y-2">
              <StatRow label="💧 Hydration" value={`${dailyMetrics.hydration.current}/${dailyMetrics.hydration.target} glasses`} color={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              <StatRow label="🏃 Movement" value={`${dailyMetrics.movement.current}/${dailyMetrics.movement.target} sessions`} color={darkMode ? 'text-green-400' : 'text-green-600'} />
              <StatRow label="🎯 Focus" value={`${dailyMetrics.focus.current}/${dailyMetrics.focus.target} sessions`} color={darkMode ? 'text-orange-400' : 'text-orange-600'} />
              <StatRow label="✨ NDMs" value={`${ndmCount}/4 completed`} color={ndmCount === 4 ? (darkMode ? 'text-emerald-400' : 'text-emerald-600') : (darkMode ? 'text-purple-400' : 'text-purple-600')} />
              <StatRow label="✅ Tasks" value={`${dailyMetrics.tasks.done}/${dailyMetrics.tasks.total}`} color={darkMode ? 'text-emerald-400' : 'text-emerald-600'} />
            </div>
          </div>

          {/* Quick Win Capture */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Celebrate Your Wins</h4>

            {/* Category Selector */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {[
                { id: 'productivity', label: 'Work', emoji: '💼' },
                { id: 'self-care', label: 'Self-Care', emoji: '💆' },
                { id: 'boundaries', label: 'Boundaries', emoji: '🚫' },
                { id: 'rest', label: 'Rest', emoji: '😴' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setWinCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    winCategory === cat.id
                      ? darkMode
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                        : 'bg-emerald-200 text-emerald-800 border border-emerald-400'
                      : darkMode
                        ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={quickWinInput}
                onChange={(e) => setQuickWinInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addQuickWin(winCategory)}
                placeholder={
                  winCategory === 'productivity' ? "e.g., Finished presentation" :
                  winCategory === 'self-care' ? "e.g., Took a 20-min walk" :
                  winCategory === 'boundaries' ? "e.g., Said no to extra meeting" :
                  "e.g., Took a nap instead of pushing through"
                }
                className={`flex-1 px-3 py-2 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-400/50'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
                }`}
              />
              <button
                onClick={() => addQuickWin(winCategory)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  darkMode
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300'
                }`}
              >
                <Plus size={18} />
              </button>
            </div>
            <p className={`text-xs mt-2 italic ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              💡 Rest and boundaries are wins too. Celebrate taking care of yourself.
            </p>
          </div>

          {/* Recent Wins */}
          {dailyMetrics.wins.length > 0 && (
            <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Recent Wins</h4>
              <div className="space-y-2">
                {dailyMetrics.wins.slice(-5).reverse().map((win, index) => {
                  // Map category to emoji
                  const categoryEmoji =
                    win.category === 'productivity' ? '💼' :
                    win.category === 'self-care' ? '💆' :
                    win.category === 'boundaries' ? '🚫' :
                    win.category === 'rest' ? '😴' : '🎉';

                  return (
                    <div
                      key={index}
                      className={`px-3 py-2 rounded-lg ${
                        darkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-100/50 border border-emerald-200'
                      }`}
                    >
                      <p className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                        {categoryEmoji} {win.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCommandCenterModal;
