import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../types';
import { fetchLeaderboard } from '../services/api';
import { Trophy, Medal, Crown, Loader2 } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard().then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="font-bold text-gray-500 w-6 text-center">{rank}</span>;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Community Leaderboard
        </h2>
        <p className="text-gray-400 mt-2">Top reviewers and cinephiles this month</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-950/50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-center">Rank</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                  </td>
                </tr>
              ) : entries.map((entry) => (
                <tr key={entry.user_id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 flex justify-center items-center">
                    {getRankIcon(entry.rank)}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {entry.name}
                    {entry.user_id.startsWith('u1') && <span className="ml-2 text-xs bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded">Admin</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border 
                      ${entry.level_title.includes('Master') ? 'bg-purple-900/30 border-purple-800 text-purple-300' : 
                        entry.level_title.includes('Critic') ? 'bg-indigo-900/30 border-indigo-800 text-indigo-300' : 
                        'bg-gray-800 border-gray-700 text-gray-300'}`}>
                      {entry.level_title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-emerald-400 font-bold">
                    {entry.points.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
