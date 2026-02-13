import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, TrendingUp, Settings, LogOut, User, Sparkles, Clock, Battery, Utensils, Mic, BookOpen, Trello } from 'lucide-react';
import { signOut } from '../services/dataService';
import usePomodoroStore from '../store/usePomodoroStore';
import useStore from '../store/useStore';
import useWellnessStore from '../store/useWellnessStore';
import useDailyMetricsStore from '../store/useDailyMetricsStore';
import useNDMStore from '../store/useNDMStore';
import useSessionStore from '../store/useSessionStore';
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
import BottomNavigation from '../components/BottomNavigation';
import SectionContainer from '../components/SectionContainer';
import MovementDetailModal from '../components/MovementDetailModal';
import NutritionDetailModal from '../components/NutritionDetailModal';
import BrainDumpModal from '../components/BrainDumpModal';
import FeaturePreview from '../components/FeaturePreview';
import Logo from '../components/Logo';
import StoryReminder from '../components/StoryBank/StoryReminder';
import useStoryBankStore from '../store/useStoryBankStore';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import useEnergyDarkMode from '../hooks/useEnergyDarkMode';
import CycleSyncWidget from '../components/CycleSyncWidget';
import NonZeroDayWidget from '../components/NonZeroDayWidget';
import DayOneChecklist from '../components/DayOneChecklist';
import MojoCycleChart from '../components/MojoCycleChart';
import { ACTIVE_HOURS_START, ACTIVE_HOURS_END } from '../constants';

