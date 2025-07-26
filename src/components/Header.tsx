import React from 'react';
import { User, Search, Bell, LogOut } from 'lucide-react';
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
    <header className="bg-gray-900 border-b border-primary-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">RT</span>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentView('tournaments')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'tournaments'
                    ? 'text-primary-400 bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Tournaments
              </button>
              <button
                onClick={() => setCurrentView('create')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'create'
                    ? 'text-primary-400 bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Create Tournament
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'profile'
                    ? 'text-primary-400 bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                My Profile
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tournaments..."
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-primary-400 focus:outline-none w-64"
              />
            </div>
            
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    {user.profile?.avatar_url ? (
                      <img
                        src={user.profile.avatar_url}
                        alt={user.profile?.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <span className="text-white text-sm">{user.profile?.username}</span>
                  {user.profile?.is_admin && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-lg transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="text-white text-sm">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}