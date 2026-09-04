import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PaperPerformance } from '../../types/index';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const getColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  const data = {
    labels: paper_performance.map((p) => p.paper_name),
    datasets: [
      {
        label: 'Average Score %',
        data: paper_performance.map((p) => p.average_score),
        backgroundColor: paper_performance.map((p) => getColor(p.average_score)),
        borderRadius: 4 as any,
        barThickness: 48,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (item: any) => {
            const p = paper_performance[item.dataIndex];
            return ` ${p.paper_name}: ${p.average_score.toFixed(1)}% (${p.sessions_completed} sessions)`;
          },
        },
      },
    },
    scales: {
      y: { min: 0, max: 100, ticks: { callback: (v: any) => `${v}%` }, grid: { color: '#e5e7eb' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Paper</h3>
      <div className="h-72">
        <Bar data={data} options={options as any} />
      </div>
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
