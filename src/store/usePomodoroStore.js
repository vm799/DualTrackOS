import { create } from 'zustand';
import { POMODORO_DURATION_SECONDS } from '../constants';

const usePomodoroStore = create((set) => ({
  isPomodoroMode: false,
  pomodoroSeconds: POMODORO_DURATION_SECONDS,
  pomodoroRunning: false,
  showPomodoroFullScreen: false,
  showFullScreen: false, // Separate fullscreen overlay state

  togglePomodoroMode: () => set((state) => ({ isPomodoroMode: !state.isPomodoroMode })),
  setPomodoroSeconds: (seconds) => set({ pomodoroSeconds: seconds }),
  setPomodoroRunning: (isRunning) => set({ pomodoroRunning: isRunning }),
  setShowPomodoroFullScreen: (isFullScreen) => set({ showPomodoroFullScreen: isFullScreen }),
  setShowFullScreen: (show) => set({ showFullScreen: show }),

  startPomodoro: () => set({ pomodoroRunning: true, showFullScreen: true }),
  pausePomodoro: () => set({ pomodoroRunning: false, showFullScreen: false }),
  resetPomodoro: () => set({ pomodoroSeconds: POMODORO_DURATION_SECONDS, pomodoroRunning: false, showFullScreen: false }),
}));

export default usePomodoroStore;
