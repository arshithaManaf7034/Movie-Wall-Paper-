import React, { useState } from 'react';
import { X, Loader2, LogIn, UserPlus } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let user: User;
      if (isSignUp) {
        if (!name) throw new Error("Display Name is required");
        user = await registerUser(email, password, name);
      } else {
        user = await loginUser(email, password);
      }
      onLoginSuccess(user);
      onClose();
      // Reset state for next open
      setIsSignUp(false);
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              {isSignUp ? <UserPlus className="w-6 h-6 text-emerald-500" /> : <LogIn className="w-6 h-6 text-emerald-500" />}
            </div>
            <h2 className="text-2xl font-bold text-white">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {isSignUp ? 'Join the community & climb the leaderboard!' : 'Sign in to track reviews and earn badges.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="animate-in slide-in-from-left-2 duration-300">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Display Name</label>
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="MovieBuff99"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isSignUp ? 'Sign Up' : 'Log In')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={toggleMode}
              className="text-sm text-gray-400 hover:text-emerald-400 transition-colors underline decoration-dotted underline-offset-4"
            >
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;