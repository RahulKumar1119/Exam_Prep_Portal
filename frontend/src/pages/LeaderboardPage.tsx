import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useExamPreference } from '../hooks/useExamPreference';
import LoadingSpinner from '../components/LoadingSpinner';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  average_score: number;
  best_score: number;
  sessions_completed: number;
  papers_attempted: number;
  last_active: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  total_participants: number;
}

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedExam } = useExamPreference();
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const exam = selectedExam || 'JAIIB';
        const response = await apiClient.get<LeaderboardData>(`/dashboard/leaderboard?exam=${exam}`);
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || 'Failed to load leaderboard');
        }
      } catch (err) {
        setError('Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedExam]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  const leaderboard = data?.leaderboard || [];
  const myEntry = leaderboard.find((e) => e.user_id === user?.user_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600 mt-1">{selectedExam === 'AI-300' ? 'AI-300' : selectedExam === 'ALL' ? 'All Exams' : 'JAIIB'} rankings based on average score</p>
      </div>

      {/* My Rank Card */}
      {myEntry && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-medium">Your Rank</p>
              <p className="text-4xl font-bold mt-1">#{myEntry.rank}</p>
              <p className="text-indigo-100 text-sm mt-1">out of {data?.total_participants} participants</p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold">{myEntry.average_score}%</p>
                <p className="text-indigo-200 text-xs">Avg Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{myEntry.best_score}%</p>
                <p className="text-indigo-200 text-xs">Best Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{myEntry.sessions_completed}</p>
                <p className="text-indigo-200 text-xs">Sessions</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{data?.total_participants || 0}</p>
          <p className="text-xs text-gray-600">Total Participants</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {leaderboard.length > 0 ? leaderboard[0].average_score : 0}%
          </p>
          <p className="text-xs text-gray-600">Top Score</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {leaderboard.length > 0
              ? Math.round(leaderboard.reduce((sum, e) => sum + e.sessions_completed, 0) / leaderboard.length)
              : 0}
          </p>
          <p className="text-xs text-gray-600">Avg Sessions/User</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {leaderboard.filter((e) => e.average_score >= 50).length}
          </p>
          <p className="text-xs text-gray-600">Above Pass Mark</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Rank</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Avg Score</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Best Score</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 hidden sm:table-cell">Sessions</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 hidden md:table-cell">Papers</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 hidden md:table-cell">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboard.map((entry) => {
                const isMe = entry.user_id === user?.user_id;
                const rankBg =
                  entry.rank === 1
                    ? 'bg-yellow-50'
                    : entry.rank === 2
                    ? 'bg-gray-50'
                    : entry.rank === 3
                    ? 'bg-orange-50'
                    : isMe
                    ? 'bg-indigo-50'
                    : '';

                const rankIcon =
                  entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;

                return (
                  <tr key={entry.user_id} className={`${rankBg} ${isMe ? 'font-semibold' : ''}`}>
                    <td className="px-4 py-3 text-center">
                      <span className="text-base">{rankIcon}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-900 truncate max-w-[120px] sm:max-w-none">
                          {entry.name}
                          {isMe && <span className="ml-1 text-indigo-600 text-xs">(You)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${entry.average_score >= 70 ? 'text-green-600' : entry.average_score >= 50 ? 'text-blue-600' : 'text-red-600'}`}>
                        {entry.average_score}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{entry.best_score}%</td>
                    <td className="px-4 py-3 text-center text-gray-700 hidden sm:table-cell">{entry.sessions_completed}</td>
                    <td className="px-4 py-3 text-center text-gray-700 hidden md:table-cell">{entry.papers_attempted}</td>
                    <td className="px-4 py-3 text-center text-gray-500 text-xs hidden md:table-cell">{entry.last_active}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No one has completed a practice session yet. Be the first!</p>
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-500 text-center">
        Rankings update in real-time. Complete more practice sets to climb the leaderboard.
      </p>
    </div>
  );
};

export default LeaderboardPage;
