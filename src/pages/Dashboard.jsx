import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, TrendingUp } from 'lucide-react';
import usePomodoroStore from '../store/usePomodoroStore';
import useStore from '../store/useStore';
import useWellnessStore from '../store/useWellnessStore';
import useDailyMetricsStore from '../store/useDailyMetricsStore';
import WellnessSnackModal from '../components/WellnessSnackModal';
import DailyCommandCenterModal from '../components/DailyCommandCenterModal';
import KanbanBoard from '../components/KanbanBoard'; // Import KanbanBoard
import { POMODORO_DURATION_SECONDS, ACTIVE_HOURS_START, ACTIVE_HOURS_END } from '../constants';

const Dashboard = () => {
  // Global states and actions
  const { isPomodoroMode, pomodoroSeconds, pomodoroRunning, togglePomodoroMode, setPomodoroSeconds, setPomodoroRunning, resetPomodoro } = usePomodoroStore();
  const darkMode = useStore((state) => state.darkMode);
  const userProfile = useStore((state) => state.userProfile);
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const setSpiritAnimalScore = useStore((state) => state.setSpiritAnimalScore); // Assuming setSpiritAnimalScore is in useStore

  // Wellness Store states and actions for external interaction
  const {
    wellnessSnacksDismissed,
    showWellnessSnackModal,
    missedHourPrompt,
    setMissedHourPrompt: setWellnessMissedHourPrompt,
    setLastWellnessHour: setWellnessLastWellnessHour,
  } = useWellnessStore();

  // Daily Metrics Store states and actions for external interaction
  const {
    showCommandCenterModal,
    setShowCommandCenterModal,
    setDailyMetrics // Destructure setDailyMetrics from useDailyMetricsStore
  } = useDailyMetricsStore();

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
      setDailyMetrics(prev => ({ // Use setDailyMetrics from useDailyMetricsStore
        ...prev,
        focus: {
          ...prev.focus,
          current: Math.min(prev.focus.target, prev.focus.current + 1),
          sessions: [...prev.focus.sessions, { duration: 20, timestamp: new Date() }]
        }
      }));
      // if (notificationsEnabled) {
      //   new Notification('Focus session complete!', { body: '20 minutes of deep work done. Take a break!' });
      // }
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


  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen relative">
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

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Pomodoro Timer */}
        <div className="text-center pb-1">
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
            } opacity-80`}>
              Tap clock to start Pomodoro
            </div>
          </button>

          {isPomodoroMode && (
            <div className="space-y-3 mt-4">
              <div className={`font-mono text-3xl sm:text-4xl font-bold ${
                darkMode
                  ? pomodoroRunning
                    ? 'bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent'
                    : 'text-gray-600'
                  : pomodoroRunning ? 'text-orange-600' : 'text-gray-400'
              }`}>
                {formatTime(pomodoroSeconds)}
              </div>
              <div className="flex items-center justify-center space-x-3">
                {!pomodoroRunning ? (
                  <button onClick={() => usePomodoroStore.getState().startPomodoro()} className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                    darkMode
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                      : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300'
                  }`}>
                    <Play size={18} />
                    <span>Start</span>
                  </button>
                ) : (
                  <button onClick={() => usePomodoroStore.getState().pausePomodoro()} className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                    darkMode
                      ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30'
                      : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300'
                  }`}>
                    <Pause size={18} />
                    <span>Pause</span>
                  </button>
                )}
                <button onClick={() => usePomodoroStore.getState().resetPomodoro()} className={`p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}>
                  <RotateCcw size={18} />
                </button>
                <button onClick={togglePomodoroMode} className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}>
                  Exit
                </button>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                {pomodoroRunning ? '🎯 Deep Focus Mode Active' : 'Paused'}
              </div>
            </div>
          )}
        </div>
        {/* Render Kanban Board */}
        <KanbanBoard />
      </div>

      <DailyCommandCenterModal />
      <WellnessSnackModal
        currentTime={currentTime}
        setDailyMetrics={setDailyMetrics}
        setSpiritAnimalScore={setSpiritAnimalScore}
      />
    </div>
  );
};

export default Dashboard;