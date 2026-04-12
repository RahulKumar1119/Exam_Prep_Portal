import React from 'react';
import { Question } from '../../types/index';

interface QuestionListProps {
  questions: Question[];
  onEdit?: (question: Question) => void;
  onDelete?: (question_id: string) => void;
  is_loading?: boolean;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onEdit, onDelete, is_loading = false }) => {
  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">No questions found. Try adjusting your search filters.</p>
      </div>
    );
  }

  const difficulty_color = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question.question_id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{question.paper_name}</span> • <span>{question.topic}</span>
              </p>
              <p className="text-gray-900 font-medium mb-3">{question.question_text}</p>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                {Object.entries(question.options).map(([key, value]) => {
                  const is_correct = key === question.correct_answer;
                  return (
                    <div
                      key={key}
                      className={`p-2 rounded text-sm ${
                        is_correct ? 'bg-green-50 border border-green-200 text-green-900' : 'bg-gray-50 border border-gray-200 text-gray-700'
                      }`}
                    >
                      <span className="font-bold">{key}.</span> {value}
                      {is_correct && <span className="ml-2 text-green-600 font-bold">✓</span>}
                    </div>
                  );
                })}
              </div>

              {/* References */}
              <div className="text-xs text-gray-600 space-y-1">
                {question.rbi_reference && <p>RBI: {question.rbi_reference}</p>}
                {question.iibf_reference && <p>IIBF: {question.iibf_reference}</p>}
              </div>
            </div>

            {/* Difficulty Badge and Actions */}
            <div className="flex-shrink-0 flex flex-col items-end gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficulty_color(question.difficulty)}`}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>

              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(question)}
                    disabled={is_loading}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium disabled:opacity-50"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(question.question_id)}
                    disabled={is_loading}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
