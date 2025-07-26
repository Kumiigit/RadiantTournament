import React, { useState } from 'react';
import { useEffect } from 'react';
import { AuthUser } from './types/auth';
import { AuthService } from './services/authService';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import Header from './components/Header';
import TournamentList from './components/TournamentList';
import CreateTournament from './components/CreateTournament';
import TournamentDetail from './components/TournamentDetail';
import PlayerRegistration from './components/PlayerRegistration';
import { Tournament, Team } from './types/tournament';
import { TournamentService } from './services/tournamentService';

type View = 'tournaments' | 'create' | 'profile' | 'detail';

function App() {
  const [currentView, setCurrentView] = useState<View>('tournaments');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  
  useEffect(() => {
    initializeAuth();
    loadTournaments();
  }, []);
  
  const initializeAuth = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      
      // Set up auth state listener
      AuthService.onAuthStateChange((user) => {
        setUser(user);
      });
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setAuthLoading(false);
    }
  };
  
  const loadTournaments = async () => {
    try {
      setLoading(true);
      const data = await TournamentService.getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
      // Show demo tournaments if Supabase fails
      setTournaments([
        {
          id: 'demo-1',
          name: 'Demo Tournament - Database Not Connected',
          description: 'This is a demo tournament. Please configure Supabase to enable full functionality.',
          game: 'Valorant',
          format: 'single-elimination',
          maxTeams: 16,
          teamSize: 5,
          prizePool: '$1,000',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          status: 'registration',
          organizer: 'Demo Organizer',
          rules: 'Standard competitive rules apply.',
          requirements: {
            region: 'NA',
          },
          teams: [],
          matches: [],
          bracket: null,
          featured: true,
          bannerImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (authUser: AuthUser) => {
    setUser(authUser);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setCurrentView('tournaments');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileUpdate = (updatedUser: AuthUser) => {
    setUser(updatedUser);
  };

  const handleCreateTournament = async (tournamentData: Omit<Tournament, 'id' | 'teams' | 'matches' | 'bracket'>) => {
    try {
      const newTournament = await TournamentService.createTournament({
        ...tournamentData,
        status: 'registration',
        user_id: user?.id,
      });
      
      setTournaments(prev => [newTournament, ...prev]);
      setCurrentView('tournaments');
      
      alert('Tournament created successfully!');
    } catch (error) {
      console.error('Failed to create tournament:', error);
      
      // Always allow tournament creation with mock data as fallback
      const mockTournament: Tournament = {
        id: `mock_${Date.now()}`,
        ...tournamentData,
        status: 'registration',
        teams: [],
        matches: [],
        bracket: null,
      };
      
      setTournaments(prev => [mockTournament, ...prev]);
      setCurrentView('tournaments');
      alert('Tournament created successfully! (Demo mode - connect Supabase for persistence)');
    }
  };

  const handleJoinTournament = (tournament: Tournament) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedTournament(tournament);
    setShowRegistration(true);
  };

  const handleViewTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setCurrentView('detail');
  };

  const handleRegisterTeam = async (team: Omit<Team, 'id'>) => {
    if (!selectedTournament) return;

    try {
      const newTeam = await TournamentService.registerTeam(selectedTournament.id, team);
      
      setTournaments(prev =>
        prev.map(t =>
          t.id === selectedTournament.id
            ? { ...t, teams: [...t.teams, newTeam] }
            : t
        )
      );

      setShowRegistration(false);
      setSelectedTournament(null);
      
      alert('Team registered successfully!');
    } catch (error) {
      console.error('Failed to register team:', error);
      alert('Failed to register team. Please try again.');
    }
  };

  const handleBackToTournaments = () => {
    setCurrentView('tournaments');
    setSelectedTournament(null);
  };

  const handleUpdateTournament = async (updatedTournament: Tournament) => {
    try {
      await TournamentService.updateTournament(updatedTournament);
      
      setTournaments(prev =>
        prev.map(t =>
          t.id === updatedTournament.id ? updatedTournament : t
        )
      );
      
      setSelectedTournament(updatedTournament);
      alert('Tournament updated successfully!');
    } catch (error) {
      console.error('Failed to update tournament:', error);
      alert('Failed to update tournament. Please try again.');
    }
  };

  const handleDeleteTournament = async (tournamentId: string) => {
    try {
      await TournamentService.deleteTournament(tournamentId);
      
      setTournaments(prev => prev.filter(t => t.id !== tournamentId));
      setCurrentView('tournaments');
      setSelectedTournament(null);
      
      alert('Tournament deleted successfully!');
    } catch (error) {
      console.error('Failed to delete tournament:', error);
      alert('Failed to delete tournament. Please try again.');
    }
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <div className="text-white text-lg">
            {authLoading ? 'Initializing...' : 'Loading tournaments...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      
      <main>
        {currentView === 'tournaments' && (
          <TournamentList
            tournaments={tournaments}
            onJoinTournament={handleJoinTournament}
            onViewTournament={handleViewTournament}
          />
        )}
        
        {currentView === 'create' && (
          <CreateTournament 
            onCreateTournament={handleCreateTournament} 
            user={user}
            onAuthRequired={() => setShowAuthModal(true)}
          />
        )}
        
        {currentView === 'detail' && selectedTournament && (
          <TournamentDetail
            tournament={selectedTournament}
            user={user}
            onBack={handleBackToTournaments}
            onJoin={handleJoinTournament}
            onUpdate={handleUpdateTournament}
            onDelete={handleDeleteTournament}
          />
        )}
        
        {currentView === 'profile' && (
          user ? (
            <UserProfile user={user} onProfileUpdate={handleProfileUpdate} />
          ) : (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
                <p className="text-gray-400 mb-6">You need to sign in to view your profile.</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors font-medium"
                >
                  Sign In
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {showRegistration && selectedTournament && (
        <PlayerRegistration
          tournament={selectedTournament}
          onRegister={handleRegisterTeam}
          onClose={() => {
            setShowRegistration(false);
            setSelectedTournament(null);
          }}
        />
      )}
    </div>
  );
}

export default App;