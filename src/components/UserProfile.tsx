import React, { useState } from 'react';
import { User, ExternalLink, Edit, Save, X, Shield, Link, Unlink } from 'lucide-react';
import { AuthUser, UserProfile as UserProfileType } from '../types/auth';
import { AuthService } from '../services/authService';
import { ValorantService } from '../services/valorantService';

interface UserProfileProps {
  user: AuthUser;
  onProfileUpdate: (user: AuthUser) => void;
}

export default function UserProfile({ user, onProfileUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkingService, setLinkingService] = useState<'discord' | 'valorant' | null>(null);
  
  const [editData, setEditData] = useState({
    username: user.profile?.username || '',
    discordId: '',
    discordUsername: '',
    valorantTracker: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user.profile) return;
    
    setLoading(true);
    setError('');

    try {
      const updatedProfile = await AuthService.updateProfile(user.profile.id, {
        username: editData.username,
      });

      const updatedUser = { ...user, profile: updatedProfile };
      onProfileUpdate(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkDiscord = async () => {
    if (!user.profile || !editData.discordId || !editData.discordUsername) {
      setError('Please provide Discord ID and username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedProfile = await AuthService.linkDiscord(user.profile.id, {
        id: editData.discordId,
        username: editData.discordUsername,
      });

      const updatedUser = { ...user, profile: updatedProfile };
      onProfileUpdate(updatedUser);
      setLinkingService(null);
      setEditData(prev => ({ ...prev, discordId: '', discordUsername: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link Discord');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkValorant = async () => {
    if (!user.profile || !editData.valorantTracker) {
      setError('Please provide Valorant tracker URL');
      return;
    }

    if (!ValorantService.validateTrackerUrl(editData.valorantTracker)) {
      setError('Invalid Valorant tracker URL format');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const valorantData = await ValorantService.fetchPlayerData(editData.valorantTracker);
      if (!valorantData) {
        setError('Could not fetch Valorant player data');
        setLoading(false);
        return;
      }

      const updatedProfile = await AuthService.linkValorantTracker(
        user.profile.id,
        editData.valorantTracker,
        valorantData
      );

      const updatedUser = { ...user, profile: updatedProfile };
      onProfileUpdate(updatedUser);
      setLinkingService(null);
      setEditData(prev => ({ ...prev, valorantTracker: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link Valorant tracker');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkService = async (service: 'discord' | 'valorant') => {
    if (!user.profile) return;

    setLoading(true);
    setError('');

    try {
      const updates: Partial<UserProfileType> = {};
      
      if (service === 'discord') {
        updates.discord_id = null;
        updates.discord_username = null;
      } else if (service === 'valorant') {
        updates.valorant_tracker_url = null;
        updates.valorant_username = null;
        updates.rank_tier = null;
        updates.rank_division = null;
        updates.rank_name = null;
        updates.rank_color = null;
        updates.rank_icon = null;
        updates.rr = 0;
      }

      const updatedProfile = await AuthService.updateProfile(user.profile.id, updates);
      const updatedUser = { ...user, profile: updatedProfile };
      onProfileUpdate(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to unlink ${service}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user.profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
          <div className="text-red-400 text-lg">Profile not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
              {user.profile.avatar_url ? (
                <img
                  src={user.profile.avatar_url}
                  alt={user.profile.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editData.username}
                    onChange={handleInputChange}
                    className="text-2xl font-bold bg-transparent border-b-2 border-white text-white placeholder-gray-300 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-white">{user.profile.username}</h1>
                )}
                {user.profile.is_admin && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-gray-200 mt-1">Member since {new Date(user.profile.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({ username: user.profile?.username || '', discordId: '', discordUsername: '', valorantTracker: '' });
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Information */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <div className="text-white">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                  <div className="text-white">{user.profile.username}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Account Type</label>
                  <div className="text-white">
                    {user.profile.is_admin ? 'Administrator' : 'Regular User'}
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Services */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Connected Services</h2>
              <div className="space-y-6">
                {/* Discord */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-white">Discord</h3>
                    {user.profile.discord_id ? (
                      <button
                        onClick={() => handleUnlinkService('discord')}
                        disabled={loading}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Unlink className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setLinkingService('discord')}
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        <Link className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {user.profile.discord_id ? (
                    <div className="text-gray-300">
                      <div className="font-medium">{user.profile.discord_username}</div>
                      <div className="text-sm text-gray-400">ID: {user.profile.discord_id}</div>
                    </div>
                  ) : linkingService === 'discord' ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="discordId"
                        placeholder="Discord User ID"
                        value={editData.discordId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        name="discordUsername"
                        placeholder="username#1234"
                        value={editData.discordUsername}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleLinkDiscord}
                          disabled={loading}
                          className="px-3 py-1 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
                        >
                          Link
                        </button>
                        <button
                          onClick={() => setLinkingService(null)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">Not connected</div>
                  )}
                </div>

                {/* Valorant */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-white">Valorant</h3>
                    {user.profile.valorant_tracker_url ? (
                      <div className="flex space-x-2">
                        <a
                          href={user.profile.valorant_tracker_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleUnlinkService('valorant')}
                          disabled={loading}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Unlink className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setLinkingService('valorant')}
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        <Link className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {user.profile.valorant_username ? (
                    <div className="text-gray-300">
                      <div className="font-medium">{user.profile.valorant_username}</div>
                      {user.profile.rank_name && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span style={{ color: user.profile.rank_color }}>
                            {user.profile.rank_icon} {user.profile.rank_name}
                          </span>
                          <span className="text-gray-400">• {user.profile.rr} RR</span>
                        </div>
                      )}
                    </div>
                  ) : linkingService === 'valorant' ? (
                    <div className="space-y-3">
                      <input
                        type="url"
                        name="valorantTracker"
                        placeholder="https://tracker.gg/valorant/profile/riot/username%23tag"
                        value={editData.valorantTracker}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleLinkValorant}
                          disabled={loading}
                          className="px-3 py-1 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
                        >
                          {loading ? 'Linking...' : 'Link'}
                        </button>
                        <button
                          onClick={() => setLinkingService(null)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">Not connected</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}