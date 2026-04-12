import React, { useState } from 'react';
import { PracticeSession } from '../../types/index';

interface QuestionDisplayProps {
  session: PracticeSession;
  onAnswer: (questionId: string, answer: string) => void;
  onSubmit: (answers: Record<string, string>) => void;
  isSubmitting?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  session,
  onAnswer,
  onSubmit,
  isSubmitting = false
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

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
    if (answeredCount === totalQuestions) {
      onSubmit(answers);
    } else {
      alert(`Please answer all ${totalQuestions} questions before submitting.`);
    }
  };

  const isAnswered = answers[currentQuestion.question_id];

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-gray-700">
            Answered: {answeredCount}/{totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
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

          <div className="flex gap-2">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-lg font-medium text-sm transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[session.questions[index].question_id]
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={answeredCount !== totalQuestions || isSubmitting}
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? 'Submitting...' : `Submit Answers (${answeredCount}/${totalQuestions})`}
        </button>
      </div>
    </div>
  );
};

export default QuestionDisplay;
