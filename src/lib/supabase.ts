import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && 
                           supabaseAnonKey !== 'placeholder-key' &&
                           supabaseUrl.includes('supabase.co');

export let supabase: any;

if (hasValidCredentials) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
    supabase = null;
  }
} else {
  console.warn('Supabase credentials not configured. Running in demo mode.');
  supabase = null;
}


// Database types
export interface DatabaseTournament {
  id: string;
  name: string;
  description: string;
  game: string;
  format: string;
  stages: number;
  max_teams: number;
  team_size: number;
  prize_pool?: string;
  entry_fee?: number;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  status: string;
  organizer: string;
  rules: string;
  min_rank?: string;
  max_rank?: string;
  region: string;
  featured: boolean;
  banner_image?: string;
  sponsors?: string[];
  socials?: Record<string, string>;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface DatabaseTeam {
  id: string;
  tournament_id: string;
  name: string;
  captain_id: string;
  avatar?: string;
  created_at: string;
}

export interface DatabasePlayer {
  id: string;
  team_id: string;
  username: string;
  valorant_tracker?: string;
  rank_tier: string;
  rank_division: number;
  rank_name: string;
  rank_color: string;
  rank_icon: string;
  rr: number;
  avatar?: string;
  discord_tag?: string;
  verified: boolean;
  is_captain: boolean;
  created_at: string;
}