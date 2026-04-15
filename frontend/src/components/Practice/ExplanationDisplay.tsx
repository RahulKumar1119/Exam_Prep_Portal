import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ExplanationDisplay as ExplanationRenderer } from '../ExplanationDisplay';

interface ExplanationDisplayProps {
  questionId: string;
  questionText: string;
  correctAnswer: string;
  options: Record<string, string>;
  isCorrect: boolean;
  onExplanationLoaded?: (explanation: string) => void;
}

export const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({
  questionId,
  questionText,
  correctAnswer,
  options,
  isCorrect,
  onExplanationLoaded
}) => {
  const { user } = useAuth();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Don't fetch if already loaded, not expanded, correct answer, or no user
    if (isCorrect || !isExpanded || explanation || !user) {
      return;
    }

    const loadExplanation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<{ explanation: string }>('/ai/explain', {
          question_id: questionId,
          user_id: user.user_id,
          question_text: questionText,
          correct_answer: correctAnswer,
          options: options
        });

        if (response.success) {
          const text = (response as any).explanation || response.data?.explanation || 'Explanation not available';
          setExplanation(text);
          onExplanationLoaded?.(text);
        } else {
          setError('Failed to load explanation');
        }
      } catch (err) {
        console.error('Error loading explanation:', err);
        setError('Error loading explanation');
      } finally {
        setIsLoading(false);
      }
    };

    loadExplanation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, isCorrect, isExpanded, user]);

  if (isCorrect) {
    return null; // Don't show explanation for correct answers
  }

  return (
    <div className="mt-4 border-t border-gray-300 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
      >
        <span>{isExpanded ? '▼' : '▶'}</span>
        {isLoading ? 'Loading AI Explanation...' : 'Show AI Explanation'}
      </button>

      {isExpanded && (
        <div className="mt-3">
          {isLoading ? (
            <ExplanationRenderer explanation="" isLoading={true} />
          ) : error ? (
            <p className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">{error}</p>
          ) : explanation ? (
            <ExplanationRenderer explanation={explanation} />
          ) : (
            <p className="text-gray-600 text-sm">No explanation available</p>
          )}
        </div>
      )}
    </div>
  );
};
