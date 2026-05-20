import React from 'react';

interface WeakAreasProps {
  weak_areas: string[];
  accuracy_by_topic: Record<string, number>;
}

const WeakAreas: React.FC<WeakAreasProps> = ({ weak_areas, accuracy_by_topic }) => {
  if (!weak_areas || weak_areas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📉 Weak Areas</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm">No weak areas identified yet. Take a mock test to see topic-level analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">📉 Weak Areas</h3>
      <p className="text-xs text-gray-500 mb-4">Topics below 50% accuracy — focus here</p>
      <div className="space-y-3">
        {weak_areas.map((topic) => {
          const accuracy = accuracy_by_topic[topic] ?? 0;

          return (
            <div key={topic} className="bg-red-50 border border-red-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-medium text-gray-900 text-sm">{topic}</p>
                <span className="text-red-600 font-bold text-sm">{accuracy}%</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-1.5">
                <div
                  className="bg-red-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.max(accuracy, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeakAreas;
