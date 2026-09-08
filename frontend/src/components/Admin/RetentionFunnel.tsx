import React from 'react';
import { AnalyticsFunnelStage } from '../../types/index';

interface RetentionFunnelProps {
  funnel: AnalyticsFunnelStage[];
}

const RetentionFunnel: React.FC<RetentionFunnelProps> = ({ funnel }) => {
  if (!funnel || funnel.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Funnel</h3>
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No funnel data yet</p>
        </div>
      </div>
    );
  }

  const max = Math.max(...funnel.map((f) => f.count), 1);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Funnel</h3>
      <div className="space-y-3">
        {funnel.map((stage) => (
          <div key={stage.stage}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-900 font-medium">{stage.label}</span>
              <span className="text-gray-600 whitespace-nowrap ml-2">
                {stage.count.toLocaleString()} · {stage.conversion.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.max((stage.count / max) * 100, stage.count > 0 ? 2 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">Conversion % is relative to the previous stage.</p>
    </div>
  );
};

export default RetentionFunnel;
