import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface DatabaseLevel {
  id: number;
  level_data: string; // JSON string of number[]
  creator_id: string;
  play_count: number;
  completions: number;
  verified: boolean;
  created_at: string;
}

export interface DatabasePlayer {
  id: string;
  username: string;
  email?: string;
  levels_completed: number;
  created_at: string;
}

export interface DatabaseLevelCompletion {
  id: number;
  player_id: string;
  level_id: number;
  completed_at: string;
}

export type Database = {
  public: {
    Tables: {
      levels: {
        Row: DatabaseLevel;
        Insert: Omit<DatabaseLevel, 'id' | 'created_at'>;
        Update: Partial<Omit<DatabaseLevel, 'id' | 'created_at'>>;
      };
      players: {
        Row: DatabasePlayer;
        Insert: Omit<DatabasePlayer, 'created_at'>;
        Update: Partial<Omit<DatabasePlayer, 'id' | 'created_at'>>;
      };
      level_completions: {
        Row: DatabaseLevelCompletion;
        Insert: Omit<DatabaseLevelCompletion, 'id' | 'completed_at'>;
        Update: Partial<Omit<DatabaseLevelCompletion, 'id' | 'completed_at'>>;
      };
    };
  };
};