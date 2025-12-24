import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Award, TrendingUp, FileText, Zap, Battery, AlertCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import usePomodoroStore from '../store/usePomodoroStore';
import useDailyMetricsStore from '../store/useDailyMetricsStore';
import useEnergyMoodStore from '../store/useEnergyMoodStore';
import useRoleStore from '../store/useRoleStore';
import KanbanBoard from '../components/KanbanBoard';
import HourlyTaskDisplay from '../components/HourlyTaskDisplay';
import SectionHeader from '../components/SectionHeader';
import BottomNavigation from '../components/BottomNavigation';
import Logo from '../components/Logo';
import BrainDumpModal from '../components/BrainDumpModal';
import DailyCommandCenterModal from '../components/DailyCommandCenterModal';
import PomodoroFullScreen from '../components/PomodoroFullScreen';
import SmartSuggestions from '../components/SmartSuggestions';
import EnergyMoodModals from '../components/EnergyMoodModals';
import RoleSetupModal from '../components/RoleSetupModal';

const ProductivityPage = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [showBrainDump, setShowBrainDump] = useState(false);
  const [winCategory, setWinCategory] = useState('productivity'); // Track win type

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

  // Energy/Mood state
  const {
    energyTracking,
    currentMood,
    setShowEnergyModal,
    setShowMoodModal,
    getCurrentPeriodEnergy,
    getCurrentEnergy,
    getSmartSuggestions,
    getTimeOfDay
  } = useEnergyMoodStore();

  // Role state
  const {
    userRoles,
    hasCompletedRoleSetup,
    setShowRoleSetup,
    getTotalMentalLoad,
    getSelfCarePercentage,
    isSelfCareNeglected,
    incrementRoleTaskCount
  } = useRoleStore();

  // Helper to add a win and track role task count
  const handleAddQuickWin = () => {
    addQuickWin(winCategory);
    // Map category to role and increment count
    if (hasCompletedRoleSetup) {
      const roleMap = {
        'productivity': ['executive', 'team-mgmt', 'side-business', 'creative'],
        'self-care': ['self-care'],
        'boundaries': ['self-care'],
        'rest': ['self-care']
      };

      const rolesToIncrement = roleMap[winCategory] || [];
      // Find the user's first matching role and increment it
      for (const roleId of rolesToIncrement) {
        const userRole = userRoles.find(r => r.id === roleId);
        if (userRole) {
          incrementRoleTaskCount(roleId);
          break; // Only increment one role per win
        }
      }
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // Current energy and suggestions
  const currentEnergy = getCurrentPeriodEnergy();
  const avgEnergy = getCurrentEnergy();
  const smartSuggestions = getSmartSuggestions();
  const timeOfDay = getTimeOfDay();
  const currentHour = new Date().getHours();

  // Detect "Gentle Mode" (low energy + overwhelmed mood)
  const isGentleMode = currentEnergy && currentEnergy <= 2 && currentMood === 'overwhelmed';

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

  // Helper to add task from SmartSuggestions
  const handleAddTaskFromSuggestion = (hour, taskText) => {
    // This would integrate with your task system
    console.log('Adding task:', taskText, 'at hour:', hour);
  };

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

          {/* Gentle Mode Banner */}
          {isGentleMode && (
            <div className={`rounded-2xl p-6 ${
              darkMode
                ? 'bg-gradient-to-br from-rose-900/40 via-pink-900/30 to-rose-900/40 border-2 border-rose-500/50 shadow-2xl'
                : 'bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-rose-300 shadow-lg'
            }`}>
              <div className="text-center space-y-3">
                <div className="text-4xl">🌸</div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-rose-300' : 'text-rose-800'}`}>
                  Gentle Mode Activated
                </h3>
                <p className={`text-lg ${darkMode ? 'text-rose-200' : 'text-rose-700'}`}>
                  Your energy is low and you're feeling overwhelmed. That's completely valid.
                </p>
                <div className={`p-4 rounded-xl ${
                  darkMode ? 'bg-rose-500/20 border border-rose-500/30' : 'bg-rose-50 border border-rose-200'
                }`}>
                  <p className={`font-semibold ${darkMode ? 'text-rose-300' : 'text-rose-800'}`}>
                    Today's only goal: Basic self-care.
                  </p>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-rose-200' : 'text-rose-700'}`}>
                    Everything else can wait. Rest is productive. ❤️
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Energy Level Display */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowEnergyModal(true)}
              className={`p-6 rounded-2xl transition-all text-left ${
                darkMode
                  ? 'bg-gradient-to-br from-yellow-900/30 via-orange-900/20 to-yellow-900/30 border-2 border-yellow-500/30 hover:border-yellow-500/50'
                  : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:border-yellow-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Battery className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} size={28} />
                <div>
                  <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your Energy
                  </h4>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {timeOfDay}
                  </p>
                </div>
              </div>
              <div className={`text-4xl font-bold mb-2 ${
                darkMode ? 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent' : 'text-yellow-600'
              }`}>
                {currentEnergy || '?'}/5
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentEnergy ? (
                  currentEnergy <= 2 ? '🌸 Gentle mode recommended' :
                  currentEnergy === 3 ? '⚖️ Moderate capacity' :
                  '🚀 Good energy for focused work'
                ) : 'Tap to track your energy'}
              </p>
            </button>

            <button
              onClick={() => setShowMoodModal(true)}
              className={`p-6 rounded-2xl transition-all text-left ${
                darkMode
                  ? 'bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border-2 border-purple-500/30 hover:border-purple-500/50'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={28} />
                <div>
                  <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    How You Feel
                  </h4>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Current mood
                  </p>
                </div>
              </div>
              <div className={`text-lg font-semibold mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                {currentMood ? (
                  <span className="capitalize">{currentMood}</span>
                ) : (
                  <span className="text-gray-500">Not tracked</span>
                )}
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Tap to update
              </p>
            </button>
          </div>

          {/* Mental Load & Capacity Indicators */}
          {hasCompletedRoleSetup && userRoles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mental Load Widget */}
              <div className={`p-6 rounded-2xl ${
                darkMode
                  ? 'bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-indigo-900/30 border-2 border-indigo-500/30'
                  : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <Users className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} size={24} />
                  <div>
                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Mental Load
                    </h4>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tasks across all roles
                    </p>
                  </div>
                </div>
                <div className={`text-3xl font-bold mb-3 ${
                  darkMode ? 'bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent' : 'text-indigo-600'
                }`}>
                  {getTotalMentalLoad()} tasks
                </div>

                {/* Role Breakdown */}
                <div className="space-y-2">
                  {userRoles.filter(r => (r.taskCount || 0) > 0).slice(0, 3).map((role) => (
                    <div key={role.id} className="flex items-center justify-between text-sm">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {role.emoji} {role.name}
                      </span>
                      <span className={`font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                        {role.taskCount}
                      </span>
                    </div>
                  ))}
                  {userRoles.filter(r => (r.taskCount || 0) > 0).length > 3 && (
                    <p className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      +{userRoles.filter(r => (r.taskCount || 0) > 0).length - 3} more roles...
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setShowRoleSetup(true)}
                  className={`mt-3 text-xs underline ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                >
                  Manage roles
                </button>
              </div>

              {/* Daily Capacity Widget */}
              <div className={`p-6 rounded-2xl ${
                darkMode
                  ? 'bg-gradient-to-br from-teal-900/30 via-cyan-900/20 to-teal-900/30 border-2 border-teal-500/30'
                  : 'bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <Battery className={darkMode ? 'text-teal-400' : 'text-teal-600'} size={24} />
                  <div>
                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Today's Capacity
                    </h4>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Energy vs. mental load
                    </p>
                  </div>
                </div>

                {currentEnergy ? (
                  <>
                    <div className={`text-2xl font-bold mb-2 ${
                      darkMode ? 'text-teal-300' : 'text-teal-700'
                    }`}>
                      {currentEnergy <= 2 && getTotalMentalLoad() > 5 ? '🚨 Overloaded' :
                       currentEnergy === 3 && getTotalMentalLoad() > 8 ? '⚠️ At capacity' :
                       currentEnergy >= 4 && getTotalMentalLoad() < 10 ? '✅ Sustainable' :
                       '⚖️ Balanced'}
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {currentEnergy <= 2 && getTotalMentalLoad() > 5
                        ? 'Low energy, high load. Time to delegate or drop tasks.'
                        : currentEnergy === 3 && getTotalMentalLoad() > 8
                        ? 'Medium energy, lots on your plate. Pace yourself.'
                        : currentEnergy >= 4 && getTotalMentalLoad() < 10
                        ? 'Good energy, manageable load. You\'ve got this!'
                        : 'Energy and load are in balance.'}
                    </p>

                    {/* Self-Care Warning */}
                    {isSelfCareNeglected() && (
                      <div className={`mt-3 p-3 rounded-lg ${
                        darkMode ? 'bg-rose-900/30 border border-rose-500/30' : 'bg-rose-100 border border-rose-300'
                      }`}>
                        <p className={`text-xs font-semibold ${darkMode ? 'text-rose-300' : 'text-rose-800'}`}>
                          ⚠️ Self-care is under 10% of your tasks
                        </p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-rose-400' : 'text-rose-700'}`}>
                          Remember: You can't pour from an empty cup.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Track your energy to see capacity insights
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Prompt to set up roles if not done */}
          {!hasCompletedRoleSetup && (
            <button
              onClick={() => setShowRoleSetup(true)}
              className={`w-full p-6 rounded-2xl border-2 border-dashed transition-all text-left ${
                darkMode
                  ? 'border-purple-500/30 bg-purple-900/10 hover:bg-purple-900/20'
                  : 'border-purple-300 bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <Users className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={32} />
                <div>
                  <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Track Your Mental Load
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Define the roles you manage and visualize your invisible labor
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* Smart Suggestions (Energy-Based Recommendations) */}
          {smartSuggestions && currentEnergy && (
            <SmartSuggestions
              suggestions={smartSuggestions}
              darkMode={darkMode}
              onAddTask={handleAddTaskFromSuggestion}
              currentHour={currentHour}
            />
          )}

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

          {/* Quick Wins with Categories */}
          <div className={`rounded-2xl p-6 ${
            darkMode
              ? 'bg-gradient-to-br from-emerald-900/30 via-green-900/20 to-emerald-900/30 border-2 border-emerald-500/30'
              : 'bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <Award className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} size={24} />
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Celebrate Your Wins
              </h3>
            </div>

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
                        ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                        : 'bg-white/50 text-gray-600 hover:bg-white'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={quickWinInput}
                onChange={(e) => setQuickWinInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddQuickWin()}
                placeholder={
                  winCategory === 'productivity' ? "e.g., Finished presentation" :
                  winCategory === 'self-care' ? "e.g., Took a 20-min walk" :
                  winCategory === 'boundaries' ? "e.g., Said no to extra meeting" :
                  "e.g., Took a nap instead of pushing through"
                }
                className={`flex-1 px-4 py-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-emerald-400/50'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                }`}
              />
              <button
                onClick={handleAddQuickWin}
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
                {dailyMetrics.wins.slice(-5).reverse().map((win, idx) => {
                  // Map category to emoji
                  const categoryEmoji =
                    win.category === 'productivity' ? '💼' :
                    win.category === 'self-care' ? '💆' :
                    win.category === 'boundaries' ? '🚫' :
                    win.category === 'rest' ? '😴' : '🎉';

                  return (
                    <div
                      key={idx}
                      className={`px-4 py-2 rounded-lg ${
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
            )}

            <p className={`text-xs mt-3 italic ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              💡 Rest and boundaries are wins too. Celebrate taking care of yourself.
            </p>
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
      <EnergyMoodModals />
      <RoleSetupModal />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ProductivityPage;
