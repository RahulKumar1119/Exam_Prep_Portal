import React from 'react';
import { AnalyticsSubjectRow } from '../../types/index';

interface SubjectPerformanceProps {
  subjects: AnalyticsSubjectRow[];
}

const SubjectPerformance: React.FC<SubjectPerformanceProps> = ({ subjects }) => {
  if (!subjects || subjects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No topic data yet (needs 2+ attempts per topic)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
      <div className="space-y-3">
        {subjects.map((row) => {
          const color =
            row.accuracy >= 70 ? 'bg-green-500' : row.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500';
          return (
            <div key={row.topic}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-900 font-medium truncate mr-2">{row.topic}</span>
                <span className="text-gray-600 whitespace-nowrap">
                  {row.accuracy.toFixed(1)}% · {row.attempts} attempts
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${Math.min(row.accuracy, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectPerformance;
