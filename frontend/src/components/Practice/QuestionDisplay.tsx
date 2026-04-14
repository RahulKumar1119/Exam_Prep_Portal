import React, { useState, useEffect, useRef } from 'react';
import { PracticeSession } from '../../types/index';
import { loadSessionState, useSessionPersistence } from '../../hooks/useSessionPersistence';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../ui/Dialog';
import { Progress } from '../ui/Progress';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/Tooltip';

interface QuestionDisplayProps {
  session: PracticeSession;
  onAnswer: (questionId: string, answer: string) => void;
  onSubmit: (answers: Record<string, string>) => void;
  isSubmitting?: boolean;
}

const TIMER_DURATION = 40 * 60; // 40 minutes in seconds

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  session,
  onAnswer,
  onSubmit,
  isSubmitting = false
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const answersRef = useRef(answers);

  // Keep ref in sync so the timer callback always has latest answers
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Persist to localStorage on every answers/timeLeft change
  useSessionPersistence(session, answers, timeLeft);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timedOut) {
      onSubmit(answersRef.current);
    }
  }, [timedOut, onSubmit]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 5 * 60; // last 5 minutes
  const isCritical = timeLeft <= 60;    // last 1 minute

  const currentQuestion = session.questions[currentQuestionIndex];
  const totalQuestions = session.questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectAnswer = (optionKey: string) => {
    const questionId = currentQuestion.question_id;
    setAnswers({
      ...answers,
      [questionId]: optionKey
    });
    onAnswer(questionId, optionKey);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const unanswered = totalQuestions - answeredCount;
    if (unanswered > 0) {
      setShowSubmitDialog(true);
    } else {
      onSubmit(answers);
    }
  };

  const isAnswered = answers[currentQuestion.question_id];

  return (
    <div className="space-y-6">
      {/* Restored session banner */}
      {isRestoredSession && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-blue-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Session restored — your answers and timer have been recovered from your last visit.
        </div>
      )}
      {/* Progress Bar + Timer */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Answered: {answeredCount}/{totalQuestions}
            </span>
            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold text-sm ${
              isCritical
                ? 'bg-red-600 text-white animate-pulse'
                : isWarning
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-white text-gray-800 border border-gray-300'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} color="blue" />
        {isWarning && !isCritical && (
          <p className="text-red-600 text-xs mt-2 font-medium">⚠ Less than 5 minutes remaining!</p>
        )}
        {isCritical && (
          <p className="text-red-700 text-xs mt-2 font-bold">🚨 Less than 1 minute! Auto-submitting soon.</p>
        )}
      </div>

      {/* Question Card */}
      <div className="card">
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 flex-1">
              {currentQuestion.question_text}
            </h3>
            <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full whitespace-nowrap">
              {currentQuestion.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-500">Topic: {currentQuestion.topic}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <label
              key={key}
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isAnswered === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.question_id}`}
                value={key}
                checked={isAnswered === key}
                onChange={() => handleSelectAnswer(key)}
                className="w-4 h-4 mt-1 flex-shrink-0"
              />
              <div className="ml-3 flex-1">
                <span className="font-medium text-gray-900">{key}.</span>
                <span className="ml-2 text-gray-700">{value}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Question Palette — click any number to jump directly */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Question Palette</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded bg-blue-600 inline-block"></span> Current
            </span>
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded bg-green-500 inline-block"></span> Answered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded bg-gray-200 inline-block"></span> Skipped
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {session.questions.map((q, idx) => {
            const isActive = idx === currentQuestionIndex;
            const isAns = !!answers[q.question_id];
            return (
              <button
                key={q.question_id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-9 h-9 rounded text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : isAns
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? 'Submitting...' : `Submit (${answeredCount}/${totalQuestions} answered)`}
        </button>
      </div>

      {/* Submit confirmation dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Practice Set?</DialogTitle>
            <DialogDescription>
              You have {totalQuestions - answeredCount} unanswered question{totalQuestions - answeredCount > 1 ? 's' : ''}.
              Unanswered questions will be marked incorrect.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-6">
            <DialogClose asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
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
    </div>
  );
};

export default QuestionDisplay;
