import { supabase, DatabaseTournament, DatabaseTeam, DatabasePlayer } from '../lib/supabase';
import { Tournament, Team, Player } from '../types/tournament';

export class TournamentService {
  static async createTournament(tournament: Omit<Tournament, 'id' | 'teams' | 'matches' | 'bracket'> & { user_id?: string }): Promise<Tournament> {
    if (!supabase) {
      // Create mock tournament when Supabase is not configured
      const mockTournament: Tournament = {
        id: `mock_${Date.now()}`,
        ...tournament,
        teams: [],
        matches: [],
        bracket: null,
      };
      return mockTournament;
    }
    
    try {
      const tournamentData: Omit<DatabaseTournament, 'id' | 'created_at' | 'updated_at'> = {
        name: tournament.name,
        description: tournament.description,
        game: tournament.game,
        format: tournament.format,
        max_teams: tournament.maxTeams,
        team_size: tournament.teamSize,
        prize_pool: tournament.prizePool,
        entry_fee: tournament.entryFee,
        start_date: tournament.startDate.toISOString(),
        end_date: tournament.endDate.toISOString(),
        registration_deadline: tournament.registrationDeadline.toISOString(),
        status: tournament.status,
        organizer: tournament.organizer,
        rules: tournament.rules,
        min_rank: tournament.requirements.minRank,
        max_rank: tournament.requirements.maxRank,
        region: tournament.requirements.region,
        featured: tournament.featured,
        banner_image: tournament.bannerImage,
        sponsors: tournament.sponsors,
        socials: tournament.socials,
        user_id: tournament.user_id,
      };

      const { data, error } = await supabase
        .from('tournaments')
        .insert([tournamentData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create tournament: ${error.message}`);
      }

      return this.mapDatabaseToTournament(data);
    } catch (error) {
      // If database operation fails, create mock tournament as fallback
      console.warn('Database operation failed, creating mock tournament:', error);
      const mockTournament: Tournament = {
        id: `mock_${Date.now()}`,
        ...tournament,
        teams: [],
        matches: [],
        bracket: null,
      };
      return mockTournament;
    }
  }

  static async getTournaments(): Promise<Tournament[]> {
    if (!supabase) {
      // Return mock tournaments when Supabase is not configured
      return [
        {
          id: 'mock-1',
          name: 'Demo Tournament',
          description: 'This is a demo tournament. Set up Supabase to create real tournaments.',
          game: 'Valorant',
          format: 'single-elimination',
          maxTeams: 16,
          teamSize: 5,
          prizePool: '$1,000',
          entryFee: 0,
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          status: 'registration',
          organizer: 'Demo Organizer',
          rules: 'Standard competitive rules apply.',
          requirements: {
            region: 'NA',
          },
          teams: [],
          matches: [],
          bracket: null,
          featured: true,
          bannerImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
          sponsors: ['Demo Sponsor'],
          socials: { twitter: 'https://twitter.com/demo' },
        },
      ];
    }
    
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        teams:tournament_teams(
          *,
          players:team_players(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch tournaments: ${error.message}`);
    }

    return data.map(this.mapDatabaseToTournament);
  }

  static async registerTeam(tournamentId: string, team: Omit<Team, 'id'>): Promise<Team> {
    if (!supabase) {
      throw new Error('Database not configured. Please set up Supabase credentials.');
    }
    
    // Insert team
    const { data: teamData, error: teamError } = await supabase
      .from('tournament_teams')
      .insert([{
        tournament_id: tournamentId,
        name: team.name,
        captain_id: team.captain,
        avatar: team.avatar,
      }])
      .select()
      .single();

    if (teamError) {
      throw new Error(`Failed to register team: ${teamError.message}`);
    }

    // Insert players
    const playersData = team.players.map(player => ({
      team_id: teamData.id,
      username: player.username,
      valorant_tracker: player.valorantTracker,
      rank_tier: player.rank.tier,
      rank_division: player.rank.division,
      rank_name: player.rank.tierName,
      rank_color: player.rank.color,
      rank_icon: player.rank.icon,
      rr: player.rr,
      avatar: player.avatar,
      discord_tag: player.discordTag,
      verified: player.verified,
      is_captain: player.id === team.captain,
    }));

    const { error: playersError } = await supabase
      .from('team_players')
      .insert(playersData);

    if (playersError) {
      throw new Error(`Failed to register players: ${playersError.message}`);
    }

    return {
      ...team,
      id: teamData.id,
    };
  }

  static async updateTournament(tournament: Tournament): Promise<Tournament> {
    if (!supabase) {
      throw new Error('Database not configured. Please set up Supabase credentials.');
    }
    
    const tournamentData: Partial<DatabaseTournament> = {
      name: tournament.name,
      description: tournament.description,
      start_date: tournament.startDate.toISOString(),
      end_date: tournament.endDate.toISOString(),
      registration_deadline: tournament.registrationDeadline.toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('tournaments')
      .update(tournamentData)
      .eq('id', tournament.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update tournament: ${error.message}`);
    }

    return this.mapDatabaseToTournament(data);
  }

  static async deleteTournament(tournamentId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Database not configured. Please set up Supabase credentials.');
    }
    
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', tournamentId);

    if (error) {
      throw new Error(`Failed to delete tournament: ${error.message}`);
    }
  }

  private static mapDatabaseToTournament(data: any): Tournament {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      game: data.game,
      format: data.format,
      maxTeams: data.max_teams,
      teamSize: data.team_size,
      prizePool: data.prize_pool,
      entryFee: data.entry_fee,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      registrationDeadline: new Date(data.registration_deadline),
      status: data.status,
      organizer: data.organizer,
      rules: data.rules,
      requirements: {
        minRank: data.min_rank,
        maxRank: data.max_rank,
        region: data.region,
      },
      teams: data.teams?.map((team: any) => ({
        id: team.id,
        name: team.name,
        captain: team.captain_id,
        avatar: team.avatar,
        players: team.players?.map((player: any) => ({
          id: player.id,
          username: player.username,
          valorantTracker: player.valorant_tracker,
          rank: {
            tier: player.rank_tier,
            division: player.rank_division,
            tierName: player.rank_name,
            color: player.rank_color,
            icon: player.rank_icon,
          },
          rr: player.rr,
          avatar: player.avatar,
          discordTag: player.discord_tag,
          verified: player.verified,
        })) || [],
      })) || [],
      matches: [],
      bracket: null,
      featured: data.featured,
      bannerImage: data.banner_image,
      sponsors: data.sponsors || [],
      socials: data.socials || {},
    };
  }
}