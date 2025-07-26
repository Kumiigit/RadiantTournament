import { Player, ValorantRank } from '../types/tournament';

// Real Valorant rank data with accurate colors and icons
export const valorantRanks: ValorantRank[] = [
  { tier: 'Unranked', division: 0, tierName: 'Unranked', color: '#9CA3AF', icon: '❓' },
  { tier: 'Iron', division: 1, tierName: 'Iron 1', color: '#4A4A4A', icon: '⚫' },
  { tier: 'Iron', division: 2, tierName: 'Iron 2', color: '#4A4A4A', icon: '⚫' },
  { tier: 'Iron', division: 3, tierName: 'Iron 3', color: '#4A4A4A', icon: '⚫' },
  { tier: 'Bronze', division: 1, tierName: 'Bronze 1', color: '#CD7F32', icon: '🟤' },
  { tier: 'Bronze', division: 2, tierName: 'Bronze 2', color: '#CD7F32', icon: '🟤' },
  { tier: 'Bronze', division: 3, tierName: 'Bronze 3', color: '#CD7F32', icon: '🟤' },
  { tier: 'Silver', division: 1, tierName: 'Silver 1', color: '#C0C0C0', icon: '⚪' },
  { tier: 'Silver', division: 2, tierName: 'Silver 2', color: '#C0C0C0', icon: '⚪' },
  { tier: 'Silver', division: 3, tierName: 'Silver 3', color: '#C0C0C0', icon: '⚪' },
  { tier: 'Gold', division: 1, tierName: 'Gold 1', color: '#FFD700', icon: '🟡' },
  { tier: 'Gold', division: 2, tierName: 'Gold 2', color: '#FFD700', icon: '🟡' },
  { tier: 'Gold', division: 3, tierName: 'Gold 3', color: '#FFD700', icon: '🟡' },
  { tier: 'Platinum', division: 1, tierName: 'Platinum 1', color: '#00CED1', icon: '🔷' },
  { tier: 'Platinum', division: 2, tierName: 'Platinum 2', color: '#00CED1', icon: '🔷' },
  { tier: 'Platinum', division: 3, tierName: 'Platinum 3', color: '#00CED1', icon: '🔷' },
  { tier: 'Diamond', division: 1, tierName: 'Diamond 1', color: '#B57EDC', icon: '💎' },
  { tier: 'Diamond', division: 2, tierName: 'Diamond 2', color: '#B57EDC', icon: '💎' },
  { tier: 'Diamond', division: 3, tierName: 'Diamond 3', color: '#B57EDC', icon: '💎' },
  { tier: 'Ascendant', division: 1, tierName: 'Ascendant 1', color: '#00FF7F', icon: '🟢' },
  { tier: 'Ascendant', division: 2, tierName: 'Ascendant 2', color: '#00FF7F', icon: '🟢' },
  { tier: 'Ascendant', division: 3, tierName: 'Ascendant 3', color: '#00FF7F', icon: '🟢' },
  { tier: 'Immortal', division: 1, tierName: 'Immortal 1', color: '#FF1744', icon: '🔴' },
  { tier: 'Immortal', division: 2, tierName: 'Immortal 2', color: '#FF1744', icon: '🔴' },
  { tier: 'Immortal', division: 3, tierName: 'Immortal 3', color: '#FF1744', icon: '🔴' },
  { tier: 'Radiant', division: 1, tierName: 'Radiant', color: '#FFFF00', icon: '⭐' },
];

export class ValorantService {
  static async fetchPlayerData(trackerUrl: string): Promise<Player | null> {
    try {
      // Extract username from tracker URL
      const usernameMatch = trackerUrl.match(/profile\/riot\/([^\/\?]+)/);
      if (!usernameMatch) {
        throw new Error('Invalid tracker URL format');
      }

      let username = decodeURIComponent(usernameMatch[1]);
      username = username.replace('%23', '#');

      // In a real implementation, you would make an API call to tracker.gg or Riot API
      // For now, we'll simulate realistic data based on the username
      const simulatedData = this.simulatePlayerData(username, trackerUrl);
      
      return simulatedData;
    } catch (error) {
      console.error('Error fetching player data:', error);
      return null;
    }
  }

  private static simulatePlayerData(username: string, trackerUrl: string): Player {
    // Create a deterministic but seemingly random rank based on username
    const hash = this.hashString(username);
    
    // Weight the distribution towards more common ranks (Silver-Diamond)
    const weights = [
      1,  // Unranked
      2, 2, 2,  // Iron 1-3
      4, 4, 4,  // Bronze 1-3
      8, 8, 8,  // Silver 1-3 (most common)
      6, 6, 6,  // Gold 1-3
      4, 4, 4,  // Platinum 1-3
      3, 3, 3,  // Diamond 1-3
      2, 2, 2,  // Ascendant 1-3
      1, 1, 1,  // Immortal 1-3
      0.5       // Radiant (very rare)
    ];
    
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = (hash % 1000) / 1000 * totalWeight;
    
    let rankIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        rankIndex = i;
        break;
      }
    }
    
    const rank = valorantRanks[rankIndex];
    
    // Generate RR based on rank (higher ranks have higher RR ranges)
    let rrRange = [0, 100];
    if (rank.tier === 'Immortal' || rank.tier === 'Radiant') {
      rrRange = [0, 500]; // Immortal and Radiant can have higher RR
    }
    
    const rr = Math.floor((hash * 13) % (rrRange[1] - rrRange[0])) + rrRange[0];

    return {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      valorantTracker: trackerUrl,
      rank,
      rr,
      verified: true,
    };
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  static validateTrackerUrl(url: string): boolean {
    const trackerPattern = /^https?:\/\/(www\.)?tracker\.gg\/valorant\/profile\/riot\/[^\/\?]+/;
    return trackerPattern.test(url);
  }

  static extractUsernameFromUrl(url: string): string | null {
    const match = url.match(/profile\/riot\/([^\/\?]+)/);
    if (match) {
      let username = decodeURIComponent(match[1]);
      return username.replace('%23', '#');
    }
    return null;
  }
}