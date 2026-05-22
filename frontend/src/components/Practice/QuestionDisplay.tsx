import React, { useState, useEffect, useRef } from 'react';
import { PracticeSession } from '../../types/index';
import { loadSessionState, useSessionPersistence } from '../../hooks/useSessionPersistence';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../ui/Dialog';
import { ExplanationDisplay } from './ExplanationDisplay';

interface QuestionDisplayProps {
  session: PracticeSession;
  onAnswer: (questionId: string, answer: string) => void;
  onSubmit: (answers: Record<string, string>) => void;
  isSubmitting?: boolean;
  isMockTest?: boolean;
}

const TIMER_DURATION = 120 * 60; // 120 minutes in seconds

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  session,
  onAnswer,
  onSubmit,
  isSubmitting = false,
  isMockTest = false
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reviewedQuestions, setReviewedQuestions] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set());
  const [showFinalReview, setShowFinalReview] = useState(false);

  // Restore answers + timer from localStorage if available
  const persisted = loadSessionState();
  const isRestoredSession = persisted?.session?.session_id === session.session_id;

  const [answers, setAnswers] = useState<Record<string, string>>(
    isRestoredSession ? persisted!.answers : {}
  );
  const [timeLeft, setTimeLeft] = useState(
    isRestoredSession ? persisted!.timeLeft : TIMER_DURATION
  );
  const [timedOut, setTimedOut] = useState(false);
  const answersRef = useRef(answers);

  useEffect(() => { answersRef.current = answers; }, [answers]);
  useSessionPersistence(session, answers, timeLeft);

  // Countdown timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); setTimedOut(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timedOut) onSubmit(answersRef.current);
  }, [timedOut, onSubmit]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 5 * 60;
  const isCritical = timeLeft <= 60;

  const currentQuestion = session.questions[currentQuestionIndex];
  const totalQuestions = session.questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectAnswer = (optionKey: string) => {
    const questionId = currentQuestion.question_id;
    setAnswers({ ...answers, [questionId]: optionKey });
    onAnswer(questionId, optionKey);
  };

  const handleClearAnswer = () => {
    const questionId = currentQuestion.question_id;
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleReviewQuestion = () => {
    const qid = currentQuestion.question_id;
    setReviewedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  };

  const handleSubmit = () => {
    const unanswered = totalQuestions - answeredCount;
    if (unanswered > 0) setShowSubmitDialog(true);
    else onSubmit(answers);
  };

  const isAnswered = answers[currentQuestion.question_id];
  const isReviewed = reviewedQuestions.has(currentQuestion.question_id);

  return (
    <div className="space-y-4">
      {/* Question Palette at top */}
      <div className="bg-white rounded-lg shadow p-4 border">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {session.questions.map((q, idx) => {
            const isActive = idx === currentQuestionIndex;
            const isAns = !!answers[q.question_id];
            const isRev = reviewedQuestions.has(q.question_id);
            return (
              <button
                key={q.question_id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300'
                    : isRev
                    ? 'bg-orange-400 text-white border-orange-500 hover:bg-orange-500'
                    : isAns
                    ? 'bg-green-500 text-white border-green-600 hover:bg-green-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-500 inline-block"></span> Answer
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-orange-400 inline-block"></span> Review
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-100 border border-gray-300 inline-block"></span> Unattempted
          </span>
        </div>

        {/* Action buttons row: Review question, Pause, Timer, Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReviewQuestion}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                isReviewed
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isReviewed ? '✓ Reviewed' : 'Review question'}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                isPaused
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono font-bold text-sm ${
              isCritical
                ? 'bg-red-600 text-white animate-pulse'
                : isWarning
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-gray-100 text-gray-800 border border-gray-300'
            }`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>
          <button
            onClick={() => isMockTest ? setShowFinalReview(true) : setShowSummary(true)}
            className="px-4 py-2 text-sm font-semibold bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all"
          >
            {isSubmitting ? 'Submitting...' : isMockTest ? 'Final Review & Submit' : 'Summary'}
          </button>
        </div>
      </div>

      {/* Question counter */}
      <p className="text-sm text-indigo-600 font-medium">
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </p>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow border p-6">
        {/* Question text */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-900">
            {currentQuestionIndex + 1}. Question
          </h3>
          <p className="mt-2 text-gray-800 leading-relaxed whitespace-pre-wrap">
            {currentQuestion.question_text}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            const isChecked = checkedQuestions.has(currentQuestion.question_id);
            const isSelected = isAnswered === key;
            const isCorrectOption = key === currentQuestion.correct_answer;

            let optionStyle = 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
            if (isChecked) {
              if (isCorrectOption) {
                optionStyle = 'border-green-500 bg-green-50';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'border-red-500 bg-red-50';
              } else {
                optionStyle = 'border-gray-200 bg-white';
              }
            } else if (isSelected) {
              optionStyle = 'border-indigo-500 bg-indigo-50';
            }

            return (
              <label
                key={key}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${optionStyle}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.question_id}`}
                  value={key}
                  checked={isSelected}
                  onChange={() => handleSelectAnswer(key)}
                  className="w-4 h-4 text-indigo-600 flex-shrink-0"
                />
                <span className="ml-3 text-gray-800">
                  <span className="font-medium">{key}.</span> {value}
                </span>
                {isChecked && isCorrectOption && (
                  <span className="ml-auto text-green-600 font-bold text-sm">✓ Correct</span>
                )}
                {isChecked && isSelected && !isCorrectOption && (
                  <span className="ml-auto text-red-600 font-bold text-sm">✗ Wrong</span>
                )}
              </label>
            );
          })}
        </div>

        {/* Explanation after Check */}
        {checkedQuestions.has(currentQuestion.question_id) && (
          <div className="mt-4">
            <ExplanationDisplay
              questionId={currentQuestion.question_id}
              questionText={currentQuestion.question_text}
              options={currentQuestion.options}
              correctAnswer={currentQuestion.correct_answer}
              isCorrect={isAnswered === currentQuestion.correct_answer}
            />
          </div>
        )}

        {/* Bottom action buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
          {/* Left buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Back
            </button>
            <button
              onClick={handleClearAnswer}
              disabled={!isAnswered}
              className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Clear Answer
            </button>
            <button
              onClick={() => setShowReportDialog(true)}
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            >
              Report Question
            </button>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            {!isMockTest && (
              <button
                onClick={() => {
                  // "Check" reveals the correct answer for current question
                  const qid = currentQuestion.question_id;
                  if (!answers[qid]) {
                    // If not answered, just highlight — user needs to select first
                    return;
                  }
                  setCheckedQuestions(prev => new Set(prev).add(qid));
                }}
                disabled={!isAnswered}
                className="px-4 py-2 text-sm font-semibold bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Check
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="px-4 py-2 text-sm font-semibold bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Paused overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
            <p className="text-2xl font-bold text-gray-900 mb-2">⏸ Test Paused</p>
            <p className="text-gray-600 mb-6">Click resume to continue your test</p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
            >
              ▶ Resume Test
            </button>
          </div>
        </div>
      )}

      {/* Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Summary</DialogTitle>
            <DialogDescription>
              Overview of your progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total Questions</span>
              <span className="font-bold">{totalQuestions}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Answered</span>
              <span className="font-bold text-green-600">{answeredCount}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Unattempted</span>
              <span className="font-bold text-gray-500">{totalQuestions - answeredCount}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Marked for Review</span>
              <span className="font-bold text-orange-500">{reviewedQuestions.size}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Time Remaining</span>
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <DialogClose asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Continue
              </button>
            </DialogClose>
            <button
              onClick={() => { setShowSummary(false); handleSubmit(); }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
            >
              Submit Test
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submit confirmation dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Mock Test?</DialogTitle>
            <DialogDescription>
              You have {totalQuestions - answeredCount} unanswered question{totalQuestions - answeredCount > 1 ? 's' : ''}.
              Unanswered questions will be marked incorrect.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-6">
            <DialogClose asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Continue Answering
              </button>
            </DialogClose>
            <button
              onClick={() => { setShowSubmitDialog(false); onSubmit(answers); }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
            >
              Submit Anyway
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Final Review Dialog (Mock Test mode) */}
      <Dialog open={showFinalReview} onOpenChange={setShowFinalReview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>📋 Final Review — Mock Test</DialogTitle>
            <DialogDescription>
              Review your answers before submitting. You cannot change answers after submission.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{answeredCount}</p>
                <p className="text-xs text-green-600">Answered</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-700">{totalQuestions - answeredCount}</p>
                <p className="text-xs text-gray-600">Unattempted</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-orange-700">{reviewedQuestions.size}</p>
                <p className="text-xs text-orange-600">Marked for Review</p>
              </div>
            </div>

            {/* Time remaining */}
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-sm text-gray-600">Time remaining:</span>
              <span className={`font-mono font-bold ${isWarning ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Question-by-question review */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700">Question Status</p>
              </div>
              <div className="max-h-60 overflow-y-auto p-3">
                <div className="grid grid-cols-10 gap-1.5">
                  {session.questions.map((q, idx) => {
                    const isAns = !!answers[q.question_id];
                    const isRev = reviewedQuestions.has(q.question_id);
                    return (
                      <button
                        key={q.question_id}
                        onClick={() => { setShowFinalReview(false); setCurrentQuestionIndex(idx); }}
                        title={`Q${idx + 1}: ${isAns ? 'Answered' : 'Unattempted'}${isRev ? ' (Review)' : ''}`}
                        className={`w-8 h-8 rounded text-xs font-bold transition-all border ${
                          isRev
                            ? 'bg-orange-400 text-white border-orange-500 hover:bg-orange-500'
                            : isAns
                            ? 'bg-green-500 text-white border-green-600 hover:bg-green-600'
                            : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Unanswered questions list */}
            {totalQuestions - answeredCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  ⚠️ {totalQuestions - answeredCount} unanswered question{totalQuestions - answeredCount > 1 ? 's' : ''} — these will score 0 marks
                </p>
                <div className="flex flex-wrap gap-1">
                  {session.questions.map((q, idx) => {
                    if (answers[q.question_id]) return null;
                    return (
                      <button
                        key={q.question_id}
                        onClick={() => { setShowFinalReview(false); setCurrentQuestionIndex(idx); }}
                        className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300 font-medium"
                      >
                        Q{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Review-marked questions */}
            {reviewedQuestions.size > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm font-medium text-orange-800 mb-2">
                  🔖 {reviewedQuestions.size} question{reviewedQuestions.size > 1 ? 's' : ''} marked for review
                </p>
                <div className="flex flex-wrap gap-1">
                  {session.questions.map((q, idx) => {
                    if (!reviewedQuestions.has(q.question_id)) return null;
                    return (
                      <button
                        key={q.question_id}
                        onClick={() => { setShowFinalReview(false); setCurrentQuestionIndex(idx); }}
                        className="px-2 py-1 text-xs bg-orange-200 text-orange-800 rounded hover:bg-orange-300 font-medium"
                      >
                        Q{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
            <DialogClose asChild>
              <button className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                ← Continue Test
              </button>
            </DialogClose>
            <button
              onClick={() => { setShowFinalReview(false); onSubmit(answers); }}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg"
            >
              ✓ Submit Mock Test
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Question Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Question</DialogTitle>
            <DialogDescription>
              Report an issue with question {currentQuestionIndex + 1}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {['Wrong answer marked as correct', 'Question is incomplete', 'Options are wrong', 'Duplicate question', 'Other'].map((reason) => (
              <label key={reason} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="report-reason" className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-gray-700">{reason}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <DialogClose asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">
                Submit Report
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionDisplay;
