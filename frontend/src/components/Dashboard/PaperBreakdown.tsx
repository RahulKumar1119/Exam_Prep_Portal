import React from 'react';
import { PaperPerformance } from '../../types/index';

interface PaperBreakdownProps {
  paper_performance: PaperPerformance[];
}

const PaperBreakdown: React.FC<PaperBreakdownProps> = ({ paper_performance }) => {
  if (!paper_performance || paper_performance.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Paper</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No data available yet</p>
        </div>
      </div>
    );
  }

  const chart_height = 300;
  const bar_width = 60;
  const gap = 20;
  const padding = 40;
  const chart_width = paper_performance.length * (bar_width + gap) + 2 * padding;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Paper</h3>
      <div className="overflow-x-auto">
        <svg width={chart_width} height={chart_height} className="mx-auto">
          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map((label, i) => {
            const y = chart_height - padding - (label / 100) * (chart_height - 2 * padding);
            return (
              <g key={`y-label-${i}`}>
                <line x1={padding - 5} y1={y} x2={padding} y2={y} stroke="#d1d5db" strokeWidth="1" />
                <text x={padding - 10} y={y + 4} fontSize="12" fill="#9ca3af" textAnchor="end">
                  {label}%
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {paper_performance.map((paper, i) => {
            const x = padding + i * (bar_width + gap);
            const bar_height = (paper.average_score / 100) * (chart_height - 2 * padding);
            const y = chart_height - padding - bar_height;

            // Color based on score
            let bar_color = '#ef4444'; // red
            if (paper.average_score >= 75) bar_color = '#10b981'; // green
            else if (paper.average_score >= 70) bar_color = '#f59e0b'; // amber
            else if (paper.average_score >= 60) bar_color = '#f97316'; // orange

            return (
              <g key={`bar-${i}`}>
                <rect x={x} y={y} width={bar_width} height={bar_height} fill={bar_color} rx="4" />
                <text
                  x={x + bar_width / 2}
                  y={chart_height - padding + 20}
                  fontSize="12"
                  fill="#374151"
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {paper.paper_name.substring(0, 3)}
                </text>
                <text
                  x={x + bar_width / 2}
                  y={y - 5}
                  fontSize="12"
                  fill="#374151"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {paper.average_score.toFixed(0)}%
                </text>
                <title>{`${paper.paper_name}: ${paper.average_score.toFixed(1)}% (${paper.sessions_completed} sessions)`}</title>
              </g>
            );
          })}

          {/* X-axis */}
          <line x1={padding} y1={chart_height - padding} x2={chart_width - padding} y2={chart_height - padding} stroke="#d1d5db" strokeWidth="1" />
          {/* Y-axis */}
          <line x1={padding} y1={padding} x2={padding} y2={chart_height - padding} stroke="#d1d5db" strokeWidth="1" />
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paper_performance.map((paper) => (
          <div key={paper.paper_name} className="bg-gray-50 rounded p-3">
            <p className="font-semibold text-gray-900">{paper.paper_name}</p>
            <p className="text-sm text-gray-600">Score: {paper.average_score.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Sessions: {paper.sessions_completed}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperBreakdown;
