import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Session Store - Tracks user context, patterns, and provides smart suggestions
 *
 * Features:
 * - Last activity tracking (route, modal, section)
 * - Smart suggestions based on time, energy, and behavior patterns
 * - Streak tracking (daily check-ins, NDM completions)
 * - Completion history
 * - Draft preservation
 */
const useSessionStore = create(
  persist(
    (set, get) => ({
      // ========================================
      // LAST ACTIVITY TRACKING
      // ========================================
      lastRoute: '/dashboard',
      lastSection: null,
      lastModalOpen: null,
      lastActivity: null,
      scrollPosition: {},

      trackNavigation: (route, section = null) => set({
        lastRoute: route,
        lastSection: section,
        lastActivity: Date.now()
      }),

      trackModalOpen: (modal) => set({
        lastModalOpen: modal,
        lastActivity: Date.now()
      }),

      trackScrollPosition: (route, position) => set((state) => ({
        scrollPosition: {
          ...state.scrollPosition,
          [route]: position
        }
      })),

      getScrollPosition: (route) => {
        const state = get();
        return state.scrollPosition[route] || 0;
      },

      // ========================================
      // STREAKS & COMPLETION TRACKING
      // ========================================
      streaks: {
        checkIns: 0,
        ndmCompletions: 0,
        lastCheckInDate: null,
        lastNDMDate: null
      },

      completedToday: [],
      completionHistory: [],

      markCompleted: (task, category = 'general') => set((state) => {
        const today = new Date().toDateString();
        const newCompletion = {
          task,
          category,
          timestamp: Date.now(),
          date: today
        };

        return {
          completedToday: [...state.completedToday, task],
          completionHistory: [newCompletion, ...state.completionHistory].slice(0, 100) // Keep last 100
        };
      }),

      updateStreak: (type) => set((state) => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (type === 'checkIn') {
          const lastDate = state.streaks.lastCheckInDate;
          const shouldIncrement = lastDate === yesterday || lastDate === null;
          const shouldReset = lastDate !== yesterday && lastDate !== today && lastDate !== null;

          return {
            streaks: {
              ...state.streaks,
              checkIns: shouldReset ? 1 : shouldIncrement ? state.streaks.checkIns + 1 : state.streaks.checkIns,
              lastCheckInDate: today
            }
          };
        }

        if (type === 'ndm') {
          const lastDate = state.streaks.lastNDMDate;
          const shouldIncrement = lastDate === yesterday || lastDate === null;
          const shouldReset = lastDate !== yesterday && lastDate !== today && lastDate !== null;

          return {
            streaks: {
              ...state.streaks,
              ndmCompletions: shouldReset ? 1 : shouldIncrement ? state.streaks.ndmCompletions + 1 : state.streaks.ndmCompletions,
              lastNDMDate: today
            }
          };
        }

        return state;
      }),

      resetDailyCompletions: () => set({
        completedToday: []
      }),

      // ========================================
      // BEHAVIOR PATTERNS
      // ========================================
      behaviorPatterns: {
        mostUsedFeature: null,
        preferredTime: null, // 'morning', 'afternoon', 'evening'
        averageSessionDuration: 0,
        totalSessions: 0
      },

      trackFeatureUse: (feature) => set((state) => {
        // Track which features are used most often
        const featureUseCount = state.featureUseCount || {};
        const newCount = (featureUseCount[feature] || 0) + 1;

        // Find most used feature
        const allFeatures = { ...featureUseCount, [feature]: newCount };
        const mostUsed = Object.entries(allFeatures).reduce((a, b) => a[1] > b[1] ? a : b)[0];

        return {
          featureUseCount: allFeatures,
          behaviorPatterns: {
            ...state.behaviorPatterns,
            mostUsedFeature: mostUsed
          }
        };
      }),

      featureUseCount: {},

      // ========================================
      // SMART SUGGESTIONS
      // ========================================
      getSuggestion: () => {
        const state = get();
        const now = new Date();
        const hour = now.getHours();
        const today = now.toDateString();

        // Time-based suggestions
        if (hour >= 6 && hour < 10 && !state.completedToday.includes('morning-checkin')) {
          return {
            type: 'morning-routine',
            title: 'Start Your Day Right',
            message: "Good morning! Ready for your morning check-in?",
            action: 'check-in',
            priority: 'high',
            icon: '☀️'
          };
        }

        if (hour >= 9 && hour < 12 && !state.completedToday.includes('focus-session')) {
          return {
            type: 'productivity',
            title: 'Peak Energy Time',
            message: "Morning energy is high. Start your most important task with a Pomodoro session?",
            action: 'start-pomodoro',
            priority: 'high',
            icon: '🎯'
          };
        }

        if (hour >= 12 && hour < 14 && !state.completedToday.includes('nutrition-logged')) {
          return {
            type: 'nutrition',
            title: 'Fuel Your Afternoon',
            message: "Log your lunch and track your protein intake?",
            action: 'open-nutrition',
            priority: 'medium',
            icon: '🍗'
          };
        }

        if (hour >= 17 && hour < 20 && !state.completedToday.includes('reflection')) {
          return {
            type: 'reflection',
            title: 'Daily Reflection',
            message: "How did today go? Take a moment to reflect and plan for tomorrow.",
            action: 'brain-dump',
            priority: 'medium',
            icon: '📝'
          };
        }

        // Pattern-based suggestions
        if (state.lastModalOpen === 'braindump' && state.lastActivity) {
          const timeSince = Date.now() - state.lastActivity;
          if (timeSince < 300000 && timeSince > 10000) { // Between 10s and 5min
            return {
              type: 'continuation',
              title: 'Continue Where You Left Off',
              message: "You were working on your brain dump. Want to continue?",
              action: 'resume-braindump',
              priority: 'low',
              icon: '🔄'
            };
          }
        }

        // Most-used feature suggestion
        if (state.behaviorPatterns.mostUsedFeature && !state.completedToday.includes(state.behaviorPatterns.mostUsedFeature)) {
          const featureNames = {
            'braindump': 'Brain Dump',
            'nutrition': 'Nutrition Tracking',
            'pomodoro': 'Focus Session',
            'energy': 'Energy Check-In'
          };

          const featureName = featureNames[state.behaviorPatterns.mostUsedFeature] || state.behaviorPatterns.mostUsedFeature;

          return {
            type: 'habit',
            title: 'Your Usual Routine',
            message: `You usually do ${featureName} around this time. Start now?`,
            action: state.behaviorPatterns.mostUsedFeature,
            priority: 'medium',
            icon: '⭐'
          };
        }

        // Streak encouragement
        if (state.streaks.checkIns >= 3 && state.streaks.lastCheckInDate !== today) {
          return {
            type: 'streak-reminder',
            title: `Keep Your ${state.streaks.checkIns}-Day Streak!`,
            message: "Don't break your streak! Do your daily check-in.",
            action: 'check-in',
            priority: 'high',
            icon: '🔥'
          };
        }

        return null;
      },

      // ========================================
      // DRAFTS (Auto-save)
      // ========================================
      drafts: {},

      saveDraft: (key, content) => set((state) => ({
        drafts: {
          ...state.drafts,
          [key]: {
            content,
            timestamp: Date.now()
          }
        }
      })),

      getDraft: (key) => {
        const draft = get().drafts[key];
        if (!draft) return null;

        // Expire drafts after 24 hours
        const age = Date.now() - draft.timestamp;
        if (age > 86400000) {
          get().clearDraft(key);
          return null;
        }

        return draft.content;
      },

      clearDraft: (key) => set((state) => {
        const { [key]: _, ...remainingDrafts } = state.drafts;
        return { drafts: remainingDrafts };
      }),

      // ========================================
      // SESSION METADATA
      // ========================================
      sessionStartTime: null,
      sessionCount: 0,

      startSession: () => set((state) => ({
        sessionStartTime: Date.now(),
        sessionCount: state.sessionCount + 1,
        behaviorPatterns: {
          ...state.behaviorPatterns,
          totalSessions: state.sessionCount + 1
        }
      })),

      endSession: () => set((state) => {
        if (!state.sessionStartTime) return state;

        const duration = Date.now() - state.sessionStartTime;
        const currentAvg = state.behaviorPatterns.averageSessionDuration;
        const totalSessions = state.behaviorPatterns.totalSessions;

        // Calculate new running average
        const newAvg = ((currentAvg * (totalSessions - 1)) + duration) / totalSessions;

        return {
          sessionStartTime: null,
          behaviorPatterns: {
            ...state.behaviorPatterns,
            averageSessionDuration: newAvg
          }
        };
      }),

      // ========================================
      // UTILITY FUNCTIONS
      // ========================================
      clearAllData: () => set({
        lastRoute: '/dashboard',
        lastSection: null,
        lastModalOpen: null,
        lastActivity: null,
        scrollPosition: {},
        streaks: {
          checkIns: 0,
          ndmCompletions: 0,
          lastCheckInDate: null,
          lastNDMDate: null
        },
        completedToday: [],
        completionHistory: [],
        drafts: {},
        featureUseCount: {},
        behaviorPatterns: {
          mostUsedFeature: null,
          preferredTime: null,
          averageSessionDuration: 0,
          totalSessions: 0
        }
      })
    }),
    {
      name: 'dualtrack-session',
      getStorage: () => localStorage
    }
  )
);

export default useSessionStore;
