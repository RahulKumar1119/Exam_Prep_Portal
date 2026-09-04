import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props { question_type_accuracy?: Record<string, number>; }

const QuestionTypeAccuracy: React.FC<Props> = ({ question_type_accuracy }) => {
  if (!question_type_accuracy || Object.keys(question_type_accuracy).length === 0) return null;

  const labels = Object.keys(question_type_accuracy);
  const values = labels.map((k) => question_type_accuracy![k]);
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

  const data = {
    labels: labels.map((l) => l.replace('_', ' ')),
    datasets: [{ label: 'Accuracy %', data: values, backgroundColor: labels.map((_, i) => colors[i % colors.length]), borderRadius: 4 as any, barThickness: 36 }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (i: any) => ` ${i.parsed.x}%` } } },
    scales: { x: { min: 0, max: 100, ticks: { callback: (v: any) => `${v}%` }, grid: { color: '#e5e7eb' } }, y: { grid: { display: false } } },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Accuracy by Question Type</h3>
      <div className="h-64"><Bar data={data} options={options as any} /></div>
    </div>
  );
};

export default QuestionTypeAccuracy;
