export interface UserProfile {
  id: string;
  username: string;
  discord_id?: string;
  discord_username?: string;
  valorant_tracker_url?: string;
  valorant_username?: string;
  rank_tier?: string;
  rank_division?: number;
  rank_name?: string;
  rank_color?: string;
  rank_icon?: string;
  rr: number;
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  profile?: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  username: string;
  provider?: 'discord' | 'valorant';
  discord_id?: string;
  discord_username?: string;
  valorant_tracker_url?: string;
  valorant_username?: string;
}