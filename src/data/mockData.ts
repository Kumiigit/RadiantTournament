import { Tournament, Player, Team, ValorantRank } from '../types/tournament';

export const valorantRanks: ValorantRank[] = [
  { tier: 'Iron', division: 1, tierName: 'Iron 1', color: '#4A4A4A', icon: '🔩' },
  { tier: 'Iron', division: 2, tierName: 'Iron 2', color: '#4A4A4A', icon: '🔩' },
  { tier: 'Iron', division: 3, tierName: 'Iron 3', color: '#4A4A4A', icon: '🔩' },
  { tier: 'Bronze', division: 1, tierName: 'Bronze 1', color: '#CD7F32', icon: '🥉' },
  { tier: 'Bronze', division: 2, tierName: 'Bronze 2', color: '#CD7F32', icon: '🥉' },
  { tier: 'Bronze', division: 3, tierName: 'Bronze 3', color: '#CD7F32', icon: '🥉' },
  { tier: 'Silver', division: 1, tierName: 'Silver 1', color: '#C0C0C0', icon: '🥈' },
  { tier: 'Silver', division: 2, tierName: 'Silver 2', color: '#C0C0C0', icon: '🥈' },
  { tier: 'Silver', division: 3, tierName: 'Silver 3', color: '#C0C0C0', icon: '🥈' },
  { tier: 'Gold', division: 1, tierName: 'Gold 1', color: '#FFD700', icon: '🥇' },
  { tier: 'Gold', division: 2, tierName: 'Gold 2', color: '#FFD700', icon: '🥇' },
  { tier: 'Gold', division: 3, tierName: 'Gold 3', color: '#FFD700', icon: '🥇' },
  { tier: 'Platinum', division: 1, tierName: 'Platinum 1', color: '#00CED1', icon: '💎' },
  { tier: 'Platinum', division: 2, tierName: 'Platinum 2', color: '#00CED1', icon: '💎' },
  { tier: 'Platinum', division: 3, tierName: 'Platinum 3', color: '#00CED1', icon: '💎' },
  { tier: 'Diamond', division: 1, tierName: 'Diamond 1', color: '#B57EDC', icon: '💎' },
  { tier: 'Diamond', division: 2, tierName: 'Diamond 2', color: '#B57EDC', icon: '💎' },
  { tier: 'Diamond', division: 3, tierName: 'Diamond 3', color: '#B57EDC', icon: '💎' },
  { tier: 'Ascendant', division: 1, tierName: 'Ascendant 1', color: '#00FF7F', icon: '⬆️' },
  { tier: 'Ascendant', division: 2, tierName: 'Ascendant 2', color: '#00FF7F', icon: '⬆️' },
  { tier: 'Ascendant', division: 3, tierName: 'Ascendant 3', color: '#00FF7F', icon: '⬆️' },
  { tier: 'Immortal', division: 1, tierName: 'Immortal 1', color: '#FF1744', icon: '🔥' },
  { tier: 'Immortal', division: 2, tierName: 'Immortal 2', color: '#FF1744', icon: '🔥' },
  { tier: 'Immortal', division: 3, tierName: 'Immortal 3', color: '#FF1744', icon: '🔥' },
  { tier: 'Radiant', division: 1, tierName: 'Radiant', color: '#FFFF00', icon: '⚡' },
];

// Mock function to simulate Valorant tracker API
export function parseValorantTracker(url: string): Player | null {
  // Simulate parsing a tracker.gg URL
  const usernameMatch = url.match(/profile\/riot\/([^\/]+)/);
  if (!usernameMatch) return null;

  const username = usernameMatch[1].replace('%23', '#');
  
  // Mock rank data based on username for demo
  const mockRankIndex = Math.floor(Math.random() * valorantRanks.length);
  const rank = valorantRanks[mockRankIndex];
  
  return {
    id: `player_${Date.now()}`,
    username,
    valorantTracker: url,
    rank,
    rr: Math.floor(Math.random() * 100),
    verified: true,
  };
}

export const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Valorant Champions Cup',
    description: 'Elite tournament for high-ranked players only. Prove your skills against the best!',
    game: 'Valorant',
    format: 'single-elimination',
    maxTeams: 16,
    teamSize: 5,
    prizePool: '$5,000',
    entryFee: 25,
    startDate: new Date('2025-02-15T18:00:00'),
    endDate: new Date('2025-02-16T22:00:00'),
    registrationDeadline: new Date('2025-02-14T23:59:59'),
    status: 'registration',
    organizer: 'ValorantPro',
    rules: 'Standard competitive rules apply. No cheating, toxicity, or account sharing.',
    requirements: {
      minRank: 'Diamond 1',
      region: 'NA',
    },
    teams: [],
    matches: [],
    bracket: null,
    featured: true,
    bannerImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
  },
  {
    id: '2',
    name: 'Rising Stars Tournament',
    description: 'Tournament for up-and-coming players. Bronze to Gold ranks welcome!',
    game: 'Valorant',
    format: 'double-elimination',
    maxTeams: 32,
    teamSize: 5,
    prizePool: '$1,500',
    startDate: new Date('2025-02-20T19:00:00'),
    endDate: new Date('2025-02-23T21:00:00'),
    registrationDeadline: new Date('2025-02-19T23:59:59'),
    status: 'upcoming',
    organizer: 'RisingStar Gaming',
    rules: 'Fair play tournament for developing players.',
    requirements: {
      maxRank: 'Gold 3',
      region: 'EU',
    },
    teams: [],
    matches: [],
    bracket: null,
    featured: false,
  },
  {
    id: '3',
    name: 'Weekend Warriors',
    description: 'Casual weekend tournament for all skill levels. Fun and competitive!',
    game: 'Valorant',
    format: 'round-robin',
    maxTeams: 8,
    teamSize: 5,
    prizePool: '$500',
    startDate: new Date('2025-02-22T14:00:00'),
    endDate: new Date('2025-02-23T18:00:00'),
    registrationDeadline: new Date('2025-02-21T23:59:59'),
    status: 'registration',
    organizer: 'Weekend Gaming',
    rules: 'Relaxed tournament atmosphere with standard competitive rules.',
    requirements: {
      region: 'NA',
    },
    teams: [],
    matches: [],
    bracket: null,
    featured: false,
  },
];