import React from 'react';

interface WeakAreasProps {
  weak_areas: string[];
  accuracy_by_topic: Record<string, number>;
}

const WeakAreas: React.FC<WeakAreasProps> = ({ weak_areas, accuracy_by_topic }) => {
  if (!weak_areas || weak_areas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weak Areas</h3>
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="text-green-700">Great job! No weak areas identified. Keep practicing to maintain your performance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weak Areas (&lt; 70% Accuracy)</h3>
      <div className="space-y-3">
        {weak_areas.map((topic) => {
          const accuracy = accuracy_by_topic[topic] || 0;
          const percentage = Math.round(accuracy * 100) / 100;

          return (
            <div key={topic} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">{topic}</p>
                <span className="text-red-600 font-bold">{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-red-600 mt-2">Focus on this area to improve your performance</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeakAreas;
