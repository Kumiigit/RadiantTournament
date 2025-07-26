import React, { useEffect, useState } from 'react';
import { AuthUser } from '../types/auth';
import { AuthService } from '../services/authService';
import AuthModal from './AuthModal';

interface AuthGuardProps {
  children: React.ReactNode;
  user: AuthUser | null;
  onAuthSuccess: (user: AuthUser) => void;
}

export default function AuthGuard({ children, user, onAuthSuccess }: AuthGuardProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) {
          setShowAuthModal(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setShowAuthModal(true);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Show auth modal if user becomes null
    if (!isInitializing && !user) {
      setShowAuthModal(true);
    }
  }, [user, isInitializing]);

  const handleAuthSuccess = (authUser: AuthUser) => {
    onAuthSuccess(authUser);
    setShowAuthModal(false);
  };

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <div className="text-white text-lg">Initializing authentication...</div>
        </div>
      </div>
    );
  }

  // Block access if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Authentication Required</h1>
            <p className="text-gray-400 mb-6">
              You must be signed in to access the tournament platform.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors font-medium"
            >
              Sign In to Continue
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {}} // Prevent closing without authentication
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
}