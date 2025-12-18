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

  // Actions
  setUser: (user) => set({ user }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setUserProfile: (userProfile) => set({ userProfile }),
}));

export default useStore;
