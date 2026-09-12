import React, { useEffect, useState } from 'react';
import { AdminAnalyticsData } from '../types/index';
import { apiClient } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalyticsOverview from '../components/Admin/AnalyticsOverview';
import DailyActiveUsersChart from '../components/Admin/DailyActiveUsersChart';
import PerformanceByPaper from '../components/Admin/PerformanceByPaper';
import SubjectPerformance from '../components/Admin/SubjectPerformance';
import InsightsList from '../components/Admin/InsightsList';
import RecentActivity from '../components/Admin/RecentActivity';
import RetentionFunnel from '../components/Admin/RetentionFunnel';
import CohortMatrix from '../components/Admin/CohortMatrix';
import DifficultQuestions from '../components/Admin/DifficultQuestions';
import DropoffAnalysis from '../components/Admin/DropoffAnalysis';
import TopUsers from '../components/Admin/TopUsers';

const RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
];

const EXAM_OPTIONS = ['ALL', 'JAIIB', 'CAIIB', 'AI-300', 'CAPM', 'QUANT'];

function exportCsv(data: AdminAnalyticsData) {
  const lines = ['section,date,metric,value'];
  data.growth.forEach((g) => {
    lines.push(`growth,${g.date},new_users,${g.new_users}`);
    lines.push(`growth,${g.date},active_users,${g.active_users}`);
    lines.push(`growth,${g.date},attempts,${g.attempts}`);
  });
  data.exam_performance.forEach((e) => {
    lines.push(`exam,${e.paper_name},attempts,${e.attempts}`);
    lines.push(`exam,${e.paper_name},avg_score,${e.avg_score}`);
  });
  data.funnel.forEach((f) => {
    lines.push(`funnel,${f.stage},count,${f.count}`);
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mockmaster-analytics-${data.exam}-${data.range_days}d.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const AdminAnalyticsPage: React.FC = () => {
  const [analytics_data, setAnalyticsData] = useState<AdminAnalyticsData | null>(null);
  const [is_loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('30');
  const [exam, setExam] = useState('ALL');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<AdminAnalyticsData>(
          `/dashboard/analytics?range=${range}&exam=${exam}`
        );

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

    fetchAnalyticsData();
  }, [range, exam]);

  if (is_loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => {
            setRange('30');
            setExam('ALL');
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor system-wide analytics and user engagement</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-600">
            Date{' '}
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="ml-1 border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-600">
            Exam{' '}
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="ml-1 border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {EXAM_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o === 'ALL' ? 'All Exams' : o}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => analytics_data && exportCsv(analytics_data)}
            disabled={!analytics_data}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {analytics_data ? (
        <>
          {/* KPI Overview with deltas */}
          <AnalyticsOverview overview={analytics_data.overview} />

          {/* User Growth */}
          <DailyActiveUsersChart
            daily_active_users={analytics_data.growth.map((g) => ({
              date: g.date,
              score: g.active_users,
            }))}
          />

          {/* Exam + Subject Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceByPaper
              performance_by_paper={analytics_data.exam_performance.map((e) => ({
                paper_name: e.paper_name,
                average_score: e.avg_score,
                sessions_completed: e.attempts,
                accuracy_by_topic: {},
              }))}
            />
            <SubjectPerformance subjects={analytics_data.subject_performance} />
          </div>

          {/* Actionable Insights */}
          <InsightsList insights={analytics_data.insights} />

          {/* Phase 2: Retention funnel + Drop-off */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RetentionFunnel funnel={analytics_data.funnel} />
            <DropoffAnalysis dropoff={analytics_data.dropoff} />
          </div>

          {/* Phase 2: Cohorts */}
          <CohortMatrix cohorts={analytics_data.cohorts} />

          {/* Phase 2: Difficult questions */}
          <DifficultQuestions questions={analytics_data.difficult_questions} />

          {/* Recent Activity */}
          <RecentActivity activity={analytics_data.recent_activity} />

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
