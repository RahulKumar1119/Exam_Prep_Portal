import React, { useState } from 'react';
import { apiClient } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { ExplanationDisplay } from './ExplanationDisplay';

interface AIExplanationRequestProps {
  questionId: string;
  sessionId: string;
  isIncorrect: boolean;
}

interface Explanation {
  explanation: string;
  citations: Array<{ source: string; reference: string }>;
}

export const AIExplanationRequest: React.FC<AIExplanationRequestProps> = ({
  questionId,
  sessionId,
  isIncorrect,
}) => {
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { showNotification } = useNotification();

  const handleRequestExplanation = async () => {
    if (explanation) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post<Explanation>('/tutor/explain', {
        question_id: questionId,
        session_id: sessionId,
      });

      if (response.success && response.data) {
        setExplanation(response.data);
        setIsExpanded(true);
        showNotification('Explanation generated successfully', 'success');
      } else {
        throw new Error(response.error || 'Failed to generate explanation');
      }
    } catch (err) {
      showNotification('Explanation temporarily unavailable. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveExplanation = async () => {
    if (!explanation) return;

    try {
      await apiClient.post('/tutor/save-explanation', {
        question_id: questionId,
        explanation: explanation.explanation,
      });
      setIsSaved(true);
      showNotification('Explanation saved successfully', 'success');
    } catch (err) {
      showNotification('Failed to save explanation', 'error');
    }
  };

  if (!isIncorrect) {
    return null;
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleRequestExplanation}
        disabled={isLoading}
        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          isLoading
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating...
          </>
        ) : explanation ? (
          <>
            {isExpanded ? '▼' : '▶'} AI Explanation
          </>
        ) : (
          '💡 Request AI Explanation'
        )}
      </button>

      {isExpanded && explanation && (
        <div className="space-y-3">
          <ExplanationDisplay
            explanation={explanation.explanation}
            citations={explanation.citations}
            isLoading={false}
          />

          <div className="flex gap-2">
            <button
              onClick={handleSaveExplanation}
              disabled={isSaved}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSaved
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isSaved ? '✓ Saved' : 'Save Explanation'}
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="flex-1 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Collapse
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
