import React from 'react';

interface PerformanceOverviewProps {
  overall_score: number;
  total_sessions: number;
  average_score: number;
  total_study_time: number;
  last_session_date?: string;
}

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({
  overall_score,
  total_sessions,
  average_score,
  total_study_time,
  last_session_date,
}) => {
  // total_study_time is in seconds
  const study_hours = Math.floor(total_study_time / 3600);
  const study_minutes = Math.floor((total_study_time % 3600) / 60);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Overall Score Card */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <p className="text-gray-600 text-sm font-medium">Overall Score</p>
        <p className="text-4xl font-bold text-blue-600 mt-2">{overall_score.toFixed(1)}%</p>
        <p className="text-gray-500 text-xs mt-2">Across all practice sets</p>
      </div>

      {/* Practice Sets Card */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <p className="text-gray-600 text-sm font-medium">Practice Sets</p>
        <p className="text-4xl font-bold text-green-600 mt-2">{total_sessions}</p>
        <p className="text-gray-500 text-xs mt-2">Completed</p>
      </div>

      {/* Average Score Card */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
        <p className="text-gray-600 text-sm font-medium">Average Score</p>
        <p className="text-4xl font-bold text-purple-600 mt-2">{average_score.toFixed(1)}%</p>
        <p className="text-gray-500 text-xs mt-2">Per session</p>
      </div>

      {/* Study Time Card */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
        <p className="text-gray-600 text-sm font-medium">Study Time</p>
        <p className="text-4xl font-bold text-orange-600 mt-2">
          {study_hours}h {study_minutes}m
        </p>
        <p className="text-gray-500 text-xs mt-2">Total</p>
      </div>

      {/* Last Session Card */}
      {last_session_date && (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500 md:col-span-2 lg:col-span-4">
          <p className="text-gray-600 text-sm font-medium">Last Practice Session</p>
          <p className="text-lg font-semibold text-indigo-600 mt-2">
            {new Date(last_session_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceOverview;
