import { createClient } from '@supabase/supabase-js'

// For local development without Supabase, use localStorage fallback
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

// Create Supabase client (returns null if credentials not configured)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase

// Helper function to get current user
export const getCurrentUser = async () => {
  if (!supabase) return null
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user ?? null
}

// Helper function to sign in with Google
export const signInWithGoogle = async () => {
  if (!supabase) return { error: 'Supabase not configured' }
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
}

// Helper function to sign out
export const signOut = async () => {
  if (!supabase) return
  return await supabase.auth.signOut()
}

// Helper function to save user data
export const saveUserData = async (userId, data) => {
  if (!supabase) return { error: 'Supabase not configured' }

  return await supabase
    .from('user_data')
    .upsert({
      id: userId,
      data: data,
      updated_at: new Date().toISOString()
    })
}

// Helper function to load user data
export const loadUserData = async (userId) => {
  if (!supabase) return { data: null }

  const { data, error } = await supabase
    .from('user_data')
    .select('data')
    .eq('id', userId)
    .single()

  return { data: data?.data, error }
}
