import React, { useState, useEffect } from 'react';
import { fetchMovies, deleteMovie, loginUser } from '../services/api';
import { Movie, User } from '../types';
import { Loader2, Trash2, Edit2, LogOut, Plus, Search } from 'lucide-react';
import AdminModal from './AdminModal';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | undefined>(undefined);

  // Check for existing session
  useEffect(() => {
    const stored = localStorage.getItem('admin_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Fetch movies when logged in
  useEffect(() => {
    if (user) {
      loadAllMovies();
    }
  }, [user]);

  const loadAllMovies = async () => {
    setLoadingMovies(true);
    try {
      // Fetching a large number to simulate "All" for the table since pagination in table is simplified
      const resp = await fetchMovies(100, 0, { search: searchTerm, genre: 'All', sortBy: 'newest' });
      setMovies(resp.results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMovies(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const u = await loginUser(email, password);
      if (u.role !== 'admin') {
        throw new Error("Access denied. Admin rights required.");
      }
      setUser(u);
      localStorage.setItem('admin_user', JSON.stringify(u));
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
    onLogout();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await deleteMovie(id);
      setMovies(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      alert("Failed to delete movie");
    }
  };

  const openAddModal = () => {
    setMovieToEdit(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (movie: Movie) => {
    setMovieToEdit(movie);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadAllMovies();
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
          {loginError && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded-lg">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="admin"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center"
            >
              {loginLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              Use <span className="text-gray-400">admin@example.com</span> / <span className="text-gray-400">admin</span>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
        <div>
          <h2 className="text-2xl font-bold text-white">Movie Management</h2>
          <p className="text-gray-400 text-sm">Manage database entries and content.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openAddModal} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Movie
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Search Bar for Table */}
      <div className="flex gap-2">
         <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search in table..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadAllMovies()}
              className="block w-full pl-10 pr-3 py-2 border border-gray-800 rounded-lg leading-5 bg-gray-900 text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
            />
         </div>
         <button onClick={loadAllMovies} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 border border-gray-700">Refresh</button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950 text-gray-200 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Genre</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loadingMovies ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                  </td>
                </tr>
              ) : movies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No movies found.
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{movie.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{movie.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-800 rounded text-xs border border-gray-700">{movie.genre}</span>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">{movie.popularity_score}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => openEditModal(movie)} className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(movie.id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        movieToEdit={movieToEdit}
      />
    </div>
  );
};

export default AdminDashboard;