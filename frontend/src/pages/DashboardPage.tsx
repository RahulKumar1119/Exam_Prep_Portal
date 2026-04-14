import React, { useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PerformanceOverview from '../components/Dashboard/PerformanceOverview';
import ScoreTrends from '../components/Dashboard/ScoreTrends';
import PaperBreakdown from '../components/Dashboard/PaperBreakdown';
import WeakAreas from '../components/Dashboard/WeakAreas';
import StrongAreas from '../components/Dashboard/StrongAreas';
import RecommendedPractice from '../components/Dashboard/RecommendedPractice';

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
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 font-medium">{error}</p>
        <p className="text-blue-600 text-sm mt-2">The dashboard endpoint will be available once the backend is fully deployed.</p>
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
        <>
          {/* Performance Overview Cards */}
          <PerformanceOverview
            overall_score={dashboard_data.metrics.overall_score}
            total_sessions={dashboard_data.metrics.total_sessions}
            average_score={dashboard_data.metrics.average_score}
            total_study_time={dashboard_data.metrics.total_study_time}
            last_session_date={dashboard_data.metrics.last_session_date}
          />

          {/* Score Trends Chart */}
          <ScoreTrends trend_data={dashboard_data.trend_data} />

          {/* Paper Breakdown Chart */}
          <PaperBreakdown paper_performance={dashboard_data.paper_performance} />

          {/* Weak and Strong Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeakAreas
              weak_areas={dashboard_data.weak_areas}
              accuracy_by_topic={
                dashboard_data.paper_performance.reduce(
                  (acc: Record<string, number>, paper: any) => ({
                    ...acc,
                    [paper.paper_name]: paper.average_score
                  }),
                  {}
                )
              }
            />
            <StrongAreas
              strong_areas={dashboard_data.strong_areas}
              accuracy_by_topic={
                dashboard_data.paper_performance.reduce(
                  (acc: Record<string, number>, paper: any) => ({
                    ...acc,
                    [paper.paper_name]: paper.average_score
                  }),
                  {}
                )
              }
            />
          </div>

          {/* Recommended Practice */}
          <RecommendedPractice
            weak_areas={dashboard_data.weak_areas}
            total_sessions={dashboard_data.metrics.total_sessions}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No data available yet. Start practicing to see your progress!</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
