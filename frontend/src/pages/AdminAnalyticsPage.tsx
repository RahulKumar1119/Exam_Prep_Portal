import React, { useEffect, useState } from 'react';
import { AdminAnalyticsData } from '../types/index';
import { apiClient } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalyticsOverview from '../components/Admin/AnalyticsOverview';
import DailyActiveUsersChart from '../components/Admin/DailyActiveUsersChart';
import PerformanceByPaper from '../components/Admin/PerformanceByPaper';
import QuestionStats from '../components/Admin/QuestionStats';
import SystemMetrics from '../components/Admin/SystemMetrics';
import TopUsers from '../components/Admin/TopUsers';

const AdminAnalyticsPage: React.FC = () => {
  const [analytics_data, setAnalyticsData] = useState<AdminAnalyticsData | null>(null);
  const [is_loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<AdminAnalyticsData>('/dashboard/analytics');

      if (response.success && response.data) {
        setAnalyticsData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch analytics data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (is_loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchAnalyticsData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor system-wide analytics and user engagement</p>
      </div>

      {analytics_data ? (
        <>
          {/* Analytics Overview */}
          <AnalyticsOverview
            total_users={analytics_data.total_users}
            active_users_7d={analytics_data.active_users_7d}
            active_users_30d={analytics_data.active_users_30d}
            active_users_90d={analytics_data.active_users_90d}
            total_practice_sets={analytics_data.total_practice_sets}
            average_score={analytics_data.average_score}
          />

          {/* Daily Active Users Chart */}
          <DailyActiveUsersChart daily_active_users={analytics_data.daily_active_users} />

          {/* Performance by Paper */}
          <PerformanceByPaper performance_by_paper={analytics_data.performance_by_paper} />

          {/* Most Attempted and Skipped Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuestionStats
              title="Most Frequently Attempted Questions"
              questions={analytics_data.most_attempted_questions}
              stat_type="attempted"
            />
            <QuestionStats
              title="Most Frequently Skipped Questions"
              questions={analytics_data.most_skipped_questions}
              stat_type="skipped"
            />
          </div>

          {/* System Metrics */}
          <SystemMetrics metrics={analytics_data.system_metrics} />

          {/* Top Users */}
          <TopUsers top_users={analytics_data.top_users} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No analytics data available yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
