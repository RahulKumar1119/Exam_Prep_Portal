import React from 'react';
import { AnalyticsDropoff } from '../../types/index';

interface DropoffAnalysisProps {
  dropoff: AnalyticsDropoff[];
}

const DropoffAnalysis: React.FC<DropoffAnalysisProps> = ({ dropoff }) => {
  if (!dropoff || dropoff.length === 0) return null;

  const max = Math.max(...dropoff.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Drop-off Analysis</h3>
      <div className="space-y-4">
        {dropoff.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-900 font-medium">{item.label}</span>
              <span className="text-red-600 font-bold whitespace-nowrap ml-2">{item.count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-red-500 h-2.5 rounded-full"
                style={{ width: `${Math.max((item.count / max) * 100, item.count > 0 ? 2 : 0)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropoffAnalysis;
