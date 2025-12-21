import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, TrendingUp, Settings, LogOut, User } from 'lucide-react';
import { signOut } from '../services/dataService';
import usePomodoroStore from '../store/usePomodoroStore';
import useStore from '../store/useStore';
import useWellnessStore from '../store/useWellnessStore';
import useDailyMetricsStore from '../store/useDailyMetricsStore';
import useNDMStore from '../store/useNDMStore';
import WellnessSnackModal from '../components/WellnessSnackModal';
import DailyCommandCenterModal from '../components/DailyCommandCenterModal';
import NDMStatusBar from '../components/NDMStatusBar';
import PomodoroFullScreen from '../components/PomodoroFullScreen';
import KanbanBoard from '../components/KanbanBoard';
import HourlyTaskDisplay from '../components/HourlyTaskDisplay';
import EnergyMoodTracker from '../components/EnergyMoodTracker';
import ProteinTracker from '../components/ProteinTracker';
import VoiceDiary from '../components/VoiceDiary';
import LearningLibrary from '../components/LearningLibrary';
import { ACTIVE_HOURS_START, ACTIVE_HOURS_END } from '../constants';

const Dashboard = () => {
  // Global states and actions
  const { isPomodoroMode, pomodoroSeconds, pomodoroRunning, togglePomodoroMode, setPomodoroSeconds, setPomodoroRunning } = usePomodoroStore();
  const darkMode = useStore((state) => state.darkMode);
  const user = useStore((state) => state.user);
  const userProfile = useStore((state) => state.userProfile);
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const setSpiritAnimalScore = useStore((state) => state.setSpiritAnimalScore);
  const setDarkMode = useStore((state) => state.setDarkMode);

  // Daily Metrics Store states and actions for external interaction
  const {
    setShowCommandCenterModal,
    setDailyMetrics
  } = useDailyMetricsStore();

  // NDM Store
  const ndm = useNDMStore((state) => state.ndm);

  // Local UI state
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  // Get welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const welcomeMessage = getWelcomeMessage();

  // NDM Handler Functions
  const openMindfulMoment = () => {
    // Open box breathing modal for mindfulness
    useWellnessStore.getState().setWellnessSnackChoice('breathing');
    useWellnessStore.getState().setBoxBreathingActive(true);
    useWellnessStore.getState().setShowWellnessSnackModal(true);
  };

  const openBrainDump = () => {
    // Brain dump opens kanban board view
    // For now, just stay on dashboard where kanban is visible
    // Could enhance later with dedicated modal or view
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  // Scroll listener for header animation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real-time clock update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [setCurrentTime]);

  // Pomodoro countdown
  useEffect(() => {
    let interval;
    if (pomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds(pomodoroSeconds - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && pomodoroRunning) {
      setPomodoroRunning(false);
      // Track focus session in metrics
      setDailyMetrics(prev => ({
        ...prev,
        focus: {
          ...prev.focus,
          current: Math.min(prev.focus.target, prev.focus.current + 1),
          sessions: [...prev.focus.sessions, { duration: 20, timestamp: new Date() }]
        }
      }));
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroSeconds, setPomodoroSeconds, setPomodoroRunning, setDailyMetrics]);

  // Hourly wellness snack trigger
  useEffect(() => {
    const currentHour = new Date().getHours();
    const isActiveHours = currentHour >= ACTIVE_HOURS_START && currentHour <= ACTIVE_HOURS_END;
    const inMainApp = userProfile.hasCompletedOnboarding;

    if (isActiveHours && currentHour !== useWellnessStore.getState().lastWellnessHour && inMainApp) {
      const hourKey = `${new Date().toDateString()}-${currentHour}`;
      if (!useWellnessStore.getState().wellnessSnacksDismissed.includes(hourKey) && !pomodoroRunning && !useWellnessStore.getState().missedHourPrompt && !useWellnessStore.getState().showWellnessSnackModal) {
        useWellnessStore.getState().setMissedHourPrompt(true);
        useWellnessStore.getState().setLastWellnessHour(currentHour);
      }
    }
  }, [userProfile.hasCompletedOnboarding, pomodoroRunning, currentTime]);

  // Reset NDM at midnight
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        useNDMStore.getState().resetNDM();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkMidnight);
  }, []);

  // ESC key handler for fullscreen Pomodoro
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && usePomodoroStore.getState().showFullScreen) {
        usePomodoroStore.getState().setShowFullScreen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className={`min-h-screen relative ${
      darkMode ? 'bg-[#191919]' : 'bg-gray-50'
    }`}>
      {/* Daily Command Center - Top Right Side Tab */}
      <div className="fixed right-0 top-1/2 -translate-y-16 w-10 h-24 z-30">
        <button
          onClick={() => setShowCommandCenterModal(true)}
          className={`w-full h-full rounded-l-xl flex items-center justify-center transition-all ${
            darkMode ? 'bg-gradient-to-b from-cyan-500/20 to-purple-500/20' : 'bg-gradient-to-b from-cyan-100/40 to-purple-100/40'
          }`}
          style={{
            border: '1px solid #a855f740',
            borderRight: 'none',
            boxShadow: '0 0 20px #a855f755'
          }}
          title="Daily Command Center"
        >
          <div className="flex flex-col items-center gap-0.5">
            <TrendingUp className={darkMode ? 'text-purple-300' : 'text-purple-600'} size={20} strokeWidth={2.5} />
            <span className={`text-[8px] font-bold leading-tight ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              CMD
            </span>
          </div>
        </button>
      </div>

      {/* HEADER - Mobile First, Brand Visible */}
      <div className={`sticky top-0 z-20 backdrop-blur-xl transition-all duration-300 ${
        isScrolled
          ? darkMode
            ? 'bg-gray-900/20 border-b border-gray-800/10'
            : 'bg-white/20 border-b border-gray-200/10'
          : darkMode
            ? 'bg-gray-900/95 border-b border-gray-800/50 shadow-2xl shadow-purple-500/10'
            : 'bg-white/95 border-b border-gray-200/50 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-1">
          <div className="flex items-center justify-between">

            {/* LEFT: LOGO */}
            <div className={`flex items-center gap-2 transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
              <img
                src="/lioness-logo.png"
                alt="DualTrack OS"
                className="w-16 h-16 md:w-20 md:h-20 drop-shadow-xl"
              />
            </div>

            {/* CENTER: TIME + POMODORO HINT - Primary Action */}
            <button
              onClick={togglePomodoroMode}
              className="flex flex-col items-center cursor-pointer select-none transition-transform hover:scale-105"
            >
              <div className={`text-3xl md:text-4xl font-semibold tracking-tight ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}>
                {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
              </div>
              <div className={`text-[11px] md:text-xs ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              } ${isScrolled ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                Tap for Focus Timer
              </div>
              {userProfile.initials && (
                <div className={`text-xs md:text-sm font-medium mt-1 ${
                  darkMode
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent'
                    : 'text-pink-600'
                } ${isScrolled ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                  {welcomeMessage}, {userProfile.initials}
                </div>
              )}
            </button>

            {/* RIGHT: USER MENU or DARK MODE TOGGLE */}
            {user ? (
              <div className="relative group">
                <button
                  className={`p-2 rounded-full transition-all flex items-center gap-2 ${
                    darkMode
                      ? 'hover:bg-white/10 text-gray-400 hover:text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
                  }`}
                  title="User Menu"
                >
                  <User className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Dropdown menu */}
                <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Signed in as</div>
                    <div className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {user.email}
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-all flex items-center gap-2 ${
                      darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Settings size={16} />
                    Toggle Dark Mode
                  </button>
                  <button
                    onClick={signOut}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-all flex items-center gap-2 ${
                      darkMode ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-50 text-rose-600'
                    }`}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-all ${
                  darkMode
                    ? 'hover:bg-white/10 text-gray-400 hover:text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
                }`}
                title="Toggle Dark Mode"
              >
                <Settings className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
          </div>

          {/* Pomodoro Timer */}
          <div className="text-center pb-1">
            {isPomodoroMode && (
              <div className="space-y-3">
                <div className={`font-mono text-4xl sm:text-5xl font-bold transition-all ${
                  darkMode
                    ? pomodoroRunning
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'
                    : pomodoroRunning ? 'text-orange-600' : 'text-purple-600'
                }`}>
                  {formatTime(pomodoroSeconds)}
                </div>
                <div className="flex items-center justify-center space-x-3 flex-wrap gap-2">
                  {!pomodoroRunning ? (
                    <button onClick={() => usePomodoroStore.getState().startPomodoro()} className={`px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all shadow-lg ${
                      darkMode
                        ? 'bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-300 border-2 border-emerald-500/50'
                        : 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-600'
                    }`}>
                      <Play size={20} />
                      <span>Start Focus</span>
                    </button>
                  ) : (
                    <button onClick={() => usePomodoroStore.getState().pausePomodoro()} className={`px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all shadow-lg ${
                      darkMode
                        ? 'bg-orange-500/30 hover:bg-orange-500/40 text-orange-300 border-2 border-orange-500/50'
                        : 'bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-600'
                    }`}>
                      <Pause size={20} />
                      <span>Pause</span>
                    </button>
                  )}
                  <button onClick={() => usePomodoroStore.getState().resetPomodoro()} className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`} title="Reset Timer">
                    <RotateCcw size={20} />
                  </button>
                  <button onClick={togglePomodoroMode} className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}>
                    Exit Timer
                  </button>
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {pomodoroRunning ? '🎯 Deep Focus Mode Active' : '⏸️ Timer Ready - Click Start Focus'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6 pb-32 relative z-10">
          {/* NDM Status Bar */}
          <NDMStatusBar
            ndm={ndm}
            darkMode={darkMode}
            setCurrentView={setCurrentView}
            openMindfulMoment={openMindfulMoment}
            openBrainDump={openBrainDump}
          />

          {/* Render HourlyTaskDisplay */}
          <HourlyTaskDisplay />

          {/* Render EnergyMoodTracker */}
          <EnergyMoodTracker />

          {/* Render ProteinTracker */}
          <ProteinTracker />

          {/* Render VoiceDiary */}
          <VoiceDiary />

          {/* Render LearningLibrary */}
          <LearningLibrary />

          {/* Render Kanban Board */}
          <KanbanBoard />
        </div>
      </div>

      {/* MODALS */}
      <DailyCommandCenterModal />
      <WellnessSnackModal
        currentTime={currentTime}
        setDailyMetrics={setDailyMetrics}
        setSpiritAnimalScore={setSpiritAnimalScore}
      />

      {/* FULLSCREEN POMODORO */}
      <PomodoroFullScreen darkMode={darkMode} />
    </div>
  );
};

export default Dashboard;
