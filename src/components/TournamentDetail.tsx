import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Trophy, MapPin, Clock, Share2, Star, ExternalLink, Edit, Trash2, Save, X } from 'lucide-react';
import { Tournament } from '../types/tournament';
import { AuthUser } from '../types/auth';

interface TournamentDetailProps {
  tournament: Tournament;
  user: AuthUser | null;
  onBack: () => void;
  onJoin: (tournament: Tournament) => void;
  onUpdate: (tournament: Tournament) => void;
  onDelete: (tournamentId: string) => void;
}

export default function TournamentDetail({ tournament, user, onBack, onJoin, onUpdate, onDelete }: TournamentDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bracket' | 'teams' | 'rules'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: tournament.name,
    description: tournament.description,
    startDate: tournament.startDate.toISOString().slice(0, 16),
    endDate: tournament.endDate.toISOString().slice(0, 16),
    registrationDeadline: tournament.registrationDeadline.toISOString().slice(0, 16),
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

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

  const isAdmin = user?.profile?.is_admin;
  const canEdit = isAdmin;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedTournament: Tournament = {
      ...tournament,
      name: editData.name,
      description: editData.description,
      startDate: new Date(editData.startDate),
      endDate: new Date(editData.endDate),
      registrationDeadline: new Date(editData.registrationDeadline),
    };
    onUpdate(updatedTournament);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: tournament.name,
      description: tournament.description,
      startDate: tournament.startDate.toISOString().slice(0, 16),
      endDate: tournament.endDate.toISOString().slice(0, 16),
      registrationDeadline: tournament.registrationDeadline.toISOString().slice(0, 16),
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      onDelete(tournament.id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bracket', label: 'Bracket' },
    { id: 'teams', label: `Teams (${tournament.teams.length})` },
    { id: 'rules', label: 'Rules' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to tournaments</span>
        </button>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {tournament.bannerImage && (
            <div className="h-48 bg-gradient-to-r from-primary-600 to-purple-600 relative overflow-hidden">
              <img
                src={tournament.bannerImage}
                alt={tournament.name}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              {tournament.featured && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                  <Star className="h-4 w-4 inline mr-1" />
                  FEATURED
                </div>
              )}
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="text-3xl font-bold bg-transparent border-b-2 border-primary-400 text-white placeholder-gray-300 focus:outline-none w-full"
                    />
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="text-lg bg-transparent border border-gray-600 rounded text-gray-300 placeholder-gray-400 focus:border-primary-400 focus:outline-none w-full p-2"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">{tournament.name}</h1>
                    <p className="text-gray-300 text-lg">{tournament.description}</p>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(tournament.status)}`}>
                  {getStatusText(tournament.status)}
                </span>
                {canEdit && (
                  <>
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                          title="Save changes"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                          title="Cancel editing"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleEdit}
                          className="p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                          title="Edit tournament"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleDelete}
                          className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                          title="Delete tournament"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </>
                )}
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-primary-400" />
                </div>
                <div className="text-2xl font-bold text-white">{tournament.teams.length}/{tournament.maxTeams}</div>
                <div className="text-gray-400 text-sm">Teams</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">{tournament.prizePool || 'N/A'}</div>
                <div className="text-gray-400 text-sm">Prize Pool</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {formatDate(tournament.startDate).split(',')[0]}
                </div>
                <div className="text-gray-400 text-sm">Start Date</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{tournament.requirements.region}</div>
                <div className="text-gray-400 text-sm">Region</div>
              </div>
            </div>
            
            {/* Sponsors and Socials */}
            {(tournament.sponsors && tournament.sponsors.length > 0) || (tournament.socials && Object.keys(tournament.socials).length > 0) && (
              <div className="mb-6 p-4 bg-gray-900 rounded-lg">
                {tournament.sponsors && tournament.sponsors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Sponsors</h4>
                    <div className="flex flex-wrap gap-2">
                      {tournament.sponsors.map((sponsor, index) => (
                        <span key={index} className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
                          {sponsor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {tournament.socials && Object.keys(tournament.socials).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Follow Us</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(tournament.socials).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-primary-400 hover:text-primary-300 transition-colors text-sm"
                        >
                          <span className="capitalize">{platform}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tournament.status === 'registration' && (
              <div className="flex justify-center">
                <button
                  onClick={() => onJoin(tournament)}
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors font-medium"
                >
                  Register Team
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-400 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Tournament Details</h3>
                  <div className="space-y-4 text-gray-300">
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="text-white capitalize">{tournament.format.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Size:</span>
                      <span className="text-white">{tournament.teamSize} players</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entry Fee:</span>
                      <span className="text-white">{tournament.entryFee ? `$${tournament.entryFee}` : 'Free'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Organizer:</span>
                      <span className="text-white">{tournament.organizer}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Important Dates</h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <div className="text-white font-medium">Registration Deadline</div>
                      <div className="text-sm">{formatDate(tournament.registrationDeadline)}</div>
                    </div>
                    <div>
                      <div className="text-white font-medium">Tournament Start</div>
                      <div className="text-sm">{formatDate(tournament.startDate)}</div>
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={editData.startDate}
                        onChange={handleInputChange}
                        className="text-sm bg-gray-800 border border-gray-600 rounded text-white focus:border-primary-400 focus:outline-none p-1"
                      />
                    ) : (
                      <div className="text-sm">{formatDate(tournament.startDate)}</div>
                    )}
                    </div>
                    <div>
                      <div className="text-white font-medium">Tournament End</div>
                      <div className="text-sm">{formatDate(tournament.endDate)}</div>
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={editData.endDate}
                        onChange={handleInputChange}
                        className="text-sm bg-gray-800 border border-gray-600 rounded text-white focus:border-primary-400 focus:outline-none p-1"
                      />
                    ) : (
                      <div className="text-sm">{formatDate(tournament.endDate)}</div>
                    )}
                    </div>
                  </div>
                </div>
              </div>

              {(tournament.requirements.minRank || tournament.requirements.maxRank) && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Rank Requirements</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-gray-300">
                      {tournament.requirements.minRank && tournament.requirements.maxRank
                        ? `${tournament.requirements.minRank} - ${tournament.requirements.maxRank}`
                        : tournament.requirements.minRank
                        ? `Minimum: ${tournament.requirements.minRank}`
                        : `Maximum: ${tournament.requirements.maxRank}`
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bracket Tab */}
          {activeTab === 'bracket' && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">Tournament bracket will be available once registration closes</div>
              <div className="text-gray-500 text-sm mt-2">Check back after {formatDate(tournament.registrationDeadline)}</div>
            </div>
          )}

          {/* Teams Tab */}
          {activeTab === 'teams' && (
            <div>
              {tournament.teams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tournament.teams.map(team => (
                    <div key={team.id} className="bg-gray-900 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">{team.name}</h3>
                      <div className="space-y-3">
                        {team.players.map((player, index) => (
                          <div key={player.id} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-white">{player.username}</span>
                                {team.captain === player.id && (
                                  <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                    C
                                  </span>
                                )}
                                {player.valorantTracker && (
                                  <a
                                    href={player.valorantTracker}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-400 hover:text-primary-300 transition-colors"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                              <div className="text-sm" style={{ color: player.rank.color }}>
                                {player.rank.icon} {player.rank.tierName}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">No teams registered yet</div>
                  <div className="text-gray-500 text-sm mt-2">Be the first to register your team!</div>
                </div>
              )}
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Tournament Rules</h3>
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="text-gray-300 whitespace-pre-wrap">{tournament.rules}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}