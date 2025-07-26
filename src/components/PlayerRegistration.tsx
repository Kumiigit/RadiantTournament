import React, { useState } from 'react';
import { User, ExternalLink, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { Tournament, Player, Team } from '../types/tournament';
import { ValorantService } from '../services/valorantService';

interface PlayerRegistrationProps {
  tournament: Tournament;
  onRegister: (team: Omit<Team, 'id'>) => void;
  onClose: () => void;
}

export default function PlayerRegistration({ tournament, onRegister, onClose }: PlayerRegistrationProps) {
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState({
    username: '',
    valorantTracker: '',
    discordTag: '',
  });
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerifyPlayer = async () => {
    if (!currentPlayer.valorantTracker) {
      setErrorMessage('Please enter a Valorant tracker URL');
      setVerificationStatus('error');
      return;
    }
    
    if (!ValorantService.validateTrackerUrl(currentPlayer.valorantTracker)) {
      setErrorMessage('Please enter a valid tracker.gg URL (e.g., https://tracker.gg/valorant/profile/riot/username%23tag)');
      setVerificationStatus('error');
      return;
    }

    setVerificationStatus('loading');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const playerData = await ValorantService.fetchPlayerData(currentPlayer.valorantTracker);
      
      if (!playerData) {
        setErrorMessage('Invalid Valorant tracker URL or player not found');
        setVerificationStatus('error');
        return;
      }

      // Check rank requirements
      if (tournament.requirements.minRank || tournament.requirements.maxRank) {
        // This would be a more sophisticated rank comparison in a real app
        const minRankMet = !tournament.requirements.minRank || true; // Simplified for demo
        const maxRankMet = !tournament.requirements.maxRank || true; // Simplified for demo
        
        if (!minRankMet || !maxRankMet) {
          setErrorMessage(`Player rank ${playerData.rank.tierName} doesn't meet tournament requirements`);
          setVerificationStatus('error');
          return;
        }
      }

      const newPlayer: Player = {
        ...playerData,
        discordTag: currentPlayer.discordTag,
      };

      setPlayers(prev => [...prev, newPlayer]);
      setCurrentPlayer({ username: '', valorantTracker: '', discordTag: '' });
      setVerificationStatus('success');
      setErrorMessage('');
      
      // Reset status after a moment
      setTimeout(() => setVerificationStatus('idle'), 2000);
    } catch (error) {
      setErrorMessage('Failed to verify player. Please try again.');
      setVerificationStatus('error');
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const handleSubmitRegistration = () => {
    if (!teamName.trim()) {
      setErrorMessage('Please enter a team name');
      return;
    }

    if (players.length !== tournament.teamSize) {
      setErrorMessage(`Team must have exactly ${tournament.teamSize} players`);
      return;
    }

    const team: Omit<Team, 'id'> = {
      name: teamName,
      players,
      captain: players[0].id,
    };

    onRegister(team);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Register for {tournament.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-400 mt-2">Team size: {tournament.teamSize} players</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
              placeholder="Enter your team name"
            />
          </div>

          {/* Current Team */}
          {players.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Current Team ({players.length}/{tournament.teamSize})
              </h3>
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div key={player.id} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{player.username}</span>
                          {index === 0 && (
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                              CAPTAIN
                            </span>
                          )}
                          {player.valorantTracker && (
                            <a
                              href={player.valorantTracker}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:text-primary-300 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span style={{ color: player.rank.color }}>
                            {player.rank.icon} {player.rank.tierName}
                          </span>
                          <span>•</span>
                          <span>{player.rr} RR</span>
                          {player.discordTag && (
                            <>
                              <span>•</span>
                              <span>{player.discordTag}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePlayer(player.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Player */}
          {players.length < tournament.teamSize && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Add Player {players.length + 1}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Valorant Tracker URL *
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={currentPlayer.valorantTracker}
                      onChange={(e) => setCurrentPlayer(prev => ({ ...prev, valorantTracker: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none pr-12"
                      placeholder="https://tracker.gg/valorant/profile/riot/username%23tag"
                    />
                    <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Copy the URL from your Valorant tracker.gg profile page
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discord Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={currentPlayer.discordTag}
                    onChange={(e) => setCurrentPlayer(prev => ({ ...prev, discordTag: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                    placeholder="username#1234"
                  />
                </div>

                <button
                  onClick={handleVerifyPlayer}
                  disabled={verificationStatus === 'loading' || !currentPlayer.valorantTracker}
                  className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center"
                >
                  {verificationStatus === 'loading' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying Player...
                    </>
                  ) : verificationStatus === 'success' ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Player Added!
                    </>
                  ) : (
                    'Verify & Add Player'
                  )}
                </button>

                {errorMessage && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Registration */}
          {players.length === tournament.teamSize && (
            <div className="pt-6 border-t border-gray-700">
              <button
                onClick={handleSubmitRegistration}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-medium"
              >
                Complete Registration
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}