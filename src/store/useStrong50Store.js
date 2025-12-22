import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Strong50 Store - Perimenopause-specific tracking
 * Philosophy: Binary completion, low cognitive load, consistency over intensity
 */
const useStrong50Store = create(
  persist(
    (set, get) => ({
      // ====== DAILY BINARY CHECK-INS ======
      dailyCheckins: {}, // Format: { 'YYYY-MM-DD': { strength: true, movement: true, protein: true, noGrazing: false, sleep: true } }

      // ====== WEEKLY TRAINING SCHEDULE ======
      weeklySchedule: {
        // User assigns days once, repeats weekly
        monday: 'gym-strength',    // 'gym-strength' | 'home-strength' | 'cardio' | 'mobility' | 'rest'
        tuesday: 'cardio',
        wednesday: 'gym-strength',
        thursday: 'rest',
        friday: 'gym-strength',
        saturday: 'home-strength',
        sunday: 'mobility',
      },

      // ====== PULL-UP PROGRESSION ======
      pullUpProgression: {
        currentStage: 'dead-hang',  // 'dead-hang' | 'negatives' | 'assisted' | 'unassisted'
        history: [], // Array of { date, stage, notes, duration/reps }
      },

      // ====== WEEKLY METRICS (once per week) ======
      weeklyMetrics: [], // Array of { date, weight, waistCircumference, energyLevel: 'low'|'ok'|'high' }
      lastMetricsDate: null,

      // ====== ACTIONS ======

      // Daily check-in
      setDailyCheckin: (date, field, value) => {
        const dateKey = date || new Date().toISOString().split('T')[0];
        set((state) => ({
          dailyCheckins: {
            ...state.dailyCheckins,
            [dateKey]: {
              ...(state.dailyCheckins[dateKey] || {}),
              [field]: value,
            },
          },
        }));
      },

      getTodayCheckin: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().dailyCheckins[today] || {
          strength: false,
          movement: false,
          protein: false,
          noGrazing: false,
          sleep: false,
        };
      },

      // Get completion count for today
      getTodayCompletionCount: () => {
        const checkin = get().getTodayCheckin();
        return Object.values(checkin).filter(Boolean).length;
      },

      // Weekly schedule
      setWeeklySchedule: (day, activityType) => {
        set((state) => ({
          weeklySchedule: {
            ...state.weeklySchedule,
            [day]: activityType,
          },
        }));
      },

      getTodayActivity: () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = days[new Date().getDay()];
        return get().weeklySchedule[today];
      },

      // Pull-up progression
      setPullUpStage: (stage) => {
        set({ pullUpProgression: { ...get().pullUpProgression, currentStage: stage } });
      },

      logPullUpSession: (stage, notesOrValue) => {
        const entry = {
          date: new Date().toISOString(),
          stage,
          notes: typeof notesOrValue === 'string' ? notesOrValue : '',
          value: typeof notesOrValue === 'number' ? notesOrValue : null,
        };

        set((state) => ({
          pullUpProgression: {
            ...state.pullUpProgression,
            history: [...state.pullUpProgression.history, entry],
          },
        }));
      },

      // Weekly metrics
      logWeeklyMetrics: (weight, waistCircumference, energyLevel) => {
        const entry = {
          date: new Date().toISOString(),
          weight,
          waistCircumference,
          energyLevel,
        };

        set((state) => ({
          weeklyMetrics: [...state.weeklyMetrics, entry],
          lastMetricsDate: new Date().toISOString(),
        }));
      },

      canLogWeeklyMetrics: () => {
        const lastDate = get().lastMetricsDate;
        if (!lastDate) return true;

        const daysSinceLastLog = Math.floor(
          (new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24)
        );
        return daysSinceLastLog >= 7; // Can only log once per week
      },

      // Get adherence stats
      getWeeklyAdherence: () => {
        const last7Days = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateKey = date.toISOString().split('T')[0];
          last7Days.push(dateKey);
        }

        const checkins = get().dailyCheckins;
        let totalChecks = 0;
        let completedChecks = 0;

        last7Days.forEach((date) => {
          const dayCheckin = checkins[date];
          if (dayCheckin) {
            Object.values(dayCheckin).forEach((checked) => {
              totalChecks++;
              if (checked) completedChecks++;
            });
          }
        });

        return {
          percentage: totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0,
          completedChecks,
          totalChecks,
        };
      },
    }),
    {
      name: 'strong50-storage',
    }
  )
);

export default useStrong50Store;
