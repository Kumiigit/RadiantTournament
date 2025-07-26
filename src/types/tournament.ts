export interface Player {
  id: string;
  username: string;
  valorantTracker?: string;
  rank: ValorantRank;
  rr: number; // Rank Rating
  avatar?: string;
  discordTag?: string;
  verified: boolean;
}

export interface ValorantRank {
  tier: string;
  division: number;
  tierName: string;
  color: string;
  icon: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  captain: string;
  avatar?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
  score: {
    team1: number;
    team2: number;
  };
  status: 'upcoming' | 'live' | 'completed';
  scheduledAt?: Date;
  maps: string[];
  streamUrl?: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  game: string;
  format: 'single-elimination' | 'double-elimination' | 'round-robin';
  maxTeams: number;
  teamSize: number;
  prizePool?: string;
  entryFee?: number;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  status: 'upcoming' | 'registration' | 'ongoing' | 'completed';
  organizer: string;
  rules: string;
  requirements: {
    minRank?: string;
    maxRank?: string;
    region: string;
  };
  teams: Team[];
  matches: Match[];
  bracket: any;
  featured: boolean;
  bannerImage?: string;
  sponsors?: string[];
  socials?: Record<string, string>;
}