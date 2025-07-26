import React from 'react';
import { Calendar, Users, Trophy, MapPin, Clock } from 'lucide-react';
import { Tournament } from '../types/tournament';

interface TournamentCardProps {
  tournament: Tournament;
  onJoin: (tournament: Tournament) => void;
  onView: (tournament: Tournament) => void;
}

export default function TournamentCard({ tournament, onJoin, onView }: TournamentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration': return 'bg-green-500';
      case 'upcoming': return 'bg-yellow-500';
      case 'ongoing': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registration': return 'Registration Open';
      case 'upcoming': return 'Starting Soon';
      case 'ongoing': return 'Live';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-primary-400 transition-all duration-300 transform hover:scale-105 ${tournament.featured ? 'ring-2 ring-primary-400 ring-opacity-50' : ''}`}>
      {tournament.bannerImage && (
        <div className="h-32 bg-gradient-to-r from-primary-600 to-purple-600 relative overflow-hidden">
          <img
            src={tournament.bannerImage}
            alt={tournament.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          {tournament.featured && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
              FEATURED
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {tournament.name}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(tournament.status)}`}>
            {getStatusText(tournament.status)}
          </span>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{tournament.description}</p>
        
        {/* Show registered teams */}
        {tournament.teams.length > 0 && (
          <div className="mb-4 p-3 bg-gray-900 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">Registered Teams</div>
            <div className="flex flex-wrap gap-1">
              {tournament.teams.slice(0, 3).map(team => (
                <span key={team.id} className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                  {team.name}
                </span>
              ))}
              {tournament.teams.length > 3 && (
                <span className="text-xs text-gray-400">+{tournament.teams.length - 3} more</span>
              )}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Users className="h-4 w-4" />
            <span className="text-sm">{tournament.teams.length}/{tournament.maxTeams} teams</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="h-4 w-4 flex items-center justify-center">
              <span className="text-xs font-bold">{tournament.stages}</span>
            </div>
            <span className="text-sm">{tournament.stages} Stage{tournament.stages > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Trophy className="h-4 w-4" />
            <span className="text-sm">{tournament.prizePool || 'No prize'}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{tournament.requirements.region}</span>
          </div>
        </div>

        {tournament.requirements.minRank && (
          <div className="mb-4 p-2 bg-gray-900 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Rank Requirements</div>
            <div className="text-sm text-white">
              {tournament.requirements.minRank}
              {tournament.requirements.maxRank && ` - ${tournament.requirements.maxRank}`}
            </div>
          </div>
        )}
        
        <div className="flex space-x-3">
          <button
            onClick={() => onView(tournament)}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            View Details
          </button>
          {tournament.status === 'registration' && (
            <button
              onClick={() => onJoin(tournament)}
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Register Team
            </button>
          )}
        </div>
      </div>
    </div>
  );
}