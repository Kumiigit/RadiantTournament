import { supabase } from '../lib/supabase';
import { UserProfile, AuthUser, LoginCredentials, SignupData } from '../types/auth';

export class AuthService {
  static async signUp(data: SignupData): Promise<AuthUser> {
    if (!supabase) {
      // Create mock user when Supabase is not configured
      const mockUser: AuthUser = {
        id: `mock_${Date.now()}`,
        email: data.email,
        profile: {
          id: `mock_${Date.now()}`,
          username: data.username,
          discord_id: data.discord_id || null,
          discord_username: data.discord_username || null,
          valorant_tracker_url: data.valorant_tracker_url || null,
          valorant_username: data.valorant_username || null,
          rank_tier: null,
          rank_division: null,
          rank_name: null,
          rank_color: null,
          rank_icon: null,
          rr: 0,
          avatar_url: null,
          is_admin: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
      return mockUser;
    }
    
    const { email, password, username, ...profileData } = data;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          ...profileData,
        },
      },
    });

    if (authError) {
      throw new Error(`Signup failed: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Signup failed: No user returned');
    }

    // Get the created profile
    const profile = await this.getProfile(authData.user.id);
    
    return {
      id: authData.user.id,
      email: authData.user.email,
      profile,
    };
  }

  static async signIn(credentials: LoginCredentials): Promise<AuthUser> {
    if (!supabase) {
      // Create mock user when Supabase is not configured
      const mockUser: AuthUser = {
        id: `mock_${Date.now()}`,
        email: credentials.email,
        profile: {
          id: `mock_${Date.now()}`,
          username: credentials.email.split('@')[0],
          discord_id: null,
          discord_username: null,
          valorant_tracker_url: null,
          valorant_username: null,
          rank_tier: null,
          rank_division: null,
          rank_name: null,
          rank_color: null,
          rank_icon: null,
          rr: 0,
          avatar_url: null,
          is_admin: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
      return mockUser;
    }
    
    const { email, password } = credentials;
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(`Login failed: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Login failed: No user returned');
    }

    const profile = await this.getProfile(authData.user.id);
    
    return {
      id: authData.user.id,
      email: authData.user.email,
      profile,
    };
  }

  static async adminSignIn(username: string, password: string): Promise<AuthUser> {
    if (username !== 'MyAdmin' || password !== 'MyAdmin') {
      throw new Error('Invalid admin credentials');
    }

    if (!supabase) {
      // Return mock admin user when Supabase is not configured
      return {
        id: 'admin-mock-id',
        email: 'admin@radianttournaments.com',
        profile: {
          id: 'admin-mock-id',
          username: 'MyAdmin',
          discord_id: null,
          discord_username: null,
          valorant_tracker_url: null,
          valorant_username: null,
          rank_tier: null,
          rank_division: null,
          rank_name: null,
          rank_color: null,
          rank_icon: null,
          rr: 0,
          avatar_url: null,
          is_admin: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
    }

    // Create or get admin user
    const adminEmail = 'admin@radianttournaments.com';
    
    try {
      // Try to sign in first
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: 'MyAdmin',
      });

      if (!error && authData.user) {
        const profile = await this.getProfile(authData.user.id);
        return {
          id: authData.user.id,
          email: authData.user.email,
          profile,
        };
      }
    } catch (error) {
      // Admin user doesn't exist, create it
    }

    // Create admin user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: 'MyAdmin',
      options: {
        data: {
          username: 'MyAdmin',
          is_admin: true,
        },
      },
    });

    if (signUpError) {
      throw new Error(`Admin signup failed: ${signUpError.message}`);
    }

    if (!authData.user) {
      throw new Error('Admin signup failed: No user returned');
    }

    // Update profile to be admin
    await this.updateProfile(authData.user.id, { is_admin: true });
    
    const profile = await this.getProfile(authData.user.id);
    
    return {
      id: authData.user.id,
      email: authData.user.email,
      profile,
    };
  }

  static async signOut(): Promise<void> {
    if (!supabase) {
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    if (!supabase) {
      return null;
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      // Clear any invalid session
      await supabase.auth.signOut();
      return null;
    }

    const profile = await this.getProfile(user.id);
    
    return {
      id: user.id,
      email: user.email,
      profile,
    };
  }

  static async getProfile(userId: string): Promise<UserProfile | null> {
    if (!supabase) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!supabase) {
      throw new Error('Database not configured. Please set up Supabase credentials.');
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Profile update failed: ${error.message}`);
    }

    return data;
  }

  static async linkDiscord(userId: string, discordData: { id: string; username: string; avatar?: string }): Promise<UserProfile> {
    return this.updateProfile(userId, {
      discord_id: discordData.id,
      discord_username: discordData.username,
      avatar_url: discordData.avatar,
    });
  }

  static async linkValorantTracker(userId: string, trackerUrl: string, valorantData: any): Promise<UserProfile> {
    return this.updateProfile(userId, {
      valorant_tracker_url: trackerUrl,
      valorant_username: valorantData.username,
      rank_tier: valorantData.rank.tier,
      rank_division: valorantData.rank.division,
      rank_name: valorantData.rank.tierName,
      rank_color: valorantData.rank.color,
      rank_icon: valorantData.rank.icon,
      rr: valorantData.rr,
    });
  }

  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!supabase) {
      callback(null);
      return { data: { subscription: null } };
    }
    
    return supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle session expiry
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (!session) {
          callback(null);
          return;
        }
      }
      
      if (session?.user) {
        const profile = await this.getProfile(session.user.id);
        callback({
          id: session.user.id,
          email: session.user.email,
          profile,
        });
      } else {
        callback(null);
      }
    });
  }
  
  static async refreshSession(): Promise<boolean> {
    if (!supabase) {
      return false;
    }
    
    try {
      const { data, error } = await supabase.auth.refreshSession();
      return !error && !!data.session;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  }
  
  static async validateSession(): Promise<boolean> {
    if (!supabase) {
      return false;
    }
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return !error && !!user;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }
}