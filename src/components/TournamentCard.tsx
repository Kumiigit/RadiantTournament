import React from 'react';
import { Calendar, Users, Trophy, MapPin, Clock, Star, Zap, ArrowRight } from 'lucide-react';
import { Tournament } from '../types/tournament';

interface TournamentCardProps {
  tournament: Tournament;
  onJoin: (tournament: Tournament) => void;
  onView: (tournament: Tournament) => void;
}

export default function TournamentCard({ tournament, onJoin, onView }: TournamentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration': return 'status-registration';
      case 'upcoming': return 'status-upcoming';
      case 'ongoing': return 'status-live';
      case 'completed': return 'status-completed';
      default: return 'status-completed';
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
    <div className={`card-hover overflow-hidden group ${tournament.featured ? 'ring-2 ring-primary-500/50 bg-gradient-to-br from-secondary-900 to-secondary-800' : ''}`}>
      {tournament.bannerImage && (
        <div className="h-40 gradient-primary relative overflow-hidden">
          <img
            src={tournament.bannerImage}
            alt={tournament.name}
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-transparent to-transparent" />
          {tournament.featured && (
            <div className="absolute top-4 right-4 bg-warning-500 text-secondary-950 px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 shadow-medium">
              <Star className="h-3 w-3" />
              <span>FEATURED</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <div className={`${getStatusColor(tournament.status)} shadow-medium`}>
              {getStatusText(tournament.status)}
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors leading-tight">
            {tournament.name}
          </h3>
          {!tournament.bannerImage && (
            <div className={`${getStatusColor(tournament.status)} shadow-soft`}>
              {getStatusText(tournament.status)}
            </div>
          )}
        </div>
        
        <p className="text-secondary-300 text-sm mb-5 line-clamp-2 leading-relaxed">{tournament.description}</p>
        
        {/* Show registered teams */}
        {tournament.teams.length > 0 && (
          <div className="mb-5 p-3 bg-secondary-800 rounded-xl border border-secondary-700">
            <div className="text-xs text-secondary-400 mb-2 font-medium">Registered Teams</div>
            <div className="flex flex-wrap gap-1">
              {tournament.teams.slice(0, 3).map(team => (
                <span key={team.id} className="badge-primary">
                  {team.name}
                </span>
              ))}
              {tournament.teams.length > 3 && (
                <span className="text-xs text-secondary-400 font-medium">+{tournament.teams.length - 3} more</span>
              )}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-secondary-400">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{tournament.teams.length}/{tournament.maxTeams} teams</span>
          </div>
          <div className="flex items-center space-x-2 text-secondary-400">
            <div className="h-4 w-4 flex items-center justify-center bg-secondary-700 rounded">
              <span className="text-xs font-bold text-secondary-300">{tournament.stages}</span>
            </div>
            <span className="text-sm font-medium">{tournament.stages} Stage{tournament.stages > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2 text-secondary-400">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">{tournament.prizePool || 'No prize'}</span>
          </div>
          <div className="flex items-center space-x-2 text-secondary-400">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{tournament.requirements.region}</span>
          </div>
        </div>

        {tournament.requirements.minRank && (
          <div className="mb-5 p-3 bg-secondary-800 rounded-xl border border-secondary-700">
            <div className="text-xs text-secondary-400 mb-1 font-medium">Rank Requirements</div>
            <div className="text-sm text-white font-medium">
              {tournament.requirements.minRank}
              {tournament.requirements.maxRank && ` - ${tournament.requirements.maxRank}`}
            </div>
          </div>
        )}
        
        <div className="flex space-x-3">
          <button
            onClick={() => onView(tournament)}
            className="flex-1 btn-secondary group"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>
          {tournament.status === 'registration' && (
            <button
              onClick={() => onJoin(tournament)}
              className="flex-1 btn-primary group"
            >
              <Zap className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              <span>Register Team</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}