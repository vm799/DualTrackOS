import React from 'react';
import { X, TrendingUp, Plus, Award } from 'lucide-react';
import useStore from '../store/useStore';
import useDailyMetricsStore from '../store/useDailyMetricsStore';

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
          {/* Metrics Overview */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Metrics Overview</h4>
            <StatRow label="Hydration" value={`${dailyMetrics.hydration.current}/${dailyMetrics.hydration.target} glasses`} color={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            <StatRow label="Movement" value={`${dailyMetrics.movement.current}/${dailyMetrics.movement.target} sessions`} color={darkMode ? 'text-green-400' : 'text-green-600'} />
            <StatRow label="Focus" value={`${dailyMetrics.focus.current}/${dailyMetrics.focus.target} sessions`} color={darkMode ? 'text-orange-400' : 'text-orange-600'} />
            <StatRow label="NDMs" value={`${dailyMetrics.ndms.current}/${dailyMetrics.ndms.target} completed`} color={darkMode ? 'text-purple-400' : 'text-purple-600'} />
            <StatRow label="Tasks Done" value={`${dailyMetrics.tasks.done}/${dailyMetrics.tasks.total}`} color={darkMode ? 'text-emerald-400' : 'text-emerald-600'} />
          </div>

          {/* Quick Win Capture */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Quick Win!</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={quickWinInput}
                onChange={(e) => setQuickWinInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addQuickWin()}
                placeholder="What's a win you had?"
                className={`flex-1 px-3 py-2 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-400/50'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
                }`}
              />
              <button
                onClick={addQuickWin}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  darkMode
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300'
                }`}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Recent Wins */}
          {dailyMetrics.wins.length > 0 && (
            <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Recent Wins</h4>
              <ul className="space-y-2">
                {dailyMetrics.wins.slice(-3).reverse().map((win, index) => (
                  <li key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Award size={16} className="inline-block mr-2 text-yellow-400" /> {win.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCommandCenterModal;
