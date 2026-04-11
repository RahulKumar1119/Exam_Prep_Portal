import React from 'react';
import { SessionResult } from '../types/index';

interface ResultsDisplayProps {
  result: SessionResult;
  timeTaken: number;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, timeTaken }) => {
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const correctCount = result.results.filter((r) => r.correct).length;
  const totalQuestions = result.results.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Practice Set Complete!</h1>

        {/* Score Display */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-indigo-600 mb-2">{result.score}%</div>
          <p className="text-lg text-gray-600">
            {correctCount} out of {totalQuestions} correct
          </p>
        </div>

        {/* Pass/Fail Badge */}
        <div className="mb-8">
          {result.passed ? (
            <div className="inline-block px-6 py-3 bg-green-100 border-2 border-green-600 rounded-lg">
              <p className="text-green-800 font-bold text-lg">✓ Passed</p>
              <p className="text-green-700 text-sm">Great job! You scored 75% or higher.</p>
            </div>
          ) : (
            <div className="inline-block px-6 py-3 bg-orange-100 border-2 border-orange-600 rounded-lg">
              <p className="text-orange-800 font-bold text-lg">⚠ Review Needed</p>
              <p className="text-orange-700 text-sm">Keep practicing to improve your score.</p>
            </div>
          )}
        </div>

        {/* Time Taken */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <p className="text-gray-600 text-sm">Time Taken</p>
          <p className="text-2xl font-semibold text-gray-900">
            {minutes}m {seconds}s
          </p>
        </div>

        {/* Questions Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-green-600 text-sm font-medium">Correct</p>
            <p className="text-3xl font-bold text-green-700">{correctCount}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-red-600 text-sm font-medium">Incorrect</p>
            <p className="text-3xl font-bold text-red-700">{totalQuestions - correctCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
