import React from 'react';
import { AnalyticsCohort } from '../../types/index';

interface CohortMatrixProps {
  cohorts: AnalyticsCohort[];
}

function cellColor(value: number | null): string {
  if (value === null || value === undefined) return 'bg-gray-50 text-gray-400';
  if (value >= 50) return 'bg-green-100 text-green-800';
  if (value >= 25) return 'bg-yellow-100 text-yellow-800';
  if (value > 0) return 'bg-orange-100 text-orange-800';
  return 'bg-red-50 text-red-700';
}

const CohortMatrix: React.FC<CohortMatrixProps> = ({ cohorts }) => {
  if (!cohorts || cohorts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Cohorts</h3>
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No cohort data yet</p>
        </div>
      </div>
    );
  }

  const weeks: Array<'w0' | 'w1' | 'w2' | 'w3'> = ['w0', 'w1', 'w2', 'w3'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Cohorts</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Signup week</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Users</th>
              {weeks.map((w, i) => (
                <th key={w} className="text-right py-3 px-4 font-semibold text-gray-900">
                  Week {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((row) => (
              <tr key={row.cohort} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">{row.cohort}</td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">{row.size}</td>
                {weeks.map((w) => {
                  const v = row[w];
                  return (
                    <td key={w} className="py-2 px-4 text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium min-w-[52px] text-center ${cellColor(v)}`}>
                        {v === null || v === undefined ? '—' : `${v}%`}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        % of each signup-week cohort completing a test in that week after signup. — = week not yet elapsed.
      </p>
    </div>
  );
};

export default CohortMatrix;
