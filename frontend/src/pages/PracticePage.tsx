import React, { useState } from 'react';
import { usePractice } from '../context/PracticeContext';
import { useDashboard } from '../context/DashboardContext';
import QuestionDisplay from '../components/Practice/QuestionDisplay';
import { ExplanationDisplay } from '../components/Practice/ExplanationDisplay';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/Select';

const PAPERS = ['IE & IFS', 'PPB', 'AFM', 'RBWM'];

const PracticePage: React.FC = () => {
  const { current_session, session_result, is_loading, error, generatePracticeSet, submitPracticeSet, clearSession } = usePractice();
  const { fetchDashboardData } = useDashboard();
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
      await submitPracticeSet(current_session.session_id, answers, () => {
        fetchDashboardData().catch(() => {});
      });
    } catch (err) {
      console.error('Failed to submit practice set:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (is_loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 font-medium">Generating your practice set with AI...</p>
        <p className="text-gray-400 text-sm">This takes about 30–60 seconds</p>
      </div>
    );
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
          <Select value={selectedPaper} onValueChange={setSelectedPaper}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a paper..." />
            </SelectTrigger>
            <SelectContent>
              {PAPERS.map((paper) => (
                <SelectItem key={paper} value={paper}>{paper}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <p className="text-4xl font-bold text-green-600">
                {Math.floor(session_result.time_taken / 60)}m {session_result.time_taken % 60}s
              </p>
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
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                {/* Question number + status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Question {index + 1}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    result.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {result.correct ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>

                {/* Question text */}
                <p className="text-gray-900 font-medium text-sm mb-3">{result.question_text}</p>

                {/* Options */}
                <div className="space-y-1 mb-3">
                  {Object.entries(result.options || {}).map(([key, val]) => {
                    const isCorrect = key === result.correct_answer;
                    const isUserAnswer = key === result.user_answer;
                    return (
                      <div
                        key={key}
                        className={`flex items-start gap-2 px-3 py-1.5 rounded text-sm ${
                          isCorrect
                            ? 'bg-green-100 text-green-800 font-medium'
                            : isUserAnswer && !result.correct
                            ? 'bg-red-100 text-red-800'
                            : 'text-gray-600'
                        }`}
                      >
                        <span className="font-semibold shrink-0">{key}.</span>
                        <span>{val as string}</span>
                        {isCorrect && <span className="ml-auto shrink-0 text-green-600">✓</span>}
                        {isUserAnswer && !result.correct && <span className="ml-auto shrink-0 text-red-500">✗ Your answer</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Unanswered note */}
                {!result.user_answer && (
                  <p className="text-xs text-gray-500 italic mb-2">Not attempted</p>
                )}

                {/* AI Explanation for wrong answers */}
                {!result.correct && (
                  <ExplanationDisplay
                    questionId={result.question_id}
                    questionText={result.question_text}
                    correctAnswer={result.correct_answer}
                    options={result.options}
                    isCorrect={result.correct}
                  />
                )}
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
