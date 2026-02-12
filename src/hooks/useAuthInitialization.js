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

    // Shared helper to hydrate state from localStorage
    const hydrateFromLocalStorage = () => {
      const saved = localStorage.getItem('dualtrack-data');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.darkMode !== undefined) setDarkMode(data.darkMode);
          if (data.userProfile) setUserProfile(data.userProfile);
          return true;
        } catch (e) {
          console.error('[useAuthInitialization] Failed to parse localStorage:', e);
        }
      }
      return false;
    };

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
          } else {
            // Session not available (OAuth redirect in progress, expired token, etc.)
            // Fall back to localStorage to preserve existing user data and avoid
            // resetting hasCompletedOnboarding which causes the auth/onboarding loop
            hydrateFromLocalStorage();
          }

          // Listen for auth changes and reload user data when session is established
          const { data } = onAuthStateChange(async (_event, newSession) => {
            const previousUser = useStore.getState().user;
            setUser(newSession?.user ?? null);

            // When a user signs in and we didn't have a user before,
            // load their data from Supabase to sync across devices.
            // Only overwrite if Supabase has completed onboarding data to avoid
            // clobbering valid localStorage state with stale/empty Supabase data.
            if (newSession?.user && !previousUser && _event === 'SIGNED_IN') {
              try {
                const userData = await loadUserData(newSession.user.id);
                if (userData?.userProfile?.hasCompletedOnboarding) {
                  if (userData.darkMode !== undefined) setDarkMode(userData.darkMode);
                  if (userData.userProfile) setUserProfile(userData.userProfile);
                }
              } catch (e) {
                console.error('[useAuthInitialization] Failed to load data on auth change:', e);
              }
            }
          });
          subscription = data.subscription;

          setIsHydrated(true);
        } else {
          // localStorage fallback (no Supabase configured)
          hydrateFromLocalStorage();
          setIsHydrated(true);
        }
      } catch (error) {
        console.error('[useAuthInitialization] Initialization failed:', error);
        // Last resort: try localStorage even on error
        hydrateFromLocalStorage();
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
