import { create } from 'zustand';

const useStore = create((set) => ({
  // State
  user: null,
  darkMode: true,
  userProfile: {
    name: '',
    preferredName: '',
    initials: '',
    age: null,
    weight: null, // in lbs, for protein calculation
    avatar: '🥚', // Everyone starts with an egg that grows into a Kitsune
    hasCompletedOnboarding: false,
    disclaimerAccepted: false
  },
  currentTime: new Date(), // Global current time
  spiritAnimalScore: 0, // Balance score (0-100) for spirit animal growth
  currentView: 'dashboard', // Current view: 'dashboard' | 'food' | 'exercise' | 'learn'

  // Actions
  setUser: (user) => set({ user }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setCurrentTime: (time) => set({ currentTime: time }), // Action to update current time
  setSpiritAnimalScore: (score) => set({ spiritAnimalScore: typeof score === 'function' ? score(useStore.getState().spiritAnimalScore) : score }),
  setCurrentView: (view) => set({ currentView: view }), // Action to change view
}));

export default useStore;
