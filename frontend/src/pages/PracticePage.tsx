import React, { useState } from 'react';
import { usePractice } from '../context/PracticeContext';
import { useDashboard } from '../context/DashboardContext';
import QuestionDisplay from '../components/Practice/QuestionDisplay';
import { ExplanationDisplay } from '../components/Practice/ExplanationDisplay';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/Select';

const PAPERS = [
  { id: 'IE & IFS', name: 'IE & IFS', fullName: 'Indian Economy & Indian Financial System', totalQuestions: 1068, sets: 21 },
  { id: 'PPB', name: 'PPB', fullName: 'Principles & Practices of Banking', totalQuestions: 536, sets: 11 },
  { id: 'AFM', name: 'AFM', fullName: 'Accounting & Financial Management for Bankers', totalQuestions: 535, sets: 11 },
  { id: 'RBWM', name: 'RBWM', fullName: 'Retail Banking & Wealth Management', totalQuestions: 299, sets: 6 },
];

const PracticePage: React.FC = () => {
  const { current_session, session_result, is_loading, error, generatePracticeSet, submitPracticeSet, clearSession } = usePractice();
  const { fetchDashboardData } = useDashboard();
  const [selectedPaper, setSelectedPaper] = useState('');
  const [selectedSet, setSelectedSet] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPaperInfo = PAPERS.find(p => p.id === selectedPaper);

  const handleStartPracticeSet = async () => {
    if (!selectedPaper) {
      alert('Please select a paper');
      return;
    }
    try {
      const setNum = selectedSet || 1;
      setSelectedSet(setNum);
      await generatePracticeSet(selectedPaper, 'practice', setNum);
    } catch (err) {
      console.error('Failed to generate practice set:', err);
    }
  };

  const handleAnswerQuestion = (questionId: string, answer: string) => {
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
        <p className="text-gray-600 font-medium">Generating Practice Set...</p>
        <p className="text-gray-400 text-sm">Preparing 50 questions for you</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Practice Sets</h1>
        <p className="text-gray-600 mt-2">50 questions per set • No time limit • Instant feedback</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!current_session ? (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Paper Info Banner */}
          {selectedPaper && currentPaperInfo && (
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white text-center">
              <h2 className="text-2xl font-bold">{currentPaperInfo.name} Full Practice Tests</h2>
              <p className="text-green-100 mt-1">
                Total Questions: {currentPaperInfo.totalQuestions} — {currentPaperInfo.sets} Practice Sets
              </p>
            </div>
          )}

          {/* Practice Set Selection */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Select Paper</h2>
            <Select value={selectedPaper} onValueChange={(val) => { setSelectedPaper(val); setSelectedSet(null); }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a paper..." />
              </SelectTrigger>
              <SelectContent>
                {PAPERS.map((paper) => (
                  <SelectItem key={paper.id} value={paper.id}>
                    {paper.name} — {paper.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Practice Set Grid */}
            {selectedPaper && currentPaperInfo && (
              <div className="mt-8">
                <div className="bg-sky-100 rounded-lg p-4 text-center mb-6">
                  <h3 className="text-lg font-bold text-sky-800">
                    Practice Set {selectedSet || '—'}
                  </h3>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <p className="text-gray-700 mb-4">Click on Start Quiz.</p>
                  <button
                    onClick={handleStartPracticeSet}
                    disabled={is_loading}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    Start Test
                  </button>
                </div>

                {/* Page Numbers */}
                <div className="bg-sky-100 rounded-lg p-4 text-center mb-4">
                  <p className="text-sky-800 font-medium">Use Page numbers below to navigate to other practice sets</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600 font-medium">Pages:</span>
                  {Array.from({ length: currentPaperInfo.sets }, (_, i) => i + 1).map((setNum) => (
                    <button
                      key={setNum}
                      onClick={() => setSelectedSet(setNum)}
                      className={`w-9 h-9 rounded border text-sm font-medium transition-all ${
                        selectedSet === setNum
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                      }`}
                    >
                      {setNum}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Practice Set Info */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-3">📝 Practice Set Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xl font-bold text-blue-600">50</p>
                <p className="text-xs text-gray-600">Questions</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xl font-bold text-green-600">No Limit</p>
                <p className="text-xs text-gray-600">Time</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xl font-bold text-purple-600">Instant</p>
                <p className="text-xs text-gray-600">Feedback</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xl font-bold text-orange-600">AI</p>
                <p className="text-xs text-gray-600">Explanations</p>
              </div>
            </div>
          </div>
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
