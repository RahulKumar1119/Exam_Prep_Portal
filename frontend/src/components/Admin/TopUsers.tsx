import React from 'react';
import { TopUser } from '../../types/index';

interface TopUsersProps {
  top_users: TopUser[];
}

const TopUsers: React.FC<TopUsersProps> = ({ top_users }) => {
  if (!top_users || top_users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Users by Completion Count</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Users by Completion Count</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Rank</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">User Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Practice Sets</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Average Score</th>
            </tr>
          </thead>
          <tbody>
            {top_users.map((user, index) => (
              <tr key={user.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                    {index + 1}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-900 font-medium">{user.full_name}</td>
                <td className="py-3 px-4 text-gray-600 text-sm">{user.email}</td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">{user.completion_count}</td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {user.average_score.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopUsers;
