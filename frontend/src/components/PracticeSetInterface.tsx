import React, { useState } from 'react';
import { usePractice } from '../context/PracticeContext';
import { QuestionDisplay } from './QuestionDisplay';
import { OptionButtons } from './OptionButtons';
import { Timer } from './Timer';
import { SubmitButton } from './SubmitButton';
import LoadingSpinner from './LoadingSpinner';

interface PracticeSetInterfaceProps {
  onResultsReady?: () => void;
}

export const PracticeSetInterface: React.FC<PracticeSetInterfaceProps> = ({
  onResultsReady,
}) => {
  const { current_session, submitPracticeSet, is_loading, error } = usePractice();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerStopped, setTimerStopped] = useState(false);
  const [stoppedAtTime, setStoppedAtTime] = useState<number | null>(null);

  if (!current_session || current_session.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const currentQuestion = current_session.questions[currentQuestionIndex];
  const totalQuestions = current_session.questions.length;
  const allQuestionsAnswered = current_session.questions.every(
    (q) => answers[q.question_id]
  );

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.question_id]: option,
    }));
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleTimeUp = async () => {
    // Skip auto-submit if the timer was manually stopped (req 3.11)
    if (timerStopped) return;
    console.log('Time is up! Submitting your practice set...');
    await handleSubmit();
  };

  const handleTimerStop = (stoppedAt: number) => {
    setTimerStopped(true);
    setStoppedAtTime(stoppedAt);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitPracticeSet(current_session.session_id, answers);
      console.log('Practice set submitted successfully!');
      onResultsReady?.();
    } catch (err) {
      console.error('Failed to submit practice set', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatStoppedTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Timer */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{current_session.paper_name}</h1>
              <p className="text-gray-600 mt-1">Practice Session</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <Timer
                duration={600}
                onTimeUp={handleTimeUp}
                onStop={handleTimerStop}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Timer Stopped Banner — reminds user to submit manually (req 3.10, 3.12) */}
        {timerStopped && stoppedAtTime !== null && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg flex items-center gap-3">
            <span className="text-yellow-700 text-lg">⏹</span>
            <div>
              <p className="text-yellow-800 font-semibold">Timer stopped at {formatStoppedTime(stoppedAtTime)}</p>
              <p className="text-yellow-700 text-sm">The timer has been stopped. Please submit your answers manually when ready.</p>
            </div>
          </div>
        )}

        {/* Question Display */}
        <div className="mb-6">
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
          />
        </div>

        {/* Options */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <OptionButtons
            options={Object.values(currentQuestion.options)}
            selectedOption={answers[currentQuestion.question_id] || null}
            onSelectOption={handleSelectOption}
          />
        </div>

        {/* Navigation and Submit */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ← Previous
            </button>

            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600">Progress</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === totalQuestions - 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next →
            </button>
          </div>

          <SubmitButton
            onSubmit={handleSubmit}
            isLoading={isSubmitting || is_loading}
            allQuestionsAnswered={allQuestionsAnswered}
          />

          {!allQuestionsAnswered && (
            <p className="text-sm text-yellow-600 mt-3 text-center">
              ⚠️ You have unanswered questions. You can still submit.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
