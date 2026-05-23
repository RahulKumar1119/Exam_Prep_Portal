import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface AttemptRecord {
  session_id: string;
  paper_name: string;
  score: number;
  time_taken: number;
  submitted_at: string;
  status: string;
  total_questions: number;
  mode?: string;
}

const PreviousAttemptsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'result' | 'profile'>('result');
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<any>('/dashboard');
      if (response.success && response.data) {
        // Build attempts from trend_data and paper_performance
        const data = response.data;
        const trendData = data.trend_data || [];
        const paperPerf = data.paper_performance || [];

        // Map trend data to attempt records
        const records: AttemptRecord[] = trendData.map((entry: any, idx: number) => ({
          session_id: `session-${idx}`,
          paper_name: paperPerf[idx % paperPerf.length]?.paper_name || 'JAIIB',
          score: entry.score || 0,
          time_taken: 0,
          submitted_at: entry.date || '',
          status: 'completed',
          total_questions: 50,
          mode: 'practice',
        }));

        setAttempts(records);
      }
    } catch (err) {
      console.error('Failed to fetch attempts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter by search
  const filtered = attempts.filter((a) =>
    a.paper_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const startIdx = (currentPage - 1) * entriesPerPage;
  const pageData = filtered.slice(startIdx, startIdx + entriesPerPage);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }) + ' IST';
  };

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Your previous exam results will be recorded here.
        </h1>
        <p className="text-gray-700 mt-2">
          Hello, <span className="font-medium">{user?.full_name || user?.email}</span>
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="px-5 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition text-sm"
      >
        LOGOUT
      </button>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('result')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'result'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Result
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Profile
        </button>
      </div>

      {activeTab === 'result' ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Search:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 px-4 font-semibold text-gray-700 w-16">S.No ↕</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Exam Name ↕</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Date & Time of Attempt ↕</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 text-center">Points ↕</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 text-center">Score % ↕</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length > 0 ? (
                  pageData.map((attempt, idx) => (
                    <React.Fragment key={attempt.session_id}>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-600">{startIdx + idx + 1}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{attempt.paper_name}</span>
                          <span className="text-gray-500 text-xs ml-2">
                            ({attempt.mode === 'mock_test' ? 'Mock Test' : 'Practice Set'})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{formatDate(attempt.submitted_at)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-gray-900">{attempt.score}</span>
                          <span className="text-gray-500">/{attempt.total_questions}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-bold ${
                            (attempt.score / attempt.total_questions) * 100 >= 50
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {((attempt.score / attempt.total_questions) * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setExpandedRow(expandedRow === attempt.session_id ? null : attempt.session_id)}
                            className="text-indigo-600 hover:text-indigo-800 text-xs font-medium hover:underline"
                          >
                            {expandedRow === attempt.session_id ? 'Hide' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === attempt.session_id && (
                        <tr>
                          <td colSpan={6} className="px-4 py-4 bg-gray-50 border-b border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                                <p className="text-xs text-gray-500">Paper</p>
                                <p className="font-bold text-gray-900">{attempt.paper_name}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                                <p className="text-xs text-gray-500">Score</p>
                                <p className="font-bold text-gray-900">{attempt.score}/{attempt.total_questions}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                                <p className="text-xs text-gray-500">Percentage</p>
                                <p className={`font-bold ${(attempt.score / attempt.total_questions) * 100 >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                                  {((attempt.score / attempt.total_questions) * 100).toFixed(1)}%
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                                <p className="text-xs text-gray-500">Result</p>
                                <p className={`font-bold ${(attempt.score / attempt.total_questions) * 100 >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                                  {(attempt.score / attempt.total_questions) * 100 >= 50 ? '✅ PASS' : '❌ FAIL'}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-gray-500">
                              <span>Attempted: {formatDate(attempt.submitted_at)}</span>
                              {attempt.time_taken > 0 && (
                                <span className="ml-4">Time: {Math.floor(attempt.time_taken / 60)}m {attempt.time_taken % 60}s</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>
              Showing {filtered.length > 0 ? startIdx + 1 : 0} to {Math.min(startIdx + entriesPerPage, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded text-sm ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Profile Tab */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-900 font-medium mt-1">{user?.full_name || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900 font-medium mt-1">{user?.email || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-gray-900 font-medium mt-1 capitalize">{user?.role?.replace('_', ' ') || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="text-gray-900 font-medium mt-1">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p className="text-gray-900 font-medium mt-1">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Verified</label>
              <p className="text-gray-900 font-medium mt-1">
                {user?.email_verified ? '✅ Verified' : '❌ Not Verified'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviousAttemptsPage;
