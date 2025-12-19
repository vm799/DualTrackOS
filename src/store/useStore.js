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

  // Actions
  setUser: (user) => set({ user }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setCurrentTime: (time) => set({ currentTime: time }), // Action to update current time
}));

export default useStore;
