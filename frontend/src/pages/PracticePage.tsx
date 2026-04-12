import React, { useState } from 'react';
import { usePractice } from '../context/PracticeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import QuestionDisplay from '../components/Practice/QuestionDisplay';
import { ExplanationDisplay } from '../components/Practice/ExplanationDisplay';

const PAPERS = ['IE & IFS', 'PPB', 'AFB', 'RBWM'];

const PracticePage: React.FC = () => {
  const { current_session, session_result, is_loading, error, generatePracticeSet, submitPracticeSet, clearSession } = usePractice();
  const [selectedPaper, setSelectedPaper] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGeneratePracticeSet = async () => {
    if (!selectedPaper) {
      alert('Please select a paper');
      return;
    }
    try {
      await generatePracticeSet(selectedPaper);
    } catch (err) {
      console.error('Failed to generate practice set:', err);
    }
  };

  const handleAnswerQuestion = (questionId: string, answer: string) => {
    // This will be handled by the context
    console.log(`Question ${questionId} answered with ${answer}`);
  };

  const handleSubmitPracticeSet = async (answers: Record<string, string>) => {
    if (!current_session) return;
    
    setIsSubmitting(true);
    try {
      await submitPracticeSet(current_session.session_id, answers);
    } catch (err) {
      console.error('Failed to submit practice set:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (is_loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Practice Sets</h1>
        <p className="text-gray-600 mt-2">Select a paper and start practicing</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!current_session ? (
        <div className="card max-w-md">
          <h2 className="text-xl font-bold mb-4">Select a Paper</h2>
          <div className="space-y-3">
            {PAPERS.map((paper) => (
              <label key={paper} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paper"
                  value={paper}
                  checked={selectedPaper === paper}
                  onChange={(e) => setSelectedPaper(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="ml-3 font-medium text-gray-700">{paper}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleGeneratePracticeSet}
            disabled={!selectedPaper || is_loading}
            className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Practice Set
          </button>
        </div>
      ) : session_result ? (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Results</h2>
            <button
              onClick={clearSession}
              className="btn-secondary"
            >
              Back to Papers
            </button>
          </div>
          
          {/* Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Your Score</p>
              <p className="text-4xl font-bold text-blue-600">{session_result.score}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Time Taken</p>
              <p className="text-4xl font-bold text-green-600">{session_result.time_taken}s</p>
            </div>
            <div className={`rounded-lg p-6 text-center ${session_result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-gray-600 text-sm mb-2">Status</p>
              <p className={`text-4xl font-bold ${session_result.passed ? 'text-green-600' : 'text-red-600'}`}>
                {session_result.passed ? 'PASSED' : 'FAILED'}
              </p>
            </div>
          </div>

          {/* Results Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Question Review</h3>
            {session_result.results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.correct
                    ? 'border-green-600 bg-green-50'
                    : 'border-red-600 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Question {index + 1}</p>
                    <p className={`text-sm mt-1 ${result.correct ? 'text-green-700' : 'text-red-700'}`}>
                      {result.correct ? '✓ Correct' : '✗ Incorrect'}
                    </p>
                    {!result.correct && (
                      <>
                        <p className="text-sm text-gray-600 mt-2">
                          Your answer: <span className="font-medium">{result.user_answer}</span>
                          <br />
                          Correct answer: <span className="font-medium">{result.correct_answer}</span>
                        </p>
                        <ExplanationDisplay
                          questionId={result.question_id}
                          questionText={result.question_text}
                          correctAnswer={result.correct_answer}
                          options={result.options}
                          isCorrect={result.correct}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{current_session.paper_name}</h2>
            <button
              onClick={clearSession}
              className="btn-secondary"
            >
              Back
            </button>
          </div>
          <QuestionDisplay
            session={current_session}
            onAnswer={handleAnswerQuestion}
            onSubmit={handleSubmitPracticeSet}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
};

export default PracticePage;
