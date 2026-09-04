import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface Props {
  avg_time_per_paper?: Record<string, number>;
  time_trend?: { date: string; time_taken: number }[];
}

const TimeStats: React.FC<Props> = ({ avg_time_per_paper, time_trend }) => {
  if ((!avg_time_per_paper || Object.keys(avg_time_per_paper).length === 0) && (!time_trend || time_trend.length === 0)) return null;

  const hasAvg = avg_time_per_paper && Object.keys(avg_time_per_paper).length > 0;
  const hasTrend = time_trend && time_trend.length > 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Analytics</h3>

      {hasAvg && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Average Time per Paper (seconds)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(avg_time_per_paper!).map(([paper, secs]) => (
              <div key={paper} className="bg-gray-50 rounded p-3 text-center">
                <p className="text-xs text-gray-600 truncate">{paper}</p>
                <p className="text-lg font-bold text-indigo-600">{Math.round(secs)}s</p>
                <p className="text-xs text-gray-500">{(secs / 60).toFixed(1)} min</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasTrend && (
        <div className="h-64">
          <Line
            data={{
              labels: time_trend!.map((t) => t.date),
              datasets: [{ label: 'Time (s)', data: time_trend!.map((t) => t.time_taken), borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', fill: true, tension: 0.3, pointRadius: 3 }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (i: any) => ` ${i.parsed.y}s` } } },
              scales: { y: { ticks: { callback: (v: any) => `${v}s` }, grid: { color: '#e5e7eb' } }, x: { grid: { display: false } } },
            } as any}
          />
        </div>
      )}
    </div>
  );
};

export default TimeStats;
