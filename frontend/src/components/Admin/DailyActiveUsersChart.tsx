import React from 'react';
import { TrendPoint } from '../../types/index';

interface DailyActiveUsersChartProps {
  daily_active_users: TrendPoint[];
}

const DailyActiveUsersChart: React.FC<DailyActiveUsersChartProps> = ({ daily_active_users }) => {
  if (!daily_active_users || daily_active_users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Active Users (30 Days)</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No data available yet</p>
        </div>
      </div>
    );
  }

  const scores = daily_active_users.map((d) => d.score);
  const min_score = Math.min(...scores);
  const max_score = Math.max(...scores);
  const score_range = max_score - min_score || 1;

  const chart_height = 250;
  const chart_width = Math.max(600, daily_active_users.length * 20);
  const padding = 40;

  const points = daily_active_users.map((point, index) => {
    const x = padding + (index / (daily_active_users.length - 1 || 1)) * (chart_width - 2 * padding);
    const normalized_score = (point.score - min_score) / score_range;
    const y = chart_height - padding - normalized_score * (chart_height - 2 * padding);
    return { x, y, score: point.score, date: point.date };
  });

  const path_data = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Active Users (30 Days)</h3>
      <div className="overflow-x-auto">
        <svg width={chart_width} height={chart_height} className="mx-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chart_height - padding - ratio * (chart_height - 2 * padding);
            const user_count = Math.round(min_score + ratio * score_range);
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
                  {user_count}
                </text>
              </g>
            );
          })}

          {/* Line chart */}
          <path d={path_data} stroke="#10b981" strokeWidth="2" fill="none" />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={`point-${i}`}>
              <circle cx={point.x} cy={point.y} r="4" fill="#10b981" />
              <title>{`${point.date}: ${Math.round(point.score)} users`}</title>
            </g>
          ))}

          {/* Axes */}
          <line x1={padding} y1={chart_height - padding} x2={chart_width - padding} y2={chart_height - padding} stroke="#d1d5db" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={chart_height - padding} stroke="#d1d5db" strokeWidth="1" />
        </svg>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Average: {(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(0)} users</p>
        <p>Peak: {Math.round(max_score)} users</p>
        <p>Lowest: {Math.round(min_score)} users</p>
      </div>
    </div>
  );
};

export default DailyActiveUsersChart;
