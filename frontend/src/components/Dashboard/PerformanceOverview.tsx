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

  const getScoreColor = (score: number) => {
    if (score >= 50) return 'text-green-600';
    if (score >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPassStatus = (score: number) => {
    if (score >= 50) return { text: 'PASS', color: 'bg-green-100 text-green-700' };
    return { text: 'FAIL', color: 'bg-red-100 text-red-700' };
  };

  const passStatus = getPassStatus(average_score);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm font-medium">Average Score</p>
            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${passStatus.color}`}>
              {passStatus.text}
            </span>
          </div>
          <p className={`text-3xl font-bold mt-2 ${getScoreColor(average_score)}`}>
            {average_score.toFixed(1)}%
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {average_score >= 50 ? '✅ Above pass mark (50%)' : '❌ Below pass mark (50%)'}
          </p>
        </div>

        {/* Mock Tests Taken */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Mock Tests Taken</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{total_sessions}</p>
          <p className="text-gray-400 text-xs mt-1">Total attempts</p>
        </div>

        {/* Study Time Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Study Time</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {study_hours > 0 ? `${study_hours}h ${study_minutes}m` : `${study_minutes}m`}
          </p>
          <p className="text-gray-400 text-xs mt-1">Total practice time</p>
        </div>

        {/* Best Score */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Best Score</p>
          <p className={`text-3xl font-bold mt-2 ${getScoreColor(overall_score)}`}>
            {overall_score.toFixed(1)}%
          </p>
          <p className="text-gray-400 text-xs mt-1">Highest in any test</p>
        </div>
      </div>

      {/* Last Session */}
      {last_session_date && (
        <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 flex items-center gap-2">
          <span className="text-indigo-500">📅</span>
          <p className="text-sm text-indigo-700">
            Last practice: <span className="font-semibold">
              {new Date(last_session_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceOverview;
