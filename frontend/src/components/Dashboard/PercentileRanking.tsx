import React from 'react';

interface PaperPercentile {
  percentile: number | null;
  total_users: number;
  your_avg: number;
  message: string;
}

interface PercentileRankingProps {
  percentile_ranking: Record<string, PaperPercentile>;
}

const getPercentileColor = (percentile: number): string => {
  if (percentile >= 80) return 'text-green-600';
  if (percentile >= 60) return 'text-blue-600';
  if (percentile >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

const getPercentileBg = (percentile: number): string => {
  if (percentile >= 80) return 'from-green-500 to-emerald-500';
  if (percentile >= 60) return 'from-blue-500 to-indigo-500';
  if (percentile >= 40) return 'from-yellow-500 to-orange-500';
  return 'from-red-500 to-pink-500';
};

const getPercentileEmoji = (percentile: number): string => {
  if (percentile >= 90) return '🏆';
  if (percentile >= 75) return '⭐';
  if (percentile >= 50) return '📈';
  if (percentile >= 25) return '💪';
  return '🎯';
};

const PercentileRanking: React.FC<PercentileRankingProps> = ({ percentile_ranking }) => {
  const papers = Object.entries(percentile_ranking);

  if (papers.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Peer Comparison</h3>
        <p className="text-gray-500 text-sm">Complete practice sessions to see how you rank against other candidates.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Peer Comparison</h3>
        <p className="text-sm text-gray-500">See how you rank against other JAIIB candidates</p>
      </div>

      <div className="space-y-4">
        {papers.map(([paper, data]) => (
          <div key={paper} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">{paper}</span>
              <span className="text-xs text-gray-400">{data.total_users} candidates</span>
            </div>

            {data.percentile !== null ? (
              <>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1">
                    {/* Percentile bar */}
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${getPercentileBg(data.percentile)} transition-all duration-700`}
                        style={{ width: `${data.percentile}%` }}
                      />
                      {/* Marker for user's position */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-gray-800"
                        style={{ left: `${data.percentile}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <span className={`text-xl font-bold ${getPercentileColor(data.percentile)}`}>
                      {data.percentile}
                    </span>
                    <span className="text-xs text-gray-500 ml-0.5">%ile</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {getPercentileEmoji(data.percentile)} {data.message}
                  </p>
                  <span className="text-xs text-gray-400">Avg: {data.your_avg}/100</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">{data.message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Percentile based on average scores of all users who have practiced each paper.
        </p>
      </div>
    </div>
  );
};

export default PercentileRanking;
