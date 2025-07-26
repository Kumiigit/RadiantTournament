import React, { useState } from 'react';
import { X, User, Shield, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthService } from '../services/authService';
import { ValorantService } from '../services/valorantService';
import { AuthUser } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAuthSuccess: (user: AuthUser) => void;
}

type AuthMode = 'login' | 'signup' | 'admin';
type SignupProvider = 'email' | 'discord' | 'valorant';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [signupProvider, setSignupProvider] = useState<SignupProvider>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    adminUsername: '',
    adminPassword: '',
    discordId: '',
    discordUsername: '',
    valorantTracker: '',
  });

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      username: '',
      adminUsername: '',
      adminPassword: '',
      discordId: '',
      discordUsername: '',
      valorantTracker: '',
    });
    setError('');
    setSuccess('');
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await AuthService.signIn({
        email: formData.email,
        password: formData.password,
      });
      
      onAuthSuccess(user);
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let signupData: any = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
      };

      if (signupProvider === 'discord') {
        if (!formData.discordId || !formData.discordUsername) {
          setError('Please provide Discord ID and username');
          setLoading(false);
          return;
        }
        signupData = {
          ...signupData,
          provider: 'discord',
          discord_id: formData.discordId,
          discord_username: formData.discordUsername,
          username: formData.discordUsername,
        };
      } else if (signupProvider === 'valorant') {
        if (!formData.valorantTracker) {
          setError('Please provide Valorant tracker URL');
          setLoading(false);
          return;
        }
        
        if (!ValorantService.validateTrackerUrl(formData.valorantTracker)) {
          setError('Invalid Valorant tracker URL format');
          setLoading(false);
          return;
        }

        const valorantData = await ValorantService.fetchPlayerData(formData.valorantTracker);
        if (!valorantData) {
          setError('Could not fetch Valorant player data');
          setLoading(false);
          return;
        }

        signupData = {
          ...signupData,
          provider: 'valorant',
          valorant_tracker_url: formData.valorantTracker,
          valorant_username: valorantData.username,
          username: valorantData.username,
        };
      }

      const user = await AuthService.signUp(signupData);
      
      setSuccess('Account created successfully! Please check your email to verify your account.');
      setTimeout(() => {
        onAuthSuccess(user);
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await AuthService.adminSignIn(formData.adminUsername, formData.adminPassword);
      
      onAuthSuccess(user);
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-secondary-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Admin Login'}
            </h2>
            {onClose && (
              <button 
                onClick={onClose}
                className="text-secondary-400 hover:text-white transition-colors p-1 hover:bg-secondary-800 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Mode Selection */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => handleModeChange('login')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Sign In
            </button>
            <button
              onClick={() => handleModeChange('signup')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => handleModeChange('admin')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                mode === 'admin'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Admin
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-error-900/50 border border-error-700 rounded-xl flex items-center space-x-3 animate-slide-up">
              <AlertCircle className="h-5 w-5 text-error-400 flex-shrink-0" />
              <div className="text-error-200 text-sm">
                <div>{error}</div>
                {error.includes('Database not configured') && (
                  <div className="mt-2 text-xs text-error-300">
                    Running in demo mode. Set up Supabase credentials for full functionality.
                  </div>
                )}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-success-900/50 border border-success-700 rounded-xl flex items-center space-x-3 animate-slide-up">
              <CheckCircle className="h-5 w-5 text-success-400" />
              <span className="text-success-200 text-sm">{success}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <div className="space-y-6">
              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  How would you like to sign up?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupProvider('email')}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      signupProvider === 'email'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupProvider('discord')}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      signupProvider === 'discord'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Discord
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupProvider('valorant')}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      signupProvider === 'valorant'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Valorant
                  </button>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                    placeholder="Create a password"
                  />
                </div>

                {signupProvider === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                      placeholder="Choose a username"
                    />
                  </div>
                )}

                {signupProvider === 'discord' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Discord ID
                      </label>
                      <input
                        type="text"
                        name="discordId"
                        required
                        value={formData.discordId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                        placeholder="Your Discord user ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Discord Username
                      </label>
                      <input
                        type="text"
                        name="discordUsername"
                        required
                        value={formData.discordUsername}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                        placeholder="username#1234"
                      />
                    </div>
                  </>
                )}

                {signupProvider === 'valorant' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Valorant Tracker URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        name="valorantTracker"
                        required
                        value={formData.valorantTracker}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none pr-12"
                        placeholder="https://tracker.gg/valorant/profile/riot/username%23tag"
                      />
                      <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      We'll use your Valorant username and rank from tracker.gg
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}

          {/* Admin Login Form */}
          {mode === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Username
                </label>
                <input
                  type="text"
                  name="adminUsername"
                  required
                  value={formData.adminUsername}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                  placeholder="Enter admin username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  name="adminPassword"
                  required
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                  placeholder="Enter admin password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                {loading ? 'Signing In...' : 'Admin Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}