import React, { useState } from 'react';
import { SessionResult } from '../../types/index';
import { ExplanationDisplay } from './ExplanationDisplay';

interface MockTestResultsProps {
  result: SessionResult;
  onBack: () => void;
}

const MockTestResults: React.FC<MockTestResultsProps> = ({ result, onBack }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const isMockTest = result.mode === 'mock_test';
  const marksEarned = result.marks_earned ?? 0;
  const totalMarks = result.total_marks ?? 100;
  const passMarks = result.pass_marks ?? 50;
  const breakdown = result.breakdown;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const getScoreColor = () => {
    if (result.passed) return 'text-green-600';
    if (result.score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredResults = selectedDifficulty
    ? result.results.filter(r => r.difficulty === selectedDifficulty)
    : result.results;

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className={`card border-2 ${result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <div className="text-center">
          <div className="text-6xl mb-2">{result.passed ? '🎉' : '📚'}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {result.passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
          </h2>
          
          {isMockTest ? (
            <div className="mt-4">
              <p className={`text-4xl font-bold ${getScoreColor()}`}>
                {marksEarned} / {totalMarks} marks
              </p>
              <p className="text-gray-600 mt-1">
                Pass marks: {passMarks} | Your score: {result.score}%
              </p>
            </div>
          ) : (
            <p className={`text-4xl font-bold ${getScoreColor()}`}>
              {result.score}%
            </p>
          )}

          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
            <span>⏱ Time: {formatTime(result.time_taken)}</span>
            <span>✅ Correct: {result.correct_count ?? result.results.filter(r => r.correct).length}/{result.total_questions ?? result.results.length}</span>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown (Mock Test only) */}
      {isMockTest && breakdown && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4">📊 Marks Breakdown by Difficulty</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Easy */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-green-800">🟢 Easy</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                  {breakdown.easy.marks_per_q} mark each
                </span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {breakdown.easy.correct}/{breakdown.easy.total}
              </p>
              <p className="text-sm text-green-600">
                Marks: {(breakdown.easy.correct * breakdown.easy.marks_per_q).toFixed(1)} / {(breakdown.easy.total * breakdown.easy.marks_per_q).toFixed(1)}
              </p>
              <div className="mt-2 bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${breakdown.easy.total > 0 ? (breakdown.easy.correct / breakdown.easy.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-yellow-800">🟡 Medium</span>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                  {breakdown.medium.marks_per_q} mark each
                </span>
              </div>
              <p className="text-2xl font-bold text-yellow-700">
                {breakdown.medium.correct}/{breakdown.medium.total}
              </p>
              <p className="text-sm text-yellow-600">
                Marks: {(breakdown.medium.correct * breakdown.medium.marks_per_q).toFixed(1)} / {(breakdown.medium.total * breakdown.medium.marks_per_q).toFixed(1)}
              </p>
              <div className="mt-2 bg-yellow-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${breakdown.medium.total > 0 ? (breakdown.medium.correct / breakdown.medium.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-red-800">🔴 Hard</span>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                  {breakdown.hard.marks_per_q} marks each
                </span>
              </div>
              <p className="text-2xl font-bold text-red-700">
                {breakdown.hard.correct}/{breakdown.hard.total}
              </p>
              <p className="text-sm text-red-600">
                Marks: {(breakdown.hard.correct * breakdown.hard.marks_per_q).toFixed(1)} / {(breakdown.hard.total * breakdown.hard.marks_per_q).toFixed(1)}
              </p>
              <div className="mt-2 bg-red-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${breakdown.hard.total > 0 ? (breakdown.hard.correct / breakdown.hard.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Key Insight */}
          {breakdown.hard.total > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Key insight:</strong> Hard questions carry {breakdown.hard.marks_per_q} marks each 
                ({(breakdown.hard.total * breakdown.hard.marks_per_q).toFixed(0)} marks total = 50% of the paper). 
                You got {breakdown.hard.correct}/{breakdown.hard.total} correct 
                ({breakdown.hard.total > 0 ? Math.round((breakdown.hard.correct / breakdown.hard.total) * 100) : 0}% accuracy).
                {breakdown.hard.correct / breakdown.hard.total < 0.5 && 
                  ' Focus more on hard/numerical questions to improve your score significantly.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Question Review */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">📋 Question Review</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDifficulty(null)}
              className={`px-3 py-1 text-xs rounded-full ${!selectedDifficulty ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All ({result.results.length})
            </button>
            <button
              onClick={() => setSelectedDifficulty('easy')}
              className={`px-3 py-1 text-xs rounded-full ${selectedDifficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
            >
              Easy
            </button>
            <button
              onClick={() => setSelectedDifficulty('medium')}
              className={`px-3 py-1 text-xs rounded-full ${selectedDifficulty === 'medium' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'}`}
            >
              Medium
            </button>
            <button
              onClick={() => setSelectedDifficulty('hard')}
              className={`px-3 py-1 text-xs rounded-full ${selectedDifficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
            >
              Hard
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-4"
        >
          {showDetails ? '▼ Hide detailed review' : '▶ Show detailed review'}
        </button>

        {showDetails && (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredResults.map((r, idx) => (
              <div
                key={r.question_id}
                className={`p-4 rounded-lg border ${r.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900 flex-1 text-sm">
                    {idx + 1}. {r.question_text}
                  </p>
                  <div className="flex items-center gap-2 ml-2">
                    {r.difficulty && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        r.difficulty === 'easy' ? 'bg-green-200 text-green-800' :
                        r.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {r.difficulty} ({r.max_marks ?? 1} mk)
                      </span>
                    )}
                    <span className={`text-lg ${r.correct ? '✅' : '❌'}`}>
                      {r.correct ? '✅' : '❌'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(r.options).map(([key, value]) => (
                    <div
                      key={key}
                      className={`px-3 py-1.5 rounded ${
                        key === r.correct_answer
                          ? 'bg-green-200 text-green-900 font-medium'
                          : key === r.user_answer && !r.correct
                          ? 'bg-red-200 text-red-900'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{key}.</span> {value}
                    </div>
                  ))}
                </div>
                {!r.correct && (
                  <p className="text-xs text-gray-600 mt-2">
                    Your answer: <span className="font-medium text-red-700">{r.user_answer || 'Not answered'}</span> | 
                    Correct: <span className="font-medium text-green-700">{r.correct_answer}</span>
                  </p>
                )}
                {/* Explanation */}
                <ExplanationDisplay
                  questionId={r.question_id}
                  questionText={r.question_text}
                  options={r.options}
                  correctAnswer={r.correct_answer}
                  isCorrect={r.correct}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
        >
          ← Take Another Mock Test
        </button>
      </div>
    </div>
  );
};

export default MockTestResults;
