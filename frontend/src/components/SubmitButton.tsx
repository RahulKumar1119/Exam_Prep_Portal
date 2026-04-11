import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SubmitButtonProps {
  onSubmit: () => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  allQuestionsAnswered?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  isLoading = false,
  disabled = false,
  allQuestionsAnswered = true,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = () => {
    if (!allQuestionsAnswered) {
      setShowConfirmation(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setShowConfirmation(false);
    await onSubmit();
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
          disabled || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
        }`}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            Submitting...
          </>
        ) : (
          'Submit Practice Set'
        )}
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unanswered Questions
            </h3>
            <p className="text-gray-600 mb-6">
              You have not answered all questions. Are you sure you want to submit?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Answering
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isLoading ? 'Submitting...' : 'Submit Anyway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
