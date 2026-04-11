import React from 'react';
import { QuestionStats as QuestionStatsType } from '../../types/index';

interface QuestionStatsProps {
  title: string;
  questions: QuestionStatsType[];
  stat_type: 'attempted' | 'skipped';
}

const QuestionStats: React.FC<QuestionStatsProps> = ({ title, questions, stat_type }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No data available yet</p>
        </div>
      </div>
    );
  }

  const max_count = Math.max(...questions.map((q) => (stat_type === 'attempted' ? q.attempt_count : q.skip_count || 0)));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {questions.slice(0, 10).map((question, index) => {
          const count = stat_type === 'attempted' ? question.attempt_count : question.skip_count || 0;
          const percentage = (count / max_count) * 100;
          const bar_color = stat_type === 'attempted' ? 'bg-blue-500' : 'bg-red-500';

          return (
            <div key={question.question_id} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{question.question_text}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${bar_color} h-2 rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }} />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {count} {stat_type === 'attempted' ? 'attempts' : 'skips'}
                  {question.average_score !== undefined && ` • Avg Score: ${question.average_score.toFixed(1)}%`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionStats;
