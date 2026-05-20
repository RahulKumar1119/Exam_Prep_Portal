import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { useNotification } from '../context/NotificationContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { is_authenticated, is_loading, user } = useAuth();
  const { dashboard_data } = useDashboard();
  const { unread_count } = useNotification();

  useEffect(() => {
    if (is_loading) return; // wait for auth to initialize
    if (!is_authenticated) {
      navigate('/login');
    }
  }, [is_authenticated, is_loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.full_name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.bank_affiliation && `${user.bank_affiliation} • `}
                Ready to practice?
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Practice Sets Completed */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Practice Sets</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard_data?.metrics?.total_sessions || 0}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard_data?.metrics?.average_score ? `${Math.round(dashboard_data.metrics.average_score)}%` : 'N/A'}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Overall Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard_data?.metrics?.overall_score ? `${Math.round(dashboard_data.metrics.overall_score)}%` : 'N/A'}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657L13.414 22.9a1.998 1.998 0 01-2.827 0l-.028-.028a1.998 1.998 0 010-2.828l4.243-4.243m2.121-5.657a2 2 0 00-2.828 0L9.172 7.172a2 2 0 000 2.828l.028.028a2 2 0 002.828 0l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Notifications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {unread_count}
                </p>
                <p className="text-xs text-gray-500 mt-1">unread</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Start Practice */}
          <div
            onClick={() => navigate('/practice')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Start Practice</h2>
                <p className="text-blue-100">
                  Generate a new practice set and test your knowledge
                </p>
              </div>
              <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <button className="mt-4 bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-blue-50 transition">
              Start Now
            </button>
          </div>

          {/* Mock Test */}
          <div
            onClick={() => navigate('/mock-test')}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Mock Test</h2>
                <p className="text-purple-100">
                  Real exam simulation with proper weightage (100 marks)
                </p>
              </div>
              <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <button className="mt-4 bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg hover:bg-indigo-50 transition">
              Take Test
            </button>
          </div>

          {/* View Dashboard */}
          <div
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">View Dashboard</h2>
                <p className="text-indigo-100">
                  Track your progress and analyze your performance
                </p>
              </div>
              <svg className="w-12 h-12 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <button className="mt-4 bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg hover:bg-indigo-50 transition">
              View Now
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Paper Performance</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboard_data?.paper_performance && dashboard_data.paper_performance.length > 0 ? (
              dashboard_data.paper_performance.slice(0, 5).map((paper: any, idx: number) => (
                <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{paper.paper_name}</p>
                      <p className="text-sm text-gray-600">
                        {paper.sessions_completed} sessions • Avg: {Math.round(paper.average_score)}%
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      paper.average_score >= 75
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {paper.average_score >= 75 ? 'Strong' : 'Needs Work'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-600">No practice sessions yet. Start practicing to see your performance here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Study Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Practice regularly to maintain your study streak</li>
                <li>• Focus on weak areas to improve your overall score</li>
                <li>• Review explanations for incorrect answers</li>
                <li>• Aim for 75% or higher to pass each practice set</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
