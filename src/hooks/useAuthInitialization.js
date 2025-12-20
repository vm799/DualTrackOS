/**
 * Custom hook for authentication initialization
 * Handles Supabase auth session and localStorage fallback
 *
 * Single Responsibility: Auth initialization only
 */

import { useEffect } from 'react';
import useStore from '../store/useStore';
import { isSupabaseConfigured } from '../supabaseClient';
import { getSession, onAuthStateChange, loadUserData } from '../services/dataService';

export const useAuthInitialization = () => {
  const setUser = useStore((state) => state.setUser);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const setUserProfile = useStore((state) => state.setUserProfile);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        // Supabase auth flow
        const session = await getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          const userData = await loadUserData(session.user.id);
          if (userData) {
            if (userData.darkMode !== undefined) setDarkMode(userData.darkMode);
            if (userData.userProfile) setUserProfile(userData.userProfile);
            // Other state hydration handled by individual store slices
          }
        }

        // Listen for auth changes
        const { data: { subscription } } = onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } else {
        // localStorage fallback for non-Supabase users
        const saved = localStorage.getItem('dualtrack-data');
        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (data.darkMode !== undefined) setDarkMode(data.darkMode);
            if (data.userProfile) setUserProfile(data.userProfile);
            // Other state hydration handled by individual store slices
          } catch (e) {
            console.error('[useAuthInitialization] Failed to parse localStorage:', e);
          }
        }
      }
    };

    initAuth();
  }, [setUser, setDarkMode, setUserProfile]);
};
