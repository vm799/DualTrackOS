import { create } from 'zustand';

const useDailyMetricsStore = create((set) => ({
  // State
  dailyMetrics: {
    hydration: { current: 0, target: 8, log: [] },
    movement: { current: 0, target: 4, completions: [] },
    focus: { current: 0, target: 4, sessions: [] },
    ndms: { current: 0, target: 4 },
    tasks: { done: 0, total: 0, pipeline: [] },
    wins: []
  },
  showCommandCenterModal: false,
  quickWinInput: '',

  // Actions
  setDailyMetrics: (metricsOrFn) => set((state) => ({
    dailyMetrics: typeof metricsOrFn === 'function'
      ? metricsOrFn(state.dailyMetrics)
      : metricsOrFn
  })),
  setShowCommandCenterModal: (show) => set({ showCommandCenterModal: show }),
  setQuickWinInput: (input) => set({ quickWinInput: input }),

  // Derived Actions/Logic
  addQuickWin: (category = 'productivity') => {
    set((state) => {
      if (state.quickWinInput.trim()) {
        const newMetrics = {
          ...state.dailyMetrics,
          wins: [...state.dailyMetrics.wins, {
            text: state.quickWinInput.trim(),
            timestamp: new Date(),
            category: category
          }]
        };
        return {
          dailyMetrics: newMetrics,
          quickWinInput: ''
        };
      }
      return state;
    });
  },
}));

export default useDailyMetricsStore;
