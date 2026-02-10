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
  const setIsHydrated = useStore((state) => state.setIsHydrated);

  useEffect(() => {
    let subscription = null;

    const initAuth = async () => {
      try {
        if (isSupabaseConfigured()) {
          // Supabase auth flow
          const session = await getSession();
          setUser(session?.user ?? null);

          if (session?.user) {
            const userData = await loadUserData(session.user.id);
            if (userData) {
              if (userData.darkMode !== undefined) setDarkMode(userData.darkMode);
              if (userData.userProfile) setUserProfile(userData.userProfile);
            }
          }

          // Listen for auth changes
          const { data } = onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
          });
          subscription = data.subscription;

          setIsHydrated(true);
        } else {
          // localStorage fallback
          const saved = localStorage.getItem('dualtrack-data');
          if (saved) {
            try {
              const data = JSON.parse(saved);
              if (data.darkMode !== undefined) setDarkMode(data.darkMode);
              if (data.userProfile) setUserProfile(data.userProfile);
            } catch (e) {
              console.error('[useAuthInitialization] Failed to parse localStorage:', e);
            }
          }
          setIsHydrated(true);
        }
      } catch (error) {
        console.error('[useAuthInitialization] Initialization failed:', error);
        setIsHydrated(true);
      }
    };

    initAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [setUser, setDarkMode, setUserProfile, setIsHydrated]);
};
