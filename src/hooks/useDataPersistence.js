/**
 * Custom hook for automatic data persistence
 * Saves data to localStorage and Supabase when state changes
 *
 * Single Responsibility: Data persistence only
 */

import { useEffect } from 'react';
import useStore from '../store/useStore';
import { isSupabaseConfigured } from '../supabaseClient';
import { saveUserData } from '../services/dataService';

export const useDataPersistence = () => {
  const user = useStore((state) => state.user);
  const darkMode = useStore((state) => state.darkMode);
  const userProfile = useStore((state) => state.userProfile);

  useEffect(() => {
    // Collect data from main store
    // Individual stores will handle their own persistence
    const dataToSave = {
      darkMode,
      userProfile,
    };

    // Always save to localStorage for offline access
    localStorage.setItem('dualtrack-data', JSON.stringify(dataToSave));

    // Save to Supabase if authenticated
    if (user && isSupabaseConfigured()) {
      saveUserData(user.id, dataToSave);
    }
  }, [darkMode, userProfile, user]);
};
