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
