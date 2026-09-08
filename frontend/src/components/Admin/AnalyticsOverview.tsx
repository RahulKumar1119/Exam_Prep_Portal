import React from 'react';
import { AnalyticsOverviewData } from '../../types/index';

interface AnalyticsOverviewProps {
  overview: AnalyticsOverviewData;
}

function formatDuration(total_seconds: number): string {
  const s = Math.round(total_seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m === 0) return `${rem}s`;
  return `${m}m ${rem}s`;
}

function DeltaBadge({ value, suffix = '%' }: { value: number | null; suffix?: string }) {
  if (value === null || value === undefined) {
    return <span className="text-gray-400 text-xs mt-2 block">no prior data</span>;
  }
  const up = value > 0;
  const flat = value === 0;
  const color = flat ? 'text-gray-500' : up ? 'text-green-600' : 'text-red-600';
  const arrow = flat ? '' : up ? '↑' : '↓';
  return (
    <span className={`${color} text-xs mt-2 block font-medium`}>
      {arrow} {Math.abs(value)}{suffix} vs prior
    </span>
  );
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ overview }) => {
  const cards = [
    {
      label: 'Total Users',
      value: String(overview.total_users),
      sub: `${overview.unverified_pending} unverified pending`,
      delta: null,
      border: 'border-blue-500',
      text: 'text-blue-600',
    },
    {
      label: 'Active Users',
      value: String(overview.active_users),
      sub: `of ${overview.total_registered} registered`,
      delta: overview.deltas.active_users,
      border: 'border-green-500',
      text: 'text-green-600',
    },
    {
      label: 'Test Attempts',
      value: String(overview.test_attempts),
      sub: 'completed sessions',
      delta: overview.deltas.test_attempts,
      border: 'border-indigo-500',
      text: 'text-indigo-600',
    },
    {
      label: 'Avg Accuracy',
      value: `${overview.avg_score.toFixed(1)}%`,
      sub: 'across attempts',
      delta: overview.deltas.avg_score,
      border: 'border-pink-500',
      text: 'text-pink-600',
    },
    {
      label: 'Avg Test Time',
      value: formatDuration(overview.avg_time_sec),
      sub: 'per attempt',
      delta: overview.deltas.avg_time_sec,
      delta_suffix: 's',
      border: 'border-orange-500',
      text: 'text-orange-600',
    },
    {
      label: 'Retention',
      value: `${overview.retention_pct.toFixed(1)}%`,
      sub: 'returning actives',
      delta: overview.deltas.retention_pct,
      border: 'border-purple-500',
      text: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.label} className={`bg-white rounded-lg shadow p-6 border-l-4 ${card.border}`}>
          <p className="text-gray-600 text-sm font-medium">{card.label}</p>
          <p className={`text-4xl font-bold mt-2 ${card.text}`}>{card.value}</p>
          <p className="text-gray-500 text-xs mt-1">{card.sub}</p>
          <DeltaBadge value={card.delta} suffix={(card as { delta_suffix?: string }).delta_suffix || '%'} />
        </div>
      ))}
    </div>
  );
};

export default AnalyticsOverview;
