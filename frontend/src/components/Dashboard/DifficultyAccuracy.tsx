import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props { difficulty_accuracy?: Record<string, number>; }

const DifficultyAccuracy: React.FC<Props> = ({ difficulty_accuracy }) => {
  if (!difficulty_accuracy || Object.keys(difficulty_accuracy).length === 0) return null;

  const labels = Object.keys(difficulty_accuracy);
  const values = labels.map((k) => difficulty_accuracy[k]);

  const getColor = (v: number) => (v >= 70 ? '#10b981' : v >= 50 ? '#f59e0b' : '#ef4444');

  const data = {
    labels: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [{ label: 'Accuracy %', data: values, backgroundColor: values.map(getColor), borderRadius: 4 as any, barThickness: 48 }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (i: any) => ` ${i.parsed.y}%` } } },
    scales: { y: { min: 0, max: 100, ticks: { callback: (v: any) => `${v}%` }, grid: { color: '#e5e7eb' } }, x: { grid: { display: false } } },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Accuracy by Difficulty</h3>
      <div className="h-64"><Bar data={data} options={options as any} /></div>
    </div>
  );
};

export default DifficultyAccuracy;
