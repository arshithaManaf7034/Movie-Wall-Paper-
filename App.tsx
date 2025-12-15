import React, { useEffect, useState, useRef, useCallback } from 'react';
import Header from './components/Header';
import MovieCard from './components/MovieCard';
import FilterBar from './components/FilterBar';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import MovieDetailModal from './components/MovieDetailModal';
import Leaderboard from './components/Leaderboard';
import UserProfile from './components/UserProfile';
import { fetchMovies, fetchUserProfile } from './services/api';
import { Movie, MovieFilters, User } from './types';
import { Loader2 } from 'lucide-react';

const LIMIT = 20;

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'admin' | 'leaderboard' | 'profile'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Home State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // Filters State
  const [filters, setFilters] = useState<MovieFilters>({
    search: '',
    genre: 'All',
    sortBy: 'popularity_desc'
  });
  
  // Sentinel ref for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  // Check LocalStorage for User
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin_user');
    if (storedAdmin) {
      setCurrentUser(JSON.parse(storedAdmin));
    }
    // In a real app we would have a separate user storage or single source of truth
    const storedUser = localStorage.getItem('app_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      localStorage.setItem('admin_user', JSON.stringify(user));
      setView('admin');
    } else {
      localStorage.setItem('app_user', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('app_user');
    setCurrentUser(null);
    setView('home');
  };

  // Debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Reset and reload when filters change (debounced for search)
      loadMovies(0, true);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const loadMovies = useCallback(async (currentOffset: number, isReset: boolean = false) => {
    if (loading && !isReset) return;
    
    setLoading(true);
    try {
      const response = await fetchMovies(LIMIT, currentOffset, filters);
      
      setMovies(prev => {
        if (isReset) return response.results;
        const newMovies = response.results.filter(
          newM => !prev.some(existingM => existingM.id === newM.id)
        );
        return [...prev, ...newMovies];
      });
      
      setOffset(response.next_offset);
      setHasMore(response.has_more);
    } catch (error) {
      console.error("Failed to load movies", error);
    } finally {
      setLoading(false);
    }
  }, [filters]); 

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && view === 'home') {
          loadMovies(offset);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, offset, loadMovies, view]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header 
        currentView={view} 
        onViewChange={setView} 
        currentUser={currentUser}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogoutClick={handleLogout}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'admin' ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : view === 'leaderboard' ? (
          <Leaderboard />
        ) : view === 'profile' && currentUser ? (
          <UserProfile user={currentUser} />
        ) : (
          /* Home / Wall View */
          <>
            <FilterBar filters={filters} onFilterChange={setFilters} />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard 
                  key={`${movie.id}-${movie.popularity_score}`} 
                  movie={movie} 
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </div>

            {/* Empty State */}
            {!loading && movies.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-lg">No movies found matching your criteria.</p>
                <button onClick={() => setFilters({ search: '', genre: 'All', sortBy: 'popularity_desc'})} className="mt-4 text-emerald-500 hover:underline">Clear filters</button>
              </div>
            )}

            {/* Loader / Sentinel */}
            <div 
              ref={observerTarget} 
              className="w-full h-24 flex items-center justify-center mt-8"
            >
              {loading && (
                <div className="flex flex-col items-center gap-2 text-emerald-500">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm font-medium text-gray-500">Loading films...</span>
                </div>
              )}
              {!hasMore && movies.length > 0 && (
                <div className="text-gray-600 text-sm font-medium">
                  ~ End of collection ~
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Movie Detail Modal */}
      <MovieDetailModal 
        movie={selectedMovie} 
        currentUser={currentUser}
        onClose={() => setSelectedMovie(null)}
        onLoginRequest={() => {
          setSelectedMovie(null); // Close detail to focus on auth
          setIsAuthOpen(true);
        }}
      />
    </div>
  );
};

export default App;
