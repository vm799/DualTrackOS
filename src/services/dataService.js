import { supabase, isSupabaseConfigured } from '../supabaseClient';

// --- User Authentication ---

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
};

export const getSession = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured. Cannot sign in.');
    return;
  }
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
};

export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured. Cannot sign out.');
    return;
  }
  await supabase.auth.signOut();
};

export const onAuthStateChange = (callback) => {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
};


// --- Data Persistence ---

/**
 * Saves user data to both Supabase (if configured) and localStorage.
 * @param {string} userId - The user's ID.
 * @param {object} data - The data object to save.
 */
export const saveUserData = async (userId, data) => {
  // Always save to localStorage as a primary backup
  localStorage.setItem('dualtrack-data', JSON.stringify(data));

  if (isSupabaseConfigured() && userId) {
    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          id: userId,
          data: data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving data to Supabase:', error);
      }
    } catch (e) {
      console.error('Supabase operation failed:', e);
    }
  }
};

/**
 * Loads user data, prioritizing Supabase if available, otherwise falling back to localStorage.
 * @param {string} userId - The user's ID.
 * @returns {object|null} The user's data or null if not found.
 */
export const loadUserData = async (userId) => {
  if (isSupabaseConfigured() && userId) {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('data')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = 'exact one row not found'
        console.error('Error loading data from Supabase:', error);
      }
      
      if (data && data.data) {
        return data.data;
      }
    } catch (e) {
      console.error('Supabase operation failed:', e);
    }
  }

  // Fallback to localStorage if Supabase fails or isn't configured
  const saved = localStorage.getItem('dualtrack-data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing data from localStorage:', e);
      return null;
    }
  }

  return null;
};
