import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jhgkshjqgagxfllgvhco.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZ2tzaGpxZ2FneGZsbGd2aGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMTM0NjAsImV4cCI6MjA3NDY4OTQ2MH0.v-w_WlZnzX690On8tBZB7pQCZ6i-I6jR6gtbtL-25cM"

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