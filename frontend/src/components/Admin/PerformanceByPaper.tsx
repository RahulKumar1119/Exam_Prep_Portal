import React from 'react';
import { PaperPerformance } from '../../types/index';

interface PerformanceByPaperProps {
  performance_by_paper: PaperPerformance[];
}

const PerformanceByPaper: React.FC<PerformanceByPaperProps> = ({ performance_by_paper }) => {
  if (!performance_by_paper || performance_by_paper.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics by Paper</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics by Paper</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Paper Name</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Average Score</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Sessions Completed</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {performance_by_paper.map((paper) => {
              const completion_rate = ((paper.sessions_completed / Math.max(paper.sessions_completed, 1)) * 100).toFixed(1);
              const score_color =
                paper.average_score >= 75 ? 'text-green-600' : paper.average_score >= 60 ? 'text-orange-600' : 'text-red-600';

              return (
                <tr key={paper.paper_name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{paper.paper_name}</td>
                  <td className={`py-3 px-4 text-right font-bold ${score_color}`}>
                    {paper.average_score.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">{paper.sessions_completed}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{completion_rate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceByPaper;
