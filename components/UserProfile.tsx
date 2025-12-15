import React from 'react';
import { User } from '../types';
import { User as UserIcon, Star, Award, Calendar } from 'lucide-react';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // Mock calculate next level progress
  const nextLevelPoints = user.points >= 5000 ? 10000 : user.points >= 1500 ? 5000 : user.points >= 500 ? 1500 : user.points >= 100 ? 500 : 100;
  const progressPercent = Math.min(100, (user.points / nextLevelPoints) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-4">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-gray-900 rounded-3xl p-8 mb-8 border border-gray-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Award className="w-64 h-64 text-white" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-4 border-emerald-500/30">
            <UserIcon className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">{user.name}</h2>
            <p className="text-emerald-200 font-medium">{user.level_title}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400 justify-center md:justify-start">
               <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {new Date(user.joined_at).toLocaleDateString()}</span>
               <span>{user.email}</span>
            </div>
          </div>
          <div className="md:ml-auto text-center">
            <div className="text-4xl font-bold text-white">{user.points.toLocaleString()}</div>
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Reputation Points</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-8 relative z-10">
          <div className="flex justify-between text-xs text-gray-300 mb-2">
            <span>Current Level: {user.level_title}</span>
            <span>Next Level: {nextLevelPoints} pts</span>
          </div>
          <div className="w-full bg-gray-950/50 rounded-full h-3">
            <div 
              className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-900/20 text-blue-400 rounded-lg">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{user.reviews_count}</div>
            <div className="text-sm text-gray-500">Reviews Written</div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-900/20 text-purple-400 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-sm text-gray-500">Badges Earned</div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
           <div className="p-3 bg-yellow-900/20 text-yellow-400 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Top 10%</div>
            <div className="text-sm text-gray-500">Global Ranking</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
