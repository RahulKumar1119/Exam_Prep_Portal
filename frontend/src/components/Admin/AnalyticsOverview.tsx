import React from 'react';

interface AnalyticsOverviewProps {
  total_users: number;
  active_users_7d: number;
  active_users_30d: number;
  active_users_90d: number;
  total_practice_sets: number;
  average_score: number;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  total_users,
  active_users_7d,
  active_users_30d,
  active_users_90d,
  total_practice_sets,
  average_score,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Users Card */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <p className="text-gray-600 text-sm font-medium">Total Users</p>
        <p className="text-4xl font-bold text-blue-600 mt-2">{total_users}</p>
        <p className="text-gray-500 text-xs mt-2">Registered users</p>
      </div>

      {/* Active Users 7 Days Card */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <p className="text-gray-600 text-sm font-medium">Active Users (7 Days)</p>
        <p className="text-4xl font-bold text-green-600 mt-2">{active_users_7d}</p>
        <p className="text-gray-500 text-xs mt-2">Last 7 days</p>
      </div>

      {/* Active Users 30 Days Card */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
        <p className="text-gray-600 text-sm font-medium">Active Users (30 Days)</p>
        <p className="text-4xl font-bold text-purple-600 mt-2">{active_users_30d}</p>
        <p className="text-gray-500 text-xs mt-2">Last 30 days</p>
      </div>

      {/* Active Users 90 Days Card */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
        <p className="text-gray-600 text-sm font-medium">Active Users (90 Days)</p>
        <p className="text-4xl font-bold text-orange-600 mt-2">{active_users_90d}</p>
        <p className="text-gray-500 text-xs mt-2">Last 90 days</p>
      </div>

      {/* Total Practice Sets Card */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
        <p className="text-gray-600 text-sm font-medium">Total Practice Sets</p>
        <p className="text-4xl font-bold text-indigo-600 mt-2">{total_practice_sets}</p>
        <p className="text-gray-500 text-xs mt-2">Completed across all users</p>
      </div>

      {/* Average Score Card */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500">
        <p className="text-gray-600 text-sm font-medium">Average Score</p>
        <p className="text-4xl font-bold text-pink-600 mt-2">{average_score.toFixed(1)}%</p>
        <p className="text-gray-500 text-xs mt-2">Across all users</p>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
