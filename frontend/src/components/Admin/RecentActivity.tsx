import React from 'react';
import { AnalyticsActivityRow } from '../../types/index';

interface RecentActivityProps {
  activity: AnalyticsActivityRow[];
}

function timeAgo(iso: string): string {
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return '—';
  const mins = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activity }) => {
  if (!activity || activity.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No test attempts in this period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Exam</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Score</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Attempts</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((row) => (
              <tr key={`${row.user_id}-${row.last_active}`} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">
                  {row.email || row.name}
                  <span className="block text-xs text-gray-500 font-normal">{row.paper_name}</span>
                </td>
                <td className="py-3 px-4 text-gray-600 text-sm">{row.exam}</td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {row.score}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">{row.attempts}</td>
                <td className="py-3 px-4 text-right text-gray-600 text-sm">{timeAgo(row.last_active)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;
