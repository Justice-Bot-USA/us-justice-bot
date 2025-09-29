import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string
          user_id: string | null
          state: string
          legal_section: string
          language: 'en' | 'es'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          state: string
          legal_section: string
          language: 'en' | 'es'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          state?: string
          legal_section?: string
          language?: 'en' | 'es'
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_state: string | null
          preferred_language: 'en' | 'es'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_state?: string | null
          preferred_language?: 'en' | 'es'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_state?: string | null
          preferred_language?: 'en' | 'es'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}