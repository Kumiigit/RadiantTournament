import React, { useState } from 'react';
import { Filter, Search, Star, Trophy, Users, Calendar } from 'lucide-react';
import { Tournament } from '../types/tournament';
import TournamentCard from './TournamentCard';

interface TournamentListProps {
  tournaments: Tournament[];
  onJoinTournament: (tournament: Tournament) => void;
  onViewTournament: (tournament: Tournament) => void;
}

export default function TournamentList({ tournaments, onJoinTournament, onViewTournament }: TournamentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tournament.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
    const matchesRegion = regionFilter === 'all' || tournament.requirements.region === regionFilter;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const featuredTournaments = filteredTournaments.filter(t => t.featured);
  const regularTournaments = filteredTournaments.filter(t => !t.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Professional <span className="text-gradient">Valorant</span> Tournaments
          </h1>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto leading-relaxed">
            Compete in high-quality tournaments with advanced bracket systems, real-time statistics, and professional-grade tournament management.
          </p>
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center p-6">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{tournaments.length}</div>
            <div className="text-sm text-secondary-400">Active Tournaments</div>
          </div>
          <div className="card text-center p-6">
            <div className="w-12 h-12 bg-success-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {tournaments.reduce((acc, t) => acc + t.teams.length, 0)}
            </div>
            <div className="text-sm text-secondary-400">Registered Teams</div>
          </div>
          <div className="card text-center p-6">
            <div className="w-12 h-12 bg-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{featuredTournaments.length}</div>
            <div className="text-sm text-secondary-400">Featured Events</div>
          </div>
          <div className="card text-center p-6">
            <div className="w-12 h-12 bg-error-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {tournaments.filter(t => t.status === 'ongoing').length}
            </div>
            <div className="text-sm text-secondary-400">Live Now</div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="registration">Registration Open</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Live</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="select min-w-[140px]"
            >
              <option value="all">All Regions</option>
              <option value="NA">North America</option>
              <option value="EU">Europe</option>
              <option value="ASIA">Asia</option>
              <option value="OCE">Oceania</option>
            </select>
          </div>
        </div>
        </div>
      </div>

      {featuredTournaments.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Star className="h-6 w-6 text-warning-500 mr-3" />
            <span className="text-gradient">
              Featured Tournaments
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredTournaments.map(tournament => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onJoin={onJoinTournament}
                onView={onViewTournament}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">All Tournaments</h2>
        {regularTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {regularTournaments.map(tournament => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onJoin={onJoinTournament}
                onView={onViewTournament}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <div className="w-16 h-16 bg-secondary-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-secondary-400" />
            </div>
            <div className="text-secondary-300 text-lg font-medium mb-2">No tournaments found</div>
            <div className="text-secondary-400 text-sm">Try adjusting your filters or search query</div>
          </div>
        )}
      </div>
    </div>
  );
}