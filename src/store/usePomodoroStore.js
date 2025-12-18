import { create } from 'zustand';
import { POMODORO_DURATION_SECONDS } from '../constants';

const usePomodoroStore = create((set) => ({
  isPomodoroMode: false,
  pomodoroSeconds: POMODORO_DURATION_SECONDS,
  pomodoroRunning: false,
  showPomodoroFullScreen: false,

  togglePomodoroMode: () => set((state) => ({ isPomodoroMode: !state.isPomodoroMode })),
  setPomodoroSeconds: (seconds) => set({ pomodoroSeconds: seconds }),
  setPomodoroRunning: (isRunning) => set({ pomodoroRunning: isRunning }),
  setShowPomodoroFullScreen: (isFullScreen) => set({ showPomodoroFullScreen: isFullScreen }),

  startPomodoro: () => set({ pomodoroRunning: true, showPomodoroFullScreen: true }),
  pausePomodoro: () => set({ pomodoroRunning: false, showPomodoroFullScreen: false }),
  resetPomodoro: () => set({ pomodoroSeconds: POMODORO_DURATION_SECONDS, pomodoroRunning: false, showPomodoroFullScreen: false }),
}));

export default usePomodoroStore;
