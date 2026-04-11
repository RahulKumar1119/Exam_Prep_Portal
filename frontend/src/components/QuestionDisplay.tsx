import React from 'react';
import { Question } from '../types/index';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionNumber,
  totalQuestions,
}) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Question {questionNumber} of {totalQuestions}
        </h2>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[question.difficulty]}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {question.topic}
          </span>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-lg text-gray-800 leading-relaxed">{question.question_text}</p>
      </div>
    </div>
  );
};
