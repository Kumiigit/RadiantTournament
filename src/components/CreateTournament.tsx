import React, { useState } from 'react';
import { Calendar, Users, Trophy, MapPin, FileText, DollarSign, Plus, X, ExternalLink } from 'lucide-react';
import { Tournament } from '../types/tournament';
import { AuthUser } from '../types/auth';

interface CreateTournamentProps {
  onCreateTournament: (tournament: Omit<Tournament, 'id' | 'teams' | 'matches' | 'bracket'>) => void;
  user: AuthUser | null;
  onAuthRequired: () => void;
}

export default function CreateTournament({ onCreateTournament, user, onAuthRequired }: CreateTournamentProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    format: 'single-elimination' as Tournament['format'],
    maxTeams: 16,
    teamSize: 5,
    prizePool: '',
    entryFee: 0,
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    organizer: '',
    rules: '',
    minRank: '',
    maxRank: '',
    region: 'NA',
    bannerImage: '',
    sponsors: [] as string[],
    socials: {} as Record<string, string>,
  });
  
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminSection, setShowAdminSection] = useState(false);
  const [newSponsor, setNewSponsor] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is signed in for featured tournaments
    if (adminPassword === 'MyAdmin' && !user) {
      alert('You must be signed in to create featured tournaments');
      onAuthRequired();
      return;
    }
    
    const isFeatured = adminPassword === 'MyAdmin';
    
    const tournament: Omit<Tournament, 'id' | 'teams' | 'matches' | 'bracket'> = {
      name: formData.name,
      description: formData.description,
      game: 'Valorant',
      format: formData.format,
      maxTeams: formData.maxTeams,
      teamSize: formData.teamSize,
      prizePool: formData.prizePool || undefined,
      entryFee: formData.entryFee || undefined,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      registrationDeadline: new Date(formData.registrationDeadline),
      status: 'upcoming',
      organizer: formData.organizer || user?.profile?.username || 'Anonymous',
      rules: formData.rules,
      requirements: {
        minRank: formData.minRank || undefined,
        maxRank: formData.maxRank || undefined,
        region: formData.region,
      },
      featured: isFeatured,
      bannerImage: formData.bannerImage || undefined,
      sponsors: formData.sponsors,
      socials: formData.socials,
    };

    onCreateTournament(tournament);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };
  
  const addSponsor = () => {
    if (newSponsor.trim()) {
      setFormData(prev => ({
        ...prev,
        sponsors: [...prev.sponsors, newSponsor.trim()]
      }));
      setNewSponsor('');
    }
  };
  
  const removeSponsor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sponsors: prev.sponsors.filter((_, i) => i !== index)
    }));
  };
  
  const addSocial = () => {
    if (newSocialPlatform.trim() && newSocialUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        socials: {
          ...prev.socials,
          [newSocialPlatform.trim()]: newSocialUrl.trim()
        }
      }));
      setNewSocialPlatform('');
      setNewSocialUrl('');
    }
  };
  
  const removeSocial = (platform: string) => {
    setFormData(prev => {
      const newSocials = { ...prev.socials };
      delete newSocials[platform];
      return {
        ...prev,
        socials: newSocials
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Tournament</h1>
          <div className="text-gray-400">
            <p>Set up your own Valorant tournament and manage everything from registration to brackets.</p>
            {!user && (
              <div className="mt-2 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  💡 You can create tournaments without signing in, but you'll need an account for featured tournaments and full management features.
                  <button 
                    onClick={onAuthRequired}
                    className="ml-2 text-yellow-400 hover:text-yellow-300 underline"
                  >
                    Sign in now
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tournament Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                placeholder="Enter tournament name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Organizer Name *
              </label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                placeholder={user?.profile?.username || "Your name or organization"}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
              placeholder="Describe your tournament, its goals, and what makes it special"
            />
          </div>

          {/* Tournament Format */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Format
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
              >
                <option value="single-elimination">Single Elimination</option>
                <option value="double-elimination">Double Elimination</option>
                <option value="round-robin">Round Robin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Teams
              </label>
              <input
                type="number"
                name="maxTeams"
                min="4"
                max="64"
                value={formData.maxTeams}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Team Size
              </label>
              <input
                type="number"
                name="teamSize"
                min="1"
                max="5"
                value={formData.teamSize}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Prize and Entry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prize Pool
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                  placeholder="e.g., $1,000 or Gaming Gear"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Entry Fee ($)
              </label>
              <input
                type="number"
                name="entryFee"
                min="0"
                value={formData.entryFee}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Registration Deadline *
              </label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                required
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="datetime-local"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Region *
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
              >
                <option value="NA">North America</option>
                <option value="EU">Europe</option>
                <option value="ASIA">Asia</option>
                <option value="OCE">Oceania</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Rank
              </label>
              <input
                type="text"
                name="minRank"
                value={formData.minRank}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                placeholder="e.g., Silver 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Rank
              </label>
              <input
                type="text"
                name="maxRank"
                value={formData.maxRank}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                placeholder="e.g., Gold 3"
              />
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament Rules *
            </label>
            <textarea
              name="rules"
              required
              rows={4}
              value={formData.rules}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
              placeholder="Define the rules, map pool, scoring system, and any specific requirements"
            />
          </div>

          {/* Optional Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Banner Image URL (Optional)
            </label>
            <input
              type="url"
              name="bannerImage"
              value={formData.bannerImage}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
              placeholder="https://example.com/banner.jpg"
            />
          </div>
          
          {/* Sponsors */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sponsors
            </label>
            <div className="space-y-3">
              {formData.sponsors.map((sponsor, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-1 px-3 py-2 bg-gray-900 rounded-lg text-white">{sponsor}</span>
                  <button
                    type="button"
                    onClick={() => removeSponsor(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSponsor}
                  onChange={(e) => setNewSponsor(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                  placeholder="Add sponsor name"
                />
                <button
                  type="button"
                  onClick={addSponsor}
                  className="px-4 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Social Media */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Social Media Links
            </label>
            <div className="space-y-3">
              {Object.entries(formData.socials).map(([platform, url]) => (
                <div key={platform} className="flex items-center space-x-2">
                  <span className="w-20 text-sm text-gray-400 capitalize">{platform}:</span>
                  <span className="flex-1 px-3 py-2 bg-gray-900 rounded-lg text-white text-sm">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeSocial(platform)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newSocialPlatform}
                  onChange={(e) => setNewSocialPlatform(e.target.value)}
                  className="px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                  placeholder="Platform"
                />
                <input
                  type="url"
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  className="px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                  placeholder="URL"
                />
                <button
                  type="button"
                  onClick={addSocial}
                  className="px-4 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Admin Section */}
          <div className="border-t border-gray-700 pt-6">
            <button
              type="button"
              onClick={() => setShowAdminSection(!showAdminSection)}
              className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
            >
              {showAdminSection ? 'Hide' : 'Show'} Admin Options
            </button>
            
            {showAdminSection && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Password (for featured tournaments)
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                  placeholder="Enter admin password to feature tournament"
                />
                {adminPassword === 'MyAdmin' && (
                  <p className="text-green-400 text-sm mt-2">✓ Tournament will be featured</p>
                )}
              </div>
            )}
          </div>


          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors font-medium"
            >
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}