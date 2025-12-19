import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import usePomodoroStore from '../store/usePomodoroStore';
import useStore from '../store/useStore';
import useWellnessStore from '../store/useWellnessStore';
import WellnessSnackModal from '../components/WellnessSnackModal';
import { POMODORO_DURATION_SECONDS, ACTIVE_HOURS_START, ACTIVE_HOURS_END } from '../constants';

const Dashboard = () => {
  // Global states and actions
  const { isPomodoroMode, pomodoroSeconds, pomodoroRunning, togglePomodoroMode, setPomodoroSeconds, setPomodoroRunning, resetPomodoro } = usePomodoroStore();
  const darkMode = useStore((state) => state.darkMode);
  const userProfile = useStore((state) => state.userProfile);

  // Local states that will eventually be moved to stores
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastWellnessHour, setLastWellnessHour] = useState(null);
  const [wellnessSnacksDismissed, setWellnessSnacksDismissed] = useState([]);
  const [showWellnessSnackModal, setShowWellnessSnackModal] = useState(false);
  const [missedHourPrompt, setMissedHourPrompt] = useState(false);

  // Mocked for now, will come from main store later
  const [dailyMetrics, setDailyMetrics] = useState({ focus: { current: 0, target: 4, sessions: [] } });
  const [spiritAnimalScore, setSpiritAnimalScore] = useState(0);

  // Wellness Store states and actions
  const { setMissedHourPrompt: setWellnessMissedHourPrompt, setLastWellnessHour: setWellnessLastWellnessHour, setWellnessSnacksDismissed: setWellnessWellnessSnacksDismissed, setShowWellnessSnackModal: setWellnessShowWellnessSnackModal } = useWellnessStore();

  // Real-time clock update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    const inMainApp = userProfile.hasCompletedOnboarding; // Landing/Story pages are now routed

    if (isActiveHours && currentHour !== lastWellnessHour && inMainApp) {
      const hourKey = `${new Date().toDateString()}-${currentHour}`;
      if (!wellnessSnacksDismissed.includes(hourKey) && !pomodoroRunning && !missedHourPrompt && !showWellnessSnackModal) {
        setMissedHourPrompt(true);
        setLastWellnessHour(currentHour);
        setWellnessMissedHourPrompt(true); // Update wellness store
        setWellnessLastWellnessHour(currentHour); // Update wellness store
      }
    }
  }, [lastWellnessHour, wellnessSnacksDismissed, pomodoroRunning, userProfile.hasCompletedOnboarding, missedHourPrompt, showWellnessSnackModal, setLastWellnessHour, setMissedHourPrompt, setWellnessLastWellnessHour, setWellnessMissedHourPrompt]);


  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
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

      {showWellnessSnackModal && (
        <WellnessSnackModal
          currentTime={currentTime}
          setDailyMetrics={setDailyMetrics}
          setSpiritAnimalScore={setSpiritAnimalScore}
        />
      )}
    </div>
  );
};

export default Dashboard;
