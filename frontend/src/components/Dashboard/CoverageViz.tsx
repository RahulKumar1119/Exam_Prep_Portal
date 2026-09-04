import React from 'react';

interface Props {
  coverage?: Record<string, { total: number; covered: number; pct: number; gaps: string[] }>;
}

const CoverageViz: React.FC<Props> = ({ coverage }) => {
  if (!coverage || Object.keys(coverage).length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Syllabus Coverage</h3>
      <div className="space-y-4">
        {Object.entries(coverage).map(([paper, c]) => (
          <div key={paper} className="border rounded p-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{paper}</span>
              <span className="text-gray-600">{c.covered}/{c.total} topics • {c.pct}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${c.pct}%` }} />
            </div>
            {c.gaps.length > 0 && <p className="text-xs text-gray-500 mt-1">Gaps: {c.gaps.join(', ')}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoverageViz;
