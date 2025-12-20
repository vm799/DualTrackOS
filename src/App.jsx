import React, { useEffect } from 'react';
import AppRouter from './Router';
import useStore from './store/useStore';
import { isSupabaseConfigured } from './supabaseClient';
import { getSession, onAuthStateChange, saveUserData, loadUserData } from './services/dataService';

const DualTrackOS = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const darkMode = useStore((state) => state.darkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const userProfile = useStore((state) => state.userProfile);
  const setUserProfile = useStore((state) => state.setUserProfile);

  // Initialize auth and load data
  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        const session = await getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          const userData = await loadUserData(session.user.id);
          if (userData) {
            if (userData.darkMode !== undefined) setDarkMode(userData.darkMode);
            if (userData.userProfile) setUserProfile(userData.userProfile);
            // ... (other state hydration will be moved to individual store slices)
          }
        }

        const { data: { subscription } } = onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } else {
        const saved = localStorage.getItem('dualtrack-data');
        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (data.darkMode !== undefined) setDarkMode(data.darkMode);
            if (data.userProfile) setUserProfile(data.userProfile);
            // ... (other state hydration will be moved to individual store slices)
          } catch (e) { console.error(e); }
        }
      }
    };

    initAuth();
  }, [setUser, setDarkMode, setUserProfile]);

  // Save data to localStorage and Supabase
  useEffect(() => {
    const dataToSave = {
      darkMode,
      userProfile,
      // ... (other data to save will be collected from individual store slices)
    };

    localStorage.setItem('dualtrack-data', JSON.stringify(dataToSave));

    if (user && isSupabaseConfigured()) {
      saveUserData(user.id, dataToSave);
    }
  }, [darkMode, userProfile, user]);

  return <AppRouter />;
};

export default DualTrackOS;
