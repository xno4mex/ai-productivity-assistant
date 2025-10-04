import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          completed: boolean
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          name: string
          description: string | null
          frequency: 'daily' | 'weekly' | 'monthly'
          target_count: number
          current_streak: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          frequency?: 'daily' | 'weekly' | 'monthly'
          target_count?: number
          current_streak?: number
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          frequency?: 'daily' | 'weekly' | 'monthly'
          target_count?: number
          current_streak?: number
          updated_at?: string
        }
      }
    }
  }
}
