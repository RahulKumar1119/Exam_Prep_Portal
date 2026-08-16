import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import ExamCountdown from '../components/Dashboard/ExamCountdown';
import AzureResources from '../components/Dashboard/AzureResources';
import { useExamPreference } from '../hooks/useExamPreference';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { is_authenticated, is_loading, user } = useAuth();
  const { dashboard_data, fetchDashboardData } = useDashboard();
  const { selectedExam } = useExamPreference();

  useEffect(() => {
    if (is_loading) return;
    if (!is_authenticated) {
      navigate('/login');
      return;
    }
    fetchDashboardData().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_authenticated, is_loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user?.full_name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Your JAIIB preparation hub</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Exam Countdown — only for JAIIB */}
        {selectedExam !== 'AI-300' && <ExamCountdown />}

        {/* Azure Resources — only for AI-300 */}
        {selectedExam === 'AI-300' && <AzureResources />}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Sessions</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{dashboard_data?.metrics?.total_sessions || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Avg Score</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {dashboard_data?.metrics?.average_score ? `${Math.round(dashboard_data.metrics.average_score)}%` : '—'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Best Score</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {dashboard_data?.metrics?.overall_score ? `${Math.round(dashboard_data.metrics.overall_score)}%` : '—'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Streak</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {dashboard_data?.study_streak?.current_streak || 0} 🔥
            </p>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => navigate('/practice')}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold">Practice Sets</h2>
                <p className="text-blue-100 text-sm">50 questions • No time limit • Instant feedback</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold">Performance Dashboard</h2>
                <p className="text-purple-100 text-sm">Score trends, weak areas, exam readiness</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Explore Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Leaderboard */}
            <div
              onClick={() => navigate('/leaderboard')}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <span className="text-xl">🏆</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Leaderboard</h3>
              <p className="text-xs text-gray-500 mt-1">All-India rankings by score</p>
            </div>

            {/* Saved Questions */}
            <div
              onClick={() => navigate('/bookmarks')}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-yellow-200 transition-all group"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Saved Questions</h3>
              <p className="text-xs text-gray-500 mt-1">Revisit bookmarked questions</p>
            </div>

            {/* Mock Test */}
            <div
              onClick={() => navigate('/practice')}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <span className="text-xl">⏱️</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Mock Test</h3>
              <p className="text-xs text-gray-500 mt-1">100 Qs • 120 min • Real exam</p>
            </div>

            {/* AI Explanations */}
            <div
              onClick={() => navigate('/practice')}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">AI Explanations</h3>
              <p className="text-xs text-gray-500 mt-1">RBI circulars & IIBF references</p>
            </div>

            {/* Discussion Forum */}
            <div
              onClick={() => navigate('/practice')}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-green-200 transition-all group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <span className="text-xl">💬</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Discussions</h3>
              <p className="text-xs text-gray-500 mt-1">Discuss doubts per question</p>
            </div>

            {/* Exam Readiness */}
            <div
              onClick={() => navigate('/dashboard')}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-emerald-200 transition-all group"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Exam Readiness</h3>
              <p className="text-xs text-gray-500 mt-1">Are you ready to pass?</p>
            </div>

            {/* Percentile Ranking */}
            <div
              onClick={() => navigate('/dashboard')}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-cyan-200 transition-all group"
            >
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <span className="text-xl">📈</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Percentile</h3>
              <p className="text-xs text-gray-500 mt-1">Compare with other candidates</p>
            </div>

            {/* Previous Attempts */}
            <div
              onClick={() => navigate('/previous-attempts')}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <span className="text-xl">📋</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Past Attempts</h3>
              <p className="text-xs text-gray-500 mt-1">Review previous sessions</p>
            </div>
          </div>
        </div>

        {/* Papers Quick Start */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Start Practicing</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {(selectedExam === 'AI-300' ? [
              { id: 'AI-300', name: 'AI-300', questions: 600, color: 'from-purple-600 to-indigo-700' },
            ] : [
              { id: 'IE & IFS', name: 'IE & IFS', questions: 1163, color: 'from-blue-500 to-blue-700' },
              { id: 'PPB', name: 'PPB', questions: 760, color: 'from-indigo-500 to-indigo-700' },
              { id: 'AFM', name: 'AFM', questions: 1195, color: 'from-purple-500 to-purple-700' },
              { id: 'RBWM', name: 'RBWM', questions: 635, color: 'from-pink-500 to-pink-700' },
              ...(selectedExam === 'ALL' ? [{ id: 'AI-300', name: 'AI-300', questions: 0, color: 'from-purple-600 to-indigo-700' }] : []),
            ]).map((paper) => (
              <div
                key={paper.id}
                onClick={() => navigate('/practice')}
                className={`bg-gradient-to-br ${paper.color} rounded-xl p-4 sm:p-5 cursor-pointer hover:shadow-lg hover:scale-[1.03] transition-all text-white`}
              >
                <h3 className="font-bold text-lg">{paper.name}</h3>
                <p className="text-sm opacity-80 mt-1">{paper.questions} questions</p>
                <p className="text-xs opacity-60 mt-0.5">{Math.ceil(paper.questions / 50)} practice sets</p>
              </div>
            ))}
          </div>
        </div>

        {/* Paper Performance (if data exists) */}
        {dashboard_data?.paper_performance && dashboard_data.paper_performance.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Your Paper Performance</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {dashboard_data.paper_performance.map((paper: any, idx: number) => (
                <div key={idx} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{paper.paper_name}</p>
                    <p className="text-xs text-gray-500">{paper.sessions_completed} sessions completed</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${paper.average_score >= 70 ? 'bg-green-500' : paper.average_score >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, paper.average_score)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${paper.average_score >= 70 ? 'text-green-600' : paper.average_score >= 50 ? 'text-blue-600' : 'text-red-600'}`}>
                      {Math.round(paper.average_score)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span>💡</span> Quick Tips
          </h3>
          <ul className="text-sm text-amber-800 space-y-1.5">
            <li>• Click <strong>"Check"</strong> after answering to see AI explanations instantly</li>
            <li>• Tap <strong>☆ Save</strong> to bookmark tricky questions for revision</li>
            <li>• Use the <strong>Discussion</strong> section to ask doubts on any question</li>
            <li>• Check the <strong>Leaderboard</strong> to see your rank among all users</li>
            <li>• <strong>No negative marking</strong> — always attempt every question</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
