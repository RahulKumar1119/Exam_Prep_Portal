import React from 'react';
import { TrendPoint } from '../../types/index';

interface ScoreTrendsProps {
  trend_data: TrendPoint[];
}

const ScoreTrends: React.FC<ScoreTrendsProps> = ({ trend_data }) => {
  if (!trend_data || trend_data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Score Trends</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No data available yet</p>
        </div>
      </div>
    );
  }

  // Find min and max scores for scaling
  const scores = trend_data.map((d) => d.score);
  const min_score = Math.min(...scores);
  const max_score = Math.max(...scores);
  const score_range = max_score - min_score || 1;

  // Calculate chart dimensions
  const chart_height = 250;
  const chart_width = Math.max(600, trend_data.length * 20);
  const padding = 40;

  // Create SVG path for line chart
  const points = trend_data.map((point, index) => {
    const x = padding + (index / (trend_data.length - 1 || 1)) * (chart_width - 2 * padding);
    const normalized_score = (point.score - min_score) / score_range;
    const y = chart_height - padding - normalized_score * (chart_height - 2 * padding);
    return { x, y, score: point.score, date: point.date };
  });

  const path_data = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Score Trends</h3>
      <div className="overflow-x-auto">
        <svg width={chart_width} height={chart_height} className="mx-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chart_height - padding - ratio * (chart_height - 2 * padding);
            const score_label = Math.round(min_score + ratio * score_range);
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chart_width - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="4"
                />
                <text x={padding - 10} y={y + 4} fontSize="12" fill="#9ca3af" textAnchor="end">
                  {score_label}%
                </text>
              </g>
            );
          })}

          {/* Line chart */}
          <path d={path_data} stroke="#3b82f6" strokeWidth="2" fill="none" />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={`point-${i}`}>
              <circle cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
              <title>{`${point.date}: ${point.score}%`}</title>
            </g>
          ))}

          {/* Axes */}
          <line x1={padding} y1={chart_height - padding} x2={chart_width - padding} y2={chart_height - padding} stroke="#d1d5db" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={chart_height - padding} stroke="#d1d5db" strokeWidth="1" />
        </svg>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Average: {(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)}%</p>
        <p>Highest: {max_score.toFixed(1)}%</p>
        <p>Lowest: {min_score.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default ScoreTrends;
