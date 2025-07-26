import React from 'react';
import { User, Search, Bell, LogOut, Trophy, Zap } from 'lucide-react';
import { AuthUser } from '../types/auth';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: AuthUser | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

export default function Header({ currentView, setCurrentView, user, onAuthClick, onLogout }: HeaderProps) {
  return (
    <header className="bg-secondary-950/95 backdrop-blur-md border-b border-secondary-800 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-medium">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning-500 rounded-full flex items-center justify-center">
                  <Zap className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Radiant</span>
                <div className="text-xs text-primary-400 font-medium -mt-1">TOURNAMENTS</div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentView('tournaments')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentView === 'tournaments'
                    ? 'text-primary-400 bg-secondary-800 shadow-soft'
                    : 'text-secondary-300 hover:text-white hover:bg-secondary-800'
                }`}
              >
                Tournaments
              </button>
              <button
                onClick={() => setCurrentView('create')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentView === 'create'
                    ? 'text-primary-400 bg-secondary-800 shadow-soft'
                    : 'text-secondary-300 hover:text-white hover:bg-secondary-800'
                }`}
              >
                Create Tournament
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentView === 'profile'
                    ? 'text-primary-400 bg-secondary-800 shadow-soft'
                    : 'text-secondary-300 hover:text-white hover:bg-secondary-800'
                }`}
              >
                My Profile
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search tournaments..."
                className="bg-secondary-900 text-white pl-10 pr-4 py-2.5 rounded-xl border border-secondary-700 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 focus:outline-none w-64 transition-all"
              />
            </div>
            
            <button className="p-2.5 text-secondary-400 hover:text-white hover:bg-secondary-800 rounded-xl transition-all">
              <Bell className="h-5 w-5" />
            </button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    {user.profile?.avatar_url ? (
                      <img
                        src={user.profile.avatar_url}
                        alt={user.profile?.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-secondary-400" />
                    )}
                  </div>
                  <span className="text-white text-sm font-medium">{user.profile?.username}</span>
                  {user.profile?.is_admin && (
                    <span className="bg-error-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="p-2.5 text-secondary-400 hover:text-error-400 hover:bg-secondary-800 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="btn-primary"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}