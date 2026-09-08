import React from 'react';
import { AnalyticsInsight } from '../../types/index';

interface InsightsListProps {
  insights: AnalyticsInsight[];
}

const LEVEL_STYLES: Record<AnalyticsInsight['level'], { bg: string; icon: string }> = {
  warn: { bg: 'bg-yellow-50 border-yellow-200 text-yellow-800', icon: '⚠' },
  good: { bg: 'bg-green-50 border-green-200 text-green-800', icon: '✅' },
  info: { bg: 'bg-blue-50 border-blue-200 text-blue-800', icon: 'ℹ️' },
};

const InsightsList: React.FC<InsightsListProps> = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 Actionable Insights</h3>
      <div className="space-y-2">
        {insights.map((insight, index) => {
          const style = LEVEL_STYLES[insight.level] || LEVEL_STYLES.info;
          return (
            <div key={index} className={`border rounded-lg px-4 py-3 text-sm ${style.bg}`}>
              <span className="mr-2">{style.icon}</span>
              {insight.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsList;
