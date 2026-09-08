import React from 'react';
import { AnalyticsDifficultQuestion } from '../../types/index';

interface DifficultQuestionsProps {
  questions: AnalyticsDifficultQuestion[];
}

const DifficultQuestions: React.FC<DifficultQuestionsProps> = ({ questions }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Hardest Questions</h3>
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No question data in this period (needs 2+ attempts)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Hardest Questions</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Question</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Paper</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Attempts</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Accuracy</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Skips</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Flag</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.question_id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 max-w-xs">
                  <span className="block truncate" title={q.question_text}>
                    {q.question_text || q.question_id}
                  </span>
                  <span className="block text-xs text-gray-500 font-normal">{q.topic}</span>
                </td>
                <td className="py-3 px-4 text-gray-600">{q.paper_name}</td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">{q.attempts}</td>
                <td className="py-3 px-4 text-right">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      q.accuracy >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {q.accuracy.toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-gray-600">{q.skip_count}</td>
                <td className="py-3 px-4 text-gray-600">
                  {q.suspect ? <span title="Accuracy <25% with 5+ attempts — answer key may be wrong">🐛 suspect</span> : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DifficultQuestions;
