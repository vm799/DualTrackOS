import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Award, TrendingUp, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import usePomodoroStore from '../store/usePomodoroStore';
import useDailyMetricsStore from '../store/useDailyMetricsStore';
import KanbanBoard from '../components/KanbanBoard';
import HourlyTaskDisplay from '../components/HourlyTaskDisplay';
import SectionHeader from '../components/SectionHeader';
import BottomNavigation from '../components/BottomNavigation';
import Logo from '../components/Logo';
import BrainDumpModal from '../components/BrainDumpModal';
import DailyCommandCenterModal from '../components/DailyCommandCenterModal';
import PomodoroFullScreen from '../components/PomodoroFullScreen';

const ProductivityPage = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [showBrainDump, setShowBrainDump] = useState(false);

  // Pomodoro state
  const {
    pomodoroSeconds,
    pomodoroRunning,
    startPomodoro,
    pausePomodoro,
    resetPomodoro
  } = usePomodoroStore();

  // Daily metrics state
  const {
    dailyMetrics,
    quickWinInput,
    setQuickWinInput,
    addQuickWin,
    setShowCommandCenterModal
  } = useDailyMetricsStore();

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // Pomodoro ticker
  useEffect(() => {
    if (!pomodoroRunning) return;
    const interval = setInterval(() => {
      usePomodoroStore.setState((state) => ({
        pomodoroSeconds: state.pomodoroSeconds > 0 ? state.pomodoroSeconds - 1 : 0
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [pomodoroRunning]);

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-[#191919]' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 backdrop-blur-xl border-b ${
        darkMode
          ? 'bg-gray-900/95 border-gray-800/50'
          : 'bg-white/95 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className={`p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Productivity
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Task management and focus tools
                </p>
              </div>
            </div>
            <Logo size="medium" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6 pb-32">

          {/* Pomodoro Timer Widget */}
          <div className={`rounded-2xl p-6 ${
            darkMode
              ? 'bg-gradient-to-br from-orange-900/30 via-pink-900/20 to-orange-900/30 border-2 border-orange-500/30'
              : 'bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🎯 Focus Timer
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Pomodoro technique: 25 min focus sessions
                </p>
              </div>
              <div className={`text-4xl font-mono font-bold ${
                darkMode ? 'text-orange-400' : 'text-orange-600'
              }`}>
                {formatTime(pomodoroSeconds)}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={pomodoroRunning ? pausePomodoro : startPomodoro}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  darkMode
                    ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30'
                    : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300'
                }`}
              >
                {pomodoroRunning ? (
                  <>
                    <Pause size={18} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Start
                  </>
                )}
              </button>
              <button
                onClick={resetPomodoro}
                className={`px-4 py-3 rounded-lg transition-all ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Brain Dump */}
            <button
              onClick={() => setShowBrainDump(true)}
              className={`p-6 rounded-2xl transition-all text-left ${
                darkMode
                  ? 'bg-purple-900/30 hover:bg-purple-900/40 border-2 border-purple-500/30'
                  : 'bg-purple-50 hover:bg-purple-100 border-2 border-purple-200'
              }`}
            >
              <FileText className={`mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={28} />
              <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Brain Dump
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Capture thoughts
              </p>
            </button>

            {/* Daily Command Center */}
            <button
              onClick={() => setShowCommandCenterModal(true)}
              className={`p-6 rounded-2xl transition-all text-left ${
                darkMode
                  ? 'bg-cyan-900/30 hover:bg-cyan-900/40 border-2 border-cyan-500/30'
                  : 'bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-200'
              }`}
            >
              <TrendingUp className={`mb-3 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} size={28} />
              <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Metrics
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Daily overview
              </p>
            </button>
          </div>

          {/* Quick Wins */}
          <div className={`rounded-2xl p-6 ${
            darkMode
              ? 'bg-gradient-to-br from-emerald-900/30 via-green-900/20 to-emerald-900/30 border-2 border-emerald-500/30'
              : 'bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <Award className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} size={24} />
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Wins Today
              </h3>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={quickWinInput}
                onChange={(e) => setQuickWinInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addQuickWin()}
                placeholder="What's a win you had today?"
                className={`flex-1 px-4 py-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-emerald-400/50'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                }`}
              />
              <button
                onClick={addQuickWin}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  darkMode
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300'
                }`}
              >
                <Plus size={18} />
              </button>
            </div>
            {dailyMetrics.wins.length > 0 && (
              <div className="space-y-2">
                {dailyMetrics.wins.slice(-3).reverse().map((win, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-100/50 border border-emerald-200'
                    }`}
                  >
                    <p className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                      🎉 {win.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hourly Task Display */}
          <SectionHeader
            emoji="⏰"
            title="Today's Schedule"
            description="Your time-blocked tasks for the day"
          />
          <HourlyTaskDisplay />

          {/* Kanban Board */}
          <SectionHeader
            emoji="📋"
            title="Task Board"
            description="Organize your work: Backlog → In Progress → Done"
          />
          <KanbanBoard />

        </div>
      </div>

      {/* Modals */}
      <BrainDumpModal show={showBrainDump} onClose={() => setShowBrainDump(false)} />
      <DailyCommandCenterModal />
      <PomodoroFullScreen darkMode={darkMode} />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ProductivityPage;
