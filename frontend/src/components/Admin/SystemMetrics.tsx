import React from 'react';
import { SystemMetrics as SystemMetricsType } from '../../types/index';

interface SystemMetricsProps {
  metrics: SystemMetricsType;
}

const SystemMetrics: React.FC<SystemMetricsProps> = ({ metrics }) => {
  const uptime_color = metrics.uptime_percentage >= 99.9 ? 'text-green-600' : metrics.uptime_percentage >= 99 ? 'text-orange-600' : 'text-red-600';
  const error_rate_color = metrics.error_rate < 1 ? 'text-green-600' : metrics.error_rate < 5 ? 'text-orange-600' : 'text-red-600';
  const response_time_color = metrics.api_response_time_ms < 200 ? 'text-green-600' : metrics.api_response_time_ms < 500 ? 'text-orange-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* API Response Time */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm font-medium">API Response Time (p95)</p>
          <p className={`text-3xl font-bold mt-2 ${response_time_color}`}>{metrics.api_response_time_ms}ms</p>
          <p className="text-xs text-gray-600 mt-2">Target: &lt; 200ms</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${response_time_color.replace('text-', 'bg-')}`}
              style={{ width: `${Math.min((metrics.api_response_time_ms / 500) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm font-medium">Error Rate</p>
          <p className={`text-3xl font-bold mt-2 ${error_rate_color}`}>{metrics.error_rate.toFixed(2)}%</p>
          <p className="text-xs text-gray-600 mt-2">Target: &lt; 1%</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${error_rate_color.replace('text-', 'bg-')}`}
              style={{ width: `${Math.min((metrics.error_rate / 5) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm font-medium">System Uptime</p>
          <p className={`text-3xl font-bold mt-2 ${uptime_color}`}>{metrics.uptime_percentage.toFixed(2)}%</p>
          <p className="text-xs text-gray-600 mt-2">Target: &gt; 99.9%</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${uptime_color.replace('text-', 'bg-')}`}
              style={{ width: `${Math.min((metrics.uptime_percentage / 100) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-xs text-gray-500 text-right">
        Last updated: {new Date(metrics.last_updated).toLocaleString()}
      </div>
    </div>
  );
};

export default SystemMetrics;
