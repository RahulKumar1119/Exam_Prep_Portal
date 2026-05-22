import React from 'react';

interface PaperReadiness {
  score: number;
  label: string;
  recent_avg?: number;
  sessions_completed?: number;
  sessions_needed?: number;
  trend?: 'improving' | 'declining' | 'stable';
}

interface ExamReadinessProps {
  exam_readiness: Record<string, PaperReadiness>;
}

const PAPER_LABELS: Record<string, string> = {
  'IE & IFS': 'Indian Economy & Indian Financial System',
  'PPB': 'Principles & Practices of Banking',
  'AFM': 'Accounting & Financial Management',
  'RBWM': 'Retail Banking & Wealth Management',
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

const getBarColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getLabelBg = (label: string): string => {
  if (label === 'Likely to pass') return 'bg-green-100 text-green-800';
  if (label === 'On track') return 'bg-blue-100 text-blue-800';
  if (label === 'Needs more practice') return 'bg-yellow-100 text-yellow-800';
  if (label === 'At risk') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-600';
};

const getTrendIcon = (trend?: string): string => {
  if (trend === 'improving') return '📈';
  if (trend === 'declining') return '📉';
  return '➡️';
};

const ExamReadiness: React.FC<ExamReadinessProps> = ({ exam_readiness }) => {
  const papers = Object.entries(exam_readiness);

  if (papers.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Exam Readiness</h3>
        <p className="text-gray-500 text-sm">Complete at least 2 sessions in a paper to see your readiness score.</p>
      </div>
    );
  }

  // Calculate overall readiness (average of all papers with data)
  const papersWithScores = papers.filter(([_, r]) => r.score > 0);
  const overallScore = papersWithScores.length > 0
    ? Math.round(papersWithScores.reduce((sum, [_, r]) => sum + r.score, 0) / papersWithScores.length)
    : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Exam Readiness</h3>
          <p className="text-sm text-gray-500">Your predicted pass probability per paper</p>
        </div>
        {overallScore > 0 && (
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <p className="text-xs text-gray-500">Overall</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {papers.map(([paper, readiness]) => (
          <div key={paper} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold text-gray-900">{paper}</span>
                <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
                  {PAPER_LABELS[paper] || ''}
                </span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLabelBg(readiness.label)}`}>
                {readiness.label}
              </span>
            </div>

            {readiness.score > 0 ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${getBarColor(readiness.score)}`}
                      style={{ width: `${readiness.score}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(readiness.score)}`}>
                    {readiness.score}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {readiness.recent_avg !== undefined && (
                    <span>Avg: {readiness.recent_avg}/100</span>
                  )}
                  {readiness.sessions_completed !== undefined && (
                    <span>{readiness.sessions_completed} sessions</span>
                  )}
                  {readiness.trend && (
                    <span>{getTrendIcon(readiness.trend)} {readiness.trend}</span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">
                {readiness.sessions_needed
                  ? `Complete ${readiness.sessions_needed} more session${readiness.sessions_needed > 1 ? 's' : ''} to unlock`
                  : 'Not enough data yet'}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Based on recent scores, consistency, improvement trend, and practice volume. Pass threshold: 50/100 per paper.
        </p>
      </div>
    </div>
  );
};

export default ExamReadiness;