const Dashboard = () => {
  const navigate = useNavigate();

  // Global states and actions
  const { isPomodoroMode, pomodoroSeconds, pomodoroRunning, togglePomodoroMode, setPomodoroSeconds, setPomodoroRunning } = usePomodoroStore();
  const darkMode = useStore((state) => state.darkMode);
  const user = useStore((state) => state.user);
  const userProfile = useStore((state) => state.userProfile);
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const setSpiritAnimalScore = useStore((state) => state.setSpiritAnimalScore);

  // Daily Metrics Store states and actions for external interaction
  const {
    setShowCommandCenterModal,
    setDailyMetrics
  } = useDailyMetricsStore();

  // NDM Store
  const ndm = useNDMStore((state) => state.ndm);

  // Session Store - Context preservation, streaks, suggestions
  const {
    startSession,
    endSession,
    trackNavigation,
    trackModalOpen,
    trackFeatureUse,
    updateStreak,
    streaks
  } = useSessionStore();

  // Local UI state
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showBrainDumpModal, setShowBrainDumpModal] = useState(false);
  const [hasCheckedNDM, setHasCheckedNDM] = useState(false);

  // Story Bank - Daily Reminder System
  const {
    shouldShowReminder,
    snoozeReminder,
    dismissReminderToday
  } = useStoryBankStore();
  const [showStoryReminder, setShowStoryReminder] = useState(false);

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
    setShowBrainDumpModal(true);
    trackModalOpen('braindump');
    trackFeatureUse('braindump');
  };

  const openNutrition = () => {
    setShowNutritionModal(true);
    trackModalOpen('nutrition');
    trackFeatureUse('nutrition');
  };

  const openMovement = () => {
    setShowMovementModal(true);
    trackModalOpen('movement');
    trackFeatureUse('movement');
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onBrainDump: openBrainDump,
    onNutrition: openNutrition,
    onMovement: openMovement,
    onPomodoro: () => {
      usePomodoroStore.getState().setShowFullScreen(true);
      trackFeatureUse('pomodoro');
    },
    onCommandCenter: () => {
      setShowCommandCenterModal(true);
      trackFeatureUse('command-center');
    }
  });

  // Energy-based dark mode (default to medium energy level 5)
  // TODO: Connect to actual energy tracking when implemented
  const [energyLevel] = useState(5);
  useEnergyDarkMode(darkMode, energyLevel);

  // Handle smart suggestion actions
  const handleSuggestionAction = (action) => {
    switch (action) {
      case 'check-in':
        navigate('/check-in');
        break;
      case 'start-pomodoro':
        usePomodoroStore.getState().setShowFullScreen(true);
        trackFeatureUse('pomodoro');
        break;
      case 'open-nutrition':
        openNutrition();
        break;
      case 'brain-dump':
        openBrainDump();
        break;
      case 'resume-braindump':
        openBrainDump();
        break;
      default:
        console.log('Unknown action:', action);
    }
    setShowSuggestion(false);
  };

  // Handle welcome modal
  const handleWelcomeClose = () => {
    localStorage.setItem('dualtrack-dashboard-welcome-seen', 'true');
    setShowWelcome(false);
  };

  const handleWelcomeGetStarted = () => {
    localStorage.setItem('dualtrack-dashboard-welcome-seen', 'true');
    setShowWelcome(false);
    // OnboardingTour will appear automatically if not completed
  };

  // Handle quick check-in
  const handleQuickCheckInClose = () => {
    localStorage.setItem('dualtrack-last-checkin-date', new Date().toDateString());
    setShowQuickCheckIn(false);
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

  // Handle check-in intent (from CheckInPage)
  useEffect(() => {
    const intentData = localStorage.getItem('checkin_intent');
    if (!intentData) return;

    try {
      const intent = JSON.parse(intentData);

      // Check if intent is recent (within last 30 seconds)
      const isRecent = Date.now() - intent.timestamp < 30000;
      if (!isRecent) {
        localStorage.removeItem('checkin_intent');
        return;
      }

      // Handle hash-based routing (modal or section)
      const handleIntent = () => {
        const hash = window.location.hash.replace('#', '');

        // Modal mapping
        const modalMap = {
          'braindump': () => setShowBrainDumpModal(true),
          'nutrition': () => setShowNutritionModal(true),
          'movement': () => setShowMovementModal(true),
        };

        // Open modal if specified
        if (modalMap[hash]) {
          setTimeout(() => modalMap[hash](), 500);
        }

        // Scroll to section if specified
        const section = document.getElementById(hash);
        if (section) {
          setTimeout(() => {
            const offset = 100; // Account for sticky header
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }, 300);
        }

        // Clear intent after handling
        setTimeout(() => localStorage.removeItem('checkin_intent'), 5000);
      };

      handleIntent();
    } catch (err) {
      console.error('Error parsing check-in intent:', err);
      localStorage.removeItem('checkin_intent');
    }
  }, []);

  // Session tracking - Start session on mount
  useEffect(() => {
    startSession();
    trackNavigation('/dashboard');

    // End session on unmount
    return () => {
      endSession();
    };
  }, []);

  // Welcome/Check-in Modal - Show on Dashboard entry
  useEffect(() => {
    // TEMPORARILY DISABLED TO DEBUG
    return;

    const hasSeenDashboardWelcome = localStorage.getItem('dualtrack-dashboard-welcome-seen');
    const lastCheckIn = localStorage.getItem('dualtrack-last-checkin-date');
    const today = new Date().toDateString();

    // First-time users: Show welcome
    if (!hasSeenDashboardWelcome) {
      setTimeout(() => setShowWelcome(true), 800);
    }
    // Returning users: Show quick check-in if they haven't checked in today
    else if (lastCheckIn !== today) {
      setTimeout(() => setShowQuickCheckIn(true), 800);
    }
  }, []);

  // NDM Completion check - Celebrate when all 4 are complete
  useEffect(() => {
    if (hasCheckedNDM) return;

    const allComplete =
      ndm.nutrition &&
      ndm.movement &&
      ndm.mindfulness &&
      ndm.brainDump;

    if (allComplete) {
      setHasCheckedNDM(true);

      // Update NDM streak
      updateStreak('ndm');

      // Show celebration
      setTimeout(() => {
        setCelebrationType('ndm-complete');
        setCelebrationData({ streakCount: streaks.ndmCompletions + 1 });
        setShowCelebration(true);
      }, 500);
    }
  }, [ndm, hasCheckedNDM, updateStreak, streaks.ndmCompletions]);

  // Check for streak milestones
  useEffect(() => {
    const checkInStreak = streaks.checkIns;

    // Celebrate streak milestones
    if (checkInStreak === 3 && !localStorage.getItem('celebrated-streak-3')) {
      setTimeout(() => {
        setCelebrationType('streak-3');
        setCelebrationData({ streakCount: 3 });
        setShowCelebration(true);
        localStorage.setItem('celebrated-streak-3', 'true');
      }, 1000);
    } else if (checkInStreak === 7 && !localStorage.getItem('celebrated-streak-7')) {
      setTimeout(() => {
        setCelebrationType('streak-7');
        setCelebrationData({ streakCount: 7 });
        setShowCelebration(true);
        localStorage.setItem('celebrated-streak-7', 'true');
      }, 1000);
    } else if (checkInStreak === 30 && !localStorage.getItem('celebrated-streak-30')) {
      setTimeout(() => {
        setCelebrationType('streak-30');
        setCelebrationData({ streakCount: 30 });
        setShowCelebration(true);
        localStorage.setItem('celebrated-streak-30', 'true');
      }, 1000);
    }
  }, [streaks.checkIns]);

  // Story Bank reminder check - runs after page load and every 30 minutes
  useEffect(() => {
    // Check if should show reminder
    const checkReminder = () => {
      if (shouldShowReminder()) {
        setShowStoryReminder(true);
      }
    };

    // Wait 5 seconds after page load before first check
    const initialTimer = setTimeout(checkReminder, 5000);

    // Check every 30 minutes
    const interval = setInterval(checkReminder, 30 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [shouldShowReminder]);

  // Story Bank reminder handlers
  const handleStartStory = () => {
    setShowStoryReminder(false);
    navigate('/story-bank');
  };

  const handleSnoozeReminder = () => {
    snoozeReminder(2); // 2 hours
    setShowStoryReminder(false);
  };

  const handleDismissReminder = () => {
    dismissReminderToday();
    setShowStoryReminder(false);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className={`min-h-screen relative ${darkMode ? 'bg-[#191919]' : 'bg-gray-50'
      }`}>
      {/* Daily Command Center - Top Right Side Tab */}
      <div className="fixed right-0 top-1/2 -translate-y-16 w-10 h-24 z-30">
        <button
          onClick={() => setShowCommandCenterModal(true)}
          className={`w-full h-full rounded-l-xl flex items-center justify-center transition-all ${darkMode ? 'bg-gradient-to-b from-cyan-500/20 to-purple-500/20' : 'bg-gradient-to-b from-cyan-100/40 to-purple-100/40'
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

      {/* HEADER - Compact Glassmorphism Sticky Header */}
      <div className={`sticky top-0 z-20 backdrop-blur-xl transition-all duration-300 ${isScrolled
        ? darkMode
          ? 'bg-gray-900/10 border-b border-gray-800/10 shadow-lg'
          : 'bg-white/10 border-b border-gray-200/10 shadow-lg'
        : darkMode
          ? 'bg-gray-900/95 border-b border-gray-800/50 shadow-2xl shadow-purple-500/10'
          : 'bg-white/95 border-b border-gray-200/50 shadow-lg'
        }`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1">
          <div className="flex items-center justify-between gap-2 sm:gap-4">

            {/* LEFT: LOGO - Medium size */}
            <div className="flex-shrink-0">
              <Logo size="medium" navigateTo="/dashboard" />
            </div>

            {/* CENTER: CLOCK + POMODORO */}
            <div className="flex items-center gap-3 sm:gap-6 flex-shrink min-w-0">
              {/* Clock */}
              <button
                onClick={togglePomodoroMode}
                className="cursor-pointer select-none transition-transform hover:scale-105"
              >
                <div className={`text-lg sm:text-2xl font-semibold tracking-tight ${darkMode
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'
                  : 'text-gray-900'
                  }`}>
                  {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
                </div>
              </button>

              {/* Divider */}
              <div className={`h-6 sm:h-8 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

              {/* Pomodoro Timer with Label */}
              <div className="flex flex-col items-center">
                <span className={`text-[9px] sm:text-[10px] font-semibold mb-0.5 ${darkMode ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                  FOCUS
                </span>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={togglePomodoroMode}
                    className={`text-base sm:text-xl font-mono font-bold cursor-pointer hover:scale-105 transition-transform ${darkMode ? 'text-orange-400' : 'text-orange-600'
                      }`}
                    title="Open Focus Mode"
                  >
                    {formatTime(pomodoroSeconds)}
                  </button>
                  <div className="flex gap-0.5 sm:gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pomodoroRunning ? setPomodoroRunning(false) : setPomodoroRunning(true);
                      }}
                      className={`p-1.5 rounded-lg transition-all ${darkMode
                        ? 'hover:bg-gray-800 text-orange-400'
                        : 'hover:bg-gray-100 text-orange-600'
                        }`}
                      title={pomodoroRunning ? 'Pause' : 'Start'}
                    >
                      {pomodoroRunning ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPomodoroSeconds(25 * 60);
                      }}
                      className={`p-1.5 rounded-lg transition-all ${darkMode
                        ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                        }`}
                      title="Reset"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: USER MENU */}
            <div className="flex-shrink-0">
              {user ? (
                <div className="relative group">
                  <button
                    className={`p-1.5 rounded-full transition-all flex flex-col items-center gap-0.5 ${darkMode
                      ? 'hover:bg-white/10 text-gray-400 hover:text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
                      }`}
                    title="User Menu"
                  >
                    <User className="w-5 h-5" />
                    {userProfile.initials && (
                      <span className="text-[10px] font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {userProfile.initials}
                      </span>
                    )}
                  </button>

                  {/* Dropdown menu */}
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                    <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Signed in as</div>
                      <div className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {user.email}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/settings')}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-all flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={signOut}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-all flex items-center gap-2 ${darkMode ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-50 text-rose-600'
                        }`}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/settings')}
                  className={`p-2 rounded-full transition-all ${darkMode
                    ? 'hover:bg-white/10 text-gray-400 hover:text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
                    }`}
                  title="Settings"
                >
                  <Settings className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Pomodoro Timer */}
          <div className="text-center pb-1">
            {isPomodoroMode && (
              <div className="space-y-3">
                <div className={`font-mono text-4xl sm:text-5xl font-bold transition-all ${darkMode
                  ? pomodoroRunning
                    ? 'bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'
                  : pomodoroRunning ? 'text-orange-600' : 'text-purple-600'
                  }`}>
                  {formatTime(pomodoroSeconds)}
                </div>
                <div className="flex items-center justify-center space-x-3 flex-wrap gap-2">
                  {!pomodoroRunning ? (
                    <button onClick={() => usePomodoroStore.getState().startPomodoro()} className={`px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all shadow-lg ${darkMode
                      ? 'bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-300 border-2 border-emerald-500/50'
                      : 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-600'
                      }`}>
                      <Play size={20} />
                      <span>Start Focus</span>
                    </button>
                  ) : (
                    <button onClick={() => usePomodoroStore.getState().pausePomodoro()} className={`px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all shadow-lg ${darkMode
                      ? 'bg-orange-500/30 hover:bg-orange-500/40 text-orange-300 border-2 border-orange-500/50'
                      : 'bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-600'
                      }`}>
                      <Pause size={20} />
                      <span>Pause</span>
                    </button>
                  )}
                  <button onClick={() => usePomodoroStore.getState().resetPomodoro()} className={`px-6 py-3 rounded-xl font-medium transition-all ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                    }`} title="Reset Timer">
                    <RotateCcw size={20} />
                  </button>
                  <button onClick={togglePomodoroMode} className={`px-6 py-3 rounded-xl font-medium transition-all ${darkMode
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
          {/* WIDGETS - TEMPORARILY DISABLED FOR DEBUGGING */}
          {/* SmartSuggestionBanner */}
          {/* {showSuggestion && (
            <SmartSuggestionBanner
              darkMode={darkMode}
              onAction={handleSuggestionAction}
              onDismiss={() => setShowSuggestion(false)}
            />
          )} */}

          {/* QuickNav */}
          {/* <QuickNav darkMode={darkMode} /> */}

          {/* StreakPrediction & SkillLevelBadge */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StreakPrediction darkMode={darkMode} />
            <SkillLevelBadge darkMode={darkMode} showProgress={true} />
          </div> */}

          {/* Day 1 Checklist */}
          <DayOneChecklist />

          {/* Must-Dos Section */}
          <SectionContainer
            id="must-dos"
            icon={Sparkles}
            title="Your Must-Dos for Today"
            description="Complete these 4 core habits - the foundation of your day"
            accentColor="emerald"
            darkMode={darkMode}
          >
            <NDMStatusBar
              ndm={ndm}
              darkMode={darkMode}
              openNutrition={openNutrition}
              openMovement={openMovement}
              openMindfulMoment={openMindfulMoment}
              openBrainDump={openBrainDump}
            />
          </SectionContainer>

          {/* Schedule Section */}
          <SectionContainer
            id="schedule"
            icon={Clock}
            title="Your Hour-by-Hour Game Plan"
            description="Pick what you're attacking now, then crush it with focus mode"
            accentColor="cyan"
            darkMode={darkMode}
          >
            <HourlyTaskDisplay />
          </SectionContainer>

          {/* Energy Section */}
          <SectionContainer
            id="energy"
            icon={Battery}
            title="How Are You Feeling?"
            description="Quick check-in helps us suggest the right tasks for your energy"
            badge="Preview Mode"
            accentColor="purple"
            darkMode={darkMode}
          >
            <FeaturePreview
              feature="energyMoodTracking"
              requiredTier="premium"
              previewLimits={{
                maxSuggestions: 3,
                basicInsights: true,
                description: "3 suggestions max"
              }}
              upgradeMessage={{
                title: "Want Smarter Insights?",
                benefits: [
                  "AI-powered task recommendations",
                  "Trend analysis & patterns",
                  "Unlimited suggestions",
                  "Advanced mood insights"
                ],
                cta: "Upgrade to Premium for $9.99/mo"
              }}
            >
              <EnergyMoodTracker />
            </FeaturePreview>
          </SectionContainer>

          {/* Cycle Syncing & Mojo Section */}
          <SectionContainer
            id="cycle-sync"
            icon={Sparkles}
            title="Daily Mojo & Cycle Phase"
            description="Align your training with your biology"
            accentColor="pink"
            darkMode={darkMode}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <CycleSyncWidget />
              <NonZeroDayWidget />
            </div>
            <MojoCycleChart />
          </SectionContainer>

          {/* Nutrition Section */}
          <SectionContainer
            id="nutrition"
            icon={Utensils}
            title="Fuel Your Fascia"
            description="Hit your 135g protein floor - no excuses"
            accentColor="orange"
            darkMode={darkMode}
          >
            <ProteinTracker openNutrition={openNutrition} />
          </SectionContainer>

          {/* Voice Section */}
          <SectionContainer
            id="voice"
            icon={Mic}
            title="Quick Voice Check-in"
            description="Talk it out in 30 seconds - no typing needed"
            badge="Free: 30s"
            accentColor="pink"
            darkMode={darkMode}
          >
            <FeaturePreview
              feature="voiceTranscription"
              requiredTier="starter"
              previewLimits={{
                maxDuration: 30,
                maxEntries: 3,
                description: "30s max, 3 entries"
              }}
              upgradeMessage={{
                title: "Love Voice Diary?",
                benefits: [
                  "Unlimited recording time",
                  "AI transcription",
                  "Full history access"
                ],
                cta: "Unlock for $4.99/mo"
              }}
            >
              <VoiceDiary />
            </FeaturePreview>
          </SectionContainer>

          {/* Library Section */}
          <SectionContainer
            id="library"
            icon={BookOpen}
            title="Your Knowledge Hub"
            description="Save useful resources and ideas for later"
            accentColor="amber"
            darkMode={darkMode}
          >
            <LearningLibrary />
          </SectionContainer>

          {/* Tasks Section */}
          <SectionContainer
            id="tasks"
            icon={Trello}
            title="Organize Your Chaos"
            description="Brain dump everything, then drag tasks where they belong"
            accentColor="blue"
            darkMode={darkMode}
          >
            <KanbanBoard />
          </SectionContainer>
        </div>
      </div>

      {/* MODALS */}
      <DailyCommandCenterModal />
      <WellnessSnackModal
        currentTime={currentTime}
        setDailyMetrics={setDailyMetrics}
        setSpiritAnimalScore={setSpiritAnimalScore}
      />
      <MovementDetailModal show={showMovementModal} onClose={() => setShowMovementModal(false)} />
      <NutritionDetailModal show={showNutritionModal} onClose={() => setShowNutritionModal(false)} />
      <BrainDumpModal show={showBrainDumpModal} onClose={() => setShowBrainDumpModal(false)} />

      {/* MODALS - RE-ENABLING SYSTEMATICALLY */}
      {/* DashboardWelcome - TEMPORARILY DISABLED FOR DEBUGGING */}
      {/* {showWelcome && (
        <DashboardWelcome
          darkMode={darkMode}
          onClose={handleWelcomeClose}
          onGetStarted={handleWelcomeGetStarted}
        />
      )} */}

      {/* QuickCheckIn - TEMPORARILY DISABLED FOR DEBUGGING */}
      {/* {showQuickCheckIn && (
        <QuickCheckIn
          darkMode={darkMode}
          onClose={handleQuickCheckInClose}
          ndm={ndm}
          streaks={streaks}
          onOpenBrainDump={openBrainDump}
          onOpenNutrition={openNutrition}
          onOpenMovement={openMovement}
          onOpenMindfulness={openMindfulMoment}
        />
      )} */}

      {/* CelebrationModal - TEMPORARILY DISABLED FOR DEBUGGING */}
      {/* <CelebrationModal
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
        type={celebrationType}
        data={celebrationData}
        darkMode={darkMode}
      /> */}

      {/* FULLSCREEN POMODORO */}
      <PomodoroFullScreen darkMode={darkMode} />

      {/* STORY BANK REMINDER */}
      {showStoryReminder && (
        <StoryReminder
          darkMode={darkMode}
          onStartStory={handleStartStory}
          onSnooze={handleSnoozeReminder}
          onDismiss={handleDismissReminder}
        />
      )}

      {/* ONBOARDING TOUR - TEMPORARILY DISABLED FOR DEBUGGING */}
      {/* <OnboardingTour
        darkMode={darkMode}
        onComplete={() => console.log('Onboarding tour completed!')}
        onOpenBrainDump={openBrainDump}
        onOpenNutrition={openNutrition}
        onOpenMovement={openMovement}
        onOpenPomodoro={openMindfulMoment}
      /> */}

      {/* BOTTOM NAVIGATION */}
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
