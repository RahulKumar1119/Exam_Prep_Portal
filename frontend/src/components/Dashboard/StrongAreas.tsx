import React from 'react';

interface StrongAreasProps {
  strong_areas: string[];
  accuracy_by_topic: Record<string, number>;
}

const StrongAreas: React.FC<StrongAreasProps> = ({ strong_areas, accuracy_by_topic }) => {
  if (!strong_areas || strong_areas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Strong Areas</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">Take a mock test to identify your strong topics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">📈 Strong Areas</h3>
      <p className="text-xs text-gray-500 mb-4">Topics with 70%+ accuracy — well done!</p>
      <div className="space-y-3">
        {strong_areas.map((topic) => {
          const accuracy = accuracy_by_topic[topic] ?? 0;

          return (
            <div key={topic} className="bg-green-50 border border-green-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-medium text-gray-900 text-sm">{topic}</p>
                <span className="text-green-600 font-bold text-sm">{accuracy}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StrongAreas;
