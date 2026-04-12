import React from 'react';
import { Question, QuestionResult } from '../types/index';

interface QuestionReviewProps {
  question: Question;
  result: QuestionResult;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionReview: React.FC<QuestionReviewProps> = ({
  question,
  result,
  questionNumber,
  totalQuestions,
}) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`border-l-4 p-6 rounded-lg ${result.correct ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {result.correct ? (
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            Question {questionNumber} of {totalQuestions}
          </h3>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[question.difficulty]}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {question.topic}
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6 pb-4 border-b border-gray-300">
        <p className="text-gray-800 text-lg leading-relaxed">{question.question_text}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {Object.entries(question.options).map(([label, option]) => {
          const isCorrect = label === result.correct_answer;
          const isUserAnswer = label === result.user_answer;
          const isWrongAnswer = isUserAnswer && !isCorrect;

          let optionStyle = 'border-gray-300 bg-white';
          if (isCorrect) {
            optionStyle = 'border-green-600 bg-green-50 border-2';
          } else if (isWrongAnswer) {
            optionStyle = 'border-red-600 bg-red-50 border-2';
          } else {
            optionStyle = 'border-gray-300 bg-gray-50 opacity-60';
          }

          return (
            <div
              key={label}
              className={`p-4 rounded-lg border transition-all ${optionStyle}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-700 min-w-8">{label}.</span>
                  <span className="text-gray-800">{option}</span>
                </div>
                <div>
                  {isCorrect && (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {isWrongAnswer && (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Answer Summary */}
      <div className="bg-white rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Your Answer:</span>
          <span className="font-semibold text-gray-900">
            {result.user_answer ? `${result.user_answer}. ${question.options[result.user_answer]}` : 'Not answered'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Correct Answer:</span>
          <span className="font-semibold text-green-700">
            {result.correct_answer}. {question.options[result.correct_answer]}
          </span>
        </div>
      </div>
    </div>
  );
};
