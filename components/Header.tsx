import React from 'react';
import { Film, LayoutDashboard, Home, Trophy, UserCircle, LogIn, LogOut } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentView: 'home' | 'admin' | 'leaderboard' | 'profile';
  onViewChange: (view: 'home' | 'admin' | 'leaderboard' | 'profile') => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, currentUser, onLoginClick, onLogoutClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => {
            onViewChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="bg-emerald-500 p-1.5 rounded-lg group-hover:bg-emerald-400 transition-colors">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-emerald-200 group-hover:to-white transition-all">
            Infinite Malayalam
          </h1>
        </div>
        
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Main Navigation */}
          <button
            onClick={() => onViewChange('home')}
            className={`p-2 sm:px-3 sm:py-2 rounded-lg transition-all text-sm flex items-center gap-2 ${currentView === 'home' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Wall</span>
          </button>

          <button
            onClick={() => onViewChange('leaderboard')}
            className={`p-2 sm:px-3 sm:py-2 rounded-lg transition-all text-sm flex items-center gap-2 ${currentView === 'leaderboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          {/* User Section */}
          <div className="h-6 w-px bg-gray-800 mx-2 hidden sm:block"></div>

          {currentUser ? (
             <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewChange(currentUser.role === 'admin' ? 'admin' : 'profile')}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all text-sm ${
                    currentView === 'profile' || currentView === 'admin'
                      ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' 
                      : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {currentUser.role === 'admin' ? <LayoutDashboard className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded ml-1">{currentUser.points}</span>
                </button>
                <button onClick={onLogoutClick} className="p-2 text-gray-500 hover:text-white" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
             </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
