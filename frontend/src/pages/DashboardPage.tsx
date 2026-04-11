import React, { useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const { dashboard_data, is_loading, error, fetchDashboardData } = useDashboard();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (is_loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your learning progress and performance</p>
      </div>

      {dashboard_data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overall Score Card */}
          <div className="card">
            <p className="text-gray-600 text-sm font-medium">Overall Score</p>
            <p className="text-4xl font-bold text-primary-600 mt-2">
              {dashboard_data.metrics.overall_score.toFixed(1)}%
            </p>
          </div>

          {/* Total Sessions Card */}
          <div className="card">
            <p className="text-gray-600 text-sm font-medium">Practice Sets</p>
            <p className="text-4xl font-bold text-primary-600 mt-2">
              {dashboard_data.metrics.total_sessions}
            </p>
          </div>

          {/* Average Score Card */}
          <div className="card">
            <p className="text-gray-600 text-sm font-medium">Average Score</p>
            <p className="text-4xl font-bold text-primary-600 mt-2">
              {dashboard_data.metrics.average_score.toFixed(1)}%
            </p>
          </div>

          {/* Study Time Card */}
          <div className="card">
            <p className="text-gray-600 text-sm font-medium">Study Time</p>
            <p className="text-4xl font-bold text-primary-600 mt-2">
              {Math.floor(dashboard_data.metrics.total_study_time / 60)}h
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No data available yet. Start practicing to see your progress!</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
