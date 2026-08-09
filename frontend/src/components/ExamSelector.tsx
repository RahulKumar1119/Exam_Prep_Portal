import React from 'react';
import { AVAILABLE_EXAMS, ExamId } from '../hooks/useExamPreference';

interface ExamSelectorProps {
  onSelect: (exam: ExamId) => void;
  title?: string;
}

const ExamSelector: React.FC<ExamSelectorProps> = ({ onSelect, title }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title || 'Which exam are you preparing for?'}
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          We'll show you only the relevant practice sets. You can change this anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {AVAILABLE_EXAMS.map((exam) => (
          <button
            key={exam.id}
            onClick={() => onSelect(exam.id)}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left hover:border-indigo-500 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                exam.id === 'JAIIB' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                <span className="text-2xl">{exam.id === 'JAIIB' ? '🏦' : '🤖'}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition">
                  {exam.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{exam.fullName}</p>
                {exam.id === 'JAIIB' && (
                  <p className="text-xs text-green-600 mt-2 font-medium">3,600+ questions available</p>
                )}
                {exam.id === 'AI-300' && (
                  <p className="text-xs text-orange-600 mt-2 font-medium">Coming soon</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamSelector;
