import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Valorant Tournaments</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-400 focus:outline-none"
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
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-400 focus:outline-none"
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

      {featuredTournaments.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Featured Tournaments
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No tournaments found matching your criteria</div>
            <div className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query</div>
          </div>
        )}
      </div>
    </div>
  );
}