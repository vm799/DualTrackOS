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
  const isHydrated = useStore((state) => state.isHydrated);

  useEffect(() => {
    // Only save if we are hydrated to avoid overwriting good data with default state
    if (!isHydrated) return;

    // Collect data from main store
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
  }, [darkMode, userProfile, user, isHydrated]);
};
