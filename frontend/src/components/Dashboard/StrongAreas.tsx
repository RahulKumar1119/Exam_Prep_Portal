import React from 'react';

interface StrongAreasProps {
  strong_areas: string[];
  accuracy_by_topic: Record<string, number>;
}

const StrongAreas: React.FC<StrongAreasProps> = ({ strong_areas, accuracy_by_topic }) => {
  if (!strong_areas || strong_areas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strong Areas</h3>
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-blue-700">Keep practicing to identify your strong areas!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Strong Areas (&gt; 85% Accuracy)</h3>
      <div className="space-y-3">
        {strong_areas.map((topic) => {
          const accuracy = accuracy_by_topic[topic] || 0;
          const percentage = Math.round(accuracy * 100) / 100;

          return (
            <div key={topic} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">{topic}</p>
                <span className="text-green-600 font-bold">{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-green-600 mt-2">Excellent performance! You've mastered this topic.</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StrongAreas;
