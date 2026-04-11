import React from 'react';

interface RecommendedPracticeProps {
  weak_areas: string[];
  total_sessions: number;
}

const RecommendedPractice: React.FC<RecommendedPracticeProps> = ({ weak_areas, total_sessions }) => {
  if (!weak_areas || weak_areas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Practice</h3>
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-blue-700">You're doing great! Continue practicing to maintain your performance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Practice Areas</h3>
      <p className="text-gray-600 text-sm mb-4">
        Based on your performance, we recommend focusing on these areas to improve your overall score:
      </p>
      <div className="space-y-3">
        {weak_areas.slice(0, 5).map((topic, index) => (
          <div key={topic} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-grow">
              <p className="font-medium text-gray-900">{topic}</p>
              <p className="text-sm text-gray-600 mt-1">
                Practice questions from this topic to strengthen your understanding and improve your accuracy.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Practice suggestion */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <p className="font-semibold text-gray-900 mb-2">Next Steps</p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✓ Generate practice sets focusing on weak areas</li>
          <li>✓ Review explanations for incorrect answers</li>
          <li>✓ Track your progress over time</li>
          <li>✓ Aim for 75% or higher on each practice set</li>
        </ul>
      </div>

      {/* Motivation message */}
      {total_sessions > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            You've completed <span className="font-bold text-blue-600">{total_sessions}</span> practice sets. Keep going!
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendedPractice;
