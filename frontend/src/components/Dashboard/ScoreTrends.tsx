import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendPoint } from '../../types/index';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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

  const scores = trend_data.map((d) => d.score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const max = Math.max(...scores);
  const min = Math.min(...scores);

  const data = {
    labels: trend_data.map((d) => {
      try {
        return new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      } catch {
        return d.date;
      }
    }),
    datasets: [
      {
        label: 'Score %',
        data: scores,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3b82f6',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: any[]) => trend_data[items[0].dataIndex]?.date || '',
          label: (item: any) => ` Score: ${item.parsed.y.toFixed(1)}%`,
        },
      },
      title: { display: false },
    },
    scales: {
      y: { min: 0, max: 100, ticks: { callback: (v: any) => `${v}%` }, grid: { color: '#e5e7eb' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Score Trends</h3>
      <div className="h-64">
        <Line data={data} options={options as any} />
      </div>
      <div className="mt-4 flex gap-6 text-sm text-gray-600">
        <span>Average: <strong>{avg.toFixed(1)}%</strong></span>
        <span>Highest: <strong>{max.toFixed(1)}%</strong></span>
        <span>Lowest: <strong>{min.toFixed(1)}%</strong></span>
      </div>
    </div>
  );
};

export default ScoreTrends;
