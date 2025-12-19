import { create } from 'zustand';
import { WELLNESS_SNOOZE_DURATION_MS, EXERCISE_TARGETS } from '../constants'; // Assuming constants are available or will be moved

const useWellnessStore = create((set, get) => ({
  // State
  lastWellnessHour: null,
  showWellnessSnackModal: false,
  wellnessSnacksDismissed: [],
  wellnessSnackChoice: null, // 'exercise', 'breathing', 'hydration'
  exerciseChoice: null, // 'squats', 'calves', etc.
  boxBreathingActive: false,
  wellnessCompletions: [],
  missedHourPrompt: false,
  exerciseReps: 0,
  exerciseTarget: EXERCISE_TARGETS.squats,
  exerciseActive: false,

  // Actions
  setLastWellnessHour: (hour) => set({ lastWellnessHour: hour }),
  setShowWellnessSnackModal: (show) => set({ showWellnessSnackModal: show }),
  setWellnessSnacksDismissed: (dismissed) => set({ wellnessSnacksDismissed: dismissed }),
  setWellnessSnackChoice: (choice) => set({ wellnessSnackChoice: choice }),
  setExerciseChoice: (choice) => set({ exerciseChoice: choice }),
  setBoxBreathingActive: (active) => set({ boxBreathingActive: active }),
  setWellnessCompletions: (completions) => set({ wellnessCompletions: completions }),
  setMissedHourPrompt: (prompt) => set({ missedHourPrompt: prompt }),
  setExerciseReps: (reps) => set({ exerciseReps: reps }),
  setExerciseTarget: (target) => set({ exerciseTarget: target }),
  setExerciseActive: (active) => set({ exerciseActive: active }),

  // Derived Actions/Logic
  dismissWellnessSnack: (currentTime) => {
    const hourKey = `${currentTime.toDateString()}-${currentTime.getHours()}`;
    set((state) => ({
      wellnessSnacksDismissed: [...state.wellnessSnacksDismissed, hourKey],
      showWellnessSnackModal: false,
      wellnessSnackChoice: null,
      exerciseChoice: null,
    }));
  },
  snoozeWellnessSnack: () => {
    set({ showWellnessSnackModal: false });
    setTimeout(() => {
      get().setShowWellnessSnackModal(true);
    }, WELLNESS_SNOOZE_DURATION_MS);
  },
  completeWellnessSnack: (type, currentTime, setDailyMetrics, setSpiritAnimalScore) => { // These will need to be passed from Dashboard/AppRouter
    const completion = {
      type,
      timestamp: new Date(),
      hour: currentTime.getHours()
    };
    set((state) => ({ wellnessCompletions: [...state.wellnessCompletions, completion] }));
    setSpiritAnimalScore(prev => Math.min(100, prev + 2)); // This needs access to the main store or passed as a prop

    // Update Daily Metrics (these functions need to come from the main store or passed as props)
    if (type === 'hydration') {
      setDailyMetrics(prev => ({
        ...prev,
        hydration: {
          ...prev.hydration,
          current: Math.min(prev.hydration.target, prev.hydration.current + 1),
          log: [...prev.hydration.log, { timestamp: new Date() }]
        }
      }));
    } else if (type === 'exercise') {
      setDailyMetrics(prev => ({
        ...prev,
        movement: {
          ...prev.movement,
          current: Math.min(prev.movement.target, prev.movement.current + 1),
          completions: [...prev.movement.completions, { type: get().exerciseChoice, timestamp: new Date() }]
        }
      }));
    }
    get().dismissWellnessSnack(currentTime);
  },
  startExercise: (exercise) => set({ exerciseChoice: exercise.id, exerciseTarget: exercise.target || EXERCISE_TARGETS.squats, exerciseReps: 0, exerciseActive: true }),
  incrementReps: () => set((state) => ({ exerciseReps: Math.min(state.exerciseReps + 1, state.exerciseTarget) })),
  decrementReps: () => set((state) => ({ exerciseReps: Math.max(state.exerciseReps - 1, 0) })),
  completeExercise: (currentTime, setDailyMetrics, setSpiritAnimalScore) => {
    get().setExerciseActive(false);
    get().completeWellnessSnack('exercise', currentTime, setDailyMetrics, setSpiritAnimalScore);
  },
  cancelExercise: () => set({ exerciseActive: false, exerciseChoice: null, exerciseReps: 0, wellnessSnackChoice: null }),
  cancelWellnessFlow: () => set({ showWellnessSnackModal: false, wellnessSnackChoice: null, exerciseChoice: null, exerciseActive: false, boxBreathingActive: false, exerciseReps: 0 }),
  acceptWellnessPrompt: () => set({ missedHourPrompt: false, showWellnessSnackModal: true }),
  declineWellnessPrompt: (currentTime) => {
    get().setMissedHourPrompt(false);
    get().dismissWellnessSnack(currentTime);
  },
}));

export default useWellnessStore;
